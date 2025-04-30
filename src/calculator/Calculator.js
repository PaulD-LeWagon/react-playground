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

function injectDynamicVars(that, theObject = {}) {
  for (const [k, v] of Object.entries(theObject)) {
    that[k] = v
  }

  // let k = "value"
  // let i = 0
  // for (i = 1; i < 3; i++) {
  //   eval("let " + k + i + "= " + i + ";")
  // }
  // // eslint-disable-next-line no-undef
  // console.log("value1=" + value1)
  // // eslint-disable-next-line no-undef
  // console.log("value2=" + value2)
  // // eslint-disable-next-line no-undef
  // console.log("value3=" + value3)

  return that
}

// ;((x) => {
//   let i
//   // Window method
//   for (i = 1; i < 5; i++) {
//     window["value" + i] = +i
//   }
//   // eslint-disable-next-line no-undef
//   console.log("value1=" + value1)
//   // eslint-disable-next-line no-undef
//   console.log("value2=" + value2)
//   // eslint-disable-next-line no-undef
//   console.log("value3=" + value3)

//   // Create a new Map to store dynamic variables
//   let dynamicMap = new Map()
//   dynamicMap.set("memory", "0")
//   dynamicMap.set("displayValue", "0")
//   dynamicMap.set("calcStack", [])

//   console.log(dynamicMap.get("memory"))
//   console.log(dynamicMap.get("displayValue"))
//   console.log(dynamicMap.get("calcStack"))

//   // Generate dynamic variable names and assign values
//   // for (let i = 1; i <= 4; i++) {
//   //     dynamicMap.set(`value${i}`, i);
//   // }

//   // Access and print the dynamically created variables
//   // dynamicMap.forEach((value, key) => {
//   //     console.log(`${key} = ${value}`);
//   // });

//   console.log(x)
// })("Hello Closure World!")

export default function Calculator({ domID = "my-calculator" }) {
  // App state vars
  class AppState {
    constructor(args = { memory: "0", displayValue: "0", calcStack: [] }) {
      this.memory = args.memory
      this.displayValue = args.displayValue
      this.calcStack = args.calcStack
    }
    getCalculation() {
      return `${this.calcStack.join("")}${this.displayValue}`
    }
    toString() {
      return `m: (${this.memory}), dv: (${
        this.displayValue
      }) cs: [${this.calcStack.join(", ")}]`
    }
    newState(newState = {}) {
      return Object.assign(new this.constructor(), this, newState)
    }
    *[Symbol.iterator]() {
      yield* Object.values(this) // yield* Object.entries(this)
    }
  }

  const [appState, setAppState] = useState(new AppState())
  const [history, setHistory] = useState([])
  const [precision, setPrecision] = useState(3)

  // console.log(appState.toString())

  // function Test(one) {
  //   this.one = one
  // }
  // const test = injectDynamicVars(new Test("Testing"), appState)
  // console.log(test)

  // console.log(
  //   appState.newState({
  //     memory: 27,
  //     displayValue: 9,
  //     calcStack: ["19", "-", "76", "-"],
  //   })
  // )

  // function Test(one, two, ...allTheRest) {
  //   this.one = one
  //   this.two = two
  //   this.allTheRest = allTheRest
  // }
  // Test.prototype.toString = function (printToConsole = false) {
  //   let retString = ""
  //   for (var [key, val] of Object.entries(this)) {
  //     retString += `${key}: ${val}\n`
  //   }
  //   if (printToConsole) {
  //     console.log(retString)
  //   }
  //   return retString
  // }
  // Test.prototype[Symbol.iterator] = function* () {
  //   // yield* Object.entries(this)
  //   yield this.one
  //   yield this.two
  //   yield this.allTheRest
  // }
  // var test = new Test(1, 2, 3, 'four', 'five', 'six', 'seven')
  // console.log('Test: ', ...test)

  // console.log(history)

  const stepBackInTimeTo = (thisIndex) => {
    if (history.length) {
      if (thisIndex >= 0) {
        setAppState((as) => history[thisIndex])
        setHistory(history.slice(0, thisIndex))
      } else {
        let newHistory = null
        setAppState((as) => history.slice(-1)[0])
        newHistory = history.slice(0, -1)
        setHistory(newHistory)
      }
    }
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
      // Just add displayValue and the theOperator to the calculation stack
      // And empty the display ready for the next term
      return appState.newState({
        calcStack: [...as.calcStack, as.displayValue, theOperator],
        displayValue: "",
      })
    })
    // setAppState((as) => {
    //   // Unpack the current state object
    //   let [memory, displayValue, calcStack] = as
    //   // Then just add theOperator and the displayValue to the calculation stack
    //   calcStack = [...calcStack, displayValue, theOperator]
    //   // And empty the display ready for the next term
    //   displayValue = ""
    //   return new AppState(memory, displayValue, calcStack)
    // })
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
          return appState.newState({
            calcStack: [],
            displayValue: "0",
          })
        })
        // setAppState((as) => {
        //   let [memory, displayValue, calcStack] = as
        //   displayValue = "0"
        //   calcStack = []
        //   return new AppState(memory, displayValue, calcStack)
        // })
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
        setAppState((as) => appState.newState({ displayValue: as.memory }))
        // setAppState((as) => {
        //   let [memory, displayValue, calcStack] = as
        //   displayValue = memory
        //   return new AppState(memory, displayValue, calcStack)
        // })
        break

      case "M-":
        // Add current state to history variable
        addCurrentStateToHistory()
        // Do appState.memory delete - i.e. reset the appState.memory variable.
        setAppState((as) => appState.newState({ memory: "0" }))
        // setAppState((as) => {
        //   let [memory, displayValue, calcStack] = as
        //   memory = "0"
        //   return new AppState(memory, displayValue, calcStack)
        // })
        break

      case "M+":
        // Add current state to history variable
        addCurrentStateToHistory()
        // Do appState.memory add - i.e. add the appState.displayValue to appState.memory
        // variable (add to existing value if exists)
        setAppState((as) => {
          return appState.newState({
            memory: String(Number(as.memory) + Number(as.displayValue)),
            displayValue: "0",
          })
        })
        // setAppState((as) => {
        //   let [memory, displayValue, calcStack] = as
        //   memory = String(Number(memory) + Number(displayValue))
        //   displayValue = "0"
        //   return new AppState(memory, displayValue, calcStack)
        // })
        break

      case "％":
        // Add current state to history variable
        addCurrentStateToHistory()
        // Do percent - i.e. take the input value and convert it to a percentage
        setAppState((as) => {
          return appState.newState({
            displayValue:
              Number(as.displayValue) === 0
                ? "0"
                : String(Number(as.displayValue) / 100),
          })
        })
        // setAppState((as) => {
        //   let [memory, displayValue, calcStack] = as
        //   displayValue =
        //     Number(as.displayValue) === 0
        //       ? "0"
        //       : String(Number(as.displayValue) / 100)
        //   return new AppState(memory, displayValue, calcStack)
        // })
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
      return appState.newState({
        displayValue: String(Number(total.toFixed(precision))),
        calcStack: [],
      })
    })
    // setAppState((as) => {
    //   let [memory, displayValue, calcStack] = as
    //   displayValue = String(Number(total.toFixed(precision)))
    //   calcStack = []
    //   return new AppState(memory, displayValue, calcStack)
    // })
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
        setAppState((as) => appState.newState({ displayValue: "0." }))
        // setAppState((as) => {
        //   let [memory, displayValue, calcStack] = as
        //   displayValue = "0."
        //   return new AppState(memory, displayValue, calcStack)
        // })
      } else {
        setAppState((as) => appState.newState({ displayValue: theValue }))
        // setAppState((as) => {
        //   let [memory, displayValue, calcStack] = as
        //   displayValue = theValue
        //   return new AppState(memory, displayValue, calcStack)
        // })
      }
    } else {
      theValue = theValue !== "∙" ? theValue : "."
      setAppState((as) => {
        return appState.newState({
          displayValue: `${as.displayValue}${theValue}`,
        })
      })
      // setAppState((as) => {
      //   let [memory, displayValue, calcStack] = as
      //   displayValue = `${displayValue}${theValue}`
      //   return new AppState(memory, displayValue, calcStack)
      // })
    }
  }

  const handleInputChange = (event, theValue) => {
    console.debug("InputChange: ", theValue)
    // const opsMatch = theValue.trim().match(/[*/+-^]|RT+$/)
    // if (opsMatch) {
    //   doOperation(opsMatch.shift())
    // } else {
    //   const comMatch = theValue.trim().match(/[C=%]|M\+|M-|M+$/)
    //   if (comMatch) {
    //     doCommand(comMatch.shift())
    //   } else {
    //     // Add current state to history variable
    //     addCurrentStateToHistory()
    //     // Strip any illegal characters and update app state
    //     setAppState((as) => appState.newState({ displayValue: theValue.replace(/[^0-9.]+/, "") }))
    //    // setAppState((as) => {
    //    //   let [memory, displayValue, calcStack] = as
    //    //   displayValue = theValue.replace(/[^0-9.]+/, "")
    //    //   return new AppState(memory, displayValue, calcStack)
    //    // })
    //   }
    // }
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
    handleLiClick: (e, theIndex) => {
      stepBackInTimeTo(theIndex)
    },
  }

  const btnType = "button"
  const stdBtnClass = "btn"
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

  const configButtons = [
    {
      btnType: btnType,
      className: stdBtnClass,
      title: "Close",
      children: "X",
      clickHandler: (e) => {
        handleCommandButtonClick(e, "XX")
      },
    },
    {
      btnType: btnType,
      className: stdBtnClass,
      title: "Set precision e.g. 2 d.p. [0.00]",
      children: "D",
      clickHandler: (e) => {
        handleCommandButtonClick(e, "DP")
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
    <div
      id={domID}
      className="calculator">
      <div className="config-panel hide">
        {configButtons.map((btnData, i) => {
          return (
            <Button
              key={i}
              {...btnData}
            />
          )
        })}
      </div>

      <header className="header">
        <h4 className="title">Basic Calculator</h4>
        <h5 className="sub-title">Version 1.0</h5>
      </header>

      <Display
        curDisplayValue={appState.displayValue}
        curMemoryValue={appState.memory}
        curCalculations={appState.getCalculation()}
        theHistory={history}
        isEditable={true}
        eventHandlers={displayEventHandlers}
      />

      <div className="keypad">
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
  eventHandlers,
  theHistory,
  isEditable = false,
}) => {
  const [show, setShow] = useState(false)
  const handleCalculationClick = (e) => {
    setShow(!show)
  }
  const handleCalcLiClick = (e, theIndex) => {
    setShow(!show)
    eventHandlers.handleLiClick(e, theIndex)
  }
  return (
    <div className="display-container">
      <div
        className="primary display"
        onInput={eventHandlers.handleInput}
        onKeyDown={eventHandlers.handleKeyDown}
        contentEditable={isEditable}
        suppressContentEditableWarning={true}>
        {curDisplayValue}
      </div>
      <div className="sub-display-container">
        <div className="memory sub display">{curMemoryValue}</div>
        <div className="csdc calculation-sub-display-container">
          <div
            className="calculation sub display"
            onClick={handleCalculationClick}>
            {curCalculations}
          </div>
          <div
            className={
              theHistory.length && show ? "history-list" : "history-list hide"
            }>
            <ul>
              {theHistory.map((ss, i) => {
                return (
                  <li
                    key={i}
                    onClick={(e) => {
                      handleCalcLiClick(e, i)
                    }}>
                    <span>Snapshot: {i + 1}</span>
                    <span>{ss.calcStack.join("") + ss.displayValue}</span>
                  </li>
                )
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
