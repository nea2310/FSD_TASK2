import * as $ from 'jquery'
import Post from '@models/post'
import './babel'
import './styles/styles.css'
import './styles/styles.less'


/*import './plugins/datepicker.min.css';
import './plugins/datepicker.min.js';
*/

import WebpackLogo from '@/assets/webpack-logo.png'


const post = new Post('Webpack Post Title', WebpackLogo)
$('pre').html(post.toString())


import * as counter from '@/components/counter/counter';
import * as pagination from '@/components/pagination/pagination';
import * as sliderinstance from '@/components/rangeslider/rangeslider';
import * as calendar from '@/components/calendar/calendar';
import * as checklist_expand from '@/components/checklist/checklist';
import * as button_like from '@/components/buttonlike/buttonlike';



