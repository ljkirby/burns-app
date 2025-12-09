# Plan 

## First prompt:

Use react native to create a mobile phone mockup of screen where there is a place to take and upload multiple photos (title = AI Analysis). the bottom nav bar layout should have a camera icon (corresponding to the current screen of the mockup), a symbol for a calculator, and a symbol for a flowchart or protocol. 

On the camera screen, there should be instructions that tell the user to take or upload multiple photos of a burn or frostbite injury. There should be an "Analyze" button on the screen that, when pressed, should lead to some sort of spinner icon or progress bar for a few seconds, then the user should see a popup with a bunch of estimates: 

- Image quality for analysis: 10/10 (should be green)
- Total Burn Surface Area: 25% (should be bolded red)
- Burn depth: Full thickness (should be bolded red)

In the popup, there should also be a red alert somewhere that tells the user that this is a "critical burn" that needs to be transfered to a higher level burn center. This popup should give the user the option to save the popup to photos or to share the popup. the popup should have the time of day at which analysis began. When the user quits out of the popup, it should ask the user to confirm that they want to close the popup and warn the user that all photos will be deleted. if the user confirms, it should clear the photos. 
