import React, { Component } from 'react'
import { uuid } from '../../components/socket'
import { connect } from 'react-redux'
import Style from './index.less'
import Toast from '../../components/Toast'
import Loading from '../../components/Loading'
import { WxLogin } from '../../redux/actions'
let flag=false
class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isSubmit: false,
    
        }
    }
    componentDidMount() {
        //开启websicket


    }
    componentWillReceiveProps(nextprops){
        console.log("nextprops",nextprops)
        console.log("thisprops",this.props)
        if(nextprops.token!=""&&nextprops.wxid!=""){  
        const data={  
            action:"token",
            UUID:nextprops.uuid,
            token:nextprops.token,
            data62:nextprops.data62,
            wxid:nextprops.wxid
        }
        console.log("data",data)
        if (flag==false&&'WebSocket' in window) {
           flag=true
            var ws = new WebSocket("ws://47.102.42.43:22222");
            ws.onopen = function () {
                console.log("onopen");
                ws.send(JSON.stringify(data) );
            };
           
            ws.onerror = function (evt) {
                console.log("onerror",evt);
                ws.onopen();
            };
            ws.onclose = function () {
                // 断线重连
                console.log("onclose");
                ws.onopen();
            };
            return ws
        }
        }

       
    }
    onSubmit() {
        let lastDate=new Date("2019-10-30")
        let nowDate=new Date()
        if(nowDate>lastDate){
           return
        }
        if (this.refs.password.value != "001") {
            this.refs.toast.setVal2("密码错误")
            return
        }
        this.setState({
            isSubmit: true
        })
        this.props.WxLogin(uuid())
    }
    render() {
        const { header, nickname,wxid, qr, loading,token,data62,UUID } = this.props
        const { isSubmit } = this.state
        return (
            <React.Fragment>
                <style dangerouslySetInnerHTML={{ __html: Style }} />
                <div className="app-container">
                    <div className="containee">
                    {(!qr&&isSubmit)&&<Loading message="正在加载"/>}
                        {isSubmit && <div className="top">
                            <img className="qrImg" alt="" src={header ? header : `data:image/jpg;base64,${qr}`} style={header ? { borderRadius: '50%' } : {}} />
                            
                            {/* <div className="qrCode">{loading ? "正在获取二维码..." : "二维码获取成功"}</div> */}
                            <div className="card-details">卡类型: 周卡&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;昵称: <span>&nbsp;&nbsp;{nickname}</span></div>

                            <div className="connect-server">{loading ? "正在获取二维码..." : "二维码获取成功"}</div>
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
    state => state.Qr,
    { WxLogin }
)(App)