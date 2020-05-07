Maven Java application
----------------------

This project demonstrates the usage of Bazel to retrieve dependencies from Maven
repositories.

To build this example, you will need to [install
Bazel](http://bazel.io/docs/install.html).

The Java application makes use of a library in
[Guava](https://github.com/google/guava), which is downloaded from a remote
repository using Maven.

This application demonstrates the usage of
[`rules_jvm_external`](https://github.com/bazelbuild/rules_jvm_external/) to
configure dependencies. The dependencies are configured in the `WORKSPACE` file.

Build the application by running:

```
$ bazel build :java-maven
```

Output to:
`./bazel-bin/java-maven.jar`


Run the application
```
$ bazel run :java-maven
```

cr. However, try to run the jar as is
`java -jar ./bazel-bin/java-maven.jar`
no main manifest attribut, in ./bazel-bin/java-maven.jar

Test the application by running:

```
$ bazel test :tests
```
