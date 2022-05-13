const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    main: "./src/index.js",
  },
  output: {
    filename: "js/bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
    environment: {
      arrowFunction: false,
    },
    assetModuleFilename: "img/[name][ext]",
  },
  mode: process.env.NODE_ENV === "development" ? "development" : "production",
  plugins: [
    new HtmlWebpackPlugin({
      title: "Weather in your city",
      template: "index.html",
      filename: "index.html",
      favicon: "./src/img/favicon.ico",
      meta: {
        charset: { charset: "utf-8" },
        viewport: "width=device-width, initial-scale=1, maximum-scale=1",
        "Content-Security-Policy": {
          "http-equiv": "X-UA-Compatible",
          content: "ie=edge",
        },
      },
    }),
    new MiniCssExtractPlugin({
      filename: "styles/styles.css",
    }),
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.[tj]s?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".css", ".scss"],
  },
  stats: {
    children: true,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dev"),
    },
    compress: true,
    port: 9000,
    hot: true,
  },
};
