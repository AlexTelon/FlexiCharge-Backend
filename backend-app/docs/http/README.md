
# HTTP Team

## Definition of Done

During the fall of 2022 we used this DoD:

> 1. Overall code coverage should be as much as possible.
> 2. Every pull request should pass all the written tests.
> 3. Every push should have some integration testing. This means that everything that's pushed doesn't change any interactions with other squads.
> 4. Provide the necessary documentation so the future project workers have an easier time getting in the project.
> 5. Peer review each others code so it's clear what has been written and everyone can understand what the changes are about. 

## Swagger Docs

We use swagger to look at the API. This is an easy tool to check all endpoints paths and check what they receive and what should be sent through the endpoint.

Check the documentation here [Swagger doc](http://ec2-18-202-253-30.eu-west-1.compute.amazonaws.com:8080/).

1. To use the the login locked endpoints in swagger you first need to [sign-in](http://ec2-18-202-253-30.eu-west-1.compute.amazonaws.com:8080/swagger/#/User/post_auth_sign_in) to an existing user. You'll get a bearertoken response that is useable for 1 hour. 

2. The bearertoken is stored in the accessToken variable and should look something like this```
```json
eyJraWQiOiJLNlZ1Q1dNNlZONktwSVlGZUdjR1dwNUkzNm9ieFJyRmRYcGlpcXZaTktvPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI1ZjI4OWY5Zi0zZGViLTQ3NzAtYmMwYS1iNjAyYTBkZDkzODUiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0xLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtMV9LbHI1ZG4zVloiLCJjbGllbnRfaWQiOiJxOGE5NjBwMG44ZjBxcWFpcnJiZmJxNHZuIiwib3JpZ2luX2p0aSI6IjFlMzZmZGQ4LWRiYmEtNDZlZS05ZTQ4LTk1YmY0ZTViOWE3ZSIsImV2ZW50X2lkIjoiYjQ2N2Y3YTQtMjg3MS00NjllLWFiODUtYTAyNjUxOGE5NDE3IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTY5NzAyMzc1NywiZXhwIjoxNjk3MDI3MzU2LCJpYXQiOjE2OTcwMjM3NTcsImp0aSI6IjE1ZGYxMjhlLTgxMTctNDdkMy1hYjVjLTU0YWZiMmViZjk1NCIsInVzZXJuYW1lIjoiNWYyODlmOWYtM2RlYi00NzcwLWJjMGEtYjYwMmEwZGQ5Mzg1In0.W7psSLKc8NzGduvYtmQ2alqRmjkyjIvhmRjDa9EKlPOoX5C4lv0MaP-0XXcNS1Hr2jfSNKqoCquemiZu5PyANYBHPlZBCaAM4ekHeI7W3CQQZlc4fAlu7Ax-FObx4AZc94ZGL_1aWDX-I4iQWE8NdB5YoQWj9IMVc2bQP-akvNpRpm2FObKntxVzArffakJHHWjA-OZF31FKe4pJFwS2TbR5DUpT-RWDT0Yd8gMJ026FpGWFKxE0RYuA4uTfMCVI1U6Gtcxa5pU_J3SYzSlpbFSdlomR957y7ss5f0yT19lSshOaWHlacnTsnNdxYT6OeQYjoHw6WTcGP24yKlAwhQ
```

3. Paste the token in the authorize at the top right of the documentation.
![[Pasted image 20231011131614.png]]
![[Pasted image 20231011133134.png]]

4. Now you should be able to use all the locked endpoints.

## User Pool

The project uses Amazons Cognito service for managing users. The user pool is located at Europe(Ireland)/`eu-west-1`.
There is only 1 user pool left for all users, this includes normal users and admins.
[Amazon Cognito user pools]('https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-dg.pdf#cognito-user-identity-pools')

Details from Cognito should be hidden from front-end teams. This means marshalling of data into our own JSON objects should occur.

## Invoices

These are still not implemented but the paths that should be used are already in the swagger documentation

  * The required endpoints for fetching invoices.

| Method and URI                | Description   |
| ----------------------------- | ------------- |
| `GET /invoices/users`         | Get a list of invoices for all users. Filter options: date & status   |
| `GET /invoices/users/{userID}` | Get a list of invoices for a specific user. Filter options: status    |
| `GET /invoices/{invoiceID}`    | Render an invoice file                                                |

  * Invoices validation and unit testInvoices documentation
  * Authorization that does not require database.

> **Note**: Only mock data has been used. You will replace the mock data with actual data from the database.

### How to proceed

  1. Implement endpoints for updating invoices. Should be straightforward if the database team adds convenient queries for creating and updating invoices.
  2. Store invoices in [AWS S3 Bucket](https://aws.amazon.com/s3/) in PDF format. Store an invoice once on creation and render the file in `GET /invoices/{invoiceID}`
  3. Keep in mind that an admin should be able to modify an existing invoice. It is up to you and Knowit to decide if you want to keep the old invoice file or replace it with the modified one.

## Testing
All the endpoint tests are written. They are stored separately in each file for the enpoint.
For example `users.test.js` is used to test the user endpoints.
### Jest
  The testing framework that is used for unit testing is Jest. In order to use this framework you need to do the following:
  * Install Jest [Jest - Getting started](https://jestjs.io/docs/getting-started). (npm i jest)
  * Run a terminal and stand in the folder **FlexiCharge-Backend/backend-app**.
  * Run the command **npm test**.

  Another way is to use the command **npm test --prefix backend-app**. This prefixes the **npm test** with a path where it should be run, you can read more about this [here](https://docs.npmjs.com/cli/v7/using-npm/config#prefix).

  ### GitHub Workflow
  A GitHub workflow is initiated when a push or pull request is made to the main branch. This runs the unit test suites and API tests.

## Technical Debt
* [auth.middleware.js](https://github.com/knowitrickard/FlexiCharge-Backend/blob/main/backend-app/src/presentation-layer/middleware/auth.middleware.js#L82): is used to encrypt user passwords and check whether they are normal users or admins.
### HTTP Responses
All HTTP responses are documented in the swagger documentation using references made in as a component to all the different responses possible. 

There is no component for a successful response because each endpoint has a different successful response.

An example of these response are `$ref: '#/components/responses/NotFound'`. 
