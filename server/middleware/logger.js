const morgan = require('morgan');

// Use 'dev' format for concise colored output during development
// Other formats: 'combined' (Apache standard), 'common', 'short', 'tiny'
const logger = morgan('dev');

module.exports = logger; 