# Taskmate - Tauri + Vue 3 + TypeScript

[![Build](https://img.shields.io/github/actions/workflow/status/sustech-taskmate/Taskmate/build.yml?logo=github)](https://github.com/sustech-taskmate/Taskmate/actions/workflows/build.yml "1")
[![Release](https://img.shields.io/github/v/release/sustech-taskmate/Taskmate?logo=github)](https://github.com/sustech-taskmate/Taskmate/releases/latest)
[![Activity](https://img.shields.io/github/last-commit/sustech-taskmate/Taskmate)](https://github.com/sustech-taskmate/Taskmate/commits)
[![Size](https://img.shields.io/github/repo-size/sustech-taskmate/Taskmate)]()
[![Size](https://img.shields.io/github/languages/code-size/sustech-taskmate/Taskmate)]()

## Installation
[Latest Release](https://github.com/sustech-taskmate/Taskmate/releases/latest)


## Development

### Prerequisite
- [Rust](https://www.rust-lang.org/tools/install)
- [Node.js](https://nodejs.org/en/download)

```shell
# skip if you already have pnpm installed
$ npm i -g pnpm

# install dependencies
$ pnpm install

# development
$ pnpm tauri dev
```

## Test

```shell
# run unit test
$ pnpm test:unit

# run ts test
$ pnpm test
```

## Build
```shell
# build application on current os
$ pnpm tauri build
```
