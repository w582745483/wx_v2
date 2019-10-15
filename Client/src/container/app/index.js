import React, { Component } from 'react'
import { uuid } from '../../components/socket'
import { connect } from 'react-redux'
import Style from './index.less'
import Toast from '../../components/Toast'
import Loading from '../../components/Loading'
import { WxLogin, login, updateUserCard, CardInfo } from '../../redux/actions'
let flag = false
class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isSubmit: false,

        }
    }
    componentDidMount() {
        this.onSubmit()
    }
    componentWillReceiveProps(nextprops, ) {
        if (nextprops.token != '' && nextprops.wxid != '' && nextprops.data62 != '') {
            var wxid_pass = { wxid: nextprops.wxid, password: this.props.password }
            if (!flag) {
                flag = true
                this.props.updateUserCard(wxid_pass, () => {
                    if (nextprops.wxid != this.props.wxdbid) {
                        return
                    }
                    const data = {
                        action: "token",
                        UUID: nextprops.uuid,
                        token: nextprops.token,
                        data62: nextprops.data62,
                        wxid: nextprops.wxid
                    }
                    console.log("data", data)
                    if ('WebSocket' in window) {
                        var ws = new WebSocket("ws://47.103.112.148:22222");
                        ws.onopen = function () {
                            console.log("WebSocket onopen");
                            ws.send(JSON.stringify(data));
                        };

                        ws.onerror = function (evt) {
                            console.log("WebSocket onerror", evt);
                            ws.onopen();
                        };
                        ws.onclose = function () {
                            // 断线重连
                            console.log("WebSocket 断线重连");
                            ws.onopen();
                        };
                        return ws
                    }
                })
            }


        }
    }
    onSubmit() {
        if (this.refs.password.value == 'register') {
            this.props.history.push('/registerCard')
            return
        }
        if (this.refs.password.value == 'log') {
            this.props.history.push('/log')
            this.props.CardInfo()
            return
        }
        this.props.login(this.refs.password.value, (result) => {
            // let lastDate = new Date("2019-10-30")
            // let nowDate = new Date()
            // if (nowDate > lastDate) {
            //     this.refs.toast.setVal2("服务器错误")
            //     return
            // }
            if (result == 1) {
                this.refs.toast.setVal2("密码错误")
                return
            }
            else if (result == 2) {
                this.refs.toast.setVal2("卡密过期")
                return
            }
            else if (result == 0) {
                this.setState({
                    isSubmit: true
                })
                this.props.WxLogin(uuid())
                // this.props.history.push('/')
            }
        })
    }
    logOut() {
        fetch('http://118.123.11.246:11425/users/', {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': ' application/json'
            },
        }).then(() => {
            window.location.href = '/'
            localStorage.setItem('password', '')
        })

    }
    render() {
        const { header, nickname, qr, loading } = this.props
        const { isSubmit } = this.state

        return (
            <React.Fragment>
                <style dangerouslySetInnerHTML={{ __html: Style }} />
                <div className="app-container">
                    <div className="containee">
                        {(!qr && isSubmit) && <Loading message="正在加载" />}
                        {isSubmit && <div className="top">
                            <img className="qrImg" alt="" src={header ? header : `data:image/jpg;base64,${qr}`} style={header ? { borderRadius: '50%' } : {}} />

                            {/* <div className="qrCode">{loading ? "正在获取二维码..." : "二维码获取成功"}</div> */}
                            <div className="card-details">卡类型: 周卡&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;昵称: <span>&nbsp;&nbsp;{nickname}</span></div>

                            <div className="connect-server" onClick={() => { this.logOut() }}>{loading ? "正在获取二维码..." : "退出"}</div>
                            <div className="info-content">如果长时间未显示二维码请您刷新本页面</div>

                        </div>

                        }
                        {!isSubmit && <div className="bottom">
                            <div className="login-content">
                                <img src={require("../../assets/img/login.png")} />
                                <input ref="password" placeholder="请输入卡密" />
                            </div>
                            <div onClick={() => this.onSubmit()} className="login-button">
                                卡密登录
                             </div>
                            <div className="account-manage">
                                <div>
                                    <span>注册账号</span>方便卡密管理
                                </div>
                                <div>账号密码登录</div>
                            </div>
                            <div className="system-info">
                                本系统会根据您的卡密类型自动进入相应功能
                            </div>
                        </div>
                        }
                    </div>
                </div>

                <Toast ref="toast" />
            </React.Fragment>
        )

    }
}
export default connect(
    state => ({ ...state.Qr, ...state.User }),
    { WxLogin, login, updateUserCard, CardInfo }
)(App)