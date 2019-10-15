import React, { Component } from 'react'
import { connect } from 'react-redux'
import { registerCard } from '../../redux/actions'
import Style from './index.less'
import Toast from '../../components/Toast'
import Loading from '../../components/Loading'

class Log extends Component {
    constructor(props) {
        super(props)
        this.state = {
           

        }
    }
    render() {
        return (
            <React.Fragment>
                <style dangerouslySetInnerHTML={{ __html: Style }} />
                <div className='log-container'>
                    <div>总卡密:<span>1232</span></div>
                    <div>总绑定卡密:<span>3123123</span></div>
                </div>
                {/* {loading && <Loading message="正在注册" />} */}
                <Toast ref="toast" />
            </React.Fragment>
        )

    }
}
export default connect(
    state => state.User,
    { registerCard }
)(Log)
