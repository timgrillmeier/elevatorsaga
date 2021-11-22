{
    init: function(elevators, floors) {
        let orders = []; // [[[floor,direction,orderCount]]]  // DO NOT TOUCH
        let destinations = []; // DO NOT TOUCH
        
        /******* Customisation Vars *******/
        let masterLoadFactor = 0.9;
        let primeElevators = true;
        let arrayElevators = false;
        let neglectModifier = 0;
        /******* Customisation Vars *******/
        
        // var elevator = elevators[0]; // Let's use the first elevator
        for (let i = 0; i < elevators.length; i++) {
            // Define null order calls and destinations for each elevator
            orders.push([]);
            destinations.push([]);
            
            // Start all elevators to get them into the idle state
            if (primeElevators) {
                elevators[i].goToFloor(0);
            }
            
            // Prompt elevators to move to next jump upon idle
            elevators[i].on("idle", function() {
                executeNextOrder(i);
            });
            
            // Pass on elevator calls to the order system
            elevators[i].on("floor_button_pressed", function(floorNum) {
                updateDestinations(i,floorNum,-1); // -1 direction for any direction
            })
            
            // Passing floor prompt
            elevators[i].on("passing_floor", function(floorNum, direction) {
                
            });
            
            // Stopped at floor
            elevators[i].on("stopped_at_floor", function(floorNum) {
                
            });
        }

        // Loop through floors
        for (let i = 0; i < floors.length; i++) {
            // Pass on up order call
            floors[i].on("up_button_pressed", function() {
                updateCalls(i,1);
            });
            // Pass on down order call
            floors[i].on("down_button_pressed", function() {
                updateCalls(i,0);
            });
        }
        
        // Queue elevator destinations
        let updateDestinations = function(elevator, floorNum, direction) {
            let noMatch = true;
            for (let i = 0; i < destinations[elevator].length; i++) {
                if (destinations[elevator][i][0] == floorNum) {
                    destinations[elevator][i][2]++;
                    noMatch = false;
                }
            }
            if (noMatch) {
                destinations[elevator].push([floorNum,direction,1]);
            }
        }
        
        // Accept elevator index, floor index, and direction(as int), and create new order or increase priority of other order
        let updateCalls = function(floorNum, direction) {            
            let elevator = determineBestElevatorForOrder(floorNum, direction);
            
            let noMatch = true;
            for (let i = 0; i < orders[elevator].length; i++) {
                if (orders[elevator][i][0] == floorNum) {
                    if (orders[elevator][i][1] == direction) {
                        orders[elevator][i][2]++;
                        noMatch = false;
                    }
                }
            }
            if (noMatch) {
                orders[elevator].push([floorNum,direction,1]);
            }
        }
        
        let determineBestElevatorForOrder = function(floorNum, direction) {
            // Loop through elevators and get current floor number
            let matches = [];
            for (let i = 0; i < elevators.length; i++) {
                // If order direction is up (1), elevator current floor must be < order floor
                console.log(elevators[i].currentFloor());
                if (direction == 1 && elevators[i].currentFloor() < floorNum) {
                    matches.push(i);
                }
                // If order direction is down (0), elevator current floor must be > order floor
                if (direction == 0 && elevators[i].currentFloor() > floorNum) {
                    matches.push(i);
                }
            }
            
            if (matches.length == 0) {
                // Assign one at random
                console.log('random')
                let ranNo = Math.floor(Math.random() * elevators.length);
                return ranNo;
            } else if (matches.length == 1) {
                console.log('1 match');
                return matches[0];
            } else if (matches.length > 1) {
                console.log('prox match');
                let closestElevator = matches[0];
                for (let i = 1; i < matches.length; i++) {
                    // If direction is up, it's safe to assume the elevator.currentFloor is < the floorNum
                    if (direction == 1) { 
                        let proximity = floorNum - elevators[matches[i]].currentFloor();
                        if (proximity < closestElevator) {
                            closestElevator = matches[i];
                        }
                        // If direction is down, it's safe to assume the elevator.currentFloor is > the floorNum
                    } else if (direction == 0) {
                        let proximity = elevators[matches[i]].currentFloor() - floorNum;
                        if (proximity < closestElevator) {
                            closestElevator = matches[i];
                        }
                    }
                }
                return closestElevator;
            }
        }
        
        // Determine next destination for elevator
        let determineNextOrder = function(elevator) {
            let currentFloor = elevators[elevator].currentFloor();
            let highestOrderCount = 0;
            let highestOrderFloor = 0;
            if (arrayElevators) {
                highestOrderFloor = Math.floor((floors.length / elevators.length) * (elevator + 1)) - 1;
            }

            // go to most in demand floor
            for (let i = 0; i < orders[elevator].length; i++) {
                if (orders[elevator][i][0] == currentFloor) {
                    orders[elevator][i][2] = 0;
                } else {
                    orders[elevator][i][2] *= (1 + neglectModifier);
                }
                if (orders[elevator][i][2] > highestOrderCount) {
                    highestOrderFloor = orders[elevator][i][0];
                }
            }
            
            // reset destinations for currentfloor
            for (let i = 0; i < destinations[elevator].length; i++) {
                if (destinations[elevator][i][0] == currentFloor) {
                    destinations[elevator][i][2] = 0;
                } else {
                    destinations[elevator][i][2] *= (1 + neglectModifier);
                }
            }
            
            if (highestOrderFloor == currentFloor) {
                return determineNextDestination(elevator);
            } else {
                return highestOrderFloor;
            }
        }
        
        let determineNextDestination = function(elevator) {
            let currentFloor = elevators[elevator].currentFloor();
            let highestOrderCount = 0;
            let highestOrderFloor = 0;
            if (arrayElevators) {
                highestOrderFloor = Math.floor((floors.length / elevators.length) * (elevator + 1)) - 1;
            }

            // go to most in demand floor
            for (let i = 0; i < destinations[elevator].length; i++) {
                if (destinations[elevator][i][0] == currentFloor) {
                    destinations[elevator][i][2] = 0;
                } else {
                    destinations[elevator][i][2] *= (1 + neglectModifier);
                }
                if (destinations[elevator][i][2] > highestOrderCount) {
                    highestOrderFloor = destinations[elevator][i][0];
                }
            }
            
            // reset orders for currentfloor
            for (let i = 0; i < orders[elevator].length; i++) {
                if (orders[elevator][i][0] == currentFloor) {
                    orders[elevator][i][2] = 0;
                } else {
                    orders[elevator][i][2] *= (1 + neglectModifier);
                }
            }

            return highestOrderFloor;
        }
        
        // Execute next destination for elevator
        let executeNextOrder = function(elevator) {
            if (elevators[elevator].loadFactor() < masterLoadFactor) {
                let destinationFloor = determineNextOrder(elevator);

                if (destinationFloor != -1) {
                    elevators[elevator].goToFloor(destinationFloor);
                    console.log('load tolerance ok: ' + elevator)
                }
            } else {
                let destinationFloor = determineNextDestination(elevator);
                
                if (destinationFloor != -1) {
                    elevators[elevator].goToFloor(destinationFloor);
                    console.log('load tolerance exceeded: ' + elevator);
                }
            }
            
        }
        
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}
