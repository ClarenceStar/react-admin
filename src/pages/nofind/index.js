import React, { Component } from 'react';
export default class NoFindApp extends Component {
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
                <p style={styleP} >Welcome to</p>
                <h1 style={styleH} >My HomePage</h1>
            </div>
        );
    }
}