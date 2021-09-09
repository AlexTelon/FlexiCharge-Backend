const awilix = require('awilix')

const container = awilix.createContainer()

container.register({
    dataAccessLayerDatabase: awilix.asFunction(require('./data-access-layer/charger-repository')),
    businessLogicDatabase: awilix.asFunction(require('./business-logic-layer/business-logic-database')),
    databaseTestPresentation: awilix.asFunction(require('./presentation-layer/database-test')),
    databaseInit: awilix.asFunction(require('./data-access-layer/db')),

    app: awilix.asFunction(require('./presentation-layer/app'))
})

const app = container.resolve("app")

app.listen(8080)