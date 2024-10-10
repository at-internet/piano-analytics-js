import dataLayer from './ext/data-layer/data-layer';

const MAP_DL_PA = [
    ['createdAt', 'content_publication_date'],
    ['tags', 'tags_array']
];

function processContentProperties(model) {
    const content = dataLayer.get('content');
    for (const propContent in content) {
        if (Object.prototype.hasOwnProperty.call(content, propContent)) {
            // searching for a DL property name and replacing it with its PA name
            const datalayerPropFoundResult = MAP_DL_PA.find((items) => items[0] === propContent);
            const propFinalName = datalayerPropFoundResult ? datalayerPropFoundResult[1] : _camelToSnake(`content_${propContent}`);
            model.addEventsProperty(propFinalName, content[propContent]);
        }
    }
}

function initContentProperties(pa) {
    pa.setContentProperty = function (name, value) {
        // searching for a PA property name and replacing it with its DL name
        const pianoAnalyticsPropFound = MAP_DL_PA.find((items) => items[1] === name);
        dataLayer.set('content', {
            [pianoAnalyticsPropFound ? pianoAnalyticsPropFound[0] : name]: value
        });
    };
    pa.setContentProperties = function (content) {
        for (const prop in content) {
            if (Object.prototype.hasOwnProperty.call(content, prop)) {
                pa.setContentProperty(prop, content[prop]);
            }
        }
    };
}

function _camelToSnake(string) {
    return string.replace(/[\w]([A-Z])/g, function (m) {
        return m[0] + '_' + m[1];
    }).toLowerCase();
}

export {
    processContentProperties,
    initContentProperties
};
