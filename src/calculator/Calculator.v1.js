import React, { useState, useRef } from "react"
import _ from "lodash"

export default function Calculator() {
  const inputRef = useRef(null)
  const [inputValue, setInputValue] = useState("")
  const [calcStack, setCalcStack] = useState([])
  const [opsStack, setOpsStack] = useState([])

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
    setInputValue((n) => Number(total.toFixed(2)))
  }

  const doOperationInput = (theOperator) => {
    switch (theOperator) {
      case "":
        // Do nothing, the user is typing directly inside
        // the input and has deleted all its contents.
        break

      case "C":
        // Reseting app
        setInputValue("")
        setCalcStack([])
        setOpsStack([])
        break

      case "=":
        if (calcStack.length >= 1) {
          // Time to calculate
          doCalculation()
        } else {
          throw new Error(
            `
            Unable to do calculation.
            Incorrect number of parameters
            [You need at least two numbers].
            Do nothing! [${calcStack}, ${opsStack}]
          `
              .replace(/\n|\t/, "")
              .trim()
          )
        }
        break

      default:
        // Just add it to the stack...
        setOpsStack((currentStack) => [...currentStack, theOperator])
        // And the current value to calcStack
        setCalcStack((currentStack) => [...currentStack, inputValue])
        // Reset the inputValue
        setInputValue("")
        break
    }
  }

  const addToValue = (thisValue) => {
    thisValue = String(thisValue)
    if (thisValue.length === 1) {
      setInputValue((n) => `${inputValue}${thisValue}`)
    } else if (thisValue.length > 1) {
      setInputValue((n) => thisValue)
    } else {
      throw new Error(
        `
        Error: 'thisValue' must be at least
        1 character in length and convert
        to a number! [${thisValue}]
        `
          .replace(/\n/, "")
          .trim()
      )
    }
  }

  const processInputValue = (thisValue) => {
    switch (typeof thisValue) {
      case "number":
        addToValue(thisValue)
        break

      case "string":
        if (thisValue.length > 1) {
          thisValue = thisValue.replace(/[^0-9.]/, "")
          addToValue(thisValue)
        } else if (
          thisValue.length === 1 &&
          (thisValue === "." || Number(thisValue))
        ) {
          console.log(`Is either '.' or a number [${thisValue}]`)
          console.log(Number(thisValue), thisValue)
          addToValue(thisValue)
        } else {
          // Should be an operation command
          doOperationInput(thisValue)
        }
        break

      default:
        throw new Error(`Unknown input value: ${thisValue}`)
    }
  }

  const handleButtonClick = (event, value) => {
    processInputValue(value)
  }

  const handleInputChange = (event) => {
    processInputValue(event.target.value)
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
        ref={inputRef}
        className="calc-input"
        type="text"
        name="calc-input"
        value={inputValue}
        onChange={(e) => {
          handleInputChange(e)
        }}
        placeholder="0"
      />
      <div className="calc-keypad">
        <div className="row one">
          <div className="calc-keypad-numbers col one">
            <div className="numbers row one">
              <button
                type="button"
                onClick={(e) => {
                  handleButtonClick(e, 7)
                }}>
                7
              </button>
              <button
                type="button"
                onClick={(e) => {
                  handleButtonClick(e, 8)
                }}>
                8
              </button>
              <button
                type="button"
                onClick={(e) => {
                  handleButtonClick(e, 9)
                }}>
                9
              </button>
            </div>
            <div className="numbers row two">
              <button
                type="button"
                onClick={(e) => {
                  handleButtonClick(e, 4)
                }}>
                4
              </button>
              <button
                type="button"
                onClick={(e) => {
                  handleButtonClick(e, 5)
                }}>
                5
              </button>
              <button
                type="button"
                onClick={(e) => {
                  handleButtonClick(e, 6)
                }}>
                6
              </button>
            </div>
            <div className="numbers row three">
              <button
                type="button"
                onClick={(e) => {
                  handleButtonClick(e, 1)
                }}>
                1
              </button>
              <button
                type="button"
                onClick={(e) => {
                  handleButtonClick(e, 2)
                }}>
                2
              </button>
              <button
                type="button"
                onClick={(e) => {
                  handleButtonClick(e, 3)
                }}>
                3
              </button>
            </div>
            <div className="numbers row four">
              <button
                type="button"
                onClick={(e) => {
                  handleButtonClick(e, 0)
                }}>
                0
              </button>
              <button
                type="button"
                onClick={(e) => {
                  handleButtonClick(e, ".")
                }}>
                .
              </button>
              <button
                type="button"
                onClick={(e) => {
                  handleButtonClick(e, "C")
                }}>
                C
              </button>
            </div>
          </div>
          <div className="calc-keypad-operations col two">
            <button
              type="button"
              onClick={(e) => {
                handleButtonClick(e, "/")
              }}>
              /
            </button>
            <button
              type="button"
              onClick={(e) => {
                handleButtonClick(e, "*")
              }}>
              *
            </button>
            <button
              type="button"
              onClick={(e) => {
                handleButtonClick(e, "+")
              }}>
              +
            </button>
            <button
              type="button"
              onClick={(e) => {
                handleButtonClick(e, "-")
              }}>
              -
            </button>
          </div>
        </div>
        <div className="row two">
          <button
            type="button"
            onClick={(e) => {
              handleButtonClick(e, "=")
            }}>
            =
          </button>
        </div>
      </div>
    </div>
  )
}
