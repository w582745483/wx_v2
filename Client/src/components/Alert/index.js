import React from 'react'
import Style from "./index.less"
/*
 组件传入参数
    赋值并button方法跟名字 this.refs.alert.setValButton("请选择收件人所在地区",[{
                name : "我知道了",
                pro:()=>{

                }
            }]);
            默认有关闭弹窗得方法
    例子 ： <Alert ref="alert"/>
}*/

class Alert extends React.Component {
    static async getInitialProps(){
        return {
        }
    }
    constructor (props) {
        super(props)
        this.state = {
            message : this.props.message || "正在加载",
            buttonList:this.props.buttonList || [{
                name : "我知道了"
            }],
            sure : false,
        }
    }
    componentDidMount() {
    }
    setValButton(message,buttonList){
        this.setState({
            sure : true,
            message : message || "正在加载",
            buttonList:buttonList || [{
                name : "我知道了"
            }],
        })
    }
    clickButton(index){
        const {buttonList} = this.state;
        this.setState({
            sure: false
        },()=>{
            buttonList[index].pro && buttonList[index].pro();
        })
    }
    closed(){
        this.setState({
            sure: false
        })
    }
    setButton(){
        const {buttonList} = this.state;
        const dom = buttonList && buttonList.length > 0 && buttonList.map((item,i)=>{
            let clas = ["button_list"];
            if(i > 0){
                clas.push("button_list_border")
            }
            return <div className={clas.join(" ")} key={i} onClick={()=>this.clickButton(i)}>
                {item.name}
            </div>
        })
        return(
            <div className="button_list_box">
                {dom}
            </div>
        )
    }
    render(){
        const {message,sure} = this.state;
        return (
            <React.Fragment>
                <style dangerouslySetInnerHTML={{ __html: Style }} />
                {sure && <div className="component_alert_big_box">
                    <div className="alert_big_black_box" onClick={()=> this.closed()}>
                    </div>
                      <div className="alert_box">
                          <p><span>{message}</span></p>
                          {this.setButton()}
                      </div>
                 </div>}
            </React.Fragment>
        )
    }
}

export default Alert