const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Fumec Hub API',
            version: '1.0.0',
            description: 'API do Fumec Hub'
        }
    },
    apis: [`${__dirname}/Routes/*.js`]
};

const swaggerSpec = swaggerJSDoc(options);
console.log(swaggerSpec.paths);

module.exports = swaggerSpec;