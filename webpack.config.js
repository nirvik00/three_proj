const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    resolve: {
        fallback: {
            fs: false,
            path: require.resolve("path-browserify"),
        },
    },
    entry: {
        bundle: path.resolve(__dirname, "src/index.js"),
    },

    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "[name][contenthash].js",
        assetModuleFilename: "[name][ext]",
        clean: true,
    },

    devtool: "source-map",

    devServer: {
        static: {
            directory: path.resolve(__dirname, "dist"),
        },
        port: 3000,
        open: true,
        hot: true,
        compress: true,
        historyApiFallback: true,
    },

    module: {
        rules: [
            {
                test: /\.(jpg|png|svg|gif|jpeg)$/i,
                type: "asset/resource",
            },
            {
                test: /\.(glb|gltf)$/,
                type: 'asset/resource'
            }
        ],
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: "three-webpack",
            filename: "index.html",
            template: "src/template.html",
        }),
    ],
};
