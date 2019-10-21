import React, { Component } from 'react'
import { connect } from 'react-redux'
import { registerAdmin, adminlogin } from '../../redux/actions'
import Style from './index.less'
import Toast from '../../components/Toast'
import Loading from '../../components/Loading'
class Admin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            dayimgType: 'no-choose',
            weekimgType: 'no-choose',
            monthimgType: 'no-choose',
            amount: '',
            islogin: false,
            loadingMessage: ''
        }
    }

    register() {
        this.setState({
            loading: true,
            loadingMessage: '正在注册'
        })
        this.props.registerAdmin((code) => {
            this.setState({
                loading: false,
            })
            if (code == 0) {
                this.refs.toast.setVal2("注册成功")
            }
            else {
                this.refs.toast.setVal2("注册失败")
            }
        })

    }
    login() {

        if (!this.refs.password.value) {
            this.refs.toast.setVal2("账号不能为空")
            return
        }
        this.setState({
            loading: true,
            loadingMessage: '正在登录'
        })
        this.props.adminlogin({ password: this.refs.password.value }, (code) => {
            if (code == 1) {
                this.setState({
                    loading: false,
                    loadingMessage: '正在登录'
                })
                this.refs.toast.setVal2("密码错误")
                return
            }

            this.setState({
                loading: false,
                islogin: true
            })
        })
    }
    registerCard() {
        this.props.history.push('/registerCard')
    }
    render() {

        const { loading, loadingMessage, islogin } = this.state
        return (
            <React.Fragment>
                <style dangerouslySetInnerHTML={{ __html: Style }} />
                <div className="app-container">
                    <div className="containee">
                        {islogin && <div className="amount-num">积分金额:&nbsp;&nbsp;&nbsp;&nbsp;{this.props.amount}</div>}
                        <div className="bottom_admin">
                           { !islogin &&<div className="login-content_admin">
                                <img src={require("../../assets/img/wxaccount.png")} />
                                <input defaultValue={this.props.password} ref="password" placeholder="请输入账号" />
                            </div>}
                            <div className="button">
                                {!islogin && <div className="login" onClick={() => { this.login() }}>登录</div>}
                                {islogin && <div className="register-card" onClick={() => { this.registerCard() }}>注册卡密</div>}
                            </div>
                        </div>

                    </div>
                </div>
                {loading && <Loading message={loadingMessage} />}
                <Toast ref="toast" />
            </React.Fragment>
        )

    }
}
export default connect(
    state => state.Admin,
    { registerAdmin, adminlogin }
)(Admin)
