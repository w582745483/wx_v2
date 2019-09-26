import React from 'react'
import Style from "./index.less"

/*
    props:
    1. val1: the first line words
    2. val2: the second line words
    3. setVal1: set the first line words
    4. setVal2 : set the second line words
 */

class Toast extends React.Component {
    constructor(props) {
        super(props)
        const { val1, val2 } = this.props;
        this.state = {
            toast1: val1 || "",
            toast2: val2 || "",
            displayToast: false
        }
        this.displayToastTimeout = null;
    }

    setVal1(val){
        this.setState({
            toast1: val
        }, ()=>{
            this.handleToast();
        })
    }

    setVal2(val){
        this.setState({
            toast2: val
        }, ()=>{
            this.handleToast();
        })
    }

    handleToast(){
        const { toast1, toast2 } = this.state;
        const toastLen = toast1.length + toast2.length;
        //console.log('toastLen', toastLen)

        let timeout = 0;
        if(toastLen < 5){
            timeout = 2000;
        } else if(toastLen >= 5 && toastLen < 20){
            timeout = 3000;
        }

        //console.log('timeout', timeout)
        if(timeout > 0){
            this.setState({
                displayToast: true
            })

            this.displayToastTimeout = setTimeout(()=>{
                this.setState({
                    displayToast: false
                })
            }, timeout);
        }
    }

    componentDidMount(){
        this.handleToast();
    }

    componentWillUnmount() {
        if(this.displayToastTimeout != null){
            clearTimeout(this.displayToastTimeout)
        }
    }

    render(){
        const { toast1, toast2 } = this.state;
        let { displayToast } = this.state;

        if(toast1 == "" && toast2 == "")
            displayToast = false;

        //console.log('displayToast', displayToast)
        if(displayToast){
            return (
                <React.Fragment>
                    <style dangerouslySetInnerHTML={{ __html: Style }} />
                    <div className="component-toast">
                        <div className="toast-area">
                            <div className="toast-content">
                                {toast1 && <p>{toast1}</p>}
                                {toast2 && <p>{toast2}</p>}
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            )
        }
        else
            return null
    }
}

export default Toast