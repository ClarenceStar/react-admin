import * as React from 'react'
import PropTypes from 'prop-types'
import './index.less'
import { Link } from 'react-router-dom'

class Bread extends React.PureComponent {
  render() {
    const { separator, style, className, routes } = this.props
    const baseName = 'breadcrumb'
    return (
      <div className={baseName}>
        {routes.map((route, i) => {
          return (
            <span style={style} className={className} key={i}>
              <Link to={route.link}>
                <span className={`${baseName}-a`}>{route.name}</span>
              </Link>
              <span className={`${baseName}-separator`}>{separator}</span>
            </span>
          )
        })}
      </div>
    )
  }
}

Bread.defaultProps = {
  separator: '/',
  routes: [],
}
Bread.propTypes = {
  separator: PropTypes.node, //导航分隔符
  routes: PropTypes.array, //路由数组
  style: PropTypes.object, //路由内联样式
  className: PropTypes.string //路由类样式
}

export default Bread
