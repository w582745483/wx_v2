import React from 'react'
import { Switch, Route} from 'react-router-dom';
import Loadable from 'react-loadable'


import {MyLoadingComponent} from './myloadingcomponent'

const AsyncNormalLoginForm=Loadable({
    loader:()=>import('./login'),
    loading:MyLoadingComponent
})
const AsyncRegistrationForm=Loadable({
    loader:()=>import('./register'),
    loading:MyLoadingComponent
})
const AsyncLogo=Loadable({
    loader:()=>import('./logo'),
    loading:MyLoadingComponent
})
const AsyncNineVideo=Loadable({
    loader:()=>import('./ninevideo'),
    loading:MyLoadingComponent
})
const AsyncBigvideo=Loadable({
    loader:()=>import('./bigvideo'),
    loading:MyLoadingComponent
})
const AsyncMenu=Loadable({
    loader:()=>import('./menu'),
    loading:MyLoadingComponent
})
const AsyncUpload=Loadable({
    loader:()=>import('./upload'),
    loading:MyLoadingComponent
})


export default class Main extends React.Component {
    render() {
        return (
            <Switch>
                <Route path='/' exact={true} component={AsyncMenu}></Route>
                <Route path='/login'  component={AsyncNormalLoginForm}></Route>
                <Route path='/register' component={AsyncRegistrationForm}></Route>
                <Route path='/logo' component={AsyncLogo}></Route>
                <Route path='/ninevideo' component={AsyncNineVideo}></Route>
                <Route path='/bigvideo' component={AsyncBigvideo}></Route>
                 <Route path='/upload' component={AsyncUpload}></Route>
            </Switch>
        )
    }
}