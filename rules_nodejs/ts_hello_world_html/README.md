[Typescript Rules for Bazel](https://bazelbuild.github.io/rules_nodejs/TypeScript.html)
================================================================================

Quick start
--------------------------------------------------------------------------------
`bazel build //...`

`bazel run //hello_world:devserver`


Steps
--------------------------------------------------------------------------------
1. `yadd add -D typescript @bazel/typescript`

2. `tsc -init`

3. Modify `tsconfig.json`:
    - Must compile under the `--declaration` flag so that downstream libraries depend only on types, not implementation. This makes Bazel faster by avoiding cascading rebuilds in cases where the types aren’t changed. We control the output format and module syntax so that downstream rules can rely on them.
    - Remove the `--noEmit` compiler option. This is not compatible with the `ts_library` rule.

Using
--------------------------------------------------------------------------------
```python
# in WORKSPACE
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")
load("@build_bazel_rules_nodejs//:index.bzl", "yarn_install")
load("@npm//:install_bazel_dependencies.bzl", "install_bazel_dependencies")
load("@npm_bazel_typescript//:index.bzl", "ts_setup_workspace")

# in BUILD
load("@npm_bazel_typescript//:index.bzl", "ts_devserver", "ts_library")
```

`ts_project`
--------------------------------------------------------------------------------
`ts_project` simply runs `tsc --project`, with Bazel knowing which outputs to expect based on the TypeScript compiler options, and with interoperability with other TypeScript rules via a Bazel Provider (DeclarationInfo) that transmits the type information. 

It is intended as an easy on-boarding for existing TypeScript code and should be familiar if your background is in frontend ecosystem idioms. 

Any behavior of ts_project should be reproducible outside of Bazel, with a couple of caveats noted in the rule documentation below.

We used to recommend using the tsc rule directly from the typescript project, like load("@npm//typescript:index.bzl", "tsc") However ts_project is strictly better and should be used instead.

`ts_library`
--------------------------------------------------------------------------------
`ts_library` is an open-sourced version of the rule we use to compile TS code at Google.

It is very complex, involving code generation of the `tsconfig.json` file, a custom compiler binary, and a lot of extra features. 

It is also opinionated, and may not work with existing TypeScript code. For example:
- Your TS code must compile under the `--declaration` flag so that downstream libraries depend only on types, not implementation. This makes Bazel faster by avoiding cascading rebuilds in cases where the types aren’t changed.
- We control the output format and module syntax so that downstream rules can rely on them.
On the other hand, `ts_library` is also fast and optimized. We keep a running TypeScript compile running as a daemon, using Bazel workers. This process avoids re-parse and re-JIT of the >1MB typescript.js and keeps cached bound ASTs for input files which saves time. We also produce JS code which can be loaded faster (using named `AMD` module format) and which can be consumed by the `Closure Compiler` (via integration with `tsickle`).


Writing TypeScript code for Bazel
--------------------------------------------------------------------------------
Bazel’s TypeScript compiler has your workspace path mapped, so you can import from an absolute path starting from your workspace.

/WORKSPACE:

workspace(name = "myworkspace")
/some/long/path/to/deeply/nested/subdirectory.ts:

import {thing} from 'myworkspace/place';
will import from /place.ts.

Since this is an extension to the vanilla TypeScript compiler, editors which use the TypeScript language services to provide code completion and inline type checking will not be able to resolve the modules. In the above example, adding

"paths": {
    "myworkspace/*": ["*"]
}

to tsconfig.json will fix the imports for the common case of using absolute paths. See path mapping for more details on the paths syntax.

Similarly, you can use path mapping to teach the editor how to resolve imports from ts_library rules which set the module_name attribute.
