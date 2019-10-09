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

        }
    }

    onSubmit() {
        const userCard = { wxid: this.refs.password.value, cardType: this.state.cardType }
        this.setState({
            loading: true
        })
        this.props.registerCard(userCard, (result) => {
            if (result == 0) {
                this.setState({
                    loading: false
                })
                this.refs.toast.setVal2("注册成功")
                setTimeout(() => {
                    this.props.history.push('/')
                }, 1000)
            }
            else{
                this.refs.toast.setVal2("注册失败!")
            }

        })


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
    componentWillReceiveProps(nextProps) {

    }
    render() {
        const { dayimgType, weekimgType, monthimgType, loading } = this.state

        return (
            <React.Fragment>
                <style dangerouslySetInnerHTML={{ __html: Style }} />
                <div className="app-container">
                    <div className="containee">
                        <div className="bottom">
                            <div className="login-content">
                                <img src={require("../../assets/img/wxaccount.png")} />
                                <input ref="password" placeholder="请输入微信账号" />
                            </div>
                            <div className='card-type'>
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
                            </div>
                            <div onClick={() => this.onSubmit()} className="login-button">
                                注册卡密
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
