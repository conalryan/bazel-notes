Bazel Rules for Javascript aka rules_nodejs 
--------------------------------------------------------------------------------

We would call this `rules_javascript` if renames weren't so disruptive. 

Github: https://github.com/bazelbuild/rules_nodejs 

Angular Example:  
  - Code: https://github.com/bazelbuild/rules_nodejs/tree/master/examples/angular. 
  - Docs: https://bazel.angular.io/ 

Refer to npm_init_bazel for exmple of https://bazelbuild.github.io/rules_nodejs/

Installation
================================================================================

Bazel-managed vs self-managed dependencies
--------------------------------------------------------------------------------
You have two options for managing your node_modules dependencies: Bazel-managed or self-managed.

With the Bazel-managed dependencies approach, Bazel is responsible for making sure that node_modules is up to date with your package[-lock].json or yarn.lock files. This means Bazel will set it up when the repository is first cloned, and rebuild it whenever it changes. With the yarn_install or npm_install repository rules, Bazel will setup your node_modules for you in an external workspace named after the repository rule. For example, a yarn_install(name = "npm", ...) will setup an external workspace named @npm with the node_modules folder inside of it as well as generating targets for each root npm package in node_modules for use as dependencies to other rules.

For Bazel to provide the strongest guarantees about reproducibility and the fidelity of your build, it is recommended that you use Bazel-managed dependencies. This approach also allows you to use the generated fine-grained npm package dependencies which can significantly reduce the number of inputs to actions, making Bazel sand-boxing and remote-execution faster if there are a large number of files under node_modules.

yarn_install vs. npm_install
yarn_install is the preferred rule for setting up Bazel-managed dependencies for a number of reasons:

yarn_install will use the global yarn cache by default which will improve your build performance (this can be turned off with the use_global_yarn_cache attribute)
npm has a known peer dependency hoisting issue that can lead to missing peer dependencies in some cases (see https://github.com/bazelbuild/rules_nodejs/issues/416)

Multiple sets of npm dependencies
If your workspace has multiple applications, each with their own package.json and npm deps, yarn_install (or npm_install) can be called separately for each.

workspace(
    name = "my_wksp",
    managed_directories = {
        "@app1_npm": ["app1/node_modules"],
        "@app2_npm": ["app2/node_modules"],
    },
)

yarn_install(
    name = "app1_npm",
    package_json = "//app1:package.json",
    yarn_lock = "//app1:yarn.lock",
)

yarn_install(
    name = "app2_npm",
    package_json = "//app2:package.json",
    yarn_lock = "//app2:yarn.lock",
)

[Built-in Rules](https://bazelbuild.github.io/rules_nodejs/Built-ins.html)
================================================================================
https://bazelbuild.github.io/rules_nodejs/Built-ins.html#nodejs_binary

nodejs_binary
--------------------------------------------------------------------------------
entryPoint: The script which should be executed first, usually containing a main function.

If the entry point target is a rule, it should produce a single JavaScript entry file that will be passed to the nodejs_binary rule. For example:

filegroup(
    name = "entry_file",
    srcs = ["main.js"],
)

nodejs_binary(
    name = "my_binary",
    entry_point = ":entry_file",
)
The entry_point can also be a label in another workspace:

nodejs_binary(
    name = "history-server",
    entry_point = "@npm//:node_modules/history-server/modules/cli.js",
    data = ["@npm//history-server"],
)

nodejs_test
--------------------------------------------------------------------------------
Identical to nodejs_binary, except this can be used with bazel test as well. When the binary returns zero exit code, the test passes; otherwise it fails.

nodejs_test is a convenient way to write a novel kind of test based on running your own test runner. For example, the ts-api-guardian library has a way to assert the public API of a TypeScript program, and uses nodejs_test here: https://github.com/angular/angular/blob/master/tools/ts-api-guardian/index.bzl

If you just want to run a standard test using a test runner like Karma or Jasmine, use the specific rules for those test runners, e.g. jasmine_node_test.

To debug a Node.js test, we recommend saving a group of flags together in a “config”. Put this in your tools/bazel.rc so it’s shared with your team:

# Enable debugging tests with --config=debug
test:debug --test_arg=--node_options=--inspect-brk --test_output=streamed --test_strategy=exclusive --test_timeout=9999 --nocache_test_results
Now you can add --config=debug to any bazel test command line. The runtime will pause before executing the program, allowing you to connect a remote debugger.

pkg_npm
--------------------------------------------------------------------------------
The pkg_npm rule creates a directory containing a publishable npm artifact.

Example:

load("@build_bazel_rules_nodejs//:index.bzl", "pkg_npm")

pkg_npm(
    name = "my_package",
    srcs = ["package.json"],
    deps = [":my_typescript_lib"],
    substitutions = {"//internal/": "//"},
)
You can use a pair of // BEGIN-INTERNAL ... // END-INTERNAL comments to mark regions of files that should be elided during publishing. For example:

function doThing() {
    // BEGIN-INTERNAL
    // This is a secret internal-only comment
    doInternalOnlyThing();
    // END-INTERNAL
}
With the Bazel stamping feature, pkg_npm will replace any placeholder version in your package with the actual version control tag. See the stamping documentation

Usage:

pkg_npm yields three labels. Build the package directory using the default label:

$ bazel build :my_package
Target //:my_package up-to-date:
  bazel-out/fastbuild/bin/my_package
$ ls -R bazel-out/fastbuild/bin/my_package
Dry-run of publishing to npm, calling npm pack (it builds the package first if needed):

$ bazel run :my_package.pack
INFO: Running command line: bazel-out/fastbuild/bin/my_package.pack
my-package-name-1.2.3.tgz
$ tar -tzf my-package-name-1.2.3.tgz
Actually publish the package with npm publish (also builds first):

# Check login credentials
$ bazel run @nodejs//:npm_node_repositories who
# Publishes the package
$ bazel run :my_package.publish
You can pass arguments to npm by escaping them from Bazel using a double-hyphen, for example:

bazel run my_package.publish -- --tag=next

`pkg_web`
--------------------------------------------------------------------------------
Assembles a web application from source files.

# Usage
pkg_web(name, additional_root_paths, srcs)

yarn_install
Runs yarn install during workspace setup.

This rule will set the environment variable BAZEL_YARN_INSTALL to ‘1’ (unless it set to another value in the environment attribute). Scripts may use to this to check if yarn is being run by the yarn_install repository rule.

# Usage
yarn_install(name, always_hide_bazel_files, args, data, environment, included_files, manual_build_file_contents, package_json, quiet, symlink_node_modules, timeout, use_global_yarn_cache, yarn_lock)

`copy_to_bin`
--------------------------------------------------------------------------------
Copies a source file to bazel-bin at the same workspace-relative path path.

e.g. <workspace_root>/foo/bar/a.txt -> <bazel-bin>/foo/bar/a.txt

This is useful to populate the output folder with all files needed at runtime, even those which aren’t outputs of a Bazel rule.

This way you can run a binary in the output folder (execroot or runfiles_root) without that program needing to rely on a runfiles helper library or be aware that files are divided between the source tree and the output tree.

# Usage
copy_to_bin(name, srcs, kwargs)

`npm_package_bin`
--------------------------------------------------------------------------------
Run an arbitrary npm package binary (e.g. a program under node_modules/.bin/\*) under Bazel.

It must produce outputs. If you just want to run a program with bazel run, use the nodejs_binary rule.

This is like a genrule() except that it runs our launcher script that first links the node_modules tree before running the program.

This is a great candidate to wrap with a macro, as documented: https://docs.bazel.build/versions/master/skylark/macros.html#full-example

# Usage
npm_package_bin(tool, package, package_bin, data, outs, args, output_dir, kwargs)


[Generated Repositories](https://bazelbuild.github.io/rules_nodejs/repositories.html)
================================================================================

rules_nodejs produces several repositories for you to reference. Bazel represents your workspace as one repository, and code fetched or installed from outside your workspace lives in other repositories. These are referenced with the @repo// syntax in your BUILD files.

@nodejs
--------------------------------------------------------------------------------
This repository is created by calling the node_repositories function in your WORKSPACE file. It contains the node, npm, and yarn programs.

As always, bazel query is useful for learning about what targets are available.

$ bazel query @nodejs//...
@nodejs//:node
...
You don’t typically need to reference the @nodejs repository from your BUILD files because it’s used behind the scenes to run node and fetch dependencies.

Some ways you can use this:

Run the Bazel-managed version of node: bazel run @nodejs//:node path/to/program.js
Run the Bazel-managed version of npm: bazel run @nodejs//:npm
Run the Bazel-managed version of yarn: bazel run @nodejs//:yarn
Install dependencies from nested package.json file(s) which were passed to node_repositories#package.json
using npm: bazel run @nodejs//:npm_node_repositories install
using yarn: bazel run @nodejs//:yarn_node_repositories

@npm
--------------------------------------------------------------------------------
This repository is created by calling the npm_install or yarn_install function in your WORKSPACE file.

The name @npm is recommended in the simple case that you install only a single package.json file. If you have multiple, call the npm_install or yarn_install multiple times, and give each one a unique name. This results in multiple repositories, named whatever you chose, rather than “npm”. The following applies to any repository created by npm_install , or yarn_install, just replace @npm with the name you chose.

Again, use bazel query @npm//... to learn about all the targets declared in this repository.

Our philosophy is to mirror the installed npm dependencies in a way that’s idiomatic to reference them in Bazel.

Commonly used ones are:
- Evey file that was installed from npm: @npm//:node_modules. This target can have a very large number of files and slow down your build, however it’s a simple way to skip having to declare more fine-grained inputs to your BUILD targets.
- If you had a dependency on the foo package, you can reference @npm//foo to get all the files. We mirror the npm dependency graph, so if foo declares a dependency on another package dep, Bazel will include that dependency when foo is used.
- If the foo package has an executable program bar, then @npm//foo/bin:bar is a nodejs_binary that you can call with bazel run or can pass as the executable to your own rules.
- Sometimes you need a *UMD bundle*, but a package doesn’t ship one. For example, the ts_devserver rule depends on third-party libraries having a named UMD entry point. The @npm//foo:foo__umd target will automatically run Browserify to convert the package’s main entry into UMD.
- A helper to install npm packages into their own Bazel repository: @npm//:install_bazel_dependencies.bzl provides a install_bazel_dependencies function. Some npm packages ship custom bazel rules, for example, the @bazel/typescript package provides rules which you should load from @npm_bazel_typescript//:index.bzl. The install_bazel_dependencies function installs such npm packages into their equivalent Bazel repository. (Note, we expect this could be removed in the future, as load("@npm//@bazel/typescript:index.bzl") would be a more natural way to load these rules.)r


