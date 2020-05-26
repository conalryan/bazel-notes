Docs: https://bazelbuild.github.io/rules_nodejs/ 
Example of the [webapp](https://github.com/bazelbuild/rules_nodejs/tree/1.4.0/examples/webapp)

Quick start
--------------------------------------------------------------------------------
`yarn install && yarn build | bazel build //...`


Steps
--------------------------------------------------------------------------------
```bash
npm init @bazel npm_init_bazel 
# or
yarn create @bazel npm_init_bazel 
```

directory now looks like
`
.bazelignore
.bazelrc
.bazelversion
.gitignore
BUILD.bazel
WORKSPACE.bazel
package.json
`

Babel to transpile our JavaScript, Mocha for running tests, and http-server to serve our app
```bash
yarn add -D @babel/core @babel/cli @babel/preset-env @babel/preset-typescript http-server mocha domino 
```

Let’s run these tools with Bazel. There are two ways to run tools:
- Use an auto-generated Bazel rule by importing from an index.bzl file in the npm package
- Use a custom rule in rules_nodejs or write one yourself

In this example we use the auto-generated rules. First we need to import them, using a load statement. So edit BUILD.bazel and add:
```
load("@npm//@babel/cli:index.bzl", "babel")
load("@npm//mocha:index.bzl", "mocha_test")
load("@npm//http-server:index.bzl", "http_server")
```


ibazel is the watch mode for bazel.

Note that on Windows, you need to pass --enable_runfiles flag to Bazel. That’s because Bazel creates a directory where inputs and outputs both appear together, for convenience.

[Debugging](https://bazelbuild.github.io/rules_nodejs/#debugging)
Add the options in the Support for debugging NodeJS tests section from https://github.com/bazelbuild/rules_nodejs/blob/master/common.bazelrc to your project’s .bazelrc file to add support for debugging NodeJS programs.

Using the --config=debug command line option with bazel will set a number of flags that are specified there are useful for debugging. See the comments under Support for debugging NodeJS tests for details on the flags that are set.

Use --config=debug with bazel test as follow,

bazel test --config=debug //test:...
or with bazel run,

bazel run --config=debug //test:test1
to also turn on the NodeJS inspector agent which will break before any user code starts. You should then see,

Executing tests from //test:test1
----------------------------------------------------------------------------
Debugger listening on ws://127.0.0.1:9229/3f20777a-242c-4d18-b88b-5ed4b3fed61c
For help, see: https://nodejs.org/en/docs/inspector
when the test is run.

To inspect with Chrome DevTools 55+, open chrome://inspect in a Chromium-based browser and attach to the waiting process. A Chrome DevTools window should open and you should see Debugger attached. in the console.

See https://nodejs.org/en/docs/guides/debugging-getting-started/ for more details.-

[Debugging with VS Code](https://bazelbuild.github.io/rules_nodejs/#debugging-with-vs-code)
With the above configuration you can use VS Code as your debugger. You will first need to configure your .vscode/launch.json:

{
      "type": "node",
      "request": "attach",
      "name": "Attach nodejs_binary",
      "internalConsoleOptions": "neverOpen",
      "sourceMapPathOverrides": {
        "../*": "${workspaceRoot}/*",
        "../../*": "${workspaceRoot}/*",
        "../../../*": "${workspaceRoot}/*",
        "../../../../*": "${workspaceRoot}/*",
        "../../../../../*": "${workspaceRoot}/*",
        // do as many levels here as needed for your project
      }
We use sourceMapPathOverrides here to rewrite the source maps produced by ts_library so that breakpoints line up with the source maps. Once configured start your process with

bzel run --config=debug //test:test1
Then hit F5 which will start the VS Code debugger with the Attach nodejs_binary configuration. VS Code will immediatenly hit a breakpoint to which you can continue and debug using all the normal debug features provided.

[Stamping](https://bazelbuild.github.io/rules_nodejs/#stamping)
Bazel is generally only a build tool, and is unaware of your version control system. However, when publishing releases, you typically want to embed version information in the resulting distribution. Bazel supports this natively, using the following approach:

To stamp a build, you must pass the --stamp argument to Bazel.

Previous releases of rules_nodejs stamped builds always. However this caused stamp-aware actions to never be remotely cached, since the volatile status file is passed as an input and its checksum always changes.

Also pass the workspace_status_command argument to bazel build. We prefer to do these with an entry in .bazelrc:

# This tells Bazel how to interact with the version control system
# Enable this with --config=release
build:rlease --stamp --workspace_status_command=./tools/bazel_stamp_vars.sh
Then create tools/bazel_stamp_vars.sh.

This is a script that prints variable/value pairs. Make sure you set the executable bit, eg. chmod 755 tools/bazel_stamp_vars.sh. For example, we could run git describe to get the current tag:

#!/usr/bin/env bash
echo BUILD_SCM_VERSION $(git describe --abbrev=7 --tags HEAD)
For a more full-featured script, take a look at the bazel_stamp_vars in Angular

Finally, we recommend a release script around Bazel. We typically have more than one npm package published from one Bazel workspace, so we do a bazel query to find them, and publish in a loop. Here is a template to get you started:

#!/usr/bin/env bash

set -u -e -o pipefail

# Call the script with argument "pack" or "publish"
readonly NPM_COMMAND=${1:-publish}
# Don't rely on $PATH to have the right version
readonly BAZEL_BIN=./node_modules/.bin/bazel
# Use a new output_base so we get a clean build
# Bazel can't know if the git metadata changed
readonly TMP=$(mktemp -d -t bazel-release.XXXXXXX)
readonly BAZEL="$BAZEL_BIN --output_base=$TMP"
# Find all the npm packages in the repo
readonly PKG_NPM_LABELS=`$BAZEL query --output=label 'kind("pkg_npm", //...)'`
# Build them in one command to maximize parallelism
$BAZEL build --config=release $PKG_NPM_LABELS
# publish one package at a time to make it easier to spot any errors or warnings
for pkg in $PKG_NPM_LABELS ; do
  $BAZEL run --config=release -- ${pkg}.${NPM_COMMAND} --access public --tag latest
done
WARNING: Bazel can’t track changes to git tags. That means it won’t rebuild a target if only the result of the workspace_status_command has changed. So changes to the version information may not be reflected if you re-build the package or bundle, and nothing in the package or bundle has changed.

See https://www.kchodorow.com/blog/2017/03/27/stamping-your-builds/ for more background.
