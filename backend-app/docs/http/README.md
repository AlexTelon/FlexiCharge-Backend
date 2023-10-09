# HTTP Team

## Definition of Done

During the fall of 2022 we used this DoD:

> 1. The code has no known defects.
> 2. Pull request review has been made and passed.
> 3. If documentation is needed then documentation should be completed.

## Swagger Docs

Swagger is used, it's important that the documentation there (live server) is correct so that any front-end teams can use the "Try It Out" functionality.

## User Pool

The project uses Amazons Cognito service for managing users. The user pool is located at Europe(Ireland)/`eu-west-1`.
There are some old, remaining groups left, but the one to use is `FlexiChargeUsers`. To make users into admins, manage the groups under **General settings** >> **Users and groups**. [Amazon Cognito user pools]('https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-dg.pdf#cognito-user-identity-pools')


Details from Cognito should be hidden from front-end teams. This means marshalling of data into our own JSON objects should occur.

## Invoices

### What we achieved
  * Invoices are manually generated from a [template javascript file](https://github.com/knowitrickard/FlexiCharge-Backend/blob/http-team-docs/backend-app/src/database-Interface/utils/invoices.js), using [pdfkit-table](https://www.npmjs.com/package/pdfkit-table).
  * The required endpoints for fetching invoices.

| Method and URI                | Description   |
| ----------------------------- | ------------- |
| `GET /invoices/users`         | Get a list of invoices for all users. Filter options: date & status   |
| `GET /invoices/users/:userID` | Get a list of invoices for a specific user. Filter options: status    |
| `GET /invoices/:invoiceID`    | Render an invoice file                                                |

  * Invoices validation and unit testInvoices documentation
  * Authorization that does not require database.

> **Note**: Only mock data has been used. You will replace the mock data with actual data from the database.

### How to proceed

  1. Once the database is ready to use, replace mock data with actual data from the database to generate invoices.
  2. Implement endpoints for creating and updating invoices. Should be straightforward if the database team adds convenient queries for creating and updating invoices.
  3. Store invoices in [AWS S3 Bucket](https://aws.amazon.com/s3/) in PDF format. Store an invoice once on creation and render the file in `GET /invoices/:invoiceID`
  4. Keep in mind that an admin should be able to modify an existing invoice. It is up to you and Knowit to decide if you want to keep the old invoice file or replace it with the modified one.

## Testing
When we got this project no tests were written. We decided to write tests for the Database Validation functions.
### Jest
  The testing framework that is used for unit testing is Jest. In order to use this framework you need to do the following:
  * Install Jest [Jest - Getting started](https://jestjs.io/docs/getting-started).
  * Run a terminal and stand in the folder **FlexiCharge-Backend/backend-app**.
  * Run the command **npm test**.

  Another way is to use the command **npm test --prefix backend-app**. This prefixes the **npm test** with a path where it should be run, you can read more about this [here](https://docs.npmjs.com/cli/v7/using-npm/config#prefix).

  ### GitHub Workflow
  A GitHub workflow is initiated when a push or pull request is made to the main branch. This runs the
  unit test suites and API tests.

## Technical Debt
* Unused user pools in AWS Cognito could be removed.
* Environment variables only needed for one user pool.
* [auth.middleware.js](https://github.com/knowitrickard/FlexiCharge-Backend/blob/main/backend-app/src/presentation-layer/middleware/auth.middleware.js#L82): Both of these setups are not required anymore, since the move to using one user pool.
### HTTP Responses
There was technical debt. Lots of responses are 400 when they instead should be 401, 404 etc. To improve the error responses we have created error classes that can be used in `database-interface` layer. For now they are used in invoices interface, but should also be added to the rest.
