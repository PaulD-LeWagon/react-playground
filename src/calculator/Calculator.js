import React, { useState, useEffect, useRef } from "react"
import AppState from "./AppState.class"
import "../app-utilities"
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

// ;((x) => {
//   let i
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
//   console.log(x)
// })("Hello Closure World!")

// const uber = ["one", 1, "two", 2, "three", 3, "4", "four"]
// const chunked = uber.chunk(2)
// const eachCons = uber.each_cons(2)

// console.log("eachCons(2): ", eachCons)

// console.log("first", chunked.first().first())
// console.log("last", chunked.last().last())

// console.log("first uber:", uber.first())
// console.log("second uber:", uber.second())
// console.log("third uber:", uber.third())
// console.log("fourth uber:", uber.fourth())
// console.log("fifth uber:", uber.fifth())
// console.log("last uber:", uber.last())

export default function Calculator({ domID = "my-calculator" }) {
  // App state vars
  const [appState, setAppState] = useState(new AppState())
  const [history, setHistory] = useState([])
  const [precision, setPrecision] = useState(2) // Should this be moved to the AppState class???
  const [showCfgMenu, setShowCfgMenu] = useState(false)
  const [isMinimised, setIsMinimised] = useState(false)
  // Element/Component References
  const configMenuRef = useRef(null)
  const primaryRef = useRef(null)
  const memoryRef = useRef(null)
  const calculationRef = useRef(null)

  const displayRefs = [primaryRef, memoryRef, calculationRef]
  const thePrecisionRange = {
    min: 0,
    max: 10,
    value: precision,
    onChange: (event) => {
      setPrecision(event.target.value)
    },
  }

  useEffect(() => {
    // The displays to the immediately input value
    displayRefs.forEach((dispRef, i) => {
      const el = dispRef.current
      if (el.scrollWidth > el.clientWidth) {
        el.scroll({
          left: el.scrollWidth,
          behavior: "smooth",
        })
      }
    })

    const globalClick = (event) => {
      if (!configMenuRef.current.contains(event.target)) {
        setShowCfgMenu(false)
      }
    }
    document.addEventListener("mousedown", globalClick)
    return () => document.removeEventListener("mousedown", globalClick)
  })

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
        break

      case "M-":
        // Add current state to history variable
        addCurrentStateToHistory()
        // Do appState.memory delete - i.e. reset the appState.memory variable.
        setAppState((as) => appState.newState({ memory: "0" }))
        break

      case "M+":
        // Add current state to history variable
        addCurrentStateToHistory()
        // Do appState.memory add - i.e. add the appState.displayValue to
        // appState.memory variable (add to existing value if exists)
        setAppState((as) => {
          return appState.newState({
            memory: String(Number(as.memory) + Number(as.displayValue)),
            displayValue: "0",
          })
        })
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
        break

      default:
        console.warn(`Command not implemented: (${theCommand})`)
        break
    }
  }

  const doCalculation = () => {
    let cStack = [...appState.calcStack, appState.displayValue]
    let total = Number(cStack.shift())
    let theOperator = null
    cStack = cStack.chunk(2)
    for (const eachPair of cStack) {
      theOperator = eachPair.first()
      switch (theOperator) {
        case "√":
          total = total ** (1 / Number(eachPair.last()))
          break
        case "xⁿ":
          total = total ** Number(eachPair.last())
          break
        case "÷":
          total /= Number(eachPair.last())
          break
        case "⨯":
          total *= Number(eachPair.last())
          break
        case "+":
          total += Number(eachPair.last())
          break
        case "−":
          total -= Number(eachPair.last())
          break
        default:
          throw Error(
            `Operator Error: op: (${theOperator}) t: (${total}), state: (${appState}) in doCalculation.`
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
  }

  const copyToClipboard = async (el) => {
    const copyText = el
    try {
      navigator.clipboard.writeText(copyText.innerText)
      alert(`(${copyText.innerText}) copied to clipboard!`)
    } catch (error) {
      console.error(
        `Error: Failed to copy, ${copyText.innerText}, to the clipboard.`,
        error
      )
    }
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
      } else {
        setAppState((as) => appState.newState({ displayValue: theValue }))
      }
    } else {
      theValue = theValue !== "∙" ? theValue : "."
      setAppState((as) => {
        return appState.newState({
          displayValue: `${as.displayValue}${theValue}`,
        })
      })
    }
  }

  const handleDblClick = (event) => {
    copyToClipboard(event.target)
  }

  const displayEventHandlers = {
    handleDblClick: handleDblClick,
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

  console.log("To-do:")
  console.log("1: [DONE] Push this repo to github! [DONE]")
  console.log("2: [DONE] Display contents of appState.memory store. [DONE]")
  console.log("3: [DONE] Display calculation sequence as-u-go. [DONE]")
  console.log("4: [DONE] Implement the Undo/history feature. X2 [DONE] ")
  console.log("5: [DONE] Bug: When deleting 0 from display. Removed keyboard Input")
  console.log("5: [DONE] Cont: functionality The unicode characters are not on a standard keyboard.")
  console.log("6: [DONE]Bug: Rounding errors ??? Add a config option. [DONE]")
  console.log("7: [DONE]ADD: Config menu & minimise button. Dragable!? [DONE]")

  console.log("8: Start a Basic To-do list component.")
  console.log("9: Create ur own custom collection objects and rubify them.")
  console.log("10: Make sure you can pass a Block|callback to them.")

  return (
    <div
      id={domID}
      className="calculator">
      <div
        ref={configMenuRef}
        className={isMinimised ? "config-panel app-minimised" : "config-panel"}>
        <div className="menu-gear">
          <button
            className="calc-config-toggle"
            onClick={(e) => {
              setShowCfgMenu(!showCfgMenu)
            }}>
            ⚙
          </button>
          <div
            className={showCfgMenu ? "config-menu show" : "config-menu hide"}>
            <Range {...thePrecisionRange} />
          </div>
        </div>

        <div className="menu-the-rest">
          <button
            className="calc-config-toggle"
            onClick={(e) => {
              setIsMinimised(!isMinimised)
            }}>
            {isMinimised ? "□" : "▣"}
            {/* "◾ ◼ ▢ □ _" */}
          </button>
        </div>
      </div>

      <div
        className={isMinimised ? "app-container hide" : "app-container show"}>
        <header className="header">
          <h4 className="title">Basic Calculator</h4>
          <h5 className="sub-title">Version 1.0</h5>
        </header>

        <Display
          refs={displayRefs}
          curDisplayValue={appState.displayValue}
          curMemoryValue={appState.memory}
          curCalculations={appState.getCalculation()}
          theHistory={history}
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
    </div>
  )
}

const Display = ({
  refs,
  curDisplayValue,
  curMemoryValue,
  curCalculations,
  eventHandlers,
  theHistory,
  isEditable = false,
}) => {
  const [show, setShow] = useState(false)
  const menuRef = useRef(null)
  const [primaryRef, memoryRef, calculationRef] = refs

  const handleCalculationClick = (e) => {
    setShow(!show)
  }
  const handleCalcLiClick = (e, theIndex) => {
    setShow(!show)
    eventHandlers.handleLiClick(e, theIndex)
  }
  // Close menu if user clicks outside the menu when it's open
  useEffect(() => {
    const globalClick = (event) => {
      if (!menuRef.current.contains(event.target)) {
        setShow(false)
      }
    }
    document.addEventListener("mousedown", globalClick)
    return () => document.removeEventListener("mousedown", globalClick)
  })

  return (
    <div className="display-container">
      <div
        ref={primaryRef}
        className="primary display"
        onDoubleClick={eventHandlers.handleDblClick}
        contentEditable={isEditable}
        suppressContentEditableWarning={true}>
        {curDisplayValue}
      </div>
      <div className="sub-display-container">
        <div
          ref={memoryRef}
          className="memory sub display"
          onDoubleClick={eventHandlers.handleDblClick}>
          {curMemoryValue}
        </div>
        <div className="csdc calculation-sub-display-container">
          <div
            ref={calculationRef}
            className="calculation sub display"
            onDoubleClick={eventHandlers.handleDblClick}
            onClick={handleCalculationClick}>
            {curCalculations}
          </div>
          <div
            ref={menuRef}
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
                    <span>Snapshot {i + 1}: </span>
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

export const Range = ({ min, max, step, value, onChange }) => {
  return (
    <div className="rcc range-component-container grid">
      <div className="cell">
        <div className="rcd range-component-display">{value}</div>
      </div>

      <div className="cell">
        <input
          className="rci range-component-input"
          type="range"
          min={min || 0}
          max={max || 10}
          step={step || 1}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  )
}
