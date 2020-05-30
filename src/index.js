import * as $ from 'jquery'
import Post from '@models/post'
import './babel'

import './styles/styles.less'
import './styles/styles.css'


import WebpackLogo from '@/assets/webpack-logo.png'


const post = new Post('Webpack Post Title', WebpackLogo)
$('pre').html(post.toString())



import * as dropdown_guests from '@/components/dropdown_guests/dropdown_guests';
import * as dropdown_rooms from '@/components/dropdown_rooms/dropdown_rooms';


