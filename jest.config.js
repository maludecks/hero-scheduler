module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/tests/integration"],
  setupFiles: ["<rootDir>/tests/.jest/setEnvVars.ts"],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  transform: {
    '^.+\\.(tsx|js|ts)?$': 'ts-jest',
  }
};
