import React, { Component } from 'react'
import { connect } from 'react-redux'
import Style from './index.less'
import Toast from '../../components/Toast'
import { CardInfo } from '../../redux/actions'

class Log extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentDidMount() {
        this.props.CardInfo()
    }
    render() {
        const { totalNum, bindNum, agentNum } = this.props
        return (
            <React.Fragment>
                <style dangerouslySetInnerHTML={{ __html: Style }} />


                <div className='log-container'>
                    <div className="log-containee">
                        <div>总卡密:<span>{totalNum}</span></div>
                        <div>总绑定卡密:<span>{bindNum}</span></div>
                        <div>总代理卡密:<span>{agentNum}</span></div>
                    </div>
                </div>
                {/* {loading && <Loading message="正在注册" />} */}
                <Toast ref="toast" />
            </React.Fragment>
        )

    }
}
export default connect(
    state => state.CardInfo,
    { CardInfo }
)(Log)
