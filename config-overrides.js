const { override, useBabelRc } = require('customize-cra');

// const ignoreWarnings = (value) => (config) => {
//     config.ignoreWarnings = value;
//     return config;
// };

module.exports = override(
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useBabelRc(),
);

//module.exports = override(ignoreWarnings([/Failed to parse source map/]));
