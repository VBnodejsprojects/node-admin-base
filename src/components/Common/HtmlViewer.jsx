import React from 'react';

const HtmlContentViewer = (html) => {
    console.log(html)
    return (
        <div
            dangerouslySetInnerHTML={{ __html: html.html }}
        />
    );
};

export default HtmlContentViewer;