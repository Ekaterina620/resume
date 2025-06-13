"use strict";

const display = document.getElementById('display');

const buttons = document.querySelectorAll('button');


buttons.forEach(button =>{
    button.addEventListener('click', (event) =>{
        const value = event.target.textContent;
        
        const lastChar = display.value.slice(-1); // последний символ
        
        if (display.value.length > 50){
            display.style.fontSize = "30px";
        }else if(display.value.length > 9){
            display.style.fontSize = "40px";
        }else if(display.value.length > 7){
            display.style.fontSize = "55px";
        }else{
            display.style.fontSize = "70px"
        }

        if (display.value === "0" && value != '.'){
            display.value = "";
        }
        if ((display.value === "0" || display.value === "") && "+-*/%".includes(value)){
            display.value = "0";
        }


        if(value === "+/-"){
            if(lastChar === "-"){
                return;
            }else if("+*/%".includes(lastChar)){
                display.value += "-";
            }else{
                display.value += "-"
            }
            return;
        }

        if("+-*/%.".includes(lastChar) && "+-*/%.".includes(value)){
            display.value = display.value.slice(0, -1) + value;
            return;
        }
            

        switch(value){
            case 'AC':
                display.value = "0";
                display.style.fontSize = "70px"
                break;
            case 'C':
                if(display.value.length > 1){
                    display.value = display.value.slice(0, -1);
                }else{
                    display.value = "0";
                }
                break;
            case "=":
                const expressionOutput  = document.getElementById('expressionOutput');
                expressionOutput.textContent = display.value;
                display.value = calculations();
                break;
            default:
                display.value += value;
                break;
            
        }
    })
} )

function calculations(){
    let expression = display.value.split(/([+\-/*%])/).filter(item => item !== '');;

    for (let i = 0; i < expression.length; i++){
        if (expression[i] === '-' && 
            (i === 0 || "+-*/%".includes(expression[i-1])) && 
            !isNaN(expression[i+1])) {
            expression[i+1] = '-' + expression[i+1];
            expression.splice(i, 1);
            i--;
        }
    }

    for(let i = 1; i < expression.length; i+=2){
        const operator = expression[i];

        if("/*%".includes(operator)){
            const left = parseFloat(expression[i - 1]);
            const right = parseFloat(expression[i + 1]);
            let result;

            switch(operator){
                case "*": result = left * right;
                    break;
                case "/": if (right === 0) {
                    return "деление на ноль"
                } else{
                    result = left / right ;
                }
                    break;
                case "%": result = left/100 * right;
                    break;

            }
            expression.splice(i - 1, 3, result);
            i -= 2;
        }
        
    }
    for(let i = 1; i < expression.length; i+=2){
        const operator = expression[i];
        const left = parseFloat(expression[i - 1]);
        const right = parseFloat(expression[i + 1]);
        let result;

        switch(operator){
            case "+": result = left + right;
                break;
            case "-": result = left - right ;
                break;

        }
        expression.splice(i - 1, 3, result);
        i -= 2;
    }
    return expression[0];
}