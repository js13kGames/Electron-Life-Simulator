const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    devtool: "source-map",
    plugins: [
        new HtmlWebpackPlugin({
            title: `132 - build ${ Date.now() }`
        })
    ]
}
