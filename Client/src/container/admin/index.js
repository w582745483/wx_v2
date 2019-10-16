import React, { Component } from 'react'
import { connect } from 'react-redux'
import { registerAdmin, adminlogin, adminPayfor } from '../../redux/actions'
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
            buttonValue: '登录',
            amount: '',
            payStatus: false
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
        this.props.registerAdmin(() => {
            this.setState({
                payStatus: true,
                buttonValue: '充值'
            })
        })

    }
    loginOrPay() {
        const { buttonValue, amount } = this.state
        if (buttonValue == '登录') {
            if(!this.refs.password.value) {
                this.refs.toast.setVal2("账号不能为空")
                return
            } 
            this.props.adminlogin()
        }
        else if (buttonValue == '充值') {
            if(!this.refs.password.value) {
                this.refs.toast.setVal2("账号不能为空")
                return
            } 
            const adminData = {
                account: this.refs.password.value,
                amount
            }
            this.props.adminPayfor(adminData)
        }
    }
    render() {

        const { loading, dayimgType, weekimgType, monthimgType, buttonValue, payStatus } = this.state
        return (
            <React.Fragment>
                <style dangerouslySetInnerHTML={{ __html: Style }} />
                <div className="app-container">
                    <div className="containee">
                        <div className="bottom_admin">
                            <div className="login-content_admin">
                                <img src={require("../../assets/img/wxaccount.png")} />
                                <input defaultValue="" ref="password" placeholder="请输入账号" />
                            </div>
                            <div className="button">
                                <div className="login-button__register" onClick={() => this.register()}>注册代理</div>
                                <div className="pay-for" onClick={() => { this.loginOrPay() }}>{buttonValue}</div>
                            </div>
                            {
                                payStatus && <div className='card-type_admin'>
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
                            }

                        </div>

                    </div>
                </div>
                {loading && <Loading message="正在注册" />}
                <Toast ref="toast" />
            </React.Fragment>
        )

    }
}
export default connect(
    state => state.Admin,
    { registerAdmin, adminlogin, adminPayfor }
)(Admin)
