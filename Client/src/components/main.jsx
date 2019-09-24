import React from 'react'
import { Switch, Route} from 'react-router-dom';
import Loadable from 'react-loadable'
import Loading from '../components/Loading'

import {MyLoadingComponent} from './myloadingcomponent'

const AsyncMenu=Loadable({
    loader:()=>import('./menu'),
    loading:Loading
})



export default class Main extends React.Component {
    render() {
        return (
            <Switch>
                <Route path='/' exact={true} component={AsyncMenu}></Route>
            </Switch>
        )
    }
}