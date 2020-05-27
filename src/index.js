import * as $ from 'jquery'
import Post from '@models/post'
import './babel'
//import json from './assets/json'
//import xml from './assets/data.xml'
//import csv from './assets/data.csv'
import './styles/styles.css'
import './styles/twidget_style.css'
import './styles/less.less'
import WebpackLogo from '@/assets/webpack-logo.png'


const post = new Post('Webpack Post Title', WebpackLogo)
$('pre').html(post.toString())

//console.log('Post to String:', post.toString())
//console.log('JSON: ', json)
//console.log('XML: ', xml)
//console.log('CSV: ', csv)
//require("imports-loader?$=jquery!./twidget_instance.js");


import * as dropdown from '@/components/dropdown/dropdown';
import * as dropdown1 from '@/components/dropdown1/dropdown1';
