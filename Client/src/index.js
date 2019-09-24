import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux'

import Main from './component/main';
import Menu from './component/menu'
import store from './redux/store'
ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <Main/>
        </BrowserRouter>     
    </Provider>,

document.getElementById('root'));

