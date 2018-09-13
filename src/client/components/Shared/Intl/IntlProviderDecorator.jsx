import { IntlProvider, addLocaleData } from 'react-intl';
import React from 'react';

import zh from 'react-intl/locale-data/zh';

import MESSAGES from 'intl';

addLocaleData(zh);

function IntlProviderDecorator(target) {
    return class IntlComponent extends React.PureComponent {
        render() {
            return (
                <IntlProvider locale='zh' key='zh' messages={MESSAGES[this.props.language]}>
                    { 
                        React.createElement(target, this.props)
                    }
                </IntlProvider>
            )
        }
    }
}

export default IntlProviderDecorator;