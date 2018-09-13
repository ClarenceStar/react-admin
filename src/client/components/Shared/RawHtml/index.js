import React from 'react';

export default ({content, className}) => {
    return (
        <div className={className} dangerouslySetInnerHTML={{__html: content}}>
        </div>
    )
}