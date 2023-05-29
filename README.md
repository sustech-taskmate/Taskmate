# Taskmate

[![Build](https://img.shields.io/github/actions/workflow/status/sustech-taskmate/Taskmate/build.yml?logo=github)](https://github.com/sustech-taskmate/Taskmate/actions/workflows/build.yml "1")
[![Release](https://img.shields.io/github/v/release/sustech-taskmate/Taskmate?logo=github)](https://github.com/sustech-taskmate/Taskmate/releases/latest)
[![Activity](https://img.shields.io/github/last-commit/sustech-taskmate/Taskmate)](https://github.com/sustech-taskmate/Taskmate/commits)
[![Size](https://img.shields.io/github/repo-size/sustech-taskmate/Taskmate)]()
[![Size](https://img.shields.io/github/languages/code-size/sustech-taskmate/Taskmate)]()

## How to Use

### Installation

[Latest Release](https://github.com/sustech-taskmate/Taskmate/releases/latest)

### Development

#### Prerequisite

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

### Test

```shell
# run unit test
$ pnpm test:unit

# run ts test
$ pnpm test
```

### Build

```shell
# build application on current os
$ pnpm tauri build
# build with customized os
$ pnpm tauri build --target [RUST TARGET]
# e.g.
# ARM64 Windows
$ pnpm tauri build --target aarch64-pc-windows-msvc
# Apple silicon and Intel-based Macs
$ pnpm tauri build --target universal-apple-darwin
```



## How to Contribute

We welcome contributions in any form! If you find any bugs, have suggestions for improvements, or would like to add new features, please follow these steps to contribute:

1. Fork this repository and clone it to your local environment.
2. Create a new branch to make your modifications.
3. Make your changes and perform necessary tests.
4. Commit your changes and send a Pull Request to our repository.

Please ensure your contribution adheres to the following guidelines:

- Maintain code style consistent with the project.
- Perform necessary tests before submitting to ensure no new issues are introduced.
- Clearly describe your modifications in your Pull Request description.



## Contact Us

If you have any questions, suggestions, or feedback regarding this project, please feel free to reach out to us through the following channels:

- Email: [![](https://img.shields.io/badge/-tavish9.chen%40gmail.com-black?logo=gmail&style=flat)](mailto:tavish9.chen@gmail.com)
- Issue Tracker: [Issues Taskmate](https://github.com/sustech-taskmate/Taskmate/issues)

We value your input and will do our best to respond promptly.

Thank you for your support!