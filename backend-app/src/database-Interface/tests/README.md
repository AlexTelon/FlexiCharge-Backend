
# Type of Tests - Unit Testing

## Overview

 - Unit tests done on the interface(business-logic-layer) are done with **Jest**! 
  - In order to run these tests you need to:
	 1. Open the project via Ubuntu(VSCode WSL Window), this gives you access to the necessary node_modules used in the testing files (specifically awilix and Jest). How to open the VSCode WSL Window should have been shown during  the "Web Development - Advanced Concepts" course by Peter. 
	 2. Run the command: **"npm run test"**
 - All repositories are manually mocked as seen in testContainer.js, these mocks are then injected into the testContainer, which allows us to directly test the business-logic-layer.
	 - If any repositories or database tables change, you **should** update the mocked repositories. However, in the event that the mocked repositories are *not* updated, the tests should alert you about this.


## What is done and what is not done

  Tests for the following interfaces are not yet implemented:
  

 1. invoices
 2. live-metrics? (a live-metric interface may be needed for the future)

###[🔙Main Database Documentation](../../data-access-layer/README.md)

###[🔙🔙Back To Main Documentation](../../../../README.md)