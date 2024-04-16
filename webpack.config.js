const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const {
    NormalModuleReplacementPlugin
} = require('webpack');

module.exports = {
    devtool: "source-map",
    entry: {
        main: path.resolve(__dirname, './src/index.js'),
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].bundle.js',
        publicPath: "/",
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    keep_classnames: true,
                    keep_fnames: true
                }
            })
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, './src/index.html')
        }),
        new NormalModuleReplacementPlugin(
            /^(..\/preact|preact)(\/[^/]+)?$/,
            function (resource) {

                const replMap = {
                    'preact/hooks': path.resolve('node_modules/@bpmn-io/properties-panel/preact/hooks/dist/hooks.module.js'),
                    'preact/jsx-runtime': path.resolve('node_modules/@bpmn-io/properties-panel/preact/jsx-runtime/dist/jsxRuntime.module.js'),
                    'preact': path.resolve('node_modules/@bpmn-io/properties-panel/preact/dist/preact.module.js')
                };

                const replacement = replMap[resource.request];

                if (!replacement) {
                    return;
                }

                resource.request = replacement;
            }
        )
    ],
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            'preact': '@bpmn-io/properties-panel/preact',
            'react': '@bpmn-io/properties-panel/preact/compat',
            'react-dom': '@bpmn-io/properties-panel/preact/compat',
            'react/jsx-runtime': '@bpmn-io/properties-panel/preact/jsx-runtime'
        }
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, './dist'),
        },
        historyApiFallback: {
            disableDotRule: true
        },
        compress: true,
        hot: true,
        port: 3000,
        allowedHosts: "all"
    },
    module: {
        rules: [
            // JavaScript
            {
                test: /\.m?jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: [
                            ['@babel/plugin-transform-react-jsx', {
                                'importSource': '@bpmn-io/properties-panel/preact',
                                'runtime': 'automatic'
                            }]
                        ]
                    }
                }
            },
            // CSS, PostCSS, Sass
            {
                test: /\.(scss|css)$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
            },
            // SVG
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'svg-loader'
                    }
                ]
            },
        ]
    }
}