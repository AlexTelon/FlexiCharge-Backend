# Database Documentation

- **Documentation of most important parts** "Might not be available from main-branch"
    - Data Access Layer
      - 📚 [_Payment-methods_](../../src/data-access-layer/payment-methods/README.md)
    - Database Interface
      - 📚 [_Interfaces_](../../src/database-Interface/README.md)
      - 📚 [_Tests_](../../src/database-Interface/tests/README.md)


- **Database population**
    - Amazon Relational Database Service (RDS) :rage:
      - The database should be stored on a server provided by Amazon in a service called RDS.
      - Can be used to update the PostgreSQL version.
      - NOTE: Due to some problems while creating a new database on RDS that could not be resolved in time, it is currently not in use.
        - Instead the database that gets created when deploying the project on EC2 is currently being used.
      - Better to not touch anything before reading the official documentation on it.
    - Local
      - To access the local database:
        ```
      - Host: 127.0.0.1
      - Port: 5432
      - Username: postgres
      - Password: abc123
      - .env file
          - USE_LOCAL_DATABASE=1
        ```
    - Cognito
      - Read about User Pools in [HTTP teams documentation](../http/README.md) since the implementation can be changed.


- **Connection to database**
    - [_db.js_](../../src/data-access-layer/db.js)
      - ORM
        - Implemented with Sequelize+PostgreSQL.
        - Creates the table if they do not exist.
        - Fills the db with data if empty.
        - Connects to the database host.
           ```JS
           if(config.USE_LOCAL_DATABASE == 1) {
            var sequelize = new Sequelize('postgres://postgres:abc123@postgre_db:5432/postgredb')
           } else {
            var sequelize = new Sequelize(config.DATABASE_NAME, config.DATABASE_USERNAME, config.DATABASE_PASSWORD, {
                host: config.DATABASE_HOST,
                dialect: "postgres"
            });
           }
           ```
    - .env - variable
      - `config.USE_LOCAL_DATABASE == 1` - 1 for local, 0 for RDS.

- **pgAdminTool** :heart_eyes: - Your Best Friend
    - Used to access the database
      - Use the credentials provided in the **Database Population** section.
    - Use for backing up the database.
    - Use for restoring the database.
    - Use for creating ERDs.
    - Use for updating the database by uploading a new version of it by copying the local one.

## Bugs 🐞
- **_Nothing yet!_**

## Technical Debt 🐞
- Repositories are mocked manually, meaning if repositories are changed, their mock also has to be manually changed.

## [🔨What's next🔨](https://www.youtube.com/watch?v=dQw4w9WgXcQ) - Backlog for the Product Owner
- Get the RDS database connection to work properly.
- Implement a proper interface for the invoices.
- Decide how charger status should be stored, strings(current) or integers. Decide which possible values a status can have.
  - Currently newly created chargers have the status "Reserved" and are not immediately "Available"
- Implement an interface for RFID.
  - Users should be able to have an RFID tag tied to their account.


## Usefull links 🔗
- [**pgAdmin**](https://www.pgadmin.org/docs/pgadmin4/latest/index.html)
- [**KlarnaAPI**](https://docs.klarna.com/klarna-payments/integrate-with-klarna-payments/)
- [**RDS**](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html)
- [**Sequelize-ORM**](https://sequelize.org/docs/v6/getting-started/)

### [🔙 Back To Main Documentation](../../../README.md)
