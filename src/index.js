import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import App from './components/Main';
import About from './components/About';
import Repos from './components/Repos';

// test htmlhint
require('./templates/test_rules.html');

// 使用路由时请用webpack-dev-server内联模式调试,即浏览器直接打开localhost:port
// path="/" => localhost:port/#/
// path="/about" => localhost:port/#/about
// path="/repos" => localhost:port/#/repos
ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={App}/>
    <Route path="/about" component={About}/>
    <Route path="/repos" component={Repos}/>
  </Router>
), document.getElementById('app'));
