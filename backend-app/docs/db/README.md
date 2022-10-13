# Database Documentation

## Refactored code population
- Current Branch
  - Name: "refactoring-database-structure"
  - Link: [Branch](https://github.com/knowitrickard/FlexiCharge-Backend/tree/refactoring-database-structure)
  - [Backup](https://drive.google.com/file/d/1vm7twjAbsH5IfoGC4jhBCl5c9mu51Erz/view?usp=sharing)
  - ![Branch](https://img.shields.io/github/last-commit/knowitrickard/FlexiCharge-Backend/refactoring-database-structure?style=for-the-badge) 


- **Documentation of most important parts** "Might not be available from main-branch"
    - Data Access Layer
      - 📚 [_Payment-methods_](../../src/data-access-layer/payment-methods/README.md)
    - Database Interface
      - 📚 [_Interfaces_](../../src/database-Interface/README.md)
      - 📚 [_Tests_](../../src/database-Interface/tests/README.md)


- **Database population**
    - Amazon Relational Database Service (RDS) :rage:
      - The database is stored on a server provided by Amazon in a service called RDS.
      - Can be used to update the PostgreSQL version.
      - Better do not touch anything before reading the official documentation on it.
      - Dockers/local
        - The database that gets created when deploying the project on EC2 is not used.
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
            var sequelize = new Sequelize('postgres', 'postgres', 'postgres', {
            host: 'flexicharge.cqjgliexpw2a.eu-west-1.rds.amazonaws.com',
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

## "postgres" vs "postgresNew"
- **Main differences**
    - ERD comparison
    ![_ERD-Comparison_](images/erd_comparison.png)
    - **"Old code" limitations**
      - The Klarna payment method was a part of the transaction interface.
      - Difficult to implement new features/payment methods.
      - Metrics had to be separated from transactions.
      - Payment details had to be separated from transactions.
      - No separation of concerns.
      - D.R.Y. violated.
      - etc......
    - "New code" improvements
      - can be accessed right now by specifying "postgresNew" instead of "postgres" as a name of db in db.js.
        - it is also up and running on RDS parallel with the old db.
      - totally reworked tables
      - Separated the payments from transactions.
      - Old "Transactions" were splitted into "ChargingSessions" and "Transactions".
      - Table with the prices.
      - Overall the structure allows to simply add new functionality/tables without the need of refactoring anything.

## What is done in "New code"
- **Basic Test data**
- **Unit Tests**
- **Some "Sceleton code" for the invoices**

## Bugs 🐞
- **_Nothing yet!_**

## [🔨What's next🔨](https://www.youtube.com/watch?v=dQw4w9WgXcQ) - Backlog for the Product Owner
- Be done with implementing the interface for the invoices.
- Merge the branch to main
  - When all team are ready.
  - Prepare to fight.
  - When the transition to using the new interfaces is done:
    - remove all old dependencies in index.js
    - remove the code marked as "old" in db.js
    - remove all old interfaces and repositories.
    - remove the "new" prefix in the new ones.
- Test data for the NewPostgres
- Update Swagger Documentation
  - The default test date is not everywhere correct. Double check with the ERD.


## Usefull links 🔗
- 1
- 2
- 3


### [🔙 Back To Main Documentation](../../../README.md)