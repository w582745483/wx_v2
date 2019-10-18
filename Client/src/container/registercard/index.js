import React, { Component } from 'react'
import { connect } from 'react-redux'
import { registerCard } from '../../redux/actions'
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
            clickButton: '注册卡密'

        }
    }

    onSubmit(text) {
        if (text == "注册卡密") {
            if (!this.state.cardType) {
                this.refs.toast.setVal2("卡密类型不能为空!")
                return
            }
            if (!/^[0-9]*$/.test(this.refs.number.value)) {
                this.refs.toast.setVal2("输入的数量必须是数字!")
                return
            }
            const userCard = { cardType: this.state.cardType }
            this.setState({
                loading: true
            })
            var arr=[]
            for (let i = 0; i < this.refs.number.value; i++) {
                arr.push(this.props.registerCard(userCard, (result) => {
                    if (result == 0) {
                        this.setState({
                            loading: false,
                            clickButton: '立即登录'
                        })
                        this.refs.toast.setVal2("注册成功")
                        // setTimeout(() => {
                        //     this.props.history.push('/')
                        // }, 1000)
                    }
                    else {
                        this.refs.toast.setVal2("注册失败,请重试!")
                    }

                }))
               
            }
            Promise.all[arr].then(()=>{
                console.log('请求完毕')
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
                    cardType: 'day'
                })
                break;
            case 'week':
                this.setState({
                    dayimgType: 'no-choose',
                    weekimgType: 'choose',
                    monthimgType: 'no-choose',
                    cardType: 'week'
                })
                break;
            case 'month':
                this.setState({
                    dayimgType: 'no-choose',
                    weekimgType: 'no-choose',
                    monthimgType: 'choose',
                    cardType: 'month'
                })
                break;
        }
    }

    handleFocus() {
        this.refs.input.select()
    }
    componentWillReceiveProps(nextProps) {

    }
    render() {
        const { dayimgType, weekimgType, monthimgType, loading, clickButton } = this.state
        const { password } = this.props

        return (
            <React.Fragment>
                <style dangerouslySetInnerHTML={{ __html: Style }} />
                <div className="app-container">
                    <div className="containee">
                        <div className="bottom_register">
                            <div className="login-content_register">
                                {/* <img src={require("../../assets/img/wxaccount.png")} />
                                <input ref="password" placeholder="请输入微信账号" /> */}
                                办卡类型:
                            </div>
                            {clickButton == '立即登录' && <div className='password'>
                                <div>卡&nbsp;&nbsp;&nbsp;&nbsp;密:</div><input defaultValue={password} ref='input' onFocus={() => this.handleFocus()} />
                            </div>}
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
    state => state.User,
    { registerCard }
)(RegisterCard)
