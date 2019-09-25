import React, { Component } from 'react'
import { uuid } from '../../components/socket'
import { connect } from 'react-redux'
import Style from './index.less'
import { WxLogin } from '../../redux/actions'
class App extends Component {
    componentDidMount(){
         //开启websicket
         this.props.WxLogin(uuid())
    }
    render() {
        return (
            <React.Fragment>
                <style dangerouslySetInnerHTML={{ __html: Style }} />
                <div className="app-container">
                    <div className="containee">
                        <div className="top">  
                       <img alt="" src={"data:image/jpg;base64," + this.props.qr} />
                            <div className="qrCode">二维码获取成功</div>
                            <div className="card-details">卡类型: 周卡&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;昵称: Warrors</div>
                        </div>
                        <div className="bottom">
                            <div className="login-content">
                                <img src={require("../../assets/img/login.png")} />
                                <input placeholder="请输入卡密" />
                            </div>
                            <div className="login-button">
                                卡密登录
                             </div>
                            <div className="account-manage">
                                <div>
                                    <span>注册账号</span>方便卡密管理
                                </div>
                                <div> 账号密码登录</div>
                            </div>
                            <div className="system-info">
                                本系统会根据您的卡密类型自动进入相应功能
                            </div>
                        </div>

                    </div>

                </div>
            </React.Fragment>
        )

    }
}
export default connect(
    state => state.Qr,
    { WxLogin }
)(App)