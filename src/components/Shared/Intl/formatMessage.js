import IntlMessageFormat from 'intl-messageformat';

import { defaultLanguage } from 'constants/config'

import MESSAGES from 'intl';

export default function(id, defaultMessage, options) {
    const lan = sessionStorage.getItem('language') || defaultLanguage;
    let msg = MESSAGES[lan][id];
    if(!msg) msg = defaultMessage || id;

    if(options) {
        msg = new IntlMessageFormat(msg, lan);
        return msg.format(options);
    }

    return msg;
}