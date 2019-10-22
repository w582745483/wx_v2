import React, { Component } from 'react'
import { connect } from 'react-redux'
import { registerCard, adminPayfor } from '../../redux/actions'
import Style from './index.less'
import Toast from '../../components/Toast'
import Loading from '../../components/Loading'
class RegisterCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dayimgType: 'no-choose',
            weekimgType: 'no-choose',
            monthimgType: 'no-choose',
            loading: false,
            clickButton: '注册卡密',
            amount: ''

        }
    }

    onSubmit(text) {
        if (text == "注册卡密") {
            if (!this.state.cardType) {
                this.refs.toast.setVal2("卡密类型不能为空!")
                return
            }
            if (!/^[0-9]*$/.test(this.refs.number.value) || !this.refs.number.value) {
                this.refs.toast.setVal2("输入的数量必须是数字!")
                return
            }
            if(!/[1-9]\d{7,10}@qq\.com/.test(this.refs.email.value)){
                this.refs.toast.setVal2("请输入正确的邮箱")
                return
            }
            if (parseInt(this.props.amount) + parseInt(this.state.amount)*parseInt(this.refs.number.value)< 0) {
                this.refs.toast.setVal2("账号积分值不足，请联系管理员充值")
                return
            }
            const userCard = { cardType: this.state.cardType, number: this.refs.number.value, email:this.refs.email.value}
            this.setState({
                loading: true
            })

            this.props.registerCard(userCard, (result) => {
                if (result == 0) {
                    this.setState({
                        loading: false,
                        clickButton: '立即登录'
                    })
                    this.refs.toast.setVal2("注册成功")
                    //卡密注册后扣除相应积分金额
                    const adminData = {
                        account: this.props.account,
                        amount: this.state.amount*this.refs.number.value
                    }
                    this.props.adminPayfor(adminData, (code) => {
                        if (code == 0) {
                            this.refs.toast.setVal2("充值成功")
                        }
                        else {
                            this.refs.toast.setVal2("充值失败")
                        }
                    })
                    // setTimeout(() => {
                    //     this.props.history.push('/')
                    // }, 1000)
                }
                else {
                    this.refs.toast.setVal2("注册失败,请重试!")
                    this.setState({
                        loading:false
                    })
                }

            })
        }
        else if (text == "立即登录") {
            this.props.history.push('/')
        }



    }
    handleClick(imgType) {
        switch (imgType) {
            case 'day':
                this.setState({
                    dayimgType: 'choose',
                    weekimgType: 'no-choose',
                    monthimgType: 'no-choose',
                    cardType: 'day',
                    amount: -2
                })
                break;
            case 'week':
                this.setState({
                    dayimgType: 'no-choose',
                    weekimgType: 'choose',
                    monthimgType: 'no-choose',
                    cardType: 'week',
                    amount: -5
                })
                break;
            case 'month':
                this.setState({
                    dayimgType: 'no-choose',
                    weekimgType: 'no-choose',
                    monthimgType: 'choose',
                    cardType: 'month',
                    amount: -30
                })
                break;
        }
    }

    handleFocus() {
        this.refs.input.select()
    }
    componentDidMount() {
        if (this.props.account == '') {
            this.props.history.push('/Admin')
        }
    }
    componentWillReceiveProps(nextProps) {

    }
    render() {
        const { dayimgType, weekimgType, monthimgType, loading, clickButton } = this.state
        const { password, amount } = this.props

        return (
            <React.Fragment>
                <style dangerouslySetInnerHTML={{ __html: Style }} />
                <div className="app-container">
                    <div className="containee">
                        {amount && <div className="amount-num">积分金额:&nbsp;&nbsp;&nbsp;&nbsp;{amount}</div>}
                        <div className="bottom_register">
                            <div className="login-content_register">
                                <div>
                                    <img src={require("../../assets/img/email.png")} />
                                    <input ref="email" placeholder="请输入接收卡密的QQ邮箱" />
                                </div>
                                <div>办卡类型:</div>
                            </div>
                            {/* {clickButton == '立即登录' && <div className='password'>
                                <div>卡&nbsp;&nbsp;&nbsp;&nbsp;密:</div><input defaultValue={password} ref='input' onFocus={() => this.handleFocus()} />
                            </div>} */}
                            <div className='card-type_register'>
                                <div onClick={() => { this.handleClick('day') }}>
                                    <img src={require(`../../assets/img/${dayimgType}.png`)} />
                                    <span>天卡</span>
                                </div>
                                <div onClick={() => { this.handleClick('week') }}>
                                    <img src={require(`../../assets/img/${weekimgType}.png`)} />
                                    <span>周卡</span>
                                </div>
                                <div onClick={() => { this.handleClick('month') }}>
                                    <img src={require(`../../assets/img/${monthimgType}.png`)} />
                                    <span>月卡</span>

                                </div>
                                <div>请输入数量:<input ref="number" placeholder="" /> </div>
                            </div>
                            <div onClick={() => this.onSubmit(clickButton)} className="login-button__register">
                                {clickButton}
                            </div>
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
    state => ({ ...state.User, ...state.Admin }),
    { registerCard, adminPayfor }
)(RegisterCard)
