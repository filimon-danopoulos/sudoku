import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { fileURLToPath } from 'url';

export default {
  entry: './src/app/index.ts',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        oneOf: [
          {
            with: { type: 'css' },
            loader: 'css-loader',
            options: {
              exportType: 'css-style-sheet',
            },
          },
          {
            use: [MiniCssExtractPlugin.loader, 'css-loader'],
          },
        ],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.svg?$/,
        type: 'asset/source',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/app/index.html',
    }),

    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css',
    }),
  ],
  optimization: {
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};
