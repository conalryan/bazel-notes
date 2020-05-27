[Typescript Rules for Bazel](https://bazelbuild.github.io/rules_nodejs/TypeScript.html)
================================================================================

ts_project
--------------------------------------------------------------------------------
ts_project simply runs tsc --project, with Bazel knowing which outputs to expect based on the TypeScript compiler options, and with interoperability with other TypeScript rules via a Bazel Provider (DeclarationInfo) that transmits the type information. It is intended as an easy on-boarding for existing TypeScript code and should be familiar if your background is in frontend ecosystem idioms. Any behavior of ts_project should be reproducible outside of Bazel, with a couple of caveats noted in the rule documentation below.

We used to recommend using the tsc rule directly from the typescript project, like load("@npm//typescript:index.bzl", "tsc") However ts_project is strictly better and should be used instead.

ts_library
--------------------------------------------------------------------------------
ts_library is an open-sourced version of the rule we use to compile TS code at Google. It should be familiar if your background is in Bazel idioms. It is very complex, involving code generation of the tsconfig.json file, a custom compiler binary, and a lot of extra features. It is also opinionated, and may not work with existing TypeScript code. For example:

Your TS code must compile under the --declaration flag so that downstream libraries depend only on types, not implementation. This makes Bazel faster by avoiding cascading rebuilds in cases where the types aren’t changed.
We control the output format and module syntax so that downstream rules can rely on them.
On the other hand, ts_library is also fast and optimized. We keep a running TypeScript ompile running as a daemon, using Bazel workers. This process avoids re-parse and re-JIT of the >1MB typescript.js and keeps cached bound ASTs for input files which saves time. We also produce JS code which can be loaded faster (using named AMD module format) and which can be consumed by the Closure Compiler (via integration with tsickle).

Steps
--------------------------------------------------------------------------------
`yadd add -D typescript`

`tsc -init`

`yarn add -D @bazel/typescript`

Your TS code must compile under the --declaration flag so that downstream libraries depend only on types, not implementation. This makes Bazel faster by avoiding cascading rebuilds in cases where the types aren’t changed.
We control the output format and module syntax so that downstream rules can rely on them.

Make sure to remove the --noEmit compiler option from your tsconfig.json. This is not compatible with the ts_library rule.

`
$ bazel build //hello_world
Starting local Bazel server and connecting to it...
ERROR: Failed to load Starlark extension '@npm_bazel_typescript//:index.bzl'.
Cycle in the workspace file detected. This indicates that a repository is used prior to being defined.
The following chain of repository dependencies lead to the missing definition.
 - @npm_bazel_typescript
This could either mean you have to add the '@npm_bazel_typescript' repository with a statement like `http_archive` in your WORKSPACE file (note that transitive dependencies are not added automatically), or move an existing definition earlier in your WORKSPACE file.
ERROR: cycles detected during target parsing
INFO: Elapsed time: 4.740s
INFO: 0 processes.
FAILED: Build did NOT complete successfully (0 packages loaded)
`

