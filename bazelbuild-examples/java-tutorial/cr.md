Bazel with Java
================================================================================


Quick Guide
--------------------------------------------------------------------------------
`
bazel build :ProjectRunner
bazel run :ProjectRunner
`
Although I can't run
`java -jar bazel-bin/ProjectRunner.jar`
no manifest...
???

load
--------------------------------------------------------------------------------
```
load("@rules_java//java:defs.bzl", "java_binary", "java_library", "java_test")
```

binary
--------------------------------------------------------------------------------
```
java_binary(
    name = "ProjectRunner",
    srcs = glob(["src/main/java/com/example/*.java"]),
)

java_binary(
    name = "java-maven",
    main_class = "com.example.myproject.App",
    runtime_deps = [":java-maven-lib"],
)
```

library
--------------------------------------------------------------------------------
```
java_library(
    name = "java-maven-lib",
    srcs = glob(["src/main/java/com/example/myproject/*.java"]),
    deps = ["@maven//:com_google_guava_guava"],
)
```

test
--------------------------------------------------------------------------------
```
java_test(
    name = "tests",
    srcs = glob(["src/test/java/com/example/myproject/*.java"]),
    test_class = "com.example.myproject.TestApp",
    deps = [
        ":java-maven-lib",
        "@maven//:com_google_guava_guava",
        "@maven//:junit_junit",
    ],
)
```
