import React from 'react'
import { Switch, Route} from 'react-router-dom';
import Loadable from 'react-loadable'
import Loading from '../../components/Loading'


const AsyncMenu=Loadable({
    loader:()=>import('../app'),
    loading:Loading
})

const AsyncRegister=Loadable({
    loader:()=>import('../registercard'),
    loading:Loading
})

const AsyncLog=Loadable({
    loader:()=>import('../log'),
    loading:Loading
})

const AsyncAdmin=Loadable({
    loader:()=>import('../admin'),
    loading:Loading
})

const AsyncRegisterAgent=Loadable({
    loader:()=>import('../registerAgent'),
    loading:Loading
})



export default class Main extends React.Component {
    render() {
        return (
            <Switch>
                <Route path='/' exact={true} component={AsyncMenu}></Route>
                <Route path='/registerCard' component={AsyncRegister} ></Route>
                <Route path='/log' component={AsyncLog} ></Route>
                <Route path='/admin' component={AsyncAdmin} ></Route>
                <Route path='/registerAgent' component={AsyncRegisterAgent} ></Route>
            </Switch>
        )
    }
}