import { combineReducers } from 'redux'

import { GET_QR, GET_HEADER, GET_WXID, GET_NICK_NAME, GET_LOGIN, REGISTER, ERROR_MSG, AUTH_SUCCESS, GET_UUID, GET_DATA62, GET_TOKEN } from './action-types'
const initQr = {
    loading: true,
    qr: "",
    uuid: '',
    wxid: '',
    header: '',
    nickname: '',
    token: '',
    loginSuccess: false
}
const inintUser = {
    wxid: '',
    cardWordExpire: ''
}

function Qr(state = initQr, action) {
    switch (action.type) {
        case GET_QR:
            return { ...state, loading: false, ...action.data }
        case GET_HEADER:
            return { ...state, ...action.data }
        case GET_NICK_NAME:
            return { ...state, ...action.data }
        case GET_UUID:
            return { ...state, ...action.data }
        case GET_TOKEN:
            return { ...state, ...action.data }
        case GET_DATA62:
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
            return { ...state, msg:action.data }
        default:
            return state
    }
}

export default combineReducers({
    Qr,
    User
})