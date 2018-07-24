import React from 'react'
import ReactDOM from 'react-dom'
import './index.less'

import router from './router'

ReactDOM.render(
    <div>
        {router}
    </div>,
    document.getElementById('root')
)