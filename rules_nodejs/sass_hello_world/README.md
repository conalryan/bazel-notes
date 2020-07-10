[rules_sass](https://github.com/bazelbuild/rules_sass/blob/master/README.md)
================================================================================

Quick start
--------------------------------------------------------------------------------
`bazel build //hello_world`

`http-server`

- sass_binary
- sass_library
- multi_sass_binary ⚠️ WARNING: This rule does a global compilation, and thus any change in the sources will trigger a build for all files. It is inefficient. Always prefer sass_binary and provide strict dependencies for most efficient compilation. This rule is also not used internally at Google.

## Using
```python
# in WORKSPACE
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")
load("@io_bazel_rules_sass//:package.bzl", "rules_sass_dependencies")
load("@io_bazel_rules_sass//:defs.bzl", "sass_repositories")

# in BUILD
load("@io_bazel_rules_sass//:defs.bzl", "sass_binary")
load("@io_bazel_rules_sass//:defs.bzl", "sass_library")
```
