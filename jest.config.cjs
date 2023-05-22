module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
  verbose: true, // 多于一个测试文件运行时展示每个测试用例测试通过情况
  bail: false, // 参数指定只要有一个测试用例没有通过，就停止执行后面的测试用例
  testEnvironment: 'jsdom', // 测试环境，jsdom可以在Node虚拟浏览器环境运行测试
  moduleFileExtensions: [ // 需要检测测的文件类型
    'ts',
    'vue',
    'js',
  ],
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': require.resolve('babel-jest'),
  },
  transformIgnorePatterns: [
    '<rootdir>/node_modules/',
    '<rootdir>/src/main.ts',
    '<rootdir>/src/router/index.ts',
    '<rootdir>/src/composable/*.ts',
  ],
  testMatch: [
      '<rootDir>/tests/unit/**/*.test.js',
      '!<rootDir>/tests/unit/Vue/*.test.js',
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/components/**/*.vue',
    '!src/components/util/*.vue',
    '!src/components/AssignContent/*.vue',
  ],
  coverageReporters: ['html', 'lcov', 'text-summary'], // Jest在编写覆盖率报告的配置，添加"text"或"text-summary"在控制台输出中查看覆盖率摘要
  coveragePathIgnorePatterns: ['/node_modules/'], // 需要跳过覆盖率信息收集的文件目录
  coverageDirectory: "<rootDir>/tests/unit/coverage", // Jest输出覆盖信息文件的目录，运行测试命令会自动生成如下路径的coverage文件
  testURL: 'http://localhost/',
  globals: {
    "ts-jest": {
      "tsconfig": "tsconfig.json"
    }
  }
};