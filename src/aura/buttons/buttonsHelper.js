({
	setParBoolean : function(component, operand) {
        switch(operand){
            case "+":
            case "*":
            case "-":
            case "/":
                component.set("v.charBeforeParen", true);
                break;
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
            case ".":
            case "%":
                component.set("v.charBeforeParen", false);
                break;
            default:
        }
	},
    
    setPar : function(component, valString){
        var numParen = component.get("v.numOpenParen");
        var oppEffect = component.get("v.charBeforeParen");
        if (oppEffect){
            component.set("v.inputVals", valString.concat("("));
            component.set("v.numOpenParen", (numParen + 1));
            component.set("v.charBeforeParen", false);
            
        } else{
        	if (numParen == 0){
            	component.set("v.inputVals", valString.concat("*("));
            	component.set("v.numOpenParen", (numParen + 1));
                
        	} else if (!oppEffect && numParen > 0){
            	component.set("v.inputVals", valString.concat(")"));
            	component.set("v.numOpenParen", (numParen - 1));
        	}
        }
        
    },
    
    setPlusMinus : function(component, valString) {
    	var index = valString.length - 1;
        
        do {
            var ch = valString.charAt(index);
            if (ch == "+" || ch == "*" || ch == "/" || ch == "-"){
                break;
            }
            index--;
        }while (index >= 0)
        
		var beforeNegation = valString.slice(0, index);
        var negationPart = valString.slice((index + 1), valString.length);
        //component.set("v.inputVals", index)
        if(index == -1){
            component.set("v.inputVals", ("(-" + negationPart + ")"))
        }
        else{
            var finalString = beforeNegation + valString.charAt(index) + "(-" + negationPart + ")";
        	component.set("v.inputVals", finalString);
        }  
        
	},
    
    setPercent : function(component, valString) {
    	//incase NaN
        var prior = valString;
       
        var index = valString.length - 1;
    	do {
            var ch = valString.charAt(index);
            if (ch == "+" || ch == "*" || ch == "/" || ch == "-" || ch == "("){
                break;
            }
            index--;
        }while (index >= 0)
        
        //Extract and convert
        var beforePercent = valString.slice(0, index);
        var percentPart = valString.slice((index + 1), valString.length);
        
        //convert to percent
       	var divisor = 100
        var toDec = (eval(percentPart) / divisor);

        //check if nan and set alert
        if (isNaN(toDec)){
            window.alert("Error. Bad percent");
            component.set("v.inputVals", prior);
            return
        }
        
        //sets value
        if(index == -1){
            component.set("v.inputVals", ("" + toDec))
        } else{
            var finalString = beforePercent + valString.charAt(index) + '' + toDec;
        	component.set("v.inputVals", finalString);
        }
        
        
    },
    
    createHist: function(component, history) {
        var action = component.get("c.saveHistory");
        action.setParams({
            "hist": history
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                var histories = component.get("v.hists");
                histories.push(response.getReturnValue()); 
                component.set("v.hists", histories);
                
            }
        });
        $A.enqueueAction(action);
    },
    
    isValidOperator : function(symb){
        switch(symb){
            case "+":
            case "*":
            case "-":
            case "/":
            case ".":
            case "%":
            case "(":
            case ")":
                return true;
                break;
            default:
                return false;
        }
    },
    
    checkValidity: function(inputVal) {
        var len = inputVal.length
        //first check that all chars are valid
        for (var i = 0; i < len; i++) {
            var ch = inputVal.charAt(i);
            if (isNaN(parseInt(ch)) && (!(this.isValidOperator(ch))) && ch != " "){
            	return false;
            }
        }
        //next check that there are no operators together (except pars)
        for (var j = 0; j < len - 1; j++) {
            var ch = inputVal.charAt(j);
            var nextChar = inputVal.charAt(j+1)
            if (this.isValidOperator(ch) && (ch != "(" && ch != ")" && nextChar !="(" && nextChar !=")") && this.isValidOperator(nextChar)){
                return false;
            }
        }
        return true;
    },
    
    doOperation: function(one, two, opp) {
        var oneVal = parseInt(one);
    	var twoVal = parseInt(two);
        var result = 0;
        switch(opp){
            case("+"):
                result = oneVal + twoVal;
                break;
            case("-"):
                result = oneVal - twoVal;
                break;
            case("*"):
                result = oneVal * twoVal;
                break;
            case("/"):
                result = oneVal / twoVal;
                break;
            default:
        }
        return result;
    },
    
    
    
    //This function is not used
    computeValue: function(inputVal) {
        
        if (inputVal.length == 0) {
            return 0;
        }
         if (!isNaN(inputVal)) {
            return parseInt(inputVal);
        }
        var opps = inputVal.match(/[+*\/-]/g);
        var nums =  inputVal.match(/\d{1,}/g);
        var oppSize = opps.length;
        
        
        for(var i = 0; i < oppSize; i++){
            if (opps[i] == "*" || opps[i] == "/"){
                var res = this.doOperation(nums[i], nums[i +1], opps[i]);
                nums.splice(i, 2);
                //Need to look more into regex
                nums.splice(i+2, 0, String(res)); //something is wrong with this statement
                
            }
        }
        
         for(var j = 0; j < oppSize; j++){
            if (opps[j] == "+" || opps[j] == "-"){
                var ex = this.doOperation(nums[j], nums[j +1], opps[j]);
                nums.splice(j, 2);
                nums.splice(j+2, 0, String(ex)); //something is wrong with this statement
                
            }
        }
        return parseInt(nums[0]);
      
    },
    
    
})