const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
    devtool: "source-map",
    plugins: [
        new HtmlWebpackPlugin({
            title: `132 - build ${ Date.now() }`
        })
    ],
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
        namedModules: false,
        moduleIds : 'size'
    },
    watchOptions: {
        ignored: /\.#|node_modules|~$/,
    }
}
