const awilix = require('awilix')

const container = awilix.createContainer()

container.register({
    dataAccessLayerDatabase: awilix.asFunction(require('./data-access-layer/data-access-database')),
    businessLogicDatabase: awilix.asFunction(require('./business-logic-layer/business-logic-database')),
    databaseTestPresentation: awilix.asFunction(require('./presentation-layer/database-test')),

    app: awilix.asFunction(require('./presentation-layer/app'))
})

const app = container.resolve("app")

app.listen(8080)