import { GET_QR, GET_HEADER, GET_NICK_NAME, GET_WXID, GET_LOGIN, REGISTER, ERROR_MSG, AUTH_SUCCESS, GET_TOKEN, GET_UUID, GET_DATA62, UPDATE_WXDBID } from './action-types'
import { ws, heartCheck } from '../components/socket'



const getQr = ({ qr, uuid }) => ({ type: GET_QR, data: { qr, uuid } })
const getWxID = (wxid) => ({ type: GET_WXID, data: { wxid } })
const getHeader = (header) => ({ type: GET_HEADER, data: { header } })
const getNickname = (nickname) => ({ type: GET_NICK_NAME, data: { nickname } })
const getToken = (token) => ({ type: GET_TOKEN, data: { token } })
const getUUID = (UUID) => ({ type: GET_UUID, data: { UUID } })
const getData62 = (data62) => ({ type: GET_DATA62, data: { data62 } })
const getloginSuccess = (loginSuccess) => ({ type: GET_LOGIN, data: { loginSuccess } })
const getregister = user => ({ type: REGISTER, data: user })
const errorMsg = msg => ({ type: ERROR_MSG, data: msg })
const authSuccess = user => ({ type: AUTH_SUCCESS, data: user })
const updateusercard = wxdbid => ({ type: UPDATE_WXDBID, data: wxdbid })



export const WxLogin = (uuid) => {

    return dispatch => {
        const wsInstace = ws(uuid)
        wsInstace.onmessage = (evt) => {
            heartCheck.reset(wsInstace);
            var msg = JSON.parse(evt.data);
            switch (msg.action) {
                case 'log':
                    const loginSuccess = msg.context
                    if (loginSuccess == '登录成功') {
                        dispatch(getloginSuccess({ loginSuccess: true }))
                    }
                    if (loginSuccess == '正在登录中') {
                        dispatch(getloginSuccess({ loginSuccess: '正在登录中' }))
                    }
                    break;
                case 'qrcode'://返回二维码
                    const qr = msg.context
                    dispatch(getQr({ qr, uuid }))
                    break;
                // case 'wxid':
                //     const wxid = msg.wxid//wxid
                //     dispatch(getWxID(wxid))
                //     break;
                case 'headimgurl':
                    const header = msg.context//头像
                    dispatch(getHeader(header))
                    break;
                // case 'nickname':
                //     const nickname = msg.nickname//昵称
                //     dispatch(getNickname(nickname))
                //     break;
                case 'token':
                    const token = msg.token

                    const wxid = msg.wxid//wxid
                    dispatch(getToken(token))//token

                    dispatch(getWxID(wxid))

                    break;
                case 'UUID':
                    const UUID = msg.UUID
                    dispatch(getUUID(UUID))//UUID
                    break;
                case 'data62':
                    const data62 = msg.data62
                    const nickname = msg.nickname//昵称
                    dispatch(getNickname(nickname))
                    dispatch(getData62(data62))//data62
                    break;
                case "getcontact"://获取联系人信息。会多次传输
                    break;
                case "getgroup"://获取群组信息。会多次传输
                    break;
                case "getgzh"://获取公众号信息。会多次传输
                    break;
                case "msgcallback"://微信消息回调事件
                    break;
            }
        };
    }
}
export const registerCard = ({ cardType }, callback) => {
    return dispatch => {
        fetch('http://118.123.11.246:11425/users/registerCard', {
            method: 'POST',
            credentials: 'include',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Accept': ' application/json'
            },
            body: JSON.stringify({ cardType })
        }).then(data => data.json())
            .then(data => {
                if (data.code == 0) {
                    dispatch(getregister(data.data))
                    return callback && callback(data.code)
                } else {
                    dispatch(errorMsg(data.msg))
                    return callback && callback(data.code)
                }
            })
    }
}
export const updateUserCard = ({ wxid, password }, callback) => {
    return dispatch => {
        fetch('http://118.123.11.246:11425/users/updateUserCard', {
            method: 'POST',
            credentials: 'include',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Accept': ' application/json'
            },
            body: JSON.stringify({ wxid, password })
        }).then(data => data.json())
            .then(data => {
                dispatch(updateusercard(data.data))
                return callback && callback(data.code)
            })
    }
}

export const login = (password, callback) => {
    return dispatch => {
        fetch('http://118.123.11.246:11425/users/login', {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': ' application/json',
                'Token':localStorage.getItem('password')
            },
            body: JSON.stringify({ password })
        }).then(data => data.json())
            .then(data => {
                if (data.code == 0) {
                    dispatch(authSuccess(data.data))
                    localStorage.setItem('password',data.data.password)
                    return callback && callback(data.code)
                } else {
                    dispatch(errorMsg(data.msg))
                    return callback && callback(data.code)
                }
            })
    }
}
export const Sendline = () => {
    return dispatch => {

    }
}