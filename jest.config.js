module.exports = {
  preset: 'react-native',
  setupFiles: [ "<rootDir>/jest/setup.js" ],
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|@fortawesome|@react-native|@react-navigation)",
  ],
};
