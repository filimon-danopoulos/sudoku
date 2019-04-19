module.exports = function override(config, env) {
  config.output = {
    ...config.output,
    globalObject: `(typeof self !== undefined ? self : this)`
  }
  config.module.rules.unshift({
    test: /\.worker\.ts/,
    use: {
      loader: 'worker-loader'
    }
  })
  return config
}