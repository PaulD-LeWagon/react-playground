import React, { useState, useRef } from "react"
import _ from "lodash"

export default function Calculator() {
  const inputRef = useRef(null)
  const [inputValue, setInputValue] = useState("")
  const [calcStack, setCalcStack] = useState([])
  const [opsStack, setOpsStack] = useState([])

  const doCalculation = (theOperator) => {
    let cStack = [...calcStack]
    let oStack = [...opsStack]
    let total = cStack.shift()

    for (const i in cStack) {
      const item = cStack[i]
    }
    switch (theOperator) {
      case "*":
        // setCalcStack([...calcStack, inputValue, theOperator])
        break

      // case "/":
      //   console.log("Division", theOperator)
      //   setCalcStack([...calcStack, inputValue, theOperator])
      //   setInputValue("")
      //   break

      // case "+":
      //   console.log("Addition", theOperator)
      //   setCalcStack([...calcStack, inputValue, theOperator])
      //   setInputValue("")
      //   break

      // case "-":
      //   console.log("Subtraction", theOperator)
      //   setCalcStack([...calcStack, inputValue, theOperator])
      //   setInputValue("")
      //   break

      default:
        throw Error(`Calculation Error: [${total}, ${calcStack}, ${opsStack}]`)
    }
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
        if (calcStack.length >= 2) {
          // Time to calculate
          doCalculation()
        } else {
          throw new Error(
            `
            Unable to do calculation.
            Incorrect number of parameters
            [You need at least two numbers].
            Do nothing!
          `
              .replace(/\n/, "")
              .trim()
          )
        }
        break

      default:
        // Just add it to the stack...
        setOpsStack([...opsStack, theOperator])
        break
    }
  }

  const addToValue = (thisValue) => {
    thisValue = String(thisValue)
    if (thisValue.length === 1) {
      setInputValue(`${inputValue}${thisValue}`)
    } else if (thisValue.length > 1) {
      console.log("len > 1 : ", thisValue)
      setInputValue(thisValue)
    } else {
      throw Error(
        `Error: 'thisValue' must be at least 1 character in length and convert
        to a number! [${thisValue}]`.trim()
      )
    }
  }

  const processInputValue = (thisValue) => {
    console.log(typeof thisValue, thisValue)
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
        throw Error(`Unknown input value: ${thisValue}`)
    }
  }

  const handleButtonClick = (event, value) => {
    processInputValue(value)
  }

  const handleInputChange = (event) => {
    processInputValue(event.target.value)
  }

  return (
    <div className="calculator">
      <h4 className="calc-title">Basic Calculator Version 1.0</h4>
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
