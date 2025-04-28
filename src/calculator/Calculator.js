import React, { useState } from "react"
import { arrayChunk as chunk } from "../app-utilities"
import "./Calculator.css"

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
//     CS: [${appState.calcStack}]
//   `
//     .replace(/\s+/g, " ")
//     .trim()
// )

// console.log(console)

// const nativeLogger = console.log
// console.log = (...params) => {
//   for (let i in params) {
//     nativeLogger(`${typeof params[i]}, ${params[i]}`)
//   }
// }

export default function Calculator() {
  // App state vars
  const initState = {
    displayValue: "0",
    calcStack: [],
    memory: "0",
  }
  const [appState, setAppState] = useState(initState)
  const [history, setHistory] = useState([appState])
  const [historyIndex, setHistoryIndex] = useState(0)

  const getCurrentCalculation = () => {
    return `${appState.calcStack.join("")}${appState.displayValue}`
  }

  const stepBackInTimeTo = (thisIndex) => {
    if (thisIndex >= 0 ) {
      setAppState((as) => history[thisIndex])
      setHistory(history.slice(0, thisIndex))
    } else {
      let newHistory = null
      setAppState((as) => history.slice(-1)[0])
      newHistory = history.slice(0, -1)
      setHistory(newHistory)
      thisIndex = newHistory.length -1
    }
    setHistoryIndex(thisIndex)
  }

  const addCurrentStateToHistory = () => {
    setHistory((allOfHistory) => [...allOfHistory, appState])
  }

  const doOperation = (theOperator) => {
    console.debug(`Operator: ${theOperator}`)
    // Add current state to history variable
    addCurrentStateToHistory()
    // Now we can update the appState
    setAppState((as) => {
      return {
        ...as,
        // Just add it and the current value to the calcStack
        calcStack: [...as.calcStack, as.displayValue, theOperator],
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
        stepBackInTimeTo()
        break

      case "C":
        // Add current state to history variable
        addCurrentStateToHistory()
        // Reset the appState values
        setAppState((as) => {
          return {
            // We don't reset the memory value
            ...as,
            // But we do reset everything else
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
        addCurrentStateToHistory()
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
        addCurrentStateToHistory()
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
        addCurrentStateToHistory()
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

      case "％":
        // Add current state to history variable
        addCurrentStateToHistory()
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
    let total = Number(cStack.shift())
    cStack = chunk(cStack, 2)

    for (const i in cStack) {
      switch (cStack[i][0]) {
        case "√":
          total = total ** (1 / Number(cStack[i][1]))
          break

        case "xⁿ":
          total = total ** Number(cStack[i][1])
          break

        case "÷":
          total /= Number(cStack[i][1])
          break

        case "⨯":
          total *= Number(cStack[i][1])
          break

        case "+":
          total += Number(cStack[i][1])
          break

        case "−":
          total -= Number(cStack[i][1])
          break

        default:
          throw Error(
            `Calculation Error: t: (${total}), cs: (${appState.calcStack.join(
              " "
            )})`
          )
      }
    }

    // Add current state to history variable
    addCurrentStateToHistory()
    setAppState((as) => {
      return {
        ...as,
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
    addCurrentStateToHistory()
    theValue = typeof theValue !== "string" ? String(theValue) : theValue
    if (appState.displayValue.length === 1 && appState.displayValue === "0") {
      if (theValue === "∙") {
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
        addCurrentStateToHistory()
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

  const displayEventHandlers = {
    handleInput: (e) => {
      handleInputChange(e, e.target.innerHTML)
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
        handleOperatorButtonClick(e, "xⁿ")
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      title: "Root of x",
      children: "√",
      clickHandler: (e) => {
        handleOperatorButtonClick(e, "√")
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      title: "Last input to percent",
      children: "％",
      clickHandler: (e) => {
        handleCommandButtonClick(e, "％")
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
        handleOperatorButtonClick(e, "÷")
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
        handleOperatorButtonClick(e, "⨯")
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
        handleOperatorButtonClick(e, "−")
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
        handleNumberButtonClick(e, "∙")
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

  // console.log("To-do:")
  // console.log("1: [DONE] Push this repo to github! [DONE]")
  // console.log("2: [DONE] Display contents of appState.memory store. [DONE]")
  // console.log("3: [DONE] Display calculation sequence as-u-go. [DONE]")
  // console.log("4: Implement the Undo/history feature.")
  // console.log("5: Bug: When deleting 0 from display.")
  // console.log("6: Bug: Rounding errors ???.")
  // console.log("7: ADD: Config menu & minimise button. Dragable!?")
  // console.log("8: Start a Basic To-do list component.")

  return (
    <div className="calculator">
      <header className="calc-header">
        <h4 className="calc-title">Basic Calculator</h4>
        <h5 className="calc-sub-title">Version 1.0</h5>
      </header>

      <Display
        curDisplayValue={appState.displayValue}
        curMemoryValue={appState.memory}
        curCalculations={getCurrentCalculation()}
        theHistory={history}
        isEditable={true}
        {...displayEventHandlers}
      />

      <div className="calc-keypad">
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

const Display = ({
  curDisplayValue,
  curMemoryValue,
  curCalculations,
  handleInput,
  handleKeyDown,
  theHistory,
  isEditable = false,
}) => {
  const [show, setShow] = useState(false)
  const handleCalculationClick = (e) => {
    setShow(!show)
    console.log("Implement history list...")
  }
  return (
    <div className="calc-display-container">
      <div
        className="calc-primary display"
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        contentEditable={isEditable}
        suppressContentEditableWarning={true}>
        {curDisplayValue}
      </div>
      <div className="calc-sub-display-container">
        <div className="calc-memory sub display">{curMemoryValue}</div>
        <div className="calc-calculation-sub-display-wrapper">
          <div
            className="calc-calculation sub display"
            onClick={handleCalculationClick}>
            {curCalculations}
          </div>
          <div
            className={show ? "calc-history-list" : "calc-history-list hide"}>
            <ul>
              <li>Version 1</li>
              {theHistory.map((ss, i)=>{
                return <li key={i} onClick={(e)=>{console.log("li", i)}}>Snapshot: {i + 1} - {ss.calcStack.join('') + ss.displayValue}</li>
              })}
            </ul>
          </div>
        </div>
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
