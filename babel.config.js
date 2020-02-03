module.exports = {
  presets: ['@babel/preset-typescript', ['@babel/preset-env', {targets: {chrome: "70"}}], '@babel/preset-react'],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-proposal-optional-chaining'],
  ],
}
