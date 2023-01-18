const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/index.tsx',
    module: {
        rules: [
            {
                test: /\.[tj]sx?$/,
                use: 'babel-loader',
                exclude: '/node_modules/'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.jsx']
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'dist/app.bundle.js',
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Distance',
            template: './static/index_template.html',
            clean: true,
        }),
        // new CopyPlugin({
        //     patterns: [
        //         {
        //             from: "static",
        //             to: "",
        //             globOptions: {
        //                 ignore: [
        //                     '**/index_template.html',
        //                 ]
        //             }
        //         },
        //     ],
        // }),
    ],
    devServer: {
        open: true,
        watchFiles: ['src/**/*', 'static/**/*'],
    },
};