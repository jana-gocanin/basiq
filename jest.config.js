module.exports = {
  moduleFileExtensions: ["js", "jsx"],
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  testMatch: ["<rootDir>/src/__tests__/**/*.test.js"],
  moduleNameMapper: {
    "\\.(css|less)$": "<rootDir>/src/__mocks__/styleMock.js",
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  transformIgnorePatterns: [
    "/node_modules/(?!(axios)/)", // Ignoriši transformaciju svih node_modules osim @babel paketa
  ], //["<rootDir>/node_modules/"], //["/node_modules/(?!(axios)/)"],
};
