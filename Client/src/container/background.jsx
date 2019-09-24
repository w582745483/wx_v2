import React from 'react'

export default class Background extends React.Component {
  
    render() {
        return (
            <div >
                <img src={require('../assets/img/background.jpg')} alt='logo' className='login-background' />
            </div>
        )
    }
}