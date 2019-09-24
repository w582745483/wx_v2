import React from 'react'
import { List, message, Input, Button, Modal } from 'antd'
import Background from '../container/background'
import PubSub from 'pubsub-js'
import { connect } from 'react-redux'


const Meta = List.Item.Meta
class NineVideo extends React.Component {
    state = {
        value1: '',
        value2: '',
        value3: '',
        value4: '',
        value5: '',
        value6: '',
        value7: '',
        value8: '',
        value9: '',
        time_line_content: '',
        visible: false,
        videodata: [],
        empty: ''
    }

    warning = (text) => {
        Modal.warning({
            content: text,
            onOk() { window.location.assign('/menu') }
        });
    }
    showModal = () => {
        this.setState({
            visible: true,
            videodata:[]
        });
        this.AsyncPromise().then(() => {
            console.log('videodata', this.state.videodata)
        })
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }
    handleChange = (key, val) => {
        this.setState({
            [key]: {
                data: val
            }
        })
    }
    handleChangeText = (key, val) => {
        this.setState({
            time_line_content: val
        })
    }
    handleClick = () => {
        message.destroy()
        message.loading('正在发送朋友圈，请等候...', 0)
        let postData = {}
        for (const key in this.state) {
            if (key.includes('value')) {
                Object.assign(postData, this.state[key].postdata)
            }
        }
         Object.assign(postData, { uuid: this.props.uuid })
         console.log('postData', postData)
        fetch('http://47.93.189.47:22221/api/sns/sendninebigvideo', {
            method: 'POST',
            //credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': ' application/json'
            },
            mode: 'cors',
            body: JSON.stringify(postData)
        }).then(res => {
            message.destroy()
            message.success('发送成功！', 1)
            this.setState({
                visible: false,
            });
            console.log(res.text())
            for (const key in this.state) {
                if (key.indexOf('value') != -1) {
                    this.setState({
                        [key]: ''
                    })
                }
            }
            this.setState({
                time_line_content: '',
                videodata: []
            })
            this.setState({
                visible: false,
            });
        })
    }

    AsyncPromise = () => {
        return new Promise(resolve => {
            let promiseArry = []
            for (const key in this.state) {
                if (key.includes('value')) {
                    promiseArry.push(this.ParseVideoAddress(key, this.state[key].data))
                }
            }
            Promise.all(promiseArry).then(val => {
                resolve()
            })
        })

        // return new Promise((resolve, reject) => {
        //     this.intelval = setInterval(() => {
        //         let postData = {}
        //         for (const key in this.state) {
        //             if (key.includes('value')) {
        //                 Object.assign(postData, this.state[key].postdata)
        //             }
        //         }
        //         var arr = Object.keys(postData);
        //         console.log(arr.length)
        //         if (this.state.time_line_content == "" && arr.length == 18 || this.state.time_line_content != "" && arr.length == 19) {
        //             clearInterval(this.intelval)
        //             resolve(postData)
        //         }
        //     }, 1500)
        // })
    }

    ParseVideoAddress = (key, val) => {
        return new Promise(resolve => {
            fetch(`https://api.w0ai1uo.org/api/kuaishou.php?url=${val}`, {
            }).then(res => res.json())
                .then(data => {
                    if (data.code == 200) {
                        //console.log(this.state)
                        this.setState({
                            [key]:
                            {
                                data: this.state[key].data,
                                postdata: {
                                    ["video_pic_address_" + key.substr(key.length - 1, 1)]: data.cover,
                                    ["video_address_" + key.substr(key.length - 1, 1)]: data.playAddr,
                                }


                            }
                        })

                        this.setState({
                            videodata: this.state.videodata.concat(data)
                        })
                        resolve()
                    }
                })

        })
    }
    componentDidMount() {
        this.pubsub_token2 = PubSub.subscribe('logout', (topic, data) => {
            this.warning('检测到用户登出,请重新登录!')
        })
    }
    componentWillUnmount() {
        PubSub.unsubscribe(this.pubsub_token2)
    }
    render() {
        const data = [
            { title: '快手视频1', key: 'value1' }, { title: '快手视频2', key: 'value2' },
            { title: '快手视频3', key: 'value3' }, { title: '快手视频4', key: 'value4' },
            { title: '快手视频5', key: 'value5' }, { title: '快手视频6', key: 'value6' },
            { title: '快手视频7', key: 'value7' }, { title: '快手视频8', key: 'value8' },
            { title: '快手视频9', key: 'value9' },
        ]
        return (
            <div>
                <Background />
                <div className='login_box'>
                    <div style={{ marginTop: '25px', marginLeft: '5px' }}>
                        <List
                            grid={{ gutter: 20, column: 1 }}
                            dataSource={data}
                            renderItem={item => (

                                <List.Item>
                                    <Meta title={item.title}></Meta>
                                    <div style={{ position: 'absolute', marginLeft: '-90px', marginTop: '-16px', width: '69%' }}>
                                        <Input placeholder="请输入视频链接" value={this.state[item.key].data} onChange={e => this.handleChange(item.key, e.target.value)} />
                                    </div>
                                </List.Item>
                            )}
                        />

                        <div style={{ textAlign: 'center', marginTop: '30px' }}>
                            <Button type='primary' onClick={this.showModal} size='large' style={{ marginTop: '10px', border: 'none' }}>查看视频</Button>
                        </div>
                        <div>
                            <Modal
                                cancelText='取消'
                                okText='发表'
                                title="视频预览"
                                visible={this.state.visible}
                                onOk={this.handleClick}
                                onCancel={this.handleCancel}
                                centered={true}
                                closable={false}

                            >
                                <Input.TextArea rows={3} style={{ width: '100%', marginBottom: '20px' }} value={this.state.time_line_content} placeholder="请输入心情！" onChange={e => this.handleChangeText('time_line_content', e.target.value)} />
                                <List
                                    okText='发表'
                                    split={false}
                                    grid={{ gutter: 16, column: 2 }}
                                    dataSource={this.state.videodata}
                                    renderItem={item => (
                                        <List.Item>
                                            <div>
                                                <div >
                                                    <video style={{ width: '100%', height: '200px' }} x5-video-player-fullscreen="true" x5-video-player-fullscreen="portraint" controls preload="true" controlsList="nodownload nofullscreen" poster={item.cover} src={item.playAddr}>
                                                    </video>
                                                </div>
                                            </div>
                                        </List.Item>
                                    )}
                                />
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default connect(
    state => state.Qr
)(NineVideo)