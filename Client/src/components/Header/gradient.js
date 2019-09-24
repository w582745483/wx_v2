import React from 'react'
import Style from "./gradient.less"
import projectConfig from '../../project.config'
import CommonUtil from '../../utils/common'
import PhoneUtil from '../../utils/phone'
import CtripUtil from '../../utils/ctrip'

/*
 props:
 1. title: the title of Header
 2. leftIcon, leftIconWidth, leftIconHeight, leftFunc:  prefix url is /static/images/
 3. rightIcon, rightIconWidth, rightIconHeight, rightFunc:
 4. children  <HeaderGradient>{children}</HeaderGradient>
 */

class HeaderGradient extends React.Component {
    constructor(props) {
        super(props)
        const { title, leftIcon, leftIconWidth, leftIconHeight, leftFunc,
            rightIcon, rightIconWidth, rightIconHeight, rightFunc, children } = this.props;

        this.backgroundColorChangedTransparentFlag = true;
        this.backgroundColorChangedWhiteFlag = false;
        this.state = {
            title: title || '',
            leftIcon: leftIcon || 'back.png',
            leftIconWidth: leftIconWidth || 11,
            leftIconHeight: leftIconHeight || 17,
            leftFunc: leftFunc,
            rightIcon: rightIcon || '',
            rightIconWidth: rightIconWidth || 20,
            rightIconHeight: rightIconHeight || 20,
            rightFunc: rightFunc,
            body: children,
            header1Flag: true,
            header2Flag: false,
            barBackgroundColor: 'rgba(255,255,255,0)',
            headerTopHeight: 128,
            barPaddingTop: 0
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        //console.log('getDerivedStateFromProps', nextProps, prevState)

        if (nextProps.title !== prevState.title
            || nextProps.children !== prevState.body) {
            return {
                ...prevState,
                title: nextProps.title,
                body: nextProps.children
            }
        }
        return null;
    }

    componentDidMount() {
        let { headerTopHeight, barPaddingTop } = this.state;

        if(PhoneUtil.isInApp()) {
            //PhoneUtil.appSetSignalBarBackgroundColor('transparent');

            PhoneUtil.appGetSignalBarHeight((height)=>{
                if(height){
                    headerTopHeight += height;
                    barPaddingTop = height;
                }

                this.setState({
                    headerTopHeight: headerTopHeight,
                    barPaddingTop: barPaddingTop
                });
            });
        }

        if(CtripUtil.isInCtrip()){
            if(CtripUtil.isInIOS()){
                if(CtripUtil.isIphoneX()){
                    headerTopHeight = 172;
                    barPaddingTop = 44;
                } else {
                    headerTopHeight = 148;
                    barPaddingTop = 20;
                }
            }

            this.setState({
                headerTopHeight: headerTopHeight,
                barPaddingTop: barPaddingTop
            });
            CtripUtil.appSetStatusBarStyle('darkContent');
            CtripUtil.appSetNavbarHidden(true);
        }
    }

    doLeft(){
        const { leftFunc } = this.state
        leftFunc ? leftFunc() : CommonUtil.back();
    }

    doRight(){
        const { rightFunc } = this.state
        rightFunc && rightFunc();
    }

    bindScroll(e){
        //console.log('bindScroll: ' + e.target.scrollTop);
        const scrollTop = e.target.scrollTop;
        if (scrollTop <= 0) {
            if(!this.backgroundColorChangedTransparentFlag && this.backgroundColorChangedWhiteFlag) {
                //console.log('set backgroundColor transparent');
                this.backgroundColorChangedTransparentFlag = true;
                this.backgroundColorChangedWhiteFlag = false;

                this.setState({
                    header1Flag: false,
                    header2Flag: true
                })
            }
        } else {
            const op = scrollTop * 0.05 > 1 ? 1
                : (scrollTop * 0.05 < 0 ? 0 : scrollTop * 0.05);

            if(!this.backgroundColorChangedWhiteFlag && this.backgroundColorChangedTransparentFlag) {
                //console.log('set backgroundColor white');

                if(op > 0.99){
                    this.backgroundColorChangedWhiteFlag = true;
                    this.backgroundColorChangedTransparentFlag = false;
                }
                else {
                    this.backgroundColorChangedTransparentFlag = true;
                    this.backgroundColorChangedWhiteFlag = false;
                }

                this.setState({
                    header1Flag: true,
                    header2Flag: false
                })
            }

            const barBackgroundColor = "rgba(255,255,255," + op + ")";
            this.setState({
                barBackgroundColor: barBackgroundColor
            })
        }
    }

    render(){
        const { header1Flag, header2Flag, barBackgroundColor, headerTopHeight, barPaddingTop,
            title, leftIcon, leftIconWidth, leftIconHeight,
            rightIcon, rightIconWidth, rightIconHeight, body } = this.state

        return (
            <React.Fragment>
                <style dangerouslySetInnerHTML={{ __html: Style }} />
                <div class="component-gradient-header">
                    {header1Flag && <div class="component-gradient-header-area"
                                         style={{ backgroundColor: barBackgroundColor, paddingTop: barPaddingTop }}>
                        {leftIcon ? <div class="component-gradient-header-left" onClick={()=>this.doLeft()}>
                            <img src={projectConfig.urlPrefix + "/static/images/" + leftIcon} width={leftIconWidth} height={leftIconHeight} />
                        </div> : <div class="component-gradient-header-left"></div>}

                        <div class="component-gradient-header-center">{title}</div>

                        {rightIcon ? <div class="component-gradient-header-right" onClick={()=>this.doRight()}>
                            <img src={projectConfig.urlPrefix + "/static/images/" + rightIcon} width={rightIconWidth} height={rightIconHeight} />
                        </div> : <div class="component-gradient-header-right"></div>}
                    </div>}

                    {header2Flag && <div class="component-gradient-header-area2" style={{ paddingTop: barPaddingTop }}>
                        {leftIcon ? <div class="component-gradient-header-left" onClick={()=>this.doLeft()}>
                            <img src={projectConfig.urlPrefix + "/static/images/" + leftIcon} width={leftIconWidth} height={leftIconHeight} />
                        </div> : <div class="component-gradient-header-left"></div>}

                        <div class="component-gradient-header-center">{title}</div>

                        {rightIcon ? <div class="component-gradient-header-right" onClick={()=>this.doRight()}>
                            <img src={projectConfig.urlPrefix + "/static/images/" + rightIcon} width={rightIconWidth} height={rightIconHeight} />
                        </div> : <div class="component-gradient-header-right"></div>}
                    </div>}

                    <div class="component-gradient-content-area" onScroll={(e)=>this.bindScroll(e)}>
                        <div class="component-gradient-content-header" style={{ height: headerTopHeight - barPaddingTop, paddingTop: barPaddingTop }}></div>
                        <div class="component-gradient-content">
                            {body}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default HeaderGradient