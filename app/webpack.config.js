const path = require('path');

module.exports = {
  mode: 'production',
  entry: './qrecords.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: 'qrecords.js',
    path: path.resolve(__dirname, ''),
    libraryTarget: 'var',
    library: 'QRecords'
  },
};