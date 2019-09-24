import { combineReducers } from 'redux'

import { GET_QR, GET_HEADER, GET_WXID, GET_NICK_NAME, GET_LOGIN, REGISTER, ERROR_MSG, AUTH_SUCCESS } from './action-types'
const initQr = {
    qr: "",
    uuid: '',
    wxid: '',
    header: '',
    nickname: '',
    loginSuccess: false
}
const inintUser = {
    username: '',
    password: '',
    email: '',
    phone: '',
}

function Qr(state = initQr, action) {
    switch (action.type) {
        case GET_QR:
            return { ...state, ...action.data }
        case GET_HEADER:
            return { ...state, ...action.data }
        case GET_NICK_NAME:
            return { ...state, ...action.data }
        case GET_WXID:
            return { ...state, ...action.data }
        case GET_LOGIN:
            return { ...state, ...action.data }
        default:
            return state
    }
}

function User(state = inintUser, action) {
    switch (action.type) {
        case REGISTER:
            return { ...state, ...action.data }
        case ERROR_MSG:
            return { ...state, msg: action.data }
        case AUTH_SUCCESS:
            const redirectTo = '/menu'
            return {redirectTo,...action.data}
        default:
            return state
    }
}

export default combineReducers({
    Qr,
    User
})