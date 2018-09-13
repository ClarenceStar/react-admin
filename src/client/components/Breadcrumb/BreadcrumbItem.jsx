import * as React from 'react'
import PropTypes from 'prop-types'
import './index.less'
class BreadcrumbItem extends React.PureComponent {
  render() {
    const { separator, children, style } = this.props
    const baseName = 'breadcrumb'
    var link
    if ('href' in this.props) {
      link = <a className={`${baseName}-a`}>{children}</a>
    } else {
      link = <span className={`${baseName}-link`}>{children}</span>
    }
    if (children) {
      return (
        <span style={style}>
          {link}
          <span className={`${baseName}-separator`}>{separator}</span>
        </span>
      )
    } else {
      return null
    }
  }
}

BreadcrumbItem.defaultProps = {
  separator: '/'
}

BreadcrumbItem.propTypes = {
  separator: PropTypes.string,
  style: PropTypes.object,
  href: PropTypes.string
}

export default BreadcrumbItem
