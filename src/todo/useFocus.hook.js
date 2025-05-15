import { useRef, useEffect } from "react"

export default function useFocus() {
  const elementRef = useRef(null)
  useEffect(() => {
    elementRef.current.focus()
  }, [])
  return elementRef
}
