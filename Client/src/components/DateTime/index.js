import React from 'react'
import Style from "./index.less"
import projectConfig from '../../project.config';
import dateTime from '../../services/components/dateTime'
import * as constants from "../Commonly/Address/constants";
/*
 组件传入参数
    value : "2019/8/14 - 2019/10/20" //传入时间格式 单选 2019/8/15 多选 2019/8/14 - 2019/10/20
    type: 2  //1 单选 2 双选
    useType : 2 //1机票 2酒店
    唤醒方法 dateClosed();
    赋值方法 getTimeValue props
    例子 ： <DateTime value="2019/8/14 - 2019/10/20" type="2" useType="2" getTimeValue={(val)=>this.getTimeValue(val)}/>
}*/
class Datetime extends React.Component {
    static async getInitialProps() {
        return {
        }
    }
    constructor(props) {
        super(props)
        this.state = {
            isShow: false,
            bodyWidth: 0,
            bodyHeight: 0,
            day: [],
            time: [],
            message: "",
            floatTime: {
                year: "",
                month: "",
            },
            value: this.props.value || "",
            type: this.props.type || 1,
            useType: this.props.useType || 1,
            click: 0,
            getValue: [],
            holiday: []
        }
    }
    componentDidMount() {
        const startDate = this.getYyyyMmDd(new Date());
        const endDate = this.getYyyyMmDd(new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000));
        dateTime.getHoliday({
            startDate: startDate,
            endDate: endDate,
        }).then((res) => {
            let list = [];
            if (res && res.resultData && res.resultData.holidayList) {
                list = res.resultData.holidayList;
            }
            this.setState({
                holiday: list
            })
        }).catch((err) => {
            console.log('err', err)
        })
    }
    xiuAndWoke(type) {
        let name = "";
        switch (type) {
            case 0:
                name = "";
                break;
            case 1:
                name = "休息";
                break;
            case 2:
                name = "补班";
                break;
            default:
                name = "";
                break;
        }
        return name
    }
    holidayName(type) {
        let name = "";
        switch (type) {
            case 0:
                name = "";
                break;
            case 1:
                name = "元旦";
                break;
            case 2:
                name = "春节";
                break;
            case 3:
                name = "清明";
                break;
            case 4:
                name = "五一";
                break;
            case 5:
                name = "端午";
                break;
            case 6:
                name = "中秋";
                break;
            case 7:
                name = "国庆";
                break;
            default:
                name = "";
                break;

        }
        return name
    }
    getYyyyMmDd(time) {
        return time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate()
    }
    getPriceDate(DepartureCityCode, ArrivalCityCode) {
        const { useType, type } = this.state;
        if (useType === 1) {
            dateTime.getPriceDate({
                DepartureCityCode: DepartureCityCode,
                ArrivalCityCode: ArrivalCityCode,
                DepartureCityAdCode: "",
                ArriveCityAdCode: ""
            }).then((res) => {
                const { time } = this.state;
                let list = [];
                if (res && res.resultData && res.resultData.lowFareCalendarList) {
                    list = res.resultData.lowFareCalendarList;
                }
                for (let i = 0; i < list.length; i++) {
                    const li = list[i];
                    for (let x = 0; x < time.length; x++) {
                        const t = time[x];
                        const y = t.year;
                        const m = t.month;
                        let choose = false
                        for (let z = 0; z < t.dateList.length; z++) {
                            const dateList = t.dateList[z];
                            const d = dateList.date;
                            if (d) {
                                const time1 = new Date(li.date.replace(/-/g, "/")).getTime();
                                const time2 = new Date(y + "/" + m + "/" + d).getTime();
                                if (time1 === time2) {
                                    dateList.price = dateList.price + li.price;
                                    choose = true;
                                    break;
                                }
                            }
                        }
                        if (choose) {
                            break;
                        }
                    }
                }
                this.setState({
                    time: time
                })
            }).catch((err) => {
                console.log('err', err)
            })
            if (type === 2) {
                dateTime.getPriceDate({
                    DepartureCityCode: ArrivalCityCode,
                    ArrivalCityCode: DepartureCityCode,
                    DepartureCityAdCode: "",
                    ArriveCityAdCode: ""
                }).then((res) => {
                    const { time } = this.state;
                    let list = [];
                    if (res && res.resultData && res.resultData.lowFareCalendarList) {
                        list = res.resultData.lowFareCalendarList;
                    }
                    for (let i = 0; i < list.length; i++) {
                        const li = list[i];
                        for (let x = 0; x < time.length; x++) {
                            const t = time[x];
                            const y = t.year;
                            const m = t.month;
                            let choose = false;
                            for (let z = 0; z < t.dateList.length; z++) {
                                const dateList = t.dateList[z];
                                const d = dateList.date;
                                if (d) {
                                    const time1 = new Date(li.date.replace(/-/g, "/")).getTime();
                                    const time2 = new Date(y + "/" + m + "/" + d).getTime();
                                    if (time1 === time2) {
                                        dateList.price = dateList.price + li.price;
                                        choose = true;
                                        break;
                                    }
                                }
                            }
                            if (choose) {
                                break;
                            }
                        }
                    }
                    this.setState({
                        time: time
                    })
                }).catch((err) => {
                    console.log('err', err)
                })
            }
        }

    }
    componentWillUnmount() {
        if (typeof window !== "undefined" && this.state.isShow) {
            const day_time_box = document.getElementsByClassName("day_time_box")[0];
            day_time_box.removeEventListener('scroll', null);
        }
    }
    timeDateSetDom() {
        const getYMlist = this.getYMlist();//获取年月列表
        const minDate = this.props.minTime;
        let dateTimeNow = "";
        if (minDate) {
            dateTimeNow = new Date(minDate).getTime() + 100
        } else {
            dateTimeNow = new Date().getTime();//获取当前时间戳
        }
        let width = 0;
        if (typeof window !== "undefined") {
            width = document.documentElement.offsetWidth || document.body.offsetWidth;
            const height = document.documentElement.offsetHeight || document.body.offsetHeight;
            this.setState({
                bodyWidth: width,
                bodyHeight: height
            })
        }
        let ymdList = [];
        let offsetTop = 0, chooseNum = 0, click = 0, getValue = [];
        const valueChoose = this.state.value.split(" - ");
        const { holiday } = this.state;
        for (let i = 0; i < getYMlist.length; i++) {
            const year = getYMlist[i].year;
            const month = getYMlist[i].month;
            const endDate = this.mGetDate(year, month);//获取当前年月的日期长度
            let dateList = [];
            let choose = false;
            let firstDayDom = false;
            let holidayType = 0 ;
            for (let x = 0; x < endDate; x++) {
                const dateTime = new Date(year + "/" + month + "/" + (x + 1)).getTime();
                let dChoose = false, chooseSecond = false;
                //选中第一个日期
                if (valueChoose[0] !== "" && dateTime === new Date(valueChoose[0]).getTime()) {
                    choose = true;
                    dChoose = true;
                    chooseNum++;
                    click++;
                    getValue.push({
                        f: i,
                        c: x,
                    })
                }
                //选中第二个日期
                if (valueChoose.length > 1 && valueChoose[1] !== "" && dateTime === new Date(valueChoose[1]).getTime()) {
                    choose = true;
                    dChoose = true;
                    chooseNum++;
                    click++;
                    getValue.push({
                        f: i,
                        c: x,
                    })
                }
                if (chooseNum === 1 && this.state.type === 2) {
                    chooseSecond = true
                }
                //判断哪些日期距离当前日期365天
                if (i === 0 && dateTime - dateTimeNow > 365 * 24 * 60 * 60 * 1000) {
                    firstDayDom = true;
                    break;
                }
                //判断今天
                let today = "";
                if (dateTimeNow - dateTime >= 0 && dateTimeNow - dateTime < 24 * 60 * 60 * 1000) {
                    today = "今天";
                }
                let day_list_holiday = false;
                //判断节假日期
                for (let z = 0; z < holiday.length; z++) {
                    const li = holiday[z];
                    const time1 = new Date(li.holidayDate.replace(/-/g, "/")).getTime();
                    if (time1 === dateTime) {
                        today = li.holidayType && li.dateType !== 2 ? this.holidayName(li.holidayType) : this.xiuAndWoke(li.dateType);
                        day_list_holiday = !!(li.dateType === 0 || li.dateType === 1);
                        console.log(li.holidayType,holidayType)
                        if( li.holidayType === holidayType){
                            today =  this.xiuAndWoke(li.dateType);
                        }
                        if( li.dateType === 1){
                            holidayType = li.holidayType ;
                        }

                        break;
                    }
                }
                dateList.push({
                    date: x + 1,
                    isDown: !(dateTime - dateTimeNow >= -86400000 && dateTime - dateTimeNow < 365 * 24 * 60 * 60 * 1000),
                    choose: dChoose,
                    chooseSecond: chooseSecond,
                    today: today,
                    price: 0,
                    day_list_holiday: day_list_holiday
                });
            }
            //判断空白日期个数
            const firstDay = new Date(year + "/" + month + "/" + 1).getDay();
            for (let x = 0; x < firstDay; x++) {
                dateList.unshift({
                    date: "",
                    isDown: true,
                    choose: false,
                    chooseSecond: false,
                    today: "",
                    day_list_holiday: false
                })
            }
            for (let x = 0; x < getValue.length; x++) {
                if (getValue[x].f === i) {
                    getValue[x].c += firstDay
                }
            }
            if (!firstDayDom) {
                //填写高度
                offsetTop += Math.ceil(dateList.length / 7) * (width * 0.96 / 7 + 5) + 45;
                ymdList.push({
                    year: year,
                    month: month,
                    choose: choose,
                    offsetTop: offsetTop,
                    dateList: dateList
                })
            }
        }
        this.setState({
            time: ymdList,
            day: ["日", "一", "二", "三", "四", "五", "六"],
            click: click,
            floatTime: {
                year: ymdList[0].year,
                month: ymdList[0].month,
            },
            getValue: getValue
        }, () => {
            if (typeof window !== "undefined" && this.state.isShow) {
                const { time, bodyWidth } = this.state;
                if (typeof window !== "undefined") {
                    const day_time_box = document.getElementsByClassName("day_time_box")[0];
                    let domHeightFirst = 0;
                    for (let i = 0; i < time.length; i++) {
                        if (time[i].choose) {
                            if (i > 0) {
                                domHeightFirst = time[i - 1].offsetTop;
                            }
                            for (let x = 0; x < time[i].dateList.length; x++) {
                                const td = time[i].dateList[x];
                                if (td.choose) {
                                    const floor = Math.floor(x / 7);
                                    const nn = (bodyWidth * 0.96 / 7 + 5) * floor;
                                    domHeightFirst += nn;
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    //日期滚动
                    if (!domHeightFirst) {
                        for (let x = 0; x < time[0].dateList.length; x++) {
                            const td = time[0].dateList[x];
                            if (!td.isDown) {
                                const floor = Math.floor(x / 7);
                                const nn = (bodyWidth * 0.96 / 7 + 5) * floor;
                                domHeightFirst += nn;
                                break;
                            }
                        }
                    }
                    day_time_box.scrollTop = domHeightFirst + 2;
                    day_time_box.addEventListener('scroll', () => this.scrollAdd(day_time_box));
                }
            }
        })
    }
    scrollAdd(dom) {
        const { time } = this.state;
        const scrolltop = dom.scrollTop;
        for (let i = 0; i < time.length; i++) {
            if (time[i].offsetTop >= scrolltop) {
                this.setState({
                    floatTime: {
                        year: time[i].year,
                        month: time[i].month,
                    }
                })
                return false
            }
        }
    }
    getYMlist() {
        const dateTime = new Date();
        const year = dateTime.getFullYear();
        const month = dateTime.getMonth() + 1;
        const getYMlist = [];
        for (let i = 0; i < 13; i++) {
            getYMlist.push({
                year: month + i > 12 ? year + 1 : year,
                month: month + i > 12 ? month + i - 12 : month + i,
            })
        }
        return getYMlist
    }
    mGetDate(year, month) {
        const d = new Date(year, month, 0);
        return d.getDate();
    }
    doDay() {
        const { day, bodyWidth } = this.state;
        let width = 0;
        if (typeof window !== "undefined") {
            width = bodyWidth * 0.96;
        }
        const daylist = day.map((item, i) =>
            <div key={i} style={{ width: width / day.length + "px" }} className={i === 0 || i === day.length - 1 ? "day_list_holiday" : ""}>{item}</div>
        )
        return (
            <div className="day_list_box">
                {daylist}
            </div>
        )
    }
    initTimeList() {
        const { time } = this.state;
        for (let i = 0; i < time.length; i++) {
            for (let x = 0; x < time[i].dateList.length; x++) {
                time[i].dateList[x].choose = false;
                time[i].dateList[x].chooseSecond = false;
            }
        }
        return time
    }
    initMessage(time) {
        for (let i = 0; i < time.length; i++) {
            for (let x = 0; x < time[i].dateList.length; x++) {
                time[i].dateList[x].messageshow = false;
            }
        }
        return time
    }
    chooseDate(i, x, isDown) {
        let { type, click, time, getValue, useType, message } = this.state;
        if (!isDown) {
            let times = (type === 2 && click === 2) || type === 1 ? this.initTimeList() : time;
            times = this.initMessage(times);
            let getValueList = getValue, clickNumber = click;
            if (type === 1) {
                getValueList = [{
                    f: i,
                    c: x
                }]
            } else if (type === 2) {
                if (clickNumber === 0) {
                    getValueList.push({
                        f: i,
                        c: x
                    })
                    if (useType === 2) {
                        message = "请选择离店日期";
                    } else {
                        message = "请选择返程日期";
                    }
                } else if (clickNumber === 1) {
                    const f = getValueList[0].f;
                    const c = getValueList[0].c;
                    const tf = times[f], ti = times[i];
                    const brforeDate = new Date(tf.year + "/" + tf.month + "/" + tf.dateList[c].date).getTime();
                    const thisDate = (new Date(ti.year + "/" + ti.month + "/" + ti.dateList[x].date)).getTime();
                    if ((brforeDate > thisDate && useType === 1) || (brforeDate >= thisDate && useType === 2)) {
                        getValueList = [{
                            f: i,
                            c: x
                        }]
                        times = this.initTimeList();
                        clickNumber = 0;
                        if (useType === 2) {
                            message = "请选择离店日期";
                        } else {
                            message = "请选择返程日期";
                        }
                    } else {
                        message = "";
                        getValueList.push({
                            f: i,
                            c: x
                        })
                    }
                } else if (clickNumber === 2) {
                    if (useType === 2) {
                        message = "请选择离店日期";
                    } else {
                        message = "请选择返程日期";
                    }
                    getValueList = [{
                        f: i,
                        c: x
                    }]
                }
            }
            const year = times[i].year;
            const month = times[i].month;
            const date = times[i].dateList[x].date;
            times[i].dateList[x].choose = true;
            if (!(type === 2 && clickNumber === 1 && useType === 1)) {
                times[i].dateList[x].messageshow = true;
            }
            this.setState({
                time: times,
                getValue: getValueList,
                message: message,
                click: clickNumber + 1 > 2 ? 1 : clickNumber + 1
            }, () => {
                let list = [];
                if (type === 1) {
                    list.push(year + "/" + month + "/" + date)
                    this.getTimeValue(list);
                    this.dateClosed();
                } else {
                    if (this.state.click === 2) {
                        if (useType === 2) {
                            list = this.chooseSecondDate();
                            const dateWan = (new Date(list[1]).getTime() - new Date(list[0]).getTime()) / 24 / 60 / 60 / 1000;
                            this.setState({
                                message: "住" + dateWan + "晚"
                            })
                            this.getTimeValue(list);
                            setTimeout(() => {
                                this.dateClosed();
                            }, 500)
                        } else {
                            this.chooseSecondDate();
                        }
                    }

                }

            })
        } else {
            console.log("不能选择该时间")
        }
    }
    flightSure() {
        const { getValue } = this.state;
        if (getValue.length > 1) {
            const list = this.chooseSecondDate();
            this.getTimeValue(list);
            this.dateClosed();
        }
    }
    getTimeValue(list) {
        try {
            this.props.getTimeValue(list);
        } catch (e) {
            console.log("暂无回调方法")
        }
    }
    chooseSecondDate() {
        const { time, getValue } = this.state;
        let choose = 0;
        let list = [];
        for (let i = 0; i < time.length; i++) {
            for (let x = 0; x < time[i].dateList.length; x++) {
                const dateList = time[i].dateList[x];
                if (dateList.choose) {
                    const year = time[i].year;
                    const month = time[i].month;
                    const date = time[i].dateList[x].date;
                    list.push(year + "/" + month + "/" + date)
                    choose++;
                }
                if (choose === 1 && !(getValue.length > 1 && getValue[0].f === getValue[1].f && getValue[0].c === getValue[1].c)) {
                    dateList.chooseSecond = true
                }
            }
        }
        if (getValue.length > 1 && getValue[0].f === getValue[1].f && getValue[0].c === getValue[1].c) {
            list.push(list[0])
        }
        this.setState({
            time: time
        })
        return list
    }
    doYMD() {
        const { time, day, bodyWidth, getValue, type, useType, message, value } = this.state;
        let width = 0;
        if (typeof window !== "undefined") {
            width = bodyWidth * 0.96 / day.length;
        }
        let firstTime = "", secondTime = "";
        if (getValue.length === 1) {
            const f = getValue[0].f;
            const c = getValue[0].c;
            const y = time[f].year;
            const m = time[f].month;
            const d = time[f].dateList[c].date;
            firstTime = new Date(y + "/" + m + "/" + d).getTime()
        } else if (getValue.length === 2) {
            const f1 = getValue[0].f;
            const c1 = getValue[0].c;
            const y1 = time[f1].year;
            const m1 = time[f1].month;
            const d1 = time[f1].dateList[c1].date;
            firstTime = new Date(y1 + "/" + m1 + "/" + d1).getTime()
            const f = getValue[1].f;
            const c = getValue[1].c;
            const y = time[f].year;
            const m = time[f].month;
            const d = time[f].dateList[c].date;
            secondTime = new Date(y + "/" + m + "/" + d).getTime()
        }
        const timelist = time.map((item, i) => {
            const yy = item.year;
            const mm = item.month;
            const datelist = item.dateList.map((items, x) => {
                const dd = items.date;
                let comeGo = "", today = "", priceDom = "";
                if (type === 2) {
                    if (getValue.length > 0) {
                        if (i === getValue[0].f && x === getValue[0].c) {
                            comeGo = useType === 1 ? <p>去程</p> : <p className="hotel_come_go">入住</p>
                        }
                    }
                    if (getValue.length > 1) {
                        if (i === getValue[1].f && x === getValue[1].c) {
                            comeGo = useType === 1 ? <p>返程</p> : <p className="hotel_come_go">离店</p>
                            if (getValue[0].f === getValue[1].f && getValue[0].c === getValue[1].c) {
                                comeGo = useType === 1 ? <p>去/返</p> : comeGo
                            }
                        }
                    }
                }
                if (useType === 2) {
                    if (items.today) {
                        today = <p className={items.day_list_holiday ? "day_list_holiday" : ""}>{items.today}</p>
                    }
                } else if (useType === 1) {
                    if (items.today && !comeGo) {
                        today = <p className={items.day_list_holiday ? "day_list_holiday" : ""}>{items.today}</p>
                    }
                }
                if (useType === 1) {
                    if (items.price) {
                        if (type === 1) {
                            priceDom = <p className="day_list_money">￥{items.price}</p>
                        } else {
                            const date1 = new Date(yy + "/" + mm + "/" + dd).getTime();
                            if (getValue.length === 0) {
                                priceDom = <p className="day_list_money">￥{items.price}</p>
                            } else if (getValue.length === 1) {
                                if (date1 >= firstTime) {
                                    priceDom = <p className="day_list_money">￥{items.price}</p>
                                }
                            } else if (getValue.length === 2) {
                                if (date1 === secondTime) {
                                    priceDom = <p className="day_list_money">￥{items.price}</p>
                                }
                            }

                        }

                    }
                }
                return <div className={items.isDown ? "day_time_d_down" :
                    (items.choose ? "day_list_choose" :
                        (items.chooseSecond ? "day_list_chooseSecond" :
                            (((x % day.length === 0 || x % day.length === 6) && !items.today) || items.day_list_holiday ? "day_list_holiday" : "")))}
                    key={x} style={{ width: width + "px", height: width + "px", lineHeight: width + "px" }}
                    onClick={() => this.chooseDate(i, x, items.isDown)}>
                    {today}
                    {comeGo}
                    {items.date}
                    {priceDom}
                    {items.messageshow && <div className="date_bubble">{message}</div>}
                </div>
            })
            return <div className="day_time_ymd" key={i} data-top={item.offsetTop}>
                <div className="day_time_ym">
                    {item.year}年{item.month}月
                    </div>
                <div className="day_time_d">{datelist}</div>
            </div>

        })
        return (
            <div className="day_time_box" style={{ paddingBottom: useType === 1 ? (type === 2 ? "115px" : "30px") : "0" }}>
                {timelist}
            </div>
        )
    }
    dateClosed() {
        const { isShow } = this.state;
        if (typeof window !== "undefined" && isShow) {
            const day_time_box = document.getElementsByClassName("day_time_box")[0];
            day_time_box.removeEventListener('scroll', null);
        }
        this.setState({
            isShow: !isShow,
            value: this.props.value || "",
            type: this.props.type || 1,
            useType: this.props.useType || 1,
        }, () => {
            if (this.state.isShow) {
                this.timeDateSetDom();
            } else {
                try {
                    if (this.props.overflowTrue) { this.props.overflowTrue() }
                } catch (e) {
                    console.log(e)
                }
            }
        })
    }
    ten(val) {
        return val - 10 >= 0 ? val : "0" + val;
    }
    render() {
        const { floatTime, isShow, useType, type, getValue, time, bodyHeight } = this.state;
        let go = "选择去程", come = "选择回程";
        if (type === 2 && useType === 1 && getValue.length > 0) {
            const timeGet = time[getValue[0].f];
            go = this.ten(timeGet.month) + "-" + this.ten(timeGet.dateList[getValue[0].c].date)
        }
        if (type === 2 && useType === 1 && getValue.length > 1) {
            const timeGet = time[getValue[1].f];
            come = this.ten(timeGet.month) + "-" + this.ten(timeGet.dateList[getValue[1].c].date)
        }
        console.log("getValue", getValue)
        let priceShow = "";
        if (getValue.length === 2) {
            const json = getValue[1];
            const pp = time[json.f].dateList[json.c].price;
            if (pp) {
                priceShow = time[json.f].dateList[json.c].price + "起";
            } else {
                priceShow = "--";
            }

        } else {
            priceShow = "--";
        }
        const price = useType === 1 ? (type === 2 ? <div className="fixed_price">
            <p>去：{go}&nbsp;&nbsp;返：{come}<span>往返价格：<span>￥{priceShow}</span></span></p>
            <button className={getValue.length < 2 ? "button_do_not" : ""} onClick={() => this.flightSure()}>确认</button>
            <h6>所选日期为出发地日期，价格变动频繁，以实际为准</h6>
        </div> : <div className="fixed_price">
                <h6>所选日期为出发地日期，价格变动频繁，以实际为准</h6>
            </div>) : "";
        const isShowDom = isShow ? <div className="component_date_time_big_box">
            <div className="date_time_box_black" onClick={() => this.dateClosed()}>
            </div>
            <div className="date_time_box" style={{ height: bodyHeight * 0.832 + "px" }}>
                <p>选择日期</p>
                <img src={projectConfig.urlPrefix + "/static/images/components/closed.png"} className="date_time_closed" onClick={() => this.dateClosed()} />
                <div className="date_tips">
                    提示信息提示信息提示信息提示信息提示信息提示信息
                                            </div>
                {this.doDay()}
                <div className="day_time_float_ymd">
                    {floatTime.year}年{floatTime.month}月
                                            </div>
                {this.doYMD()}
                {price}
            </div>

        </div> : "";
        return (
            <React.Fragment>
                <style dangerouslySetInnerHTML={{ __html: Style }} />
                {isShowDom}
            </React.Fragment>
        )
    }
}

export default Datetime