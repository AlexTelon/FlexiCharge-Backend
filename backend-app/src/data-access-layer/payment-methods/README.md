
# Payment-Methods

  

### Current Payment Methods
1. Klarna

## Klarna
- Klarna is currently the only implmented payment method available to FlexiCharge.
- Below is a an image showing how Klarna is implemented in the backend.
	
<img src="https://i.ibb.co/c3PxCMW/image.png" height="500" width="800" >

### authorization_token
authorization_token can only be accessed via the Klarna Widget (Postman requests can **NOT** get authorization_token back in responses, **ONLY** the Klarna widget).

- authorization_token is a **completely** different token from session_id and client_token, and should only live inside the client side (should not be stored on the backend).

- More information regarding **how to get authorization token** can be found here(Step 1 -> 3 under “Integrate with Klarna Payment” are important): [https://docs.klarna.com/klarna-payments/integrate-with-klarna-payments/](https://docs.klarna.com/klarna-payments/integrate-with-klarna-payments/)

### new-klarna-repository vs new-klarna-payments-repository.js
<img name="architecture" src="https://i.ibb.co/tMKmPX8/image.png" height="400" width="600"> 

### How to add payment methods
In the event that a new payment method is to be added to FlexiCharge, we strongly advise following the architecture structure <a href="#architecture">shown above</a>.

Below is an example of implementing Swish as a new payment method:
 1. Create a new SwishPayments table, which holds Swish related information, e.g "order_id" of a Swish transaction, or perhaps the "user_id" of the Swish user (This all depends on how how Swish's API is built). 
 2. Create a .js file inside the "/payment-methods/" folder that handles all Swish API calls.
 3. Create a repository file inside "/data-access-layer/" folder communicates with the new SwishPayments table.
 4. Create a interface file inside the "/interfaces/".

### What is done and what is not done

To implement:

1. What if Klarna is not available

    - Double check with PM for requirements

  

###[🔙 Main Database Documentation](../README.md)

###[🔙🔙 Back To Main Documentation](../../../../README.md)