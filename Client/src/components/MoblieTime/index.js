import projectConfig from '../../project.config';
import DomUtil from  '../../utils/dom'
/*new moTimeCJJ({
    domId : "birthday",
    minTime : mixTime,
    maxTime : maxTime,
    value:val,
    type : "YMD" ,
    domSetTime:(time)=>{
        const {addCommonlyTravel} = self.state;
        const {message} = addCommonlyTravel;
        message.other.birthday = time;
        addCommonlyTravel.message = message;
        self.setState({
            addCommonlyTravel: addCommonlyTravel
        })
    }
})*/
(function () {
    if(typeof window !== "undefined") {
        let moTimeCJJ = function (array) {
            let _this = this;
            _this.array = array;
            _this.valueSure = _this.array.value ;
            _this.array.value = (_this.array.value || _this.nowDate()).replace(/(^\s*)|(\s*$)/g, "");
            _this.typeList = ["YMDHMS", "YMD", "HMS"];
            _this.typeListIndex = _this.typeList.indexOf(_this.array.type) == -1 ? 0 : _this.typeList.indexOf(_this.array.type);
            _this.array.minTime = _this.array.minTime || "1900-01-01 00:00:00";
            _this.array.maxTime = _this.array.maxTime || "2100-12-31 23:59:59";
            _this.time = {
                year: "",
                mon: "",
                date: "",
                hour: "",
                min: "",
                sec: "",
            }
            _this.array.domSetTime = _this.array.domSetTime || function () {
                console.log("暂无回调")
            }
            _this.showYes = true;
            _this.Liheight = 1.6;
            _this.init();
        }
        moTimeCJJ.prototype = {
            init: function () {
                const _this = this;
                if (_this.array.domId === undefined) {
                    return false;
                }
                _this.minTimeId = _this.array.minTime;
                _this.maxTimeId = _this.array.maxTime;
                _this.getValueInit();
                if( _this.valueSure){
                    _this.setValue();
                }

                document.getElementById(_this.array.domId).addEventListener('touchend', function () {
                    if (_this.showYes) {
                        _this.getValueminTime();
                        _this.dataShow();
                    }

                },false);
            },
            getValueminTime: function () {
                let _this = this;
                _this.array.minTime = _this.array.minTime || "";
                if (_this.minTimeId.indexOf("-") == -1 || _this.minTimeId.indexOf(":") == -1) {
                    try {
                        _this.array.minTime = document.getElementById(_this.minTimeId).innerHTML;
                    } catch(e){
                        _this.array.minTime = "1900-01-01 00:00:00";
                    }
                }
                _this.array.maxTime = _this.array.maxTime || "";
                if (_this.maxTimeId.indexOf("-") == -1 || _this.maxTimeId.indexOf(":") == -1) {
                    try {
                        _this.array.maxTime = document.getElementById(_this.maxTimeId).innerHTML;
                    } catch(e){
                        _this.array.maxTime = "2100-12-31 23:59:59";
                    }
                }
            },
            nowDate:function(){
                let date = new Date();
                return this.tenMean(date.getFullYear()) + "-" + this.tenMean(date.getMonth() + 1) + "-" + this.tenMean(date.getDate()) + " " +
                    this.tenMean(date.getHours()) + ":" + this.tenMean(date.getMinutes()) + ":" + this.tenMean(date.getSeconds());
            },
            getValueInit: function () {
                let _this = this;
                let date = new Date();
                try {
                    let ymdList = _this.typeListIndex == 0 || _this.typeListIndex == 1 ? _this.array.value.split(" ")[0].split("-") : "";
                    let hms = _this.typeListIndex == 0 ? _this.array.value.split(" ")[1].split(":") : _this.typeListIndex == 2 ? _this.array.value.split(":") : "";
                    _this.time = {
                        year: _this.typeListIndex == 0 || _this.typeListIndex == 1 ? ymdList[0] * 1 : "",
                        mon: _this.typeListIndex == 0 || _this.typeListIndex == 1 ? ymdList[1] * 1 : "",
                        date: _this.typeListIndex == 0 || _this.typeListIndex == 1 ? ymdList[2] * 1 : "",
                        hour: _this.typeListIndex == 0 || _this.typeListIndex == 2 ? hms[0] * 1 : "",
                        min: _this.typeListIndex == 0 || _this.typeListIndex == 2 ? hms[1] * 1 : "",
                        sec: _this.typeListIndex == 0 || _this.typeListIndex == 2 ? hms[2] * 1 : "",
                    }
                } catch (e) {
                    _this.time = {
                        year: date.getFullYear(),
                        mon: date.getMonth() + 1,
                        date: date.getDate(),
                        hour: date.getHours(),
                        min: date.getMinutes(),
                        sec: date.getSeconds(),
                    }
                }
                if (new Date(_this.array.minTime.replace(/-/g, '/')).getTime() > new Date(_this.time.year + "/" + _this.time.mon + "/" + _this.time.date + " " + _this.time.hour + ":" + _this.time.min + ":" + _this.time.sec).getTime()) {
                    console.log("默认时间不能小于最小时间");
                    _this.showYes = false;
                }
                if (new Date(_this.array.maxTime.replace(/-/g, '/')).getTime() < new Date(_this.time.year + "/" + _this.time.mon + "/" + _this.time.date + " " + _this.time.hour + ":" + _this.time.min + ":" + _this.time.sec).getTime()) {
                    console.log("默认时间不能大于最大时间");
                    _this.showYes = false;
                }
                if (new Date(_this.array.maxTime.replace(/-/g, '/')).getTime() < new Date(_this.array.minTime.replace(/-/g, '/')).getTime()) {
                    console.log("最小时间不能大于最大时间");
                    _this.showYes = false;
                }
            },
            dataShow: function () {
                let _this = this;
                _this.random = Math.random();
                let screenTimeBox = document.createElement("div");
                let str = '<div id="screenTimeBody' + _this.random + '" class="screenTimeBody">' +
                    '<div class="timeScrollBoutton"><div class="sure">确定</div>请选择出生日期' +
                    '<img src="' + projectConfig.urlPrefix + '/static/images/components/closed2.png" class="closed"/><div class="clearBoth"></div></div>' +
                    '<p class="screenTimeBodyP">' + _this.getTimeValue() + '</p>' +
                    '<div class="timeMean"></div>' +
                    '<div id="timeScroll' + _this.random + '" style="height:' + _this.Liheight * 5 *0.375+ 'rem" class="timeScroll"></div>' +
                    '</div>';

                screenTimeBox.id = "screenTimeBox" + _this.random;
                screenTimeBox.style.opacity = 0;
                screenTimeBox.innerHTML = str;
                let body = document.getElementsByTagName("body")[0];
                body.appendChild(screenTimeBox);
                _this.addClass(screenTimeBox, "component_screenTimeBox");
                screenTimeBox.getElementsByClassName("sure")[0].addEventListener('touchend', function () {
                    _this.setValue();
                    let _time = _this.time;
                    if (_this.typeListIndex == 0) {
                        _this.array.value = _time.year + "-" + _time.mon + "-" + _time.date + " " + _time.hour + ":" + _time.min + ":" + _time.sec;
                    } else if (_this.typeListIndex == 1) {
                        _this.array.value = _time.year + "-" + _time.mon + "-" + _time.date;
                    } else if (_this.typeListIndex == 2) {
                        _this.array.value = _time.hour + ":" + _time.min + ":" + _time.sec;
                    }
                    _this.removeDom();
                },false)
                screenTimeBox.getElementsByClassName("closed")[0].addEventListener('touchend', function () {
                    _this.removeDom();
                }, false);
                _this.opciaty();
                _this.getTypeUl(screenTimeBox);
            },
            removeDom: function () {
                let _this = this;
                DomUtil.documentOnTouch(true);
                let body = document.getElementsByTagName("body")[0];
                let screenAddressBox = document.getElementById("screenTimeBox" + _this.random);
                let opciaty = screenAddressBox.style.opacity;
                let time = setInterval(function () {
                    if (opciaty > 0) {
                        opciaty = opciaty * 1 - 0.01;
                        screenAddressBox.style.opacity = opciaty;
                    } else {
                        clearInterval(time);
                        body.removeChild(screenAddressBox);
                    }
                }, 2)
            },
            getTypeUl: function (_dom) {
                let _this = this;
                let dom = _dom.getElementsByClassName("timeScroll")[0];
                let dom2 = _dom.getElementsByClassName("timeMean")[0];
                _this.getDay();
                let str = "";
                let str2 = "";
                if (_this.typeListIndex == 0) {
                    str2 = "<h6>年</h6><h6>月</h6><h6>日</h6><h6>时</h6><h6>分</h6><h6>秒</h6>";
                } else if (_this.typeListIndex == 1) {
                    str2 = "<h6>年</h6><h6>月</h6><h6>日</h6>";
                } else if (_this.typeListIndex == 2) {
                    str2 = "<h6>时</h6><h6>分</h6><h6>秒</h6>";
                }
                for (let i = 0; i < _this.typeList[_this.typeListIndex].length; i++) {
                    let liBox = "";
                    if (_this.typeListIndex == 0) {
                        for (let x = 0; x < _this.TimeList[i].length; x++) {
                            liBox += "<li style='line-height: " + _this.Liheight * 0.375 + "rem;height: " + _this.Liheight * 0.375 + "rem;'>" + _this.tenMean(_this.TimeList[i][x]) + "</li>";
                        }
                    } else if (_this.typeListIndex == 1) {
                        for (let x = 0; x < _this.TimeList[i].length; x++) {
                            liBox += "<li style='line-height: " + _this.Liheight * 0.375 + "rem;height: " + _this.Liheight * 0.375 + "rem;'>" + _this.tenMean(_this.TimeList[i][x]) + "</li>";
                        }

                    } else if (_this.typeListIndex == 2) {
                        for (let x = 0; x < _this.TimeList[i + 3].length; x++) {
                            liBox += "<li style='line-height: " + _this.Liheight * 0.375 + "rem;height: " + _this.Liheight * 0.375 + "rem;'>" + _this.tenMean(_this.TimeList[i + 3][x]) + "</li>";
                        }

                    }
                    str += "<div class='ulBox' style='height: " + _this.Liheight * 5  * 0.375+ "rem;width:" + (9.8  * 0.375)/ (_this.typeList[_this.typeListIndex].length) + "rem'><ul i='" + i + "'>" + liBox + "</ul><div class='dwwo'></div></div>";
                }
                dom.innerHTML = str + "<div class='lookTimeLine' style='height:" + _this.Liheight  * 0.375 + "rem;margin-top: -" + (_this.Liheight * 0.375) / 2 + "rem;'></div><div class='clearBoth'></div>";
                dom2.innerHTML = str2 + "<div class='clearBoth'></div>";
                for (let i = 0; i < dom2.getElementsByTagName("h6").length; i++) {
                    dom2.getElementsByTagName("h6")[i].style.width = (9.8  * 0.375)/ (_this.typeList[_this.typeListIndex].length) + "rem";
                }
                _this.scrollLi();
                for (let i = 0; i < dom.getElementsByClassName("ulBox").length; i++) {

                    let dom3 = dom.getElementsByClassName("ulBox")[i];
                    _this.tran(dom3);
                }
            },

            tran: function (_dom) {
                let _this = this;
                _this.startX  = 0,  _this.startY  = 0,  _this.endX = 0 ,  _this.endY = 0;
                let style;
                DomUtil.documentOnTouch(false);
                _dom.addEventListener("touchstart", function (event) {
                    const domTop = document.documentElement||  document.body;
                   domTop.scrollTop = 0;
                    let touch = event.targetTouches[0];
                    _this.startX = touch.pageX;
                    _this.startY = touch.pageY;
                    style = _dom.getElementsByTagName("ul")[0].style.transform.replace(/[^0-9\-\.,]/g, '').split(',');
                }, false);
                _dom.addEventListener("touchmove", function (event) {
                    const domTop = document.documentElement||  document.body;
                    domTop.scrollTop = 0;
                    let touch = event.targetTouches[0];
                    _this.endX = touch.pageX;
                    _this.endY = touch.pageY;
                    let height = (style[1] == undefined ? 0 : style[1] * 1) + ( _this.endY -  _this.startY);
                    _dom.getElementsByTagName("ul")[0].style.transform = " translate3d(0," + height + "px,0)";
                    _dom.getElementsByTagName("ul")[0].style.transition = "all " + 0.003 * Math.abs( _this.endY -  _this.startY) + "s ease-out";
                }, false);
                _dom.addEventListener("touchend", function (event) {
                    const domTop = document.documentElement||  document.body;
                    domTop.scrollTop = 0;
                    let height = (style[1] == undefined ? 0 : style[1] * 1) + ( _this.endY -  _this.startY) * 1.5;
                    _dom.getElementsByTagName("ul")[0].style.transform = " translate3d(0," + height + "px,0)";
                    style = _dom.getElementsByTagName("ul")[0].style.transform.replace(/[^0-9\-\.,]/g, '').split(',');
                    height = (style[1] == undefined ? 0 : style[1] * 1);
                    let px = height / _this.getHtmlSize() / _this.Liheight;
                    px = Math.round(px);
                    px = px >= 3 ? 2 : px;
                    px = px < 3 - _dom.getElementsByTagName("li").length ? 3 - _dom.getElementsByTagName("li").length : px;
                    _dom.getElementsByTagName("ul")[0].style.transform = " translate3d(0," + px * _this.getHtmlSize() * _this.Liheight + "px,0)";
                    _dom.getElementsByTagName("ul")[0].style.transition = "all " + 0.003 * Math.abs( _this.endY -  _this.startY) + "s ease-out";
                    let style2 = _dom.getElementsByTagName("ul")[0].style.transform.replace(/[^0-9\-\.,]/g, '').split(',');
                    let height2 = (style2[1] == undefined ? 0 : style2[1] * 1);
                    let number = Math.abs(Math.round(height2 / _this.getHtmlSize() / _this.Liheight) - 2); //计算停留在第几个
                    let i = _dom.getElementsByTagName("ul")[0].getAttribute("i");
                    let typeList = ["year", "mon", "date", "hour", "min", "sec"];
                    let men = "";
                    let index = 0;
                    if (_this.typeListIndex == 0) {
                        men = typeList[i];
                        index = i;
                        _this.time[typeList[i]] = _dom.getElementsByTagName("li")[number].innerHTML * 1;
                    } else if (_this.typeListIndex == 1) {
                        men = typeList[i];
                        index = i;
                        _this.time[typeList[i]] = _dom.getElementsByTagName("li")[number].innerHTML * 1;
                    } else if (_this.typeListIndex == 2) {
                        men = typeList[i * 1 + 3];
                        index = i * 1 + 3;
                        _this.time[typeList[i * 1 + 3]] = _dom.getElementsByTagName("li")[number].innerHTML * 1;
                    }
                    if (typeList.indexOf(men) == 0) {
                        _this.changeMon();
                    }
                    if (typeList.indexOf(men) == 0 || typeList.indexOf(men) == 1) {
                        _this.changeDay();
                    }
                    if (_this.typeListIndex == 0) {
                        if (typeList.indexOf(men) == 0 || typeList.indexOf(men) == 1 || typeList.indexOf(men) == 2) {
                            _this.changeHour();
                        }
                        if (typeList.indexOf(men) == 0 || typeList.indexOf(men) == 1 || typeList.indexOf(men) == 2 || typeList.indexOf(men) == 3) {
                            _this.changeMin();
                        }
                        if (typeList.indexOf(men) == 0 || typeList.indexOf(men) == 1 || typeList.indexOf(men) == 2 || typeList.indexOf(men) == 3 || typeList.indexOf(men) == 4) {
                            _this.changeSec();
                        }
                    }
                    if (_this.typeListIndex == 0 || _this.typeListIndex == 1) {
                        if (_this.time[typeList[0]] * 1 == _this.mintimeList[0] * 1) {
                            _this.selectMinMax(1, 0);
                            if (_this.time[typeList[1]] * 1 == _this.mintimeList[1] * 1) {
                                _this.selectMinMax(2, 0);
                                if (_this.typeListIndex == 0) {
                                    if (_this.time[typeList[2]] * 1 == _this.mintimeList[2] * 1) {
                                        _this.selectMinMax(3, 0);
                                        if (_this.time[typeList[3]] * 1 == _this.mintimeList[3] * 1) {
                                            _this.selectMinMax(4, 0);
                                            if (_this.time[typeList[4]] * 1 == _this.mintimeList[4] * 1) {
                                                _this.selectMinMax(5, 0);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (_this.time[typeList[0]] == _this.maxtimeList[0]) {
                            _this.selectMinMax2(1, 0);
                            if (_this.time[typeList[1]] == _this.maxtimeList[1]) {
                                _this.selectMinMax2(2, 0);
                                if (_this.typeListIndex == 0) {
                                    if (_this.time[typeList[2]] == _this.maxtimeList[2]) {
                                        _this.selectMinMax2(3, 0);
                                        if (_this.time[typeList[3]] == _this.maxtimeList[3]) {
                                            _this.selectMinMax2(4, 0);
                                            if (_this.time[typeList[4]] == _this.maxtimeList[4]) {
                                                _this.selectMinMax2(5, 0);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    setTimeout(function () {
                        document.getElementById("screenTimeBox" + _this.random).getElementsByClassName("screenTimeBodyP")[0].innerHTML = _this.getTimeValue();
                    }, 3 * Math.abs(_this.endY - _this.startY));

                }, false);
            },
            getHtmlSize: function () {
                let htmlSize = document.documentElement.offsetWidth || document.body.offsetWidth;
                return htmlSize/10;
            },
            changeDay: function () {
                let _this = this;
                let date = new Date(_this.time.year, _this.time.mon, 0);
                _this.dateList = [];
                for (let i = 0; i < date.getDate(); i++) {
                    _this.dateList.push(i + 1);
                }
                _this.TimeList[2] = _this.dateList;
                let liBox = "";
                for (let x = 0; x < _this.TimeList[2].length; x++) {
                    liBox += "<li style='line-height: " + _this.Liheight * 0.375 + "rem;height: " + _this.Liheight * 0.375 + "rem;'>" + _this.tenMean(_this.TimeList[2][x]) + "</li>";
                }
                let ulHtml = document.getElementById("screenTimeBox" + _this.random).getElementsByClassName("ulBox")[2].getElementsByTagName("ul")[0];
                ulHtml.innerHTML = liBox;
                let length = ulHtml.getElementsByTagName("li").length;
                let style = ulHtml.style.transform.replace(/[^0-9\-\.,]/g, '').split(',');
                let height = (style[1] == undefined ? 0 : style[1] * 1);
                let number = Math.abs(Math.round(height / _this.getHtmlSize() / _this.Liheight) - 2); //计算停留在第几个
                if (number >= length) {
                    _this.time.date = ulHtml.getElementsByTagName("li")[length - 1].innerHTML;
                    ulHtml.style.transform = " translate3d(0," + -(length - 3) * _this.getHtmlSize() * _this.Liheight + "px,0)";
                    ulHtml.style.transition = "all 0.2s ease-out";

                }
                _this.knowTime(ulHtml);
            },
            changeMon: function () {
                let _this = this;
                _this.monList = [];
                for (let i = 0; i < 12; i++) {
                    _this.monList.push(i + 1);
                }
                _this.TimeList[1] = _this.monList;
                let liBox = "";
                for (let x = 0; x < _this.TimeList[1].length; x++) {
                    liBox += "<li style='line-height: " + _this.Liheight * 0.375 + "rem;height: " + _this.Liheight * 0.375 + "rem;'>" + _this.tenMean(_this.TimeList[1][x]) + "</li>";
                }
                let ulHtml = document.getElementById("screenTimeBox" + _this.random).getElementsByClassName("ulBox")[1].getElementsByTagName("ul")[0];
                ulHtml.innerHTML = liBox;
                let length = ulHtml.getElementsByTagName("li").length;
                let style = ulHtml.style.transform.replace(/[^0-9\-\.,]/g, '').split(',');
                let height = (style[1] == undefined ? 0 : style[1] * 1);
                let number = Math.abs(Math.round(height / _this.getHtmlSize() / _this.Liheight) - 2); //计算停留在第几个
                if (number >= length) {
                    _this.time.mon = ulHtml.getElementsByTagName("li")[length - 1].innerHTML;
                    ulHtml.style.transform = " translate3d(0," + -(length - 3) * _this.getHtmlSize() * _this.Liheight + "px,0)";
                    ulHtml.style.transition = "all 0.2s ease-out";

                }
                _this.knowTime(ulHtml);
            },
            knowTime: function (ulHtml) {
                let _this = this;
                let style2 = ulHtml.style.transform.replace(/[^0-9\-\.,]/g, '').split(',');
                let height2 = (style2[1] == undefined ? 0 : style2[1] * 1);
                let number = Math.abs(Math.round(height2 / _this.getHtmlSize() / _this.Liheight) - 2); //计算停留在第几个
                let i = ulHtml.getAttribute("i");
                let typeList = ["year", "mon", "date", "hour", "min", "sec"];
                if (_this.typeListIndex == 0) {
                    _this.time[typeList[i]] = ulHtml.getElementsByTagName("li")[number].innerHTML * 1;
                } else if (_this.typeListIndex == 1) {
                    _this.time[typeList[i]] = ulHtml.getElementsByTagName("li")[number].innerHTML * 1;
                } else if (_this.typeListIndex == 2) {
                    _this.time[typeList[i * 1 + 3]] = ulHtml.getElementsByTagName("li")[number].innerHTML * 1;
                }
                setTimeout(function () {
                    document.getElementById("screenTimeBox" + _this.random).getElementsByClassName("screenTimeBodyP")[0].innerHTML = _this.getTimeValue();
                }, 3 * Math.abs(_this.endY - _this.startY));
            },
            changeHour: function () {
                let _this = this;
                _this.hourList = [];
                for (let i = 0; i < 24; i++) {
                    _this.hourList.push(i);
                }
                _this.TimeList[3] = _this.hourList;
                let liBox = "";
                for (let x = 0; x < _this.TimeList[3].length; x++) {
                    liBox += "<li style='line-height: " + _this.Liheight * 0.375 + "rem;height: " + _this.Liheight * 0.375 + "rem;'>" + _this.tenMean(_this.TimeList[3][x]) + "</li>";
                }
                let ulHtml = document.getElementById("screenTimeBox" + _this.random).getElementsByClassName("ulBox")[3].getElementsByTagName("ul")[0];
                ulHtml.innerHTML = liBox;
                let length = ulHtml.getElementsByTagName("li").length;
                let style = ulHtml.style.transform.replace(/[^0-9\-\.,]/g, '').split(',');
                let height = (style[1] == undefined ? 0 : style[1] * 1);
                let number = Math.abs(Math.round(height / _this.getHtmlSize() / _this.Liheight) - 2); //计算停留在第几个
                if (number >= length) {
                    _this.time.hour = ulHtml.getElementsByTagName("li")[length - 1].innerHTML;
                    ulHtml.style.transform = " translate3d(0," + -(length - 3) * _this.getHtmlSize() * _this.Liheight + "px,0)";
                    ulHtml.style.transition = "all 0.2s ease-out";

                }
                _this.knowTime(ulHtml);
            },
            changeMin: function () {
                let _this = this;
                _this.minList = [];
                for (let i = 0; i < 60; i++) {
                    _this.minList.push(i);
                }
                _this.TimeList[4] = _this.minList;
                let liBox = "";
                for (let x = 0; x < _this.TimeList[4].length; x++) {
                    liBox += "<li style='line-height: " + _this.Liheight * 0.375 + "rem;height: " + _this.Liheight * 0.375 + "rem;'>" + _this.tenMean(_this.TimeList[4][x]) + "</li>";
                }
                let ulHtml = document.getElementById("screenTimeBox" + _this.random).getElementsByClassName("ulBox")[4].getElementsByTagName("ul")[0];
                ulHtml.innerHTML = liBox;
                let length = ulHtml.getElementsByTagName("li").length;
                let style = ulHtml.style.transform.replace(/[^0-9\-\.,]/g, '').split(',');
                let height = (style[1] == undefined ? 0 : style[1] * 1);
                let number = Math.abs(Math.round(height / _this.getHtmlSize() / _this.Liheight) - 2); //计算停留在第几个
                if (number >= length) {
                    _this.time.min = ulHtml.getElementsByTagName("li")[length - 1].innerHTML;
                    ulHtml.style.transform = " translate3d(0," + -(length - 3) * _this.getHtmlSize() * _this.Liheight + "px,0)";
                    ulHtml.style.transition = "all 0.2s ease-out";

                }
                _this.knowTime(ulHtml);
            },
            changeSec: function () {
                let _this = this;
                _this.secList = [];
                for (let i = 0; i < 60; i++) {
                    _this.secList.push(i);
                }
                _this.TimeList[5] = _this.secList;
                let liBox = "";
                for (let x = 0; x < _this.TimeList[5].length; x++) {
                    liBox += "<li style='line-height: " + _this.Liheight * 0.375 + "rem;height: " + _this.Liheight * 0.375 + "rem;'>" + _this.tenMean(_this.TimeList[5][x]) + "</li>";
                }
                let ulHtml = document.getElementById("screenTimeBox" + _this.random).getElementsByClassName("ulBox")[5].getElementsByTagName("ul")[0];
                ulHtml.innerHTML = liBox;
                let length = ulHtml.getElementsByTagName("li").length;
                let style = ulHtml.style.transform.replace(/[^0-9\-\.,]/g, '').split(',');
                let height = (style[1] == undefined ? 0 : style[1] * 1);
                let number = Math.abs(Math.round(height / _this.getHtmlSize() / _this.Liheight) - 2); //计算停留在第几个
                if (number >= length) {
                    _this.time.sec = ulHtml.getElementsByTagName("li")[length - 1].innerHTML;
                    ulHtml.style.transform = " translate3d(0," + -(length - 3) * _this.getHtmlSize() * _this.Liheight + "px,0)";
                    ulHtml.style.transition = "all 0.2s ease-out";

                }
                _this.knowTime(ulHtml);
            },
            scrollLi: function () {
                let _this = this;
                let dom = document.getElementsByClassName("screenTimeBody")[0].getElementsByClassName("ulBox");
                let typeList = ["year", "mon", "date", "hour", "min", "sec"];
                if (_this.typeListIndex == 0) {
                    for (let i = 0; i < 6; i++) {
                        for (let x = 0; x < _this.TimeList[i].length; x++) {
                            if (_this.TimeList[i][x] == _this.time[typeList[i]]) {
                                dom[i].getElementsByTagName("ul")[0].style.transform = " translate3d(0," + -(x - 2) * _this.getHtmlSize() * _this.Liheight + "px,0)";
                                dom[i].getElementsByTagName("ul")[0].style.transition = "all " + 0.2 + "s ease-out";
                                break;
                            }
                        }
                    }
                } else if (_this.typeListIndex == 1) {
                    for (let i = 0; i < 3; i++) {
                        for (let x = 0; x < _this.TimeList[i].length; x++) {
                            if (_this.TimeList[i][x] == _this.time[typeList[i]]) {
                                dom[i].getElementsByTagName("ul")[0].style.transform = " translate3d(0," + -(x - 2) * _this.getHtmlSize() * _this.Liheight + "px,0)";
                                dom[i].getElementsByTagName("ul")[0].style.transition = "all " + 0.2 + "s ease-out";
                                break;
                            }
                        }
                    }
                } else if (_this.typeListIndex == 2) {
                    for (let i = 0; i < 3; i++) {
                        for (let x = 0; x < _this.TimeList[i + 3].length; x++) {
                            if (_this.TimeList[i + 3][x] == _this.time[typeList[i + 3]]) {
                                dom[i].getElementsByTagName("ul")[0].style.transform = " translate3d(0," + -(x - 2) * _this.getHtmlSize() * _this.Liheight + "px,0)";
                                dom[i].getElementsByTagName("ul")[0].style.transition = "all " + 0.2 + "s ease-out";
                                break;
                            }
                        }
                    }
                }
            },
            tenMean: function (time) {
                return time * 1 < 10 ? "0" + time * 1 : time * 1;
            },
            opciaty: function () {
                let _this = this;
                let opciaty = document.getElementById("screenTimeBox" + _this.random).style.opacity;
                let time = setInterval(function () {
                    if (opciaty < 1) {
                        opciaty = opciaty * 1 + 0.01;
                        document.getElementById("screenTimeBox" + _this.random).style.opacity = opciaty;
                    } else {
                        clearInterval(time);
                    }
                }, 3)
            },
            getDay: function (time) {
                let _this = this;
                let date = new Date(_this.time.year, _this.time.mon, 0);
                let List = [];
                _this.dateList = [], _this.yearList = [], _this.monList = [], _this.hourList = [], _this.minList = [], _this.secList = [];
                for(let i = _this.time.year - 100; i < _this.time.year + 100;i++){
                    _this.yearList.push(i);
                }
                List.push(_this.yearList);
                for (let i = 0; i < 12; i++) {
                    _this.monList.push(i + 1);
                }
                List.push(_this.monList);
                for (let i = 0; i < date.getDate(); i++) {
                    _this.dateList.push(i + 1);
                }
                List.push(_this.dateList);
                for (let i = 0; i < 24; i++) {
                    _this.hourList.push(i);
                }
                List.push(_this.hourList);
                for (let i = 0; i < 60; i++) {
                    _this.minList.push(i);
                    _this.secList.push(i);
                }
                List.push(_this.minList);
                List.push(_this.secList);
                _this.TimeList = List;
                let typeList = ["year", "mon", "date", "hour", "min", "sec"];
                if (_this.typeListIndex == 0 || _this.typeListIndex == 1) {
                    _this.selectMinMax(0);
                    if (_this.time[typeList[0]] == _this.mintimeList[0]) {
                        _this.selectMinMax(1);
                        if (_this.time[typeList[1]] == _this.mintimeList[1]) {
                            _this.selectMinMax(2);
                            if (_this.typeListIndex == 0) {
                                if (_this.time[typeList[2]] == _this.mintimeList[2]) {
                                    _this.selectMinMax(3);

                                    if (_this.time[typeList[3]] == _this.mintimeList[3]) {
                                        _this.selectMinMax(4);
                                        if (_this.time[typeList[4]] == _this.mintimeList[4]) {
                                            _this.selectMinMax(5);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    _this.selectMinMax2(0);
                    if (_this.time[typeList[0]] == _this.maxtimeList[0]) {
                        _this.selectMinMax2(1);
                        if (_this.time[typeList[1]] == _this.maxtimeList[1]) {
                            _this.selectMinMax2(2);
                            if (_this.typeListIndex == 0) {
                                if (_this.time[typeList[2]] == _this.maxtimeList[2]) {
                                    _this.selectMinMax2(3);
                                    if (_this.time[typeList[3]] == _this.maxtimeList[3]) {
                                        _this.selectMinMax2(4);
                                        if (_this.time[typeList[4]] == _this.maxtimeList[4]) {
                                            _this.selectMinMax2(5);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

            },
            selectMinMax: function (type, from) {
                let _this = this;
                let time = _this.array.minTime;
                if (time != "") {
                    if (time.split(" ").length < 2) {
                        _this.array.minTime = _this.array.minTime + " 00:00:00";
                    }
                    let minYMD = _this.array.minTime.split(" ")[0];
                    let minHMS = _this.array.minTime.split(" ")[1];
                    _this.mintimeList = [minYMD.split("-")[0], minYMD.split("-")[1], minYMD.split("-")[2], minHMS.split(":")[0], minHMS.split(":")[1], minHMS.split(":")[2]];
                    for (let i = 0; i < _this.TimeList[type].length; i++) {
                        if (_this.TimeList[type][i] == _this.mintimeList[type]) {
                            _this.TimeList[type].splice(0, i);
                            break;
                        }
                    }
                }
                if (from == 0) {
                    let liBox = "";
                    for (let x = 0; x < _this.TimeList[type].length; x++) {
                        liBox += "<li style='line-height: " + _this.Liheight * 0.375 + "rem;height: " + _this.Liheight * 0.375 + "rem;'>" + _this.tenMean(_this.TimeList[type][x]) + "</li>";
                    }

                    let ulHtml = document.getElementById("screenTimeBox" + _this.random).getElementsByClassName("ulBox")[type].getElementsByTagName("ul")[0];
                    ulHtml.innerHTML = liBox;
                    let length = ulHtml.getElementsByTagName("li").length;
                    let style = ulHtml.style.transform.replace(/[^0-9\-\.,]/g, '').split(',');
                    let height = (style[1] == undefined ? 0 : style[1] * 1);
                    let number = Math.abs(Math.round(height / _this.getHtmlSize() / _this.Liheight) - 2); //计算停留在第几个
                    if (number >= length) {
                        let typeList = ["year", "mon", "date", "hour", "min", "sec"];
                        _this.time[typeList[type]] = ulHtml.getElementsByTagName("li")[length - 1].innerHTML;
                        ulHtml.style.transform = " translate3d(0," + -(length - 3) * _this.getHtmlSize() * _this.Liheight + "px,0)";
                        ulHtml.style.transition = "all 0.2s ease-out";

                    }
                    _this.knowTime(ulHtml);
                }

            },
            selectMinMax2: function (type, from) {
                let _this = this;
                let time = _this.array.maxTime;
                if (time != "") {
                    if (time.split(" ").length < 2) {
                        _this.array.maxTime = _this.array.maxTime + " 00:00:00";
                    }
                    let minYMD = _this.array.maxTime.split(" ")[0];
                    let minHMS = _this.array.maxTime.split(" ")[1];
                    _this.maxtimeList = [minYMD.split("-")[0], minYMD.split("-")[1], minYMD.split("-")[2], minHMS.split(":")[0], minHMS.split(":")[1], minHMS.split(":")[2]];
                    for (let i = 0; i < _this.TimeList[type].length; i++) {
                        if (_this.TimeList[type][i] == _this.maxtimeList[type]) {
                            _this.TimeList[type].splice(i + 1);
                            break;
                        }
                    }
                }
                if (from == 0) {
                    let liBox = "";
                    for (let x = 0; x < _this.TimeList[type].length; x++) {
                        liBox += "<li style='line-height: " + _this.Liheight * 0.375 + "rem;height: " + _this.Liheight * 0.375 + "rem;'>" + _this.tenMean(_this.TimeList[type][x]) + "</li>";
                    }

                    let ulHtml = document.getElementById("screenTimeBox" + _this.random).getElementsByClassName("ulBox")[type].getElementsByTagName("ul")[0];
                    ulHtml.innerHTML = liBox;
                    let length = ulHtml.getElementsByTagName("li").length;
                    let style = ulHtml.style.transform.replace(/[^0-9\-\.,]/g, '').split(',');
                    let height = (style[1] == undefined ? 0 : style[1] * 1);
                    let number = Math.abs(Math.round(height / _this.getHtmlSize() / _this.Liheight) - 2); //计算停留在第几个
                    if (number >= length) {
                        let typeList = ["year", "mon", "date", "hour", "min", "sec"];
                        _this.time[typeList[type]] = ulHtml.getElementsByTagName("li")[length - 1].innerHTML;
                        ulHtml.style.transform = " translate3d(0," + -(length - 3) * _this.getHtmlSize() * _this.Liheight + "px,0)";
                        ulHtml.style.transition = "all 0.2s ease-out";

                    }
                    _this.knowTime(ulHtml);
                }

            },
            setValue: function () {
                let _this = this;
                let str = _this.getTimeValue();
                _this.array.domSetTime(str);
               // dom.innerHTML = str;
            },
            getTimeValue: function () {
                let _this = this;
                let str = "";
                if (_this.typeListIndex == 0) {
                    str = _this.time.year + "-" + _this.tenMean(_this.time.mon) + "-" + _this.tenMean(_this.time.date) + " " + _this.tenMean(_this.time.hour) + ":" + _this.tenMean(_this.time.min) + ":" + _this.tenMean(_this.time.sec);
                } else if (_this.typeListIndex == 1) {
                    str = _this.time.year + "-" + _this.tenMean(_this.time.mon) + "-" + _this.tenMean(_this.time.date);
                } else if (_this.typeListIndex == 2) {
                    str = _this.tenMean(_this.time.hour) + ":" + _this.tenMean(_this.time.min) + ":" + _this.tenMean(_this.time.sec);
                }
                return str;
            },
            addClass: function (obj, cls) {//增加class
                let id = obj;
                let idJson = id.className.split(" ");
                for (let i = 0; i < idJson.length; i++) {
                    if (idJson[i] == cls) {
                        return false;
                    }
                }
                idJson.push(cls);
                id.className = idJson.join(" ");
                return true;
            },
            removeClass: function (obj, cls) {//删除class
                let id = obj;
                let idJson = id.className.split(" ");
                for (let i = 0; i < idJson.length; i++) {
                    if (idJson[i] == cls) {
                        idJson.splice(i, 1)
                    }
                }
                id.className = idJson.join(" ");
            },
            hasClass: function (obj, cls) {//判断是不是有这个class
                let idJson = obj.className.split(" ");
                for (let i = 0; i < idJson.length; i++) {
                    if (idJson[i] == cls) {
                        return true;
                    }
                }
                return false;
            },
        }
        window.moTimeCJJ = moTimeCJJ;
    }
}())