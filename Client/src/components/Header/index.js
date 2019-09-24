/**
 * Created by lei_sun on 2019/8/1.
 */
import React from 'react'
import Style from "./index.less"
import projectConfig from '../../project.config'
import CommonUtil from '../../utils/common'
import PhoneUtil from '../../utils/phone'
import CtripUtil from '../../utils/ctrip'

/*
    props:
    1. title: the title of Header
    2. leftIcon, leftIconWidth, leftIconHeight, leftFunc:  prefix url is /static/images/
    3. rightIcon, rightIconWidth, rightIconHeight, rightFunc:
    4. children  <Header>{children}</Header>
 */

class Header extends React.Component {
    constructor(props) {
        super(props)
        const { title, leftIcon, leftIconWidth, leftIconHeight, leftFunc,
            rightIcon, rightIconWidth, rightIconHeight, rightFunc, children, rightContent } = this.props;

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
            headerPaddingTop: 0,
            contentPaddingTop: 65,
            rightContent: rightContent || ""
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
        let { headerPaddingTop, contentPaddingTop } = this.state;

        if (PhoneUtil.isInApp()) {
            //PhoneUtil.appSetSignalBarBackgroundColor('transparent');

            PhoneUtil.appGetSignalBarHeight((height) => {
                if (height) {
                    headerPaddingTop += height;
                    contentPaddingTop += height;
                }

                this.setState({
                    headerPaddingTop: headerPaddingTop,
                    contentPaddingTop: contentPaddingTop
                });
            });
        }

        if (CtripUtil.isInCtrip()) {
            if (CtripUtil.isInIOS()) {
                if (CtripUtil.isIphoneX()) {
                    headerPaddingTop = 44;
                    contentPaddingTop = 109;
                }
                else {
                    headerPaddingTop = 20;
                    contentPaddingTop = 85;
                }
            }

            this.setState({
                headerPaddingTop: headerPaddingTop,
                contentPaddingTop: contentPaddingTop
            })

            CtripUtil.appSetStatusBarStyle('darkContent');
            CtripUtil.appSetNavbarHidden(true);
        }
    }

    doLeft() {
        const { leftFunc } = this.state
        leftFunc ? leftFunc() : CommonUtil.back();
    }

    doRight() {
        const { rightFunc } = this.state
        rightFunc && rightFunc();
    }

    render() {
        const { headerPaddingTop, contentPaddingTop, title, leftIcon, leftIconWidth, leftIconHeight,
            rightIcon, rightIconWidth, rightIconHeight, body, rightContent } = this.state

        //console.log('headerPaddingTop', headerPaddingTop, contentPaddingTop)

        return (
            <React.Fragment>
                <style dangerouslySetInnerHTML={{ __html: Style }} />
                <div class="component-header">
                    <div class="component-header-area" style={{ paddingTop: headerPaddingTop }}>
                        <div class="component-header-top">
                            <div class="component-header-bar">
                                {leftIcon ? <div class="component-header-left" onClick={() => this.doLeft()}>
                                    <img src={projectConfig.urlPrefix + "/static/images/" + leftIcon} width={leftIconWidth} height={leftIconHeight} />
                                </div> : <div class="component-header-left"></div>}

                                <div class="component-header-center">{title}</div>
                                {rightIcon && <div class="component-header-right" onClick={() => this.doRight()}>
                                    <img src={projectConfig.urlPrefix + "/static/images/" + rightIcon} width={rightIconWidth} height={rightIconHeight} />
                                </div>}
                                {rightContent && <div class="component-header-right" onClick={() => this.doRight()}>{rightContent}</div>} 
                            </div>
                        </div>
                        <div class="component-header-bottom"></div>
                    </div>
                    <div class="component-content-area" style={{ paddingTop: contentPaddingTop }}>
                        {body}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Header