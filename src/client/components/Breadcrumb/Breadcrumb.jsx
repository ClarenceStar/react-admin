import * as React from 'react'
import PropTypes from 'prop-types'
import BreadcrumbItem from './BreadcrumbItem'
import './index.less'

function getBreadcrumbName(route, params) {
  if (!route.breadcrumbName) {
    return null
  }
  var paramsKeys = Object.keys(params).join('|')
  var name = route.breadcrumbName.replace(
    new RegExp(':(' + paramsKeys + ')', 'g'),
    function(replacement, key) {
      return params[key] || replacement
    }
  )
  return name
}

function defaultItemRender(route, params, routes, paths) {
  var isLastItem = routes.indexOf(route) === routes.length - 1
  var name = getBreadcrumbName(route, params)
  return isLastItem
    ? <span>{name}</span>
      : <a href={'#/' + paths.join('/')}>{name}</a> 
}

class Breadcrumb extends React.PureComponent {
  render() {
    const {
      separator,
      style,
      className,
      routes,
      params,
      children,
      itemRender
    } = this.props
    var _props$itemRender = itemRender,
      _itemRender =
        _props$itemRender === undefined ? defaultItemRender : _props$itemRender
    var crumbs = null
    if (routes && routes.length > 0) {
      var paths = []
      crumbs = routes.map(function(route) {
        route.path = route.path || ''
        var path = route.path.replace(/^\//, '')
        Object.keys(params).forEach(function(key) {
          path = path.replace(':' + key, params[key])
        })
        if (path) {
          paths.push(path)
        }
        return (
          <BreadcrumbItem
            separator={separator}
            className={className}
            key={route.breadcrumbName || path}
          >
            {_itemRender(route, params, routes, paths)}
          </BreadcrumbItem>
        )
      })
    } else if (children) {
      crumbs = React.Children.map(children, function(element, index) {
        if (!element) {
          return element
        }
        return React.cloneElement(element, {
          separator: separator,
          key: index
        })
      })
    }
    return (
      <div className='breadcrumb' style={style}>
        {crumbs}
      </div>
    )
  }
}
Breadcrumb.defaultProps = {
  separator: '/'
}
Breadcrumb.propTypes = {
  separator: PropTypes.node,
  routes: PropTypes.array,
  params: PropTypes.object
}

export default Breadcrumb
