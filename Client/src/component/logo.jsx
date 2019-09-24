import React, { Component } from 'react';
import PubSub from 'pubsub-js'
import { uuid } from './socket'
import { connect } from 'react-redux'

import '../assets/css/main.css'
import { WxLogin } from '../redux/actions'

class Logo extends Component {
    state = {
        qr: '',
        timeout: '使用手机微信扫码登录',
        opacity: '1',
        isshow: false,
    }

    handleClick2 = () => {
        var content = {
            text: "朋友圈测试！！！",
            uuid: this.props.uuid
        }
        fetch("http://47.93.189.47:22221/api/sns/sendtext", {
            headers: {
                'Content-Type': 'application/json',
                'Accept': ' application/json'
            },
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(content)
        })
            .then(res => res.json())
            .then(data => {
                console.log('sendtext', data)
            })
    }

    handleRefresh = () => {
        let current = 0;

        this.timer1 = setInterval(() => {
            current = (current + 30) % 360;
            this.setState({
                transform: 'rotate(' + current + 'deg)'
            })
        }, 10)


        this.setState({
            timeout: '',
            opacity: '1',
            isshow: false
        })
        this.timeInit = setTimeout(() => {
            this.setState({
                timeout: '二维码失效，点击刷新',
                opacity: '0.4',
                isshow: true
            })
        }, 5000)

    }
    componentWillMount() {
        //开启websicket
        this.props.WxLogin(uuid())

        this.timeInit = setTimeout(() => {
            this.setState({
                timeout: '二维码失效，点击刷新',
                opacity: '0.4',
                isshow: true
            })
        }, 200000)
    }
    componentWillReceiveProps(props){
        console.log(props)
        if(props.header){
            this.setState({
                timeout: '请在手机中点击登录'
            })
        }
    }
    render() {
        const {header} = this.props
        return (
            <div style={{ marginTop: '-370px' }}>
                <img className="imgqr"  style={{ opacity: this.state.opacity }} alt="" src={header?header:"data:image/jpg;base64," + this.props.qr}></img>
                <div style={{ marginTop: '-213px', paddingBottom: '70px', }}>
                    {this.state.isshow ? <img className="refresh" style={{ transform: this.state.transform }} onClick={this.handleRefresh} src={require('../assets/img/refresh.png')}></img> : null}
                </div>
                <div className='sub_title'>
                    <p >{this.state.timeout}</p>
                    {/* <button onClick={this.handleClick2}>发朋友圈</button> */}
                </div>

            </div>
        )
    }
}
export default connect(
    state => state.Qr,
    { WxLogin }
)(Logo)
