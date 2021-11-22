# elevatorsaga master solution WIP
My WIP solution to [play.elevatorsaga.com](https://play.elevatorsaga.com/)

## Getting Started
Copy and paste the JavaScript code from index.js into the editor at play.elevatorsaga.com to get started using this code. 

## Customisation Vars
Update the variables near the top of the document to customise how the code will execute to overcome certain scenarios.

##### `let masterLoadFactor = 0.9;`
Requires a decimal value between 0 and 1. Weighs against the loadFactor for all elevators to determine if an elevator should ignore requests and offload passengers. A higher master load factor will result in all elevators accepting more passengers before ignoring new passenger calls to offload passengers. See `loadFactor` in elevatorsaga documentation: https://play.elevatorsaga.com/documentation.html#docs

##### `let primeElevators = true;`
Requires semantic boolean. Set to true to initialise all the elevators with a command to go to floor 0 immediately upon scenario initialisation. Set to false to not do this. This can improve responsiveness of elevators for follow up orders in certain scenarios where initial passenger requests are rapid. Do not set to true while arrayElevators is set to true.

##### `let arrayElevators = false;`
Requires semantic boolean. Set to true to spread out all elevators fairly eveningly across all floors in the scenario. Set to false to not do this. This can improve initial responsiveness in certain scenarios where initial passenger requests are spread out. Do not set to true while primeElevators is set to true.

##### `let neglectModifier = 1.5;`
WIP - Requires a decimal value between 0 and n. Takes into consideration the number of orders per floor for an elevator and multiplies the number of orders by the neglectModifier per event "visit" an elevator makes to a floor, allowing those floors with the highest demands and the longest ignored to effectively have the greatest "weight" via order numbers. A neglectModifier above 0 will result in floors with order requests greater than 0 becoming more indemand per elevator stop, effectively decreasing wait times for floors with low passenger requests.

## Development Roadmap
- [x] Build model for elevators
- [x] Build model for elevator orders
- [x] Create basic customisable variables for easy cusomisation
- [ ] Utilised the elevator direction signs for direction indication to passengers
- [ ] Factor in elevator direction with request direction before prioritising order
