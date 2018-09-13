import * as React from 'react'
import PropTypes from 'prop-types'
import './index.less'

const treeData = [
  {
    title: '0-0',
    key: '0-0',
    children: [
      {
        title: '0-0-0',
        key: '0-0-0'
      },
      {
        title: '0-0-1',
        key: '0-0-1'
      },
      {
        title: '0-0-2',
        key: '0-0-2'
      }
    ]
  }
]
class Tree extends React.PureComponent {
  constructor(props){
    super(props)
    this.state = {
      showli:'block',
      flag:true
    }
  }
  _onChange=()=>{
    this.setState({
      flag:!this.state.flag,
      showli:this.state.flag?'none':'block'
    })
  }
  render() {
    const { style, className, data } = this.props
    const baseName = 'tree'
    return (
      <ul className={baseName}>
        {data.map((item) => {
          if (item.children) {
            return <li key={item.key} className={`${baseName}-li`} >
              <span className={`${baseName}-switcher`} onClick={this._onChange}>></span>
                {item.title}
              <ul style={{ display: `${this.state.showli}` }}>
                  {item.children.map(item => {
                    return <li key={item.key} >{item.title}</li>
                  })}
                </ul>
              </li>
          } else {
            return <li key={item.key}>{item.title}</li>
          }
        })}
      </ul>
    )
  }
}

Tree.defaultProps = {
    data:[]
}

Tree.propTypes = {
  data: PropTypes.array, //导航数组
  style: PropTypes.object, //组件内联样式
  className: PropTypes.string //组件类样式
}

export default Tree