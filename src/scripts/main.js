function init() {
  const theme = document.querySelector(".js-body-theme");
  const toggleButtons = Array.from(
    document.querySelectorAll(".js-toggle-btns li input")
  );
  const numbers = Array.from(document.querySelectorAll("[data-number]"));
  const operators = Array.from(document.querySelectorAll("[data-operator]"));
  const del = document.querySelector("[data-delete]");
  const reset = document.querySelector("[data-reset]");
  const equal = document.querySelector("[data-equal]");
  const previousOperandTextElement = document.querySelector(
    "[data-previous-operand]"
  );
  const currentOperandandTextElement = document.querySelector(
    "[data-current-operand]"
  );

  const preferedTheme = window.matchMedia("(prefers-color-scheme: dark)");

  // user-agent and os theme setter procedure
  function setTheme() {
    if (preferedTheme.matches) {
      theme.setAttribute("data-theme", "default");
      document.querySelector("#theme1").checked = true;
    } else {
      theme.setAttribute("data-theme", "light");
      document.querySelector("#theme2").checked = true;
    }
  }
  // set user theme based on browser and os preference setTheme();
  // set theme when user changes browser and os theme preference
  preferedTheme.addEventListener("change", setTheme);
  //toggle functionality
  // store in local storage
  toggleButtons.forEach(function (toggleBtn) {
    toggleBtn.addEventListener("click", function (event) {
      const themeValue = event.target.dataset.theme;
      theme.setAttribute("data-theme", themeValue);
      localStorage.setItem("data-theme", themeValue);
    });
  });

  // use stored local stored theme on document load
  const storedTheme = localStorage.getItem("data-theme");
  theme.setAttribute("data-theme", storedTheme);
  document.querySelector(`input[data-theme=${storedTheme}]`).checked = true;

  // calculator functionality
  // calculator contructor function
  class Calculator {
    constructor(previousOperandTextElement, currentOperandandTextElement) {
      this.previousOperandTextElement = previousOperandTextElement;
      this.currentOperandandTextElement = currentOperandandTextElement;
      this.clear();
    }

    clear() {
      this.currentOperand = "";
      this.previousOperand = "";
      this.operation = undefined;
    }

    delete() {
      this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }
    appendNumber(number) {
      if (number === "." && this.currentOperand.toString().includes("."))
        return;
      this.currentOperand = this.currentOperand.toString() + number;
    }
    chooseOperation(operation) {
      if (this.currentOperand === "") return;
      if (this.previousOperand !== "") {
        this.compute();
      }
      this.operation = operation;
      this.previousOperand = this.currentOperand;
      this.currentOperand = "";
    }
    compute() {
      let computation;
      const prev = parseFloat(this.previousOperand);
      const current = parseFloat(this.currentOperand);

      if (isNaN(prev) || isNaN(current)) return;

      switch (this.operation) {
        case "+":
          computation = prev + current;
          break;
        case "-":
          computation = prev - current;
          break;
        case "x":
          computation = prev * current;
          break;

        case "/":
          computation = prev / current;
          break;
        default:
          return;
      }
      this.currentOperand = computation;
      this.operation = undefined;
      this.previousOperand = "";
    }

    getDisplayNumber(number) {
      const stringNumber = number.toString();
      const integerDigits = parseFloat(stringNumber.split(".")[0]);
      const decimalDigits = stringNumber.split(".")[1];
      let integerDisplay;

      if (isNaN(integerDigits)) {
        integerDisplay = "";
      } else {
        integerDisplay = integerDigits.toLocaleString("en", {
          maximumFractionDigits: 0,
        });
      }
      if (decimalDigits != null) {
        return `${integerDisplay}.${decimalDigits}`;
      } else {
        return integerDisplay;
      }
    }
    updateDisplay() {
      this.currentOperandandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
      if (this.operation != null) {
        this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
      } else {
        this.previousOperandTextElement.innerText = "";
      }
    }
  }

  const calculator = new Calculator(
    previousOperandTextElement,
    currentOperandandTextElement
  );

  numbers.forEach(function (number) {
    number.addEventListener("click", function () {
      calculator.appendNumber(number.innerText);
      calculator.updateDisplay();
    });
  });

  operators.forEach(function (operator) {
    operator.addEventListener("click", function () {
      calculator.chooseOperation(operator.innerText);
      calculator.updateDisplay();
    });
  });

  equal.addEventListener("click", function () {
    calculator.compute();
    calculator.updateDisplay();
  });
  reset.addEventListener("click", function () {
    calculator.clear();
    calculator.updateDisplay();
  });
  del.addEventListener("click", function () {
    calculator.delete();
    calculator.updateDisplay();
  });
}

document.addEventListener("DOMContentLoaded", init);
