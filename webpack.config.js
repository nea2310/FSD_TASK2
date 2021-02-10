const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin');  // Копирует отдельные файлы или целые каталоги, которые уже существуют, в каталог сборки.
const webpack = require('webpack');
//const images = require('./webpack/images');

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const PATHS = {
	src: path.join(__dirname, './src'),
	dist: path.join(__dirname, './dist'),
	assets: 'assets/'
}


const optimization = () => {

	const config = {
		splitChunks: {
			chunks: 'all'
		}
	}

	if (isProd) {
		config.minimizer = [
			new OptimizeCssAssetWebpackPlugin(),
			new TerserWebpackPlugin()
		]
	}

	return config
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`


const cssLoaders = extra => {
	const loaders = [
		{
			loader: MiniCssExtractPlugin.loader,
			options: {
				hmr: isDev,
				reloadAll: true
			},
		},
		'css-loader'
	]

	if (extra) {
		loaders.push(extra)
	}

	return loaders
}

const babelOptions = preset => {
	const opts = {
		presets: [
			'@babel/preset-env'
		],
		plugins: [
			'@babel/plugin-proposal-class-properties'
		]
	}

	if (preset) {
		opts.presets.push(preset)
	}

	return opts
}




console.log('IS DEV: ', isDev)
console.log('IS PROD: ', isProd)

module.exports = {
	watch: true,
	context: path.resolve(__dirname, 'src'),
	mode: 'development',
	entry: {
		main: ['@babel/polyfill', './index.js'],
		//	analytics: './analytics.ts',
	},
	output: {
		filename: filename('js'),
		path: path.resolve(__dirname, 'dist')
	},
	resolve: {
		extensions: ['.js', '.json', '.png'],
		alias: {
			'@models': path.resolve(__dirname, 'src/models'),
			'@': path.resolve(__dirname, 'src'),
			//images: path.resolve(__dirname, 'src/assets/images/'),
		}
	},
	optimization: optimization(),

	devServer: {
		port: 4200,
		hot: isDev,
		watchOptions: {
			poll: true
		},
	},
	devtool: isDev ? 'source-map' : '',
	plugins: [
		new HTMLWebpackPlugin({
			filename: 'cards.html',
			template: './pages/cards/cards.pug',
		}),
		new HTMLWebpackPlugin({
			filename: 'colorsType.html',
			template: './pages/colorsType/colorsType.pug',
		}),
		new HTMLWebpackPlugin({
			filename: 'formElements.html',
			template: './pages/formElements/formElements.pug',
		}),
		new HTMLWebpackPlugin({
			filename: 'headersFooters.html',
			template: './pages/headersFooters/headersFooters.pug',
		}),
		new HTMLWebpackPlugin({
			filename: 'index.html',
			template: './pages/main/main.pug',
		}),
		new HTMLWebpackPlugin({
			filename: 'layout.html',
			template: './pages/layout/layout.pug',
		}),
		new HTMLWebpackPlugin({
			filename: 'landing_page.html',
			template: './pages/landing_page/landing_page.pug',
		}),
		new HTMLWebpackPlugin({
			filename: 'registration.html',
			template: './pages/registration/registration.pug',
		}),
		new HTMLWebpackPlugin({
			filename: 'sign_in.html',
			template: './pages/sign_in/sign_in.pug',
		}),
		new HTMLWebpackPlugin({
			filename: 'search_room.html',
			template: './pages/search_room/search_room.pug',
		}),
		new HTMLWebpackPlugin({
			filename: 'room_details.html',
			template: './pages/room_details/room_details.pug',
		}),



		new CleanWebpackPlugin(),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, 'src/favicon.ico'),
					to: path.resolve(__dirname, 'dist')
				},
			],
		}),
		new MiniCssExtractPlugin({
			filename: filename('css')
		}),
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery'
		}),
		new CopyPlugin({
			patterns: [
				{ from: `${PATHS.assets}images`, to: `${PATHS.dist}/${PATHS.assets}images/` }, // копируем все изображения в папку продакшена
			],
		}),
	],

	module: {
		rules: [
			{
				test: /\.pug$/,
				use: ['pug-loader']
			},
			{
				test: /\.css$/,
				use: cssLoaders()
			},

			{
				test: /\.less$/,
				use: cssLoaders('less-loader')
			},

			{
				test: /\.s[ac]ss$/,
				use: cssLoaders('sass-loader')
			},
			{
				test: /\.(gif|svg|png|jpe?g|gif|jpg)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: './images/[name].[ext]'
						}
					}
				]
			},
			//{ test: /\.(jpe?g|gif|jpg)$/, loader: "file-loader"},

			{
				test: /\.(ttf|woff|woff2|eot)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							outputPath: './fonts'
						}
					}
				]
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: {
					loader: 'babel-loader',
					options: babelOptions()
				}
			},

			{
				test: /\.ts$/,
				exclude: /node_modules/,
				loader: {
					loader: 'babel-loader',
					options: babelOptions('@babel/preset-typescript')
				}
			},

		]
	}
}