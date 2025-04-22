import React, { useRef, useState, useEffect } from "react"

export default function SimpleTextEditor() {
  const editorRef = useRef(null)

  const initialState = {
    content: "The quick brown fox, jumped of the lazy dog.",
    selection: null,
  }

  const [state, setState] = useState(initialState)
  const [counter, setCounter] = useState(0)
  const [history, setHistory] = useState([initialState])
  const [historyIndex, setHistoryIndex] = useState(0)
}
