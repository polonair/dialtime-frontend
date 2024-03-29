const APP_ENV = (process.env.APP_ENV || 'dev').trim();

const path = require("path");
const webpack = require("webpack");

module.exports =
{
    entry:
    {
        admin: "./src/admin.ts",
        manager: "./src/manager.ts",
        master: "./src/master.ts",
        partner: "./src/partner.ts",
        polyfill: "./src/polyfill.ts",
        vendor: "./src/vendor.ts"
    },
    output:
    {
        filename: "js/[name].js",
        path: __dirname + "/dist/"
    },
    module:
    {
        loaders:
        [
            {
                test: /\.ts$/,
                loader: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.s[ac]ss$/,
                loader: 'style!css!autoprefixer?browsers=last 2 versions!sass'
            }
        ]
    },
    resolve:
    {
        extensions: ["", ".js", ".ts", ".scss"]
    },
    plugins: [],
    devtool: "source-map",
    watch: (APP_ENV == 'dev')
}

if (APP_ENV == 'prod')
{
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin(
        {
            compress: { warnings: false },
            comments: false
        })
    );
}
