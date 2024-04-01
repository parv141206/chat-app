const TerserPlugin = require("terser-webpack-plugin");
module.exports = {
  // Your existing configuration...
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
  },
};
