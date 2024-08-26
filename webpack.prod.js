import { merge } from 'webpack-merge';
import common from './webpack.config.js';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import WorkboxPlugin from 'workbox-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export default merge(common, {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimizer: [`...`, new CssMinimizerPlugin()],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css',
    }),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],
});
