import React, { Component } from 'react';
import { Modal, Avatar, List } from 'antd'
import PubSub from 'pubsub-js'
import { connect } from 'react-redux'

import Logo from '../component/logo'
import '../assets/css/main.css'
import { WxLogin } from '../redux/actions'

const data = [
    {
        title: '九宫格',
        img: require('../assets/img/ninevideo.png'),
        url: '/ninevideo'
    },
    {
        title: '长视频',
        img: require('../assets/img/bigvideo.png'),
        url: '/bigvideo'
    },
    {
        title: '发送本地视频',
        img: require('../assets/img/localvideo.png'),
        url: '/upload'
    },
    
];
class Menu extends Component {
    state = {
        isShow: false
    }
    handleClick = (url) => {
        // if (this.state.wxid.length < 1) {
        //     this.warning('用户未登录，请登录用户！')
        //     return
        // }
        this.props.history.push(url)
    }
    warning = (text) => {
        Modal.warning({
            content: text,
        });
    }
    componentWillReceiveProps(props) {
        //用户登录成功关闭二维码扫描界面
        console.log(props)
        if (props.loginSuccess) {
            this.setState({
                isShow: false
            })
        }
    }
    render() {
        const { header, nickname } = this.props
        return (
            <div>
                <img src={require('../assets/img/ng-scope.jpg')} alt='logo' className='logo-img' />
                <div className='login_box'>
                    <div style={{ background: '#666', width: '100%', height: '20%' }}>
                        <Avatar src={header} style={{ backgroundColor: '#87d068', marginTop: '25px', marginLeft: '20px' }} size="large" icon="user" />
                        <span style={{ color: 'white', paddingLeft: '10px' }}>{nickname ? nickname : '未登录'}</span>
                        <div onClick={() => { this.setState({ isShow: true }) }} style={{ marginTop: '-49px', marginLeft: '280px', textAlign: 'center' }}>
                            <img style={{ width: '30px' }} src={require('../assets/img/login.png')} ></img>
                            <span style={{ display: 'block', lineHeight: '1.15', fontSize: '1rem', color: 'white' }}>扫码登陆</span>
                        </div>
                    </div>
                    <div style={{ background: '#ddd', height: '80%' }}>
                        <List
                            split={false}
                            grid={{ gutter: 16, column: 3 }}
                            dataSource={data}
                            renderItem={item => (
                                <List.Item>
                                    <div >
                                        <img onClick={() => this.handleClick(item.url)} style={{ width: '50px', marginLeft: '25px', marginTop: '20px' }} src={item.img}></img>
                                        <div style={{ textAlign: 'center' }}>
                                            <span style={{ lineHeight: '1.15', fontSize: '1rem', marginLeft: '-10px' }}>{item.title}</span>
                                        </div>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </div>
                    {this.state.isShow ? <Logo /> : null}
                </div>

            </div>
        )
    }
}
export default connect(
    state => state.Qr,
    { WxLogin }
)(Menu)