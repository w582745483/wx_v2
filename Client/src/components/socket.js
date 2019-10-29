export const ws = (uuid,type) => {
    var host = "47.103.222.169:6387";
    //判断当前浏览器是否支持WebSocket
    if ('WebSocket' in window) {
        var ws = new WebSocket("ws://" + host + "/?action=scan&uuid=" + uuid + "&devicename=mars-ipad&isreset=true&proxyip=" + "116.255.218.115:21081" +"&username=123qwe"+"&cleartype="+type+"&password=123www"+ "&posturl="  + "");
        ws.onopen = function () {
            console.log("onopen");
            heartCheck.start(ws);
        };
        ws.onerror = function (evt) {
            console.log("onerror",evt);
            ws.onopen();
        };
        ws.onclose = function () {
            // 断线重连
            console.log("onclose");
            ws.onopen();
        };
        return ws
    }
    else {
        alert('当前浏览器 Not support websocket')
    }

}

export const heartCheck = {
    timeout: 60000, //60ms
    timeoutObj: null,
    serverTimeoutObj: null,
    reset: function (ws) {
        clearTimeout(this.timeoutObj);
        clearTimeout(this.serverTimeoutObj);
        this.start(ws);
    },
    start: function (ws) {
        var self = this;
        this.timeoutObj = setTimeout(function () {
            try {
                ws.send("HeartBeat");
            } catch (e) {
                console.log("catch",e)
                ws.onopen();
            }
        }, this.timeout)
    },
}
//生成uuid
export const uuid=() =>{
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}