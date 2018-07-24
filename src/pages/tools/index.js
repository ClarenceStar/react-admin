import React, { Component } from 'react';
export default class ToolsApp extends Component {
    render() {
        let styleP = {
            textAlign: 'center',
            fontFamily: 'cursive',
            fontSize: 35,
            marginTop: '14%'
        }
        let styleH = {
            textAlign: 'center',
            fontFamily: 'cursive',
            fontSize: 100
        }
        return (
            <div>
                <p style={styleP} >OOPS! - Could not Find it</p>
                <h1 style={styleH} >这是Tools</h1>
            </div>
        );
    }
}