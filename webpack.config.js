const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    decode: './src/decoder.ts',
    encode: './src/encoder.ts',
    all: ['./src/decoder.ts', './src/encoder.ts']
  },
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
    filename: 'qresponse-[name]-bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};