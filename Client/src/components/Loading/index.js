import React from 'react'
import Style from "./index.less"

/*
 组件传入参数
    message : "正在加载"
    例子 ： <Loading message="正在加载"/>
}*/

class Loading extends React.Component {
    static async getInitialProps(){
        return {
        }
    }
    constructor (props) {
        super(props)
        this.state = {
            message : this.props.message || "正在加载"
        }
    }
    componentDidMount() {
    }
    changeMessage(message){
        this.setState({
            message : message
        })
    }
    render(){
        const {message} = this.state;
        return (
            <React.Fragment>
                <style dangerouslySetInnerHTML={{ __html: Style }} />
                 <div className="component_loading_big_box">
                      <div className="loading_box">
                           <img src={require('../../assets/img/loading.gif')}/>
                          <p>{message}</p>
                      </div>
                 </div>
            </React.Fragment>
        )
    }
}

export default Loading