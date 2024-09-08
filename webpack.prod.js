import { merge } from 'webpack-merge';
import common from './webpack.config.js';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

export default merge(common, {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimizer: [
      `...`,
      new CssMinimizerPlugin({
        exclude: 'elements/**/*.css',
      }),
    ],
  },
});
