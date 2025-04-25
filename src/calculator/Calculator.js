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
    const opsMatch = theValue.trim().match(/[*/+-]+$/)
    if (opsMatch) {
      doOperation(opsMatch.shift())
    } else {
      const comMatch = theValue.trim().match(/[C=]+$/)
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
      children: "M",
      clickHandler: (e) => {
        handleCommandButtonClick(e, "M")
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      children: "M-",
      clickHandler: (e) => {
        handleCommandButtonClick(e, "M-")
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      children: "M+",
      clickHandler: (e) => {
        handleCommandButtonClick(e, "M+")
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      children: "C",
      clickHandler: (e) => {
        handleCommandButtonClick(e, "C")
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      children: "7",
      clickHandler: (e) => {
        handleNumberButtonClick(e, 7)
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      children: "8",
      clickHandler: (e) => {
        handleNumberButtonClick(e, 8)
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      children: "9",
      clickHandler: (e) => {
        handleNumberButtonClick(e, 9)
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      children: "/",
      clickHandler: (e) => {
        handleOperatorButtonClick(e, "/")
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      children: "4",
      clickHandler: (e) => {
        handleNumberButtonClick(e, 4)
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      children: "5",
      clickHandler: (e) => {
        handleNumberButtonClick(e, 5)
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      children: "6",
      clickHandler: (e) => {
        handleNumberButtonClick(e, 6)
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      children: "*",
      clickHandler: (e) => {
        handleOperatorButtonClick(e, "*")
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      children: "1",
      clickHandler: (e) => {
        handleNumberButtonClick(e, 1)
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      children: "2",
      clickHandler: (e) => {
        handleNumberButtonClick(e, 2)
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      children: "3",
      clickHandler: (e) => {
        handleNumberButtonClick(e, 3)
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      children: "-",
      clickHandler: (e) => {
        handleOperatorButtonClick(e, "-")
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      children: "0",
      clickHandler: (e) => {
        handleNumberButtonClick(e, 0)
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      children: ".",
      clickHandler: (e) => {
        handleNumberButtonClick(e, ".")
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      children: "^",
      clickHandler: (e) => {
        handleOperatorButtonClick(e, "^")
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      children: "+",
      clickHandler: (e) => {
        handleOperatorButtonClick(e, "+")
      },
    },
    {
      btnType: btnType,
      className: `${stdBtnClass} fg-3`,
      children: "=",
      clickHandler: (e) => {
        handleCommandButtonClick(e, "=")
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

  console.debug(
    `
      ${(() => {
        console.count("Calculator Render")
        return ""
      })()}
      M: (${memory}),
      IV: (${inputValue})
      CS: [${calcStack}],
      OS: [${opsStack}]
    `
      .replace(/\s+/g, " ")
      .trim()
  )

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

export const Button = ({ btnType, className, clickHandler, children }) => {
  return (
    <button
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
