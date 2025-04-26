import React, { useState } from "react"

export default function Calculator() {
  // App state vars
  const [inputValue, setInputValue] = useState("0")
  const [calcStack, setCalcStack] = useState([])
  const [opsStack, setOpsStack] = useState([])
  const [memory, setMemory] = useState("0")

  const doOperation = (theOperator) => {
    console.debug("Operator: ", theOperator)
    // Just add it to the stack...
    setOpsStack((curStack) => [...curStack, theOperator])
    // And the current value to calcStack
    setCalcStack((curStack) => [...curStack, inputValue])
    // The reset the inputValue
    setInputValue("")
  }

  const doCommand = (theCommand) => {
    console.debug("Executing Command: ", theCommand)
    switch (theCommand) {
      case "C":
        // Reset the state
        setInputValue("0")
        setCalcStack([])
        setOpsStack([])
        break

      case "=":
        // Do the calculation
        doCalculation()
        break

      case "M":
        // Do memory recall - i.e. set inputValue to memory variable.
        setInputValue(memory)
        break

      case "M-":
        // Do memory delete - i.e. reset the memory variable.
        setMemory("0")
        break

      case "M+":
        // Do memory add - i.e. add the inputValue to memory
        // variable (add to existing value if exists)
        setMemory((m) => String(Number(m) + Number(inputValue)))
        setInputValue("0")
        break

      case "%":
        // Do percent - i.e. take the input value and convert it to a percentage
        setInputValue((n) => (Number(n) === 0 ? "0" : Number(n) / 100))
        break

      default:
        console.warn(`Command not implemented: (${theCommand})`)
        break
    }
  }

  const doCalculation = () => {
    let cStack = [...calcStack, inputValue]
    let oStack = [...opsStack]
    let total = Number(cStack.shift())

    for (const i in cStack) {
      switch (oStack[i]) {
        case "RT":
          total = total ** (1 / Number(cStack[i]))
          break

        case "^":
          total = total ** Number(cStack[i])
          break

        case "/":
          total /= Number(cStack[i])
          break

        case "*":
          total *= Number(cStack[i])
          break

        case "+":
          total += Number(cStack[i])
          break

        case "-":
          total -= Number(cStack[i])
          break

        default:
          throw Error(
            `Calculation Error: t: (${total}), cs: (${calcStack}), os: (${opsStack})`
          )
      }
    }
    setCalcStack([])
    setOpsStack([])
    setInputValue(Number(total.toFixed(2)))
  }

  const handleOperatorButtonClick = (event, theValue) => {
    console.debug("OpsClick: ", theValue)
    doOperation(theValue)
  }

  const handleCommandButtonClick = (event, theValue) => {
    console.debug("ComClick: ", theValue)
    doCommand(theValue)
  }

  const handleNumberButtonClick = (event, theValue) => {
    console.debug("NumClick: ", theValue)
    theValue = typeof theValue !== "string" ? String(theValue) : theValue
    if (inputValue.length === 1 && inputValue === "0") {
      if (theValue === ".") {
        setInputValue("0.")
      } else {
        setInputValue(theValue)
      }
    } else {
      setInputValue((n) => `${n}${theValue}`)
    }
  }

  const handleInputChange = (event, theValue) => {
    console.debug("InputChange: ", theValue)
    const opsMatch = theValue.trim().match(/[*/+-^]|RT+$/)
    if (opsMatch) {
      doOperation(opsMatch.shift())
    } else {
      const comMatch = theValue.trim().match(/[C=%]|M\+|M-|M+$/)
      if (comMatch) {
        doCommand(comMatch.shift())
      } else {
        // Strip any illegal characters
        setInputValue(theValue.replace(/[^0-9.]+/, ""))
      }
    }
  }

  const inputEventHandlers = {
    handleInput: (e) => {
      handleInputChange(e, e.target.value)
    },
    handleKeyDown: (e) => {
      if (e.key === "Enter") {
        doCommand("=")
      }
    },
  }

  const btnType = "button"
  const stdBtnClass = "calc-btn"
  const calcButtons = [
    {
      btnType: btnType,
      className: stdBtnClass,
      title: "Memory Recall",
      children: "M",
      clickHandler: (e) => {
        handleCommandButtonClick(e, "M")
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      title: "Memory Delete",
      children: "M-",
      clickHandler: (e) => {
        handleCommandButtonClick(e, "M-")
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      title: "Memory Add",
      children: "M+",
      clickHandler: (e) => {
        handleCommandButtonClick(e, "M+")
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      title: "Cancel/Reset",
      children: "C",
      clickHandler: (e) => {
        handleCommandButtonClick(e, "C")
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      title: "Undo",
      children: "UD",
      clickHandler: (e) => {
        handleCommandButtonClick(e, "UD")
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      title: "Power",
      children: "xⁿ",
      clickHandler: (e) => {
        handleOperatorButtonClick(e, "^")
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      title: "Root of x",
      children: "√",
      clickHandler: (e) => {
        handleOperatorButtonClick(e, "RT")
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      title: "Last input to percent",
      children: "％",
      clickHandler: (e) => {
        handleCommandButtonClick(e, "%")
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      title: "",
      children: "7",
      clickHandler: (e) => {
        handleNumberButtonClick(e, 7)
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      title: "",
      children: "8",
      clickHandler: (e) => {
        handleNumberButtonClick(e, 8)
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      title: "",
      children: "9",
      clickHandler: (e) => {
        handleNumberButtonClick(e, 9)
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      title: "Divide",
      children: "÷",
      clickHandler: (e) => {
        handleOperatorButtonClick(e, "/")
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      title: "",
      children: "4",
      clickHandler: (e) => {
        handleNumberButtonClick(e, 4)
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      title: "",
      children: "5",
      clickHandler: (e) => {
        handleNumberButtonClick(e, 5)
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      title: "",
      children: "6",
      clickHandler: (e) => {
        handleNumberButtonClick(e, 6)
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      title: "Multiply",
      children: "⨯",
      clickHandler: (e) => {
        handleOperatorButtonClick(e, "*")
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      title: "",
      children: "1",
      clickHandler: (e) => {
        handleNumberButtonClick(e, 1)
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      title: "",
      children: "2",
      clickHandler: (e) => {
        handleNumberButtonClick(e, 2)
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      title: "",
      children: "3",
      clickHandler: (e) => {
        handleNumberButtonClick(e, 3)
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      title: "Subtract",
      children: "−",
      clickHandler: (e) => {
        handleOperatorButtonClick(e, "-")
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      title: "",
      children: "0",
      clickHandler: (e) => {
        handleNumberButtonClick(e, 0)
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      title: "",
      children: "∙",
      clickHandler: (e) => {
        handleNumberButtonClick(e, ".")
      },
    },
    {
      btnType: btnType,
      className: `${stdBtnClass} fg-3-disabled`,
      title: "Calculate",
      children: "=",
      clickHandler: (e) => {
        handleCommandButtonClick(e, "=")
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      title: "Add",
      children: "+",
      clickHandler: (e) => {
        handleOperatorButtonClick(e, "+")
      },
    },
  ]

  // const debugThis = (counterLabel, ...vars) => {
  //   let output = ""
  //   for (const i in vars) {
  //     output += `\n${typeof vars[i]}: ${vars[i]}`
  //   }
  //   console.debug(
  //     `
  //       ${(() => {
  //         console.count(counterLabel)
  //         return ""
  //       })()}

  //       ${output}
  //     `
  //       // .replace(/\s+/g, " ")
  //       .trim()
  //   )
  // }
  // debugThis("Test Run", 1, "Two", { three: 3 })

  // const counter = () => {
  //   console.count("Calculator Render")
  //   return ""
  // }
  // console.debug(
  //   `
  //     ${counter()}
  //     M: (${memory}),
  //     IV: (${inputValue})
  //     CS: [${calcStack}],
  //     OS: [${opsStack}]
  //   `
  //     .replace(/\s+/g, " ")
  //     .trim()
  // )

  // console.log(console)

  console.log("To-do:")
  console.log("1: Push this repo to github!")
  console.log("2: Display contents of memory store.")
  console.log("3: Display calculation sequence as-u-go.")
  console.log("4: Implement the Undo/history feature.")
  console.log("5: Start a Basic To-do list component.")

  return (
    <div className="calculator flex-box-cc flex-col flex-gap-2">
      <header className="calc-header flex-box-ec flex-col">
        <h4 className="calc-title">Basic Calculator</h4>
        <h5 className="calc-sub-title">Version 1.0</h5>
      </header>

      <Input
        inputType="text"
        inputName="calc-input"
        className="calc-input"
        inputValue={inputValue}
        {...inputEventHandlers}
      />

      <div className="calc-keypad flex-box-cc flx-w flex-gap-1">
        {calcButtons.map((btnData, i) => {
          return (
            <Button
              key={i}
              {...btnData}
            />
          )
        })}
      </div>
    </div>
  )
}

export const Button = ({
  btnType,
  className,
  title,
  clickHandler,
  children,
}) => {
  return (
    <button
      title={title}
      className={className}
      type={btnType ? btnType : "button"}
      onClick={clickHandler}>
      {children}
    </button>
  )
}

export const Input = ({
  inputType,
  inputName,
  className,
  inputValue,
  handleInput,
  handleKeyDown,
}) => {
  return (
    <input
      type={inputType}
      name={inputName}
      className={className}
      value={inputValue}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
    />
  )
}
