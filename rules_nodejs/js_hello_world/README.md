# js_hello_world

Single js file that exports a function. Test with Jasmine.

## Quick Start

Build

`bazel build //...`

Run

`bazel run //:my_binary`

Test

`bazel test //...`

## Setup

`yarn add -D @bazel/bazelisk @bazel/ibazel @bazel/jasmine`

Copy `WORKSPACE` and `BUILD`

## Using
```python
# in WORKSPACE
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")
load("@build_bazel_rules_nodejs//:index.bzl", "yarn_install")
load("@npm//:install_bazel_dependencies.bzl", "install_bazel_dependencies")

# in BUILD
load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_binary")
load("@npm_bazel_jasmine//:index.bzl", "jasmine_node_test")
```
