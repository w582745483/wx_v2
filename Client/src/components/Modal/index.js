import React from 'react';
import Style from './index.less';

/*
    description: 浮层
    props:
    1. children
    2. className
    3. boxClassName
    4. onClick
    5. onChangeShow
    6. destroy
    7. hidden
    8. closeElement
 */

class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        }
    }

    open() {
        this.setState({ show: true });
        this.props.onChangeShow && this.props.onChangeShow(true);
    }

    close() {
        this.setState({ show: false });
        this.props.onChangeShow && this.props.onChangeShow(false);
    }

    onClickContent(event) {
        event.stopPropagation();
        this.props.onClick && this.props.onClick(event);
    }

    render() {
        const { className, boxClassName, children, onChangeShow, destroy, hidden,closeElement, ...others } = this.props;
        const { show } = this.state;

        return (
            <React.Fragment>
                <style dangerouslySetInnerHTML={{ __html: Style }}></style>
                {
                    (!show) && destroy ?
                        null :
                        <div {...others} className={`component_modal_box ${className} ${show ? '' : hidden ? 'component_modal_hidden' : 'component_modal_none'}`} onClick={() => this.close()}>
                            <div className={`modal_content_box ${boxClassName}`} onClick={this.onClickContent.bind(this)}>
                                {children}
                            </div>
                            {closeElement}
                        </div>
                }


            </React.Fragment>
        )
    }
}

export default Modal;