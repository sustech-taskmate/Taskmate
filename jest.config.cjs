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
  transform: { // 预处理器配置，匹配的文件要经过转译才能被识别，否则会报错
    '^.+\\.vue$': '@vue/vue3-jest',
    // "^.+\\.[tj]s$": "ts-jest",
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': require.resolve('babel-jest'),
  },
  transformIgnorePatterns: [ // 转译时忽略 node_modules
    '<rootdir>/node_modules/',
    // 'node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic)',
    '<rootdir>/src/main.ts',
    '<rootdir>/src/router/index.ts',
    '<rootdir>/src/composable/*.ts',
  ],
  // moduleNameMapper: { // 从正则表达式到模块名称的映射，和webpack的alisa类似
  //   '^@/(.*)$': '<rootDir>/src/$1'
  // },
  // snapshotSerializers: [ // Jest在快照测试中使用的快照序列化程序模块的路径列表
  //   'jest-serializer-vue'
  // ],
  testMatch: [
    '<rootDir>/tests/unit/*.test.js',
  ],
  collectCoverage: true, // 覆盖率报告，运行测试命令后终端会展示报告结果
  collectCoverageFrom: [ // 需要进行收集覆盖率的文件，会依次进行执行符合的文件
    'src/**/*.vue',
    'src/**/**/*.vue',
    'src/**/**/**/*.vue',
      '!src/components/util/*.vue'
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