# ts_hello_world

## Quick Start

`bazel build //...`

`bazel test //:my_test`

## Init

```bash
yarn add -D \
    @bazel/bazelisk \
    @bazel/ibazel \
    typescript \
    @bazel/typescript \
    @types/jasmine \
    jasmine \
    jasmine-core \
    @bazel/jasmine
```

`tsc -init`

Modify `tsconfig.json`
- "declaration": true,
- "noEmit": false,    
- "types": ["@types/jasmine"],

```json
{
    "compilerOptions": {
        // ...
        "declaration": true,
        "noEmit": false,
        "types": ["@types/jasmine"],
        // ...
    }
}
```