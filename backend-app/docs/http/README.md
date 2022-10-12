# HTTP Team 



## Definition of Done

During the fall of 2022 we used this DoD:

> 1. The code has no *un-documented* defects.
> 2. Pull request has been made and passed.
> 3. Has documentation, if needed. For endpoints this means Swagger.



## Swagger Docs

Other teams will constantly be harassing you. To avoid this, Swagger is used. Make sure that the documentation there (live server) is correct so that any front-end teams can use the "Try It Out" functionality.
This avoids many meeting hours.



## User Pool

The project uses Amazons Cognito service for managing users. The user pool is located at Europe(Ireland)/`eu-west-1`.
There are some old, remaining groups left, but the one to use is `FlexiChargeUsers`. To make users into admins, manage the groups under **General settings** >> **Users and groups**.

Details from Cognito should be hidden from front-end teams. This means marshalling of data into our own JSON objects should occur.



## HTTP Responses

There was technical debt. Lots of responses are 400 when they instead should be 401, 402 etc. To improve the error responses we have created error classes that can be used in `database-interface` layer. For now they are used in invoices interface, but should also be added to the rest.



## Invoices

### What we achieved
  * Invoices are manually generated from a [template javascript file](../src/database-Interface/utils/invoices.js), using [pdfkit-table](https://www.npmjs.com/package/pdfkit-table). 
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
