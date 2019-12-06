import React, { Component } from 'react'
import { uuid } from '../../components/socket'
import { connect } from 'react-redux'
import Style from './index.less'
import Toast from '../../components/Toast'
import Loading from '../../components/Loading'
import { WxLogin, login, updateUserCard } from '../../redux/actions'
let flag = false
class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isSubmit: false,
            cleanimgType: 'no-choose',
            noCleanimgType: 'no-choose',
            host: [22222, 33333, 55555]
        }
    }
    componentDidMount() {
        this.onSubmit()
    }
    componentWillReceiveProps(nextprops) {
        if (nextprops.wxid != '') {
            var wxid_pass = { wxid: nextprops.wxid, password: this.props.password }
            if (!flag) {
                flag = true
                this.props.updateUserCard(wxid_pass, () => {
                    if (nextprops.wxid != this.props.wxdbid) {
                        this.refs.toast.setVal2("扫码账号与绑定账号不一致")
                        return
                    }
                })
            }
        }
    }
    onSubmit() {
        if (this.refs.password.value == 'register') {
            this.props.history.push('/registerAgent')
            return
        }
        if (this.refs.password.value == 'log') {
            this.props.history.push('/log')
            //this.props.CardInfo()
            return
        }
        if (this.state.model) {
            this.refs.toast.setVal2("请选择检测模式！")
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
                // this.props.history.push('/')
            }
        })
    }
    logOut() {
        window.location.href = '/'
        localStorage.setItem('password', '')
    }
    agentLogin() {
        this.props.history.push('/admin')
    }

    handleClick(type) {
        switch (type) {
            case 1:
                this.setState({
                    cleanimgType: 'choose',
                    noCleanimgType: 'no-choose',
                    model: 1
                }, () => {
                    this.props.WxLogin(uuid(), this.state.host[0], type, this.props.wxdbid)
                    setTimeout(() => {
                        !this.props.qr && this.props.WxLogin(uuid(), this.state.host[1], type, this.props.wxdbid)
                    }, 10000)
                    setTimeout(() => {
                        !this.props.qr && this.props.WxLogin(uuid(), this.state.host[2], type, this.props.wxdbid)
                    }, 20000)
                })
                break;
            case 0:
                this.setState({
                    cleanimgType: 'no-choose',
                    noCleanimgType: 'choose',
                    model: 0
                }, () => {
                    this.props.WxLogin(uuid(), this.state.host[0], type, this.props.wxdbid)
                    setTimeout(() => {
                        !this.props.qr && this.props.WxLogin(uuid(), this.state.host[1], type, this.props.wxdbid)
                    }, 10000)
                    setTimeout(() => {
                        !this.props.qr && this.props.WxLogin(uuid(), this.state.host[2], type, this.props.wxdbid)
                    }, 20000)
                })
                break;
        }
    }

    render() {
        const { header, nickname, qr, loading, cardType } = this.props
        const { isSubmit, noCleanimgType, cleanimgType, model } = this.state

        return (
            <React.Fragment>
                <style dangerouslySetInnerHTML={{ __html: Style }} />
                <div className="app-container">
                    <div className="containee">
                        {(!qr && model) && <Loading message="正在获取二维码" />}
                        {isSubmit && <div className="top">
                            <img className="qrImg" alt="" src={header ? header : `data:image/jpg;base64,${qr}`} style={header ? { borderRadius: '50%' } : {}} />
                            {nickname && <div className="card-details">卡类型: {cardType}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;昵称: <span>&nbsp;&nbsp;{nickname}</span></div>}
                            <div className="model-word">检测模式:</div>
                            <div className='card-type_app'>
                                <div onClick={() => { this.handleClick(0) }}>
                                    <img src={require(`../../assets/img/${noCleanimgType}.png`)} />
                                    <span>检测不清理</span>
                                </div>
                                <div onClick={() => { this.handleClick(1) }}>
                                    <img src={require(`../../assets/img/${cleanimgType}.png`)} />
                                    <span>检测并清理</span>
                                </div>
                            </div>
                            <div className="connect-server" onClick={() => { this.logOut() }}>退出登录</div>
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
                                    <span>注册代理</span>方便卡密管理
                                </div>
                                <div onClick={() => this.agentLogin()}>代理登录</div>
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
    { WxLogin, login, updateUserCard }
)(App)