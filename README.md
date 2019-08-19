[bazel](https://docs.bazel.build/versions/master/bazel-overview.html)
==================================================================================================

- Build and test tool (similar to Make, Maven, and Gradle). 
- High-level build language to describe the build properties of your project at a high semantical level.
- Supports multiple languages and builds outputs for multiple platforms. 
- Supports large codebases across multiple repositories, and large numbers of users.
- Operates on the concepts of libraries, binaries, scripts, and data sets.
- Shields you from the complexity of writing individual calls to tools such as compilers and linkers.
- Caches all previously done work and tracks changes to both file content and build commands and rebuilds only those changes.
- Multi-platform (Linux, macOS, and Windows).
- Build binaries and deployable packages for multiple platforms, including desktop, server, and mobile, from the same project.
- Works with multiple repositories and large user bases.
- Extensible. Many [languages](https://docs.bazel.build/versions/master/be/overview.html#rules) are supported, and you can extend Bazel to support any other language or framework.

## Setup
1. [Install](https://docs.bazel.build/versions/master/install-os-x.html)
2. Set up a project **workspace**, which is a directory where Bazel looks for build inputs and `BUILD` files, and where it stores build outputs.
3. Write a `BUILD` file, which tells Bazel what to build and how to build it.
  - You write your `BUILD` file by declaring build targets using [Starlark](https://docs.bazel.build/versions/master/skylark/language.html), a domain-specific language. (See example [here](https://github.com/bazelbuild/bazel/blob/master/examples/cpp/BUILD).)
  - A **build target** specifies a set of input artifacts that Bazel will build plus their dependencies, the build rule Bazel will use to build it, and options that configure the build rule.
  - A [build rule](https://github.com/bazelbuild/bazel/blob/master/examples/cpp/BUILD) specifies the build tools Bazel will use, such as compilers and linkers, and their configurations. Bazel ships with a number of build rules covering the most common artifact types in the supported languages on supported platforms.
4. Run Bazel from the command line. Bazel places your outputs within the workspace.

In addition to building, you can also use Bazel to run tests and query the build to trace dependencies in your code.

When running a build or a test, Bazel does the following:
- Loads the BUILD files relevant to the target.
- Analyzes the inputs and their dependencies, applies the specified build rules, and produces an action graph.
- Executes the build actions on the inputs until the final build outputs are produced.

All previous build work is cached, Bazel can identify and reuse cached artifacts and only rebuild or retest what’s changed. To further enforce correctness, you can set up Bazel to run builds and tests hermetically through sandboxing, minimizing skew and maximizing reproducibility.

## Action graph
- Represents the build artifacts, the relationships between them, and the build actions that Bazel will perform.
- Bazel can track changes to file content as well as changes to actions, such as build or test commands, and know what build work has previously been done. 
- The graph also enables you to easily trace dependencies in your code.

# [Getting Started](https://docs.bazel.build/versions/master/getting-started.html)
==================================================================================================

## [Introduction to Bazel: Building a Java Project](https://docs.bazel.build/versions/master/tutorial/java.html)
```bash
git clone https://github.com/bazelbuild/examples/
```

Directory structure
```bash
BUILD
src
  main
    java
      com
        example
          SomeClass.java
WORKSPACE 
```

Build java-tutorial sample project. 
```bash
cd ./java-tutorial
bazel build //:ProjectRunner
```
Notice the target label - the `//` part is the location of our `BUILD` file **relative** to the root of the workspace (in this case, the root itself), and ProjectRunner is what we named that target in the BUILD file. (You will learn about target labels in more detail at the end of this tutorial.)

Bazel places build outputs in the `bazel-bin` directory at the **root** of the **workspace**.

Now test your freshly built binary:
```bash
bazel-bin/ProjectRunner
```

Review dependency graph:
```bash
bazel query  --nohost_deps --noimplicit_deps "deps(//:ProjectRunner)" --output graph
```

## WORKSPACE
- Directory that holds your project’s source files and Bazel’s build outputs. 
- Identifies the directory and its contents as a Bazel workspace and lives at the root of the project’s directory structure.
- To designate a directory as a Bazel workspace, create an empty file named `WORKSPACE` in that directory.
- All inputs and **dependencies** must be in the same workspace. Files residing in different workspaces are independent of one another unless **linked**, which is beyond the scope of this tutorial.

## BUILD
- One or more `BUILD` files, which tell Bazel how to build different parts of the project. 
- **Package**: A directory within the workspace that contains a `BUILD` file is a package.
- File contains several different types of instructions for Bazel:
  - The most important type is the **build rule**, which tells Bazel how to build the desired outputs, such as executable binaries or libraries. 
  - Each instance of a build rule in the BUILD file is called a **target** and points to a specific set of source files and dependencies. 
  - A target can also point to other targets.

Take a look at the java-tutorial/BUILD file:
build rule
```
java_binary(
    name = "ProjectRunner",
    srcs = glob(["src/main/java/com/example/*.java"]),
)
```

- ProjectRunner target instantiates Bazel’s built-in java_binary rule. 
- The rule tells Bazel to build a .jar file and a wrapper shell script (both named after the target).

### Attributes
- **name** attribute is mandatory 
- **srcs** specifies the source files that Bazel uses to build the target, and main_class specifies the class that contains the main method. (You may have noticed that our example uses glob to pass a set of source files to Bazel instead of listing them one by one.)

## [Multiple Build Target](https://docs.bazel.build/versions/master/tutorial/java.html#specify-multiple-build-targets)

java-tutorial/BUILD
```python
java_binary(
    name = "ProjectRunner",
    srcs = ["src/main/java/com/example/ProjectRunner.java"],
    main_class = "com.example.ProjectRunner",
    deps = [":greeter"],
)

java_library(
    name = "greeter",
    srcs = ["src/main/java/com/example/Greeting.java"],
)
```
With this configuration, Bazel first builds the `greeter` library, then the `ProjectRunner` binary. 
The `deps` attribute in `java_binary` tells Bazel that the `greeter `library is required to build the `ProjectRunner` binary.

## [Use Multiple Packages](https://docs.bazel.build/versions/master/tutorial/java.html#use-multiple-packages)

To Bazel the structure is 2 packages:
```bash
BUILD
src
  main
    java
      com
        example
          cmdline
            BUILD
            SomOtherClass.java
          SomeClass.java
WORKSPACE 
```

`//` means the `BUILD` file at the root.
`//scr/main/java/com/exampled/cmdline` means the `BUILD` file in that directory.

Take a look at the `src/main/java/com/example/cmdline/BUILD` file:
```python
java_binary(
    name = "runner",
    srcs = ["Runner.java"],
    main_class = "com.example.cmdline.Runner",
    deps = ["//:greeter"]
)
```
The runner target depends on the greeter target in the `//` package (hence the target label `//:greeter`) - Bazel knows this through the `deps` attribute.

You **must** explicitly give the runner target in `//src/main/java/com/example/cmdline/BUILD` visibility to targets in `//BUILD` using the `visibility` attribute. 
By default targets are only visible to other targets in the same BUILD file (to prevent issues such as libraries containing implementation details leaking into public APIs).

To do this, add the visibility attribute to the greeter target in `java-tutorial/BUILD` as shown below:
```python
java_library(
  name = "greeter",
  srcs = ["src/main/java/com/example/Greeting.java"],
  visibility = ["//src/main/java/com/example/cmdline:__pkg__"],
)
```

```bash
bazel build //src/main/java/com/example/cmdline:runner
```

Now test your freshly built binary:
```bash
./bazel-bin/src/main/java/com/example/cmdline/runner
```

## [Use labels to reference targets](https://docs.bazel.build/versions/master/tutorial/java.html#use-labels-to-reference-targets)
In `BUILD` files and at the command line, Bazel uses target labels to reference targets - for example, `//:ProjectRunner` or `//src/main/java/com/example/cmdline:runner`. 
Their syntax is as follows:
```bash
//path/to/package:target-name
```
If the target is a **rule target**, then `path/to/package` is the path to the directory containing the `BUILD` file, and `target-name` is what you named the target in the BUILD file (the name attribute). 

If the target is a **file target**, then `path/to/package` is the path to the root of the package, and `target-name` is the name of the target file, including its full path.

When referencing targets within the same package, you can skip the package path and just use `//:target-name`. 
When referencing targets within the same `BUILD` file, you can even skip the `// workspace root` identifier and just use `:target-name`.

Targets in the `java-tutorial/BUILD` file, you did not have to specify a package path, since the workspace root is itself a package (`//`), and your two target labels were simply `//:ProjectRunner` and `//:greeter`.

However, for targets in the `//src/main/java/com/example/cmdline/BUILD` file you had to specify the full package path of `//src/main/java/com/example/cmdline` and your target label was `//src/main/java/com/example/cmdline:runner`.

## [Package  Java target for Deployment](https://docs.bazel.build/versions/master/tutorial/java.html#package-a-java-target-for-deployment)
- Package a Java target for deployment by building the binary with all of its runtime dependencies. 
- The `java_binary` build rule produces a `.jar` and a wrapper shell script. 
- Take a look at the contents of runner.jar using this command:
```bash
jar tf bazel-bin/src/main/java/com/example/cmdline/runner.jar
```
The contents are:
```
META-INF/
META-INF/MANIFEST.MF
com/
com/example/
com/example/cmdline/
com/example/cmdline/Runner.class
```
 Fortunately, the `java_binary` rule allows you to build a self-contained, deployable binary. 
 To build it, add the `_deploy.jar` suffix to the file name when building `runner.jar` (_deploy.jar):
```bash
bazel build //src/main/java/com/example/cmdline:runner_deploy.jar
```

[Working with External Dependencies]()
==================================================================================================
- Bazel can depend on targets from other projects. Dependencies from these other projects are called external dependencies.
- The `WORKSPACE` file in the workspace directory tells Bazel how to get other projects’ sources. 
- These other projects can contain one or more `BUILD` files with their own targets. 
- `BUILD` files within the main project can depend on these external targets by using their name from the `WORKSPACE` file.

For example, suppose there are two projects on a system:
```
/
  home/
    user/
      project1/
        WORKSPACE
        BUILD
        srcs/
          ...
      project2/
        WORKSPACE
        BUILD
        my-libs/
```
- If `project1` wanted to depend on a target, `:foo`, defined in `/home/user/project2/BUILD`, it could specify that a repository named `project2` could be found at `/home/user/project2`. 
- Then targets in `/home/user/project1/BUILD` could depend on `@project2//:foo`.
- The `WORKSPACE` file allows users to depend on targets from other parts of the filesystem or downloaded from the internet. 
- Users can also write custom repository rules to get more complex behavior.
- This WORKSPACE file uses the same syntax as BUILD files, but allows a different set of rules. 

[Supported types of external dependencies](https://docs.bazel.build/versions/master/external.html#supported-types-of-external-dependencies)
A few basic types of external dependencies can be used:
1. Dependencies on other Bazel projects
2. Dependencies on non-Bazel projects
3. Dependencies on external packages

[1. Depending on other Bazel Projects](https://docs.bazel.build/versions/master/external.html#depending-on-other-bazel-projects)
- Use targets from a second Bazel project, you can use [local_repository](https://docs.bazel.build/versions/master/be/workspace.html#local_repository), [git_repository](https://docs.bazel.build/versions/master/repo/git.html#git_repository) or [http_archive](https://docs.bazel.build/versions/master/repo/http.html#http_archive) to symlink it from the local filesystem, reference a git repository or download it (respectively).
- If Both projects use Bazel, so you can add your coworker’s project as an external dependency and then use any targets your coworker has defined from your own BUILD files. 
- You would add the following to my_project/WORKSPACE:
```python
local_repository(
    name = "coworkers_project",
    path = "/path/to/coworkers-project",
)
```
- If your coworker has a target `//foo:bar`, your project can refer to it as `@coworkers_project//foo:bar`. 
- External project names must be valid workspace names, so _ (valid) is used to replace - (invalid) in the name coworkers_project.

[2. Depending on non-Bazel projects](https://docs.bazel.build/versions/master/external.html#depending-on-non-bazel-projects)
- Rules prefixed with `new_`, e.g., [new_local_repository](https://docs.bazel.build/versions/master/be/workspace.html#new_local_repository), allow you to create targets from projects that do not use Bazel.
- For example, suppose you are working on a project, my-project/, and you want to depend on your coworker’s project, coworkers-project/. Your coworker’s project uses make to build, but you’d like to depend on one of the .so files it generates. 
- To do so, add the following to my_project/WORKSPACE:
```python
new_local_repository(
    name = "coworkers_project",
    path = "/path/to/coworkers-project",
    build_file = "coworker.BUILD",
)
```
build_file specifies a `BUILD` file to overlay on the existing project, for example:
```python
cc_library(
    name = "some-lib",
    srcs = glob(["**"]),
    visibility = ["//visibility:public"],
)
```

You can then depend on `@coworkers_project//:some-lib` from your project’s `BUILD` files.

[3. Depending on external packages](https://docs.bazel.build/versions/master/external.html#depending-on-external-packages)
- Maven artifacts and repositories:
  - Use the ruleset [rules_jvm_external](https://github.com/bazelbuild/rules_jvm_external) to download artifacts from Maven repositories and make them available as Java dependencies.
- Fetching dependencies
  - By default, external dependencies are fetched as needed during bazel build. 
  - If you would like to prefetch the dependencies needed for a specific set of targets, use [bazel fetch](https://docs.bazel.build/versions/master/command-line-reference.html#commands).
  - To unconditionally fetch all external dependencies, use [bazel sync](https://docs.bazel.build/versions/master/command-line-reference.html#commands).

[Shadowing dependencies](https://docs.bazel.build/versions/master/external.html#shadowing-dependencies)
```python
workspace(name = "myproject")

local_repository(
    name = "A",
    path = "../A",
)
local_repository(
    name = "B",
    path = "../B",
)
```

Both dependencies A and B depend on testrunner, but they depend on different versions of testrunner. 
There is no reason for these test runners to not peacefully coexist within myproject, however they will clash with each other since they have the same name. 
To declare both dependencies, update myproject/WORKSPACE:
```python
workspace(name = "myproject")

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")
http_archive(
    name = "testrunner-v1",
    urls = ["https://github.com/testrunner/v1.zip"],
    sha256 = "..."
)
http_archive(
    name = "testrunner-v2",
    urls = ["https://github.com/testrunner/v2.zip"],
    sha256 = "..."
)
local_repository(
    name = "A",
    path = "../A",
    repo_mapping = {"@testrunner" : "@testrunner-v1"}
)
local_repository(
    name = "B",
    path = "../B",
    repo_mapping = {"@testrunner" : "@testrunner-v2"}
)
```

This mechanism can also be used to join diamonds. For example if A and B had the same dependency but call it by different names, those dependencies can be joined in myproject/WORKSPACE.

[Using Proxies](https://docs.bazel.build/versions/master/external.html#using-proxies)
Bazel will pick up proxy addresses from the HTTPS_PROXY and HTTP_PROXY environment variables and use these to download HTTP/HTTPS files (if specified).

[Transitive dependencies](https://docs.bazel.build/versions/master/external.html#transitive-dependencies)
- Bazel only reads dependencies listed in your `WORKSPACE` file. 
- If your project (A) depends on another project (B) which list a dependency on a third project (C) in its `WORKSPACE` file, you’ll have to add both B and C to your project’s WORKSPACE file. 
- This requirement can balloon the `WORKSPACE` file size, but hopefully limits the chances of having one library include C at version 1.0 and another include C at 2.0.

[Caching of external dependencies](https://docs.bazel.build/versions/master/external.html#caching-of-external-dependencies)
- Bazel caches external dependencies and re-downloads or updates them when the WORKSPACE file changes.

[Layout](https://docs.bazel.build/versions/master/external.html#layout)
- External dependencies are all downloaded and `symlinked` under a directory named `external`. 
- You can see this directory by running:
```bash
ls $(bazel info output_base)/external
```
- Note that running bazel clean will not actually delete the external directory. 
- To remove all external artifacts, use `bazel clean --expunge`.

[Best practices](https://docs.bazel.build/versions/master/external.html#best-practices)
Repository rules
- Prefer [http_archive](https://docs.bazel.build/versions/master/repo/http.html#http_archive) to `git_repository` and `new_git_repository`.
- Do not use `bind()`. See “Consider removing bind” for a long discussion of its issues and alternatives.

A repository rule should generally be responsible for:
- Detecting system settings and writing them to files.
- Finding resources elsewhere on the system.
- Downloading resources from URLs.
- Generating or symlinking BUILD files into the external repository directory.

- Avoid using `repository_ctx.execute` when possible. For example, when using a non-Bazel C++ library that has a build using Make, it is preferable to use `repository_ctx.download()` and then write a `BUILD` file that builds it, instead of running ctx.execute(["make"]).

[Angular.io Building with Bazel](https://angular.io/guide/bazel)
==================================================================================================

1. Upgrade to Angular-CLI 8
```bash
npm uninstall -g angular-cli
npm cache verify
npm install -g @angular/cli@latest
ng --version
```

2. Install Bazel
```bash
npm install -g @angular/bazel
```

3. Create an application
```bash
ng new --collection=@angular/bazel
```

4. Build the application
```bash
ng build --leaveBazelFilesOnDisk
```

Compare to Blank Workspace with app and lib
1. Create worksapce
```bash
ng new --createApplication=false
```

2. Add an app
```bash
ng g app my-app
```

3. Add a lib
```bash
ng g lib my-lib
```
