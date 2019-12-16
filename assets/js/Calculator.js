$("button[value='pi']").val(Math.PI);
$("button[value='exp']").val(Math.E);

var mode = "rad";
var statementString = "";
var statementStringClone = "";
var e = /^[\+\-]?(\(?[\+\-]?[0-9]+\.?[0-9]*\)?[\+\-\*\/\%\^√])*(\(?[\+\-]?[0-9]+\.?[0-9]*)\)?$/; //Regular expression for arithmetic expression

$("button").click(function(){
	$(this).blur();
});

$("button#normal").addClass("modeSelected");

$("button#scientific").click(function(){
	$("#scientificCalculator").css("display", "block");
	$("#normalCalculator").css("display", "none");
	$(this).addClass("modeSelected");
	$("button#normal").removeClass("modeSelected");
});

$("button#normal").click(function(){
	$("#scientificCalculator").css("display", "none");
	$("#normalCalculator").css("display", "block");
	$(this).addClass("modeSelected");
	$("button#scientific").removeClass("modeSelected");
});

$("button#shift").click(function(){
	if($(".mainButton").css("display") === "none"){
		$(".shiftButton").css("display", "none");
		$(".mainButton").css("display", "inline-block");
	}
	else{
		$(".mainButton").css("display", "none");
		$(".shiftButton").css("display", "inline-block");
	}
});

$("button#rad").addClass("switchesSelected");

$("button#deg").click(function(){
	if(mode === "rad")
		mode = "deg";
	$(this).addClass("switchesSelected");
	$("button#rad").removeClass("switchesSelected");
});

$("button#rad").click(function(){
	if(mode === "deg")
		mode = "rad";
	$(this).addClass("switchesSelected");
	$("button#deg").removeClass("switchesSelected");
});

$(".screen").on("change", function(){
	statementString = $(this).val();
});

$(".screen").on("keypress", function(event){
	if(event.which === 13){
		statementString = $(this).val();
		printResult();
	}
});

function evaluate(expr){
	expr = expr.toString();
	try{ //User input = expected errors
		if(expr === "")
			throw new Exception();
		else if(expr.search(/\^/) === -1 && expr.search(/\√/) === -1){
			return eval(expr);
		}
		else if (expr.search(/\^/) !== -1){
	 		var subExpr = expr.split("^");
			var resultExpr = subExpr[0];
			var rootExpression;
			var rootExpressionEnd;
			var remainingExpression;
			var lastResult = "";
			var returnValue;
			if(subExpr[0] === "" || subExpr[1] === "")
				throw new Exception();
			if(subExpr[1][0] === "("){
				rootExpression = "";
				rootExpressionEnd = false;
				remainingExpression = "";
				for(var j = 1; j < subExpr[1].length; j++){
					if(subExpr[1][j] !== ")" && rootExpressionEnd === false)
						rootExpression += subExpr[1][j];
					else{
						rootExpressionEnd = true;
						if(subExpr[1][j] !== ")")
							remainingExpression += subExpr[1][j];
					}
				}
			}
			else{
				rootExpression = "";
				rootExpressionEnd = false;
				remainingExpression = "";
				for(var j = 0; j < subExpr[1].length; j++){
					if(/[\+\-\/\*]/.test(subExpr[1][j]) === false && rootExpressionEnd === false)
						rootExpression += subExpr[1][j];
					else{
						rootExpressionEnd = true;
						remainingExpression += subExpr[1][j];
					}
				}
			}
			resultExpr = Math.pow(evaluate(resultExpr), evaluate(rootExpression));
			lastResult += resultExpr;
	 		lastResult += remainingExpression;
	 		returnValue = evaluate(lastResult);
	 		if (returnValue){
	 			return returnValue;
	 		}
	 		else{
	 			throw new Exception();
	 		}
		}
		else if (expr.search(/\√/) !== -1){
			var subExpr = expr.split("√");
			var resultExpr = subExpr[0];
			var rootExpression;
			var rootExpressionEnd;
			var remainingExpression;
			var lastResult = "";
			var returnValue;
			if(subExpr[0] === "" || subExpr[1] === "")
				throw new Exception();
			if(subExpr[1][0] === "("){
				rootExpression = "";
				rootExpressionEnd = false;
				remainingExpression = "";
				for(var j = 1; j < subExpr[1].length; j++){
					if(subExpr[1][j] !== ")" && rootExpressionEnd === false)
						rootExpression += subExpr[1][j];
					else{
						rootExpressionEnd = true;
						if(subExpr[1][j] !== ")")
							remainingExpression += subExpr[1][j];
					}
				}
			}
			else{
				rootExpression = subExpr[1][0];
				rootExpressionEnd = false;
				remainingExpression = "";
				for(var j = 1; j < subExpr[1].length; j++){
					if(/[\+\-\/\*]/.test(subExpr[1][j]) === false && rootExpressionEnd === false)
						rootExpression += subExpr[1][j];
					else{
						rootExpressionEnd = true;
						remainingExpression += subExpr[1][j];
					}
				}
			}
			resultExpr = Math.pow(evaluate(rootExpression), 1/evaluate(resultExpr));
			lastResult += resultExpr;
	 		lastResult += remainingExpression;
	 		returnValue = evaluate(lastResult);
	 		if (returnValue){
	 			return returnValue;
	 		}
	 		else{
	 			throw new Exception();
	 		}
	 	}
	}
	catch{
		alert("Error!");
		resetExp();
		return "";
	}
}

function mathOp(operation){ //DRY code
	if(e.test(statementString) === false){ //Testing with a regular expression to avoid bad eval() uses
			alert("Error!");
			resetExp();
		}
	else{
		try{ //User input = expected errors
			statementStringClone = statementString;
			statementString = eval(operation);
			printExp();
		}
		catch{
			alert("Error!");
			resetExp();
		}
	}		
}

function power_root(){
	if(e.test(statementString) === false){ //Testing with a regular expression to avoid bad eval() uses
			alert("Error!");
			resetExp();
		}
	else{
		try{ //User input = expected errors
			if(statementString !== "")
				statementStringClone = statementString;
			var operator = statementString[statementString.length-1];
			if(/[\+\-\/\*]/.test(operator)){
				statementString = statementString.substr(0, statementString.length-1);
				statementString = evaluate(statementString);
				statementString += operator;
			}
			else{
				statementString = evaluate(statementString);
			}
			if(statementString !== ""){
				printExp();
				updateExp();
			}
		}
		catch{
			alert("Error!");
			resetExp();
		}
	}	
}

function factorial(x){
	if ((x === 0)||(x === 1)){
		return 1;
	}
	return (x*factorial(x-1));
}

function printResult(){
	if(e.test(statementString) === false){ //Testing with a regular expression to avoid bad eval() uses
			alert("Error!");
			resetExp();
		}
	else{
		try{ //User input = expected errors
			if(statementString !== "")
				statementStringClone = statementString;
			statementString = "" + evaluate(statementString) + "";
			printExp();
		}
		catch{
			alert("Error!");
			resetExp();
		}
	}
}

function printExp(){
	$(".screen").val(statementString); 
}

function resetExp(){
	statementString = "";
	printExp();
}

function deleteExp(){
	statementString = statementString.substr(0, statementString.length - 1);
	printExp();
}

function updateExp(){
	statementString += value;
	printExp();	
}

$("button").on("click", function(){
	value = $(this).val();
	switch (value) {
		//Normal
		case "=": 
			printResult();
		break;	

		case "reset": 
			if(statementString !== "")
				statementStringClone = statementString;
			resetExp();
		break;

		case "delete": 
			deleteExp();
		break;

		//Scientific
		case "factorial":
			mathOp("factorial(evaluate(statementString))");
		break;

		case "ans":
			statementString = statementStringClone;
			printExp();
		break;

		case "sine":
			if(mode === "deg")
				mathOp("Math.sin(evaluate(statementString)*Math.PI/180.toFixed(3))");
			else
				mathOp("Math.sin(evaluate(statementString)).toFixed(3)");
		break;

		case "cosine":
			if(mode === "deg")
				mathOp("Math.cos(evaluate(statementString)*Math.PI/180).toFixed(3)");
			else
				mathOp("Math.cos(evaluate(statementString)).toFixed(3)");
		break;

		case "tangent":
			if(mode === "deg")
				mathOp("Math.tan(evaluate(statementString)*Math.PI/180).toFixed(3)");
			else
				mathOp("Math.tan(evaluate(statementString)).toFixed(3)");
		break;

		case "asine":
			if(mode === "deg")
				mathOp("Math.asin(evaluate(statementString))*180/Math.PI");
			else
				mathOp("Math.asin(evaluate(statementString))");
		break;

		case "acosine":
			if(mode === "deg")
				mathOp("Math.acos(evaluate(statementString))*180/Math.PI");
			else
				mathOp("Math.acos(evaluate(statementString))");
		break;

		case "atangent":
			if(mode === "deg")
				mathOp("Math.atan(evaluate(statementString))*180/Math.PI");
			else
				mathOp("Math.atan(evaluate(statementString))");
		break;

		case "logarithmN":
			mathOp("Math.log(evaluate(statementString))");
		break;

		case "logarithmD":
			mathOp("Math.log10(evaluate(statementString))");
		break;

		case "exponential":
			mathOp("Math.exp(evaluate(statementString))");
		break;

		case "power10":
			mathOp("Math.pow(10, evaluate(statementString))");
		break;

		case "√":
			power_root();
		break;

		case "^":
			power_root();
		break; 

		case "inverse":
			mathOp("1/(evaluate(statementString))");
		break;

		case "square":
			mathOp("Math.pow(evaluate(statementString), 2)");
		break;

		case "cube":
			mathOp("Math.pow(evaluate(statementString), 3)");
		break;

		case "squareRoot":
			mathOp("Math.sqrt(evaluate(statementString))");
		break;

		case "cubicRoot":
			mathOp("Math.cbrt(evaluate(statementString))");
		break;

		case "absolute":
		 	mathOp("Math.abs(evaluate(statementString))");
		break;

		default: 
			updateExp();
	}
});

