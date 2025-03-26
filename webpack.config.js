const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './src/code.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'code.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new webpack.DefinePlugin({
      __html__: JSON.stringify(`
        <h2>Content Anonymizer</h2>
        <label>
          <input type="checkbox" id="products" checked> Anonymize Product Names
        </label>
        <label>
          <input type="checkbox" id="prices" checked> Anonymize Prices
        </label>
        <label>
          <input type="checkbox" id="images"> Anonymize Images
        </label>
        <div style="margin-top: 20px;">
          <button id="anonymize">Anonymize Content</button>
          <button id="close">Close</button>
        </div>
      `)
    })
  ]
};