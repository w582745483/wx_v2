import React, { Component } from 'react'
import { connect } from 'react-redux'
import { registerAdmin, adminlogin, adminPayfor } from '../../redux/actions'
import Style from './index.less'
import Toast from '../../components/Toast'
import Loading from '../../components/Loading'
class RegisterAgent extends Component {
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

    handleClick(amount) {
        switch (amount) {
            case 50:
                this.setState({
                    dayimgType: 'choose',
                    weekimgType: 'no-choose',
                    monthimgType: 'no-choose',
                    amount: 50
                })
                break;
            case 100:
                this.setState({
                    dayimgType: 'no-choose',
                    weekimgType: 'choose',
                    monthimgType: 'no-choose',
                    amount: 100
                })
                break;
            case 500:
                this.setState({
                    dayimgType: 'no-choose',
                    weekimgType: 'no-choose',
                    monthimgType: 'choose',
                    amount: 500
                })
                break;
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
    Payfor() {
        const { amount } = this.state
        if (!this.refs.password.value || !amount) {
            this.refs.toast.setVal2("账号和金额不能为空")
            return
        }
        const adminData = {
            account: this.refs.password.value,
            amount
        }
        this.props.adminPayfor(adminData, (code) => {
            if (code == 0) {
                this.refs.toast.setVal2("充值成功")
            }
            else {
                this.refs.toast.setVal2("充值失败")
            }
        })
    }

    render() {

        const { loading, dayimgType, weekimgType, monthimgType, loadingMessage, islogin } = this.state
        return (
            <React.Fragment>
                <style dangerouslySetInnerHTML={{ __html: Style }} />
                <div className="app-container">
                    <div className="containee">
                        <div className="bottom_admin">
                            <div className="login-content_registerAgent">
                                <img src={require("../../assets/img/wxaccount.png")} />
                                <input defaultValue={this.props.password} ref="password" placeholder="请输入账号" />
                            </div>
                            <div className="button">
                                <div className="login-button__register" onClick={() => this.register()}>注册代理</div>

                                <div className="pay-for" onClick={() => { this.Payfor() }}>充值</div>
                            </div>

                            <div className='card-type_admin'>
                                <div onClick={() => { this.handleClick(50) }}>
                                    <img src={require(`../../assets/img/${dayimgType}.png`)} />
                                    <span>￥50元</span>
                                </div>
                                <div onClick={() => { this.handleClick(100) }}>
                                    <img src={require(`../../assets/img/${weekimgType}.png`)} />
                                    <span>￥100元</span>
                                </div>
                                <div onClick={() => { this.handleClick(500) }}>
                                    <img src={require(`../../assets/img/${monthimgType}.png`)} />
                                    <span>￥500元</span>
                                </div>
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
    { registerAdmin, adminlogin, adminPayfor }
)(RegisterAgent)
