import React, { Component } from 'react'
import CommentInput from '../../containers/CommentInput'
import CommentList from '../../containers/CommentList'
import commentsReducer from '../../reducers/comments'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import './index.less'
class Comment extends Component {
    render() {
        return (
            <div className='wrapper'>
                <CommentInput name = {this.props.name}/>
                <CommentList />
            </div>
        )
    }
}
const store = createStore(commentsReducer)

export default class CommentApp extends Component {
    render() {
        const {location} = this.props
        const name = location.state.nickName
        return (
            <div>
                <Provider store={store}>
                    <Comment name = {name}/>
                </Provider>
            </div>
        )
    }
}