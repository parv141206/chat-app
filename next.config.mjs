/** @type {import('next').NextConfig} */
import TerserPlugin from "terser-webpack-plugin";
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Only modify the client-side Webpack configuration
    if (!isServer) {
      config.optimization.minimizer = [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true,
            },
          },
        }),
      ];
    }

    return config;
  },
};

export default nextConfig;
