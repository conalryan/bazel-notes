Docs: https://bazelbuild.github.io/rules_nodejs/ 
Example of the [webapp](https://github.com/bazelbuild/rules_nodejs/tree/1.4.0/examples/webapp)

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
