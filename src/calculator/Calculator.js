import React, { useState } from "react"
import "./Calculator.css"

export default function Calculator() {
  // App state vars
  const initState = {
    displayValue: "0",
    calcStack: [],
    opsStack: [],
    memory: "0",
  }
  const [appState, setAppState] = useState(initState)
  const [history, setHistory] = useState([appState])

  const getCurrentCalculation = () => {
    return "1 * 2 * 3"
  }

  const doOperation = (theOperator) => {
    console.debug("Operator: ", theOperator)
    // Add current state to history variable
    setHistory((h) => [appState, ...h])
    // Now we can update the appState
    setAppState((as) => {
      return {
        ...as,
        // Just add it to the stack...
        opsStack: [...as.opsStack, theOperator],
        // And the current value to the calcStack
        calcStack: [...as.calcStack, as.displayValue],
        // The reset the appState.displayValue
        displayValue: "",
      }
    })
  }

  const doCommand = (theCommand) => {
    console.debug("Executing Command: ", theCommand)
    switch (theCommand) {
      case "UD":
        // Do undo...
        if (history.length) {
          setAppState((as) => history[0])
          setHistory((h) => h.slice(1))
        }
        break

      case "C":
        // Add current state to history variable
        setHistory((h) => [appState, ...h])
        // Reset the appState values
        setAppState((as) => {
          return {
            // We don't reset the memory value
            ...as,
            // But we do reset everything else
            opsStack: [],
            calcStack: [],
            displayValue: "0",
          }
        })
        break

      case "=":
        // Do the calculation
        doCalculation()
        break

      case "M":
        // Add current state to history variable
        setHistory((h) => [appState, ...h])
        // Do appState.memory recall - i.e. set appState.displayValue
        // to appState.memory variable.
        setAppState((as) => {
          return {
            ...as,
            displayValue: as.memory,
          }
        })
        break

      case "M-":
        // Add current state to history variable
        setHistory((h) => [appState, ...h])
        // Do appState.memory delete - i.e. reset the appState.memory variable.
        setAppState((as) => {
          return {
            ...as,
            memory: "0",
          }
        })
        break

      case "M+":
        // Add current state to history variable
        setHistory((h) => [appState, ...h])
        // Do appState.memory add - i.e. add the appState.displayValue to appState.memory
        // variable (add to existing value if exists)
        setAppState((as) => {
          return {
            ...as,
            memory: String(Number(as.memory) + Number(as.displayValue)),
            displayValue: "0",
          }
        })
        break

      case "%":
        // Add current state to history variable
        setHistory((h) => [appState, ...h])
        // Do percent - i.e. take the input value and convert it to a percentage
        setAppState((as) => {
          return {
            ...as,
            displayValue:
              Number(as.displayValue) === 0
                ? "0"
                : String(Number(as.displayValue) / 100),
          }
        })
        break

      default:
        console.warn(`Command not implemented: (${theCommand})`)
        break
    }
  }

  const doCalculation = () => {
    let cStack = [...appState.calcStack, appState.displayValue]
    let oStack = [...appState.opsStack]
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
            `Calculation Error: t: (${total}), cs: (${appState.calcStack}), os: (${appState.opsStack})`
          )
      }
    }
    // Add current state to history variable
    setHistory((h) => [appState, ...h])
    setAppState((as) => {
      return {
        ...as,
        opsStack: [],
        calcStack: [],
        displayValue: String(Number(total.toFixed(2))),
      }
    })
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
    // Add current state to history variable
    setHistory((h) => [appState, ...h])
    theValue = typeof theValue !== "string" ? String(theValue) : theValue
    if (appState.displayValue.length === 1 && appState.displayValue === "0") {
      if (theValue === ".") {
        setAppState((as) => {
          return {
            ...as,
            displayValue: "0.",
          }
        })
      } else {
        setAppState((as) => {
          return {
            ...as,
            displayValue: theValue,
          }
        })
      }
    } else {
      setAppState((as) => {
        return {
          ...as,
          displayValue: `${as.displayValue}${theValue}`,
        }
      })
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
        // Add current state to history variable
        setHistory((h) => [appState, ...h])
        // Strip any illegal characters and update app state
        setAppState((as) => {
          return {
            ...as,
            displayValue: theValue.replace(/[^0-9.]+/, ""),
          }
        })
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
  //     M: (${appState.memory}),
  //     IV: (${appState.displayValue})
  //     CS: [${appState.calcStack}],
  //     OS: [${appState.opsStack}]
  //   `
  //     .replace(/\s+/g, " ")
  //     .trim()
  // )

  // console.log(console)

  // console.log("To-do:")
  // console.log("1: [DONE] Push this repo to github! [DONE]")
  // console.log("2: Display contents of appState.memory store.")
  // console.log("3: Display calculation sequence as-u-go.")
  // console.log("4: [DONE] Implement the Undo/history feature. [DONE]")
  // console.log("5: Start a Basic To-do list component.")

  return (
    <div className="calculator flex-box-cc flex-col flex-gap-2">
      <header className="calc-header flex-box-ec flex-col">
        <h4 className="calc-title">Basic Calculator</h4>
        <h5 className="calc-sub-title">Version 1.0</h5>
      </header>

      <div className="calc-display flex-box-cc flex-row flex-w flex-gap-1">
        <Input
          inputType="text"
          inputName="calc-input"
          className="calc-input fg-1"
          displayValue={appState.displayValue}
          {...inputEventHandlers}
        />
        <Input
          inputType="text"
          inputName="calc-memory-display"
          className="calc-memory-display flex-b-2-fifths"
          displayValue={appState.memory}
          readOnly={true}
        />

        <Input
          inputType="text"
          inputName="calc-current-calculation"
          className="calc-current-calculation flex-b-3-fifths"
          displayValue={getCurrentCalculation()}
        />
      </div>

      <div className="calc-keypad flex-box-cc flex-w flex-gap-1">
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
  btnType = null,
  className = null,
  title = null,
  clickHandler,
  children = "Click Me!",
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
  styleObj,
  className = null,
  displayValue = null,
  readOnly = null,
  handleInput = null,
  handleKeyDown = null,
}) => {
  return (
    <input
      type={inputType}
      name={inputName}
      className={className}
      style={styleObj}
      value={displayValue}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      readOnly={readOnly}
    />
  )
}
