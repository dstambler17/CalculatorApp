({
    scriptsLoaded : function(component, event, helper) {
		console.log('javaScript files loaded successful'); 
	},
    
	addButton : function(component, event, helper) {
		var clickedButton = event.getSource();
        var operand = clickedButton.get("v.label");
        
        //Call function to deal with what parenthesis should be used
        helper.setParBoolean(component, operand);
        
        //sets the button label
        var valString = component.get("v.inputVals");
        component.set("v.inputVals", valString.concat(operand))
        
        if (operand === "+/-"){
            helper.setPlusMinus(component, valString);
        }
        
        if (operand === "%"){
            helper.setPercent(component, valString);
        }
        
        if (operand === "()"){
            helper.setPar(component, valString);
        }
       
	},
    
    clear : function(component, event, helper) {
        component.set("v.inputVals", "");
        component.set("v.Result", 0);
        component.set("v.charBeforeParen", true);
        component.set("v.numOpenParen", 0);
       
    },
    
    
    computeCalculation : function(component, event, helper) {
        //Computes calculation and saves history
        var inputs = component.get("v.inputVals");
    	
        //check that inputs are valid
        if (!(helper.checkValidity(inputs))){
        	window.alert("Error! Invalid Inputs");   
        } else {
        	
            //COMPUTATION HELPER FUNCTION WOULD GO HERE
        	//var equals = helper.computeValue(inputs);
            var equals = eval(inputs);
            component.set("v.inputVals", equals.toString());
        
        
        	//Now set history 
        	var result = component.get("v.inputVals");
            
        	component.set("v.newHist.formula__c", inputs);
			component.set("v.newHist.result__c", result);
        
       		//insert history
        	var newHist = component.get("v.newHist");
        	helper.createHist(component, newHist);
        }
    },
    
    
    doInit: function(component, event, helper) {
        
        // Create the action by calling the backend function
        var action = component.get("c.getHistory");
        
        // Add callback behavior for when response is received
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                //window.alert("Success!");
               	component.set("v.hists", response.getReturnValue());
            }
            else {
                console.log("Failed with state: " + state);
            }
        });
        // Send action off to be executed
        $A.enqueueAction(action);
    },
    
    clearHistory : function(component, event, helper){
        var action = component.get("c.removeHistory");
         action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                window.alert("Successfully Removed all history!");
               	component.set("v.hists", response.getReturnValue());
            }
            else {
                console.log("Failed with state: " + state);
            }
        });
        // Send action off to be executed
        $A.enqueueAction(action);
    },
})