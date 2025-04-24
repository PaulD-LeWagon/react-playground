import React, { useState, useRef } from "react"
import _ from "lodash"

export default function Calculator() {
  const opsRegex = /[*/+-]+$/
  const comRegex = /[C=]+$/
  const [inputValue, setInputValue] = useState("0")
  const [calcStack, setCalcStack] = useState([])
  const [opsStack, setOpsStack] = useState([])

  //       if (calcStack.length >= 1) {
  //         // Time to calculate
  //         doCalculation()
  //       } else {
  //         throw new Error(
  //           `
  //           Unable to do calculation.
  //           Incorrect number of parameters
  //           [You need at least two numbers].
  //           Do nothing! [${calcStack}, ${opsStack}]
  //         `
  //             .replace(/\n|\t/, "")
  //             .trim()
  //         )
  //       }

  const doCalculation = () => {
    let cStack = [...calcStack, inputValue]
    let oStack = [...opsStack]
    let total = Number(cStack.shift())

    for (const i in cStack) {
      switch (oStack[i]) {
        case "*":
          total *= Number(cStack[i])
          break

        case "/":
          total /= Number(cStack[i])
          break

        case "+":
          total += Number(cStack[i])
          break

        case "-":
          total -= Number(cStack[i])
          break

        default:
          throw Error(
            `Calculation Error: [${total}, ${calcStack}, ${opsStack}]`
          )
      }
    }
    setCalcStack([])
    setOpsStack([])
    setInputValue(Number(total.toFixed(2)))
  }

  const doCommand = (theCommand) => {
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

      default:
        console.warn(`Command not implemented: (${theCommand})`)
        break
    }
  }

  const doOperation = (theOperator) => {
    // Just add it to the stack...
    setOpsStack((currentStack) => [...currentStack, theOperator])
    // And the current value to calcStack
    setCalcStack((currentStack) => [...currentStack, inputValue])
    // The reset the inputValue
    setInputValue("")
  }

  const handleInputChange = (event, value) => {
    value = value.trim()
    const opsMatch = value.match(opsRegex)
    if (opsMatch) {
      console.log(`opsMatch: [${opsMatch}], v: ${value}, iv: ${inputValue}`)
      doOperation(opsMatch.shift())
    } else {
      const comMatch = value.match(comRegex)
      if (comMatch) {
        console.log(`comMatch: [${comMatch}], v: ${value}, iv: ${inputValue}`)
        doCommand(comMatch.shift())
      } else {
        setInputValue(value.replace(/[^0-9.]+/, ""))
      }
    }
  }

  const handleNumberButtonClick = (event, value) => {
    value = typeof value !== "string" ? String(value) : value

    if (inputValue.length === 1 && inputValue === "0") {
      if (value === ".") {
        setInputValue("0.")
      } else {
        setInputValue(value)
      }
    } else {
      setInputValue((n) => `${n}${value}`)
    }
  }

  const handleOperatorButtonClick = (event, value) => {
    doOperation(value)
  }

  const handleCommandButtonClick = (event, value) => {
    doCommand(value)
  }

  console.count(`Calculator Render: `)
  console.log(`iv: (${inputValue}), cs: [${calcStack}], os: [${opsStack}]`)

  return (
    <div className="calculator">
      <header className="calc-header">
        <h4 className="calc-title">Basic Calculator</h4>
        <h5 className="calc-sub-title">Version 1.0</h5>
      </header>
      <input
        className="calc-input"
        type="text"
        name="calc-input"
        value={inputValue}
        onInput={(e) => {
          handleInputChange(e, e.target.value)
        }}
      />
      <div className="calc-keypad">
        <div className="row one">
          <div className="calc-keypad-numbers col one">
            <div className="numbers row one">
              <button
                type="button"
                onClick={(e) => {
                  handleNumberButtonClick(e, 7)
                }}>
                7
              </button>
              <button
                type="button"
                onClick={(e) => {
                  handleNumberButtonClick(e, 8)
                }}>
                8
              </button>
              <button
                type="button"
                onClick={(e) => {
                  handleNumberButtonClick(e, 9)
                }}>
                9
              </button>
            </div>
            <div className="numbers row two">
              <button
                type="button"
                onClick={(e) => {
                  handleNumberButtonClick(e, 4)
                }}>
                4
              </button>
              <button
                type="button"
                onClick={(e) => {
                  handleNumberButtonClick(e, 5)
                }}>
                5
              </button>
              <button
                type="button"
                onClick={(e) => {
                  handleNumberButtonClick(e, 6)
                }}>
                6
              </button>
            </div>
            <div className="numbers row three">
              <button
                type="button"
                onClick={(e) => {
                  handleNumberButtonClick(e, 1)
                }}>
                1
              </button>
              <button
                type="button"
                onClick={(e) => {
                  handleNumberButtonClick(e, 2)
                }}>
                2
              </button>
              <button
                type="button"
                onClick={(e) => {
                  handleNumberButtonClick(e, 3)
                }}>
                3
              </button>
            </div>
            <div className="numbers row four">
              <button
                type="button"
                onClick={(e) => {
                  handleNumberButtonClick(e, 0)
                }}>
                0
              </button>
              <button
                type="button"
                onClick={(e) => {
                  handleNumberButtonClick(e, ".")
                }}>
                .
              </button>
              <button
                type="button"
                onClick={(e) => {
                  handleCommandButtonClick(e, "C")
                }}>
                C
              </button>
            </div>
          </div>
          <div className="calc-keypad-operations col two">
            <button
              type="button"
              onClick={(e) => {
                handleOperatorButtonClick(e, "/")
              }}>
              /
            </button>
            <button
              type="button"
              onClick={(e) => {
                handleOperatorButtonClick(e, "*")
              }}>
              *
            </button>
            <button
              type="button"
              onClick={(e) => {
                handleOperatorButtonClick(e, "+")
              }}>
              +
            </button>
            <button
              type="button"
              onClick={(e) => {
                handleOperatorButtonClick(e, "-")
              }}>
              -
            </button>
          </div>
        </div>
        <div className="row two">
          <button
            type="button"
            onClick={(e) => {
              handleCommandButtonClick(e, "=")
            }}>
            =
          </button>
        </div>
      </div>
    </div>
  )
}
