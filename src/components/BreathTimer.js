import React, { useEffect, useRef, useState } from "react"
import { useRaf } from "react-use"

function useDetectTouchType(TIMEOUT = 200) {
  const [ state, setState ] = useState(0)

  const timer = useRef(null)
  useEffect(
    () => {
      const touchStart = e => {
        setState(1)
        // Detect long-press
        timer.current = setTimeout(() => setState(2), TIMEOUT)
      }
      const touchEnd = e => {
        state === 2 && setState(0)
        clearTimeout(timer.current)
      }

      document.addEventListener("touchstart", touchStart)
      document.addEventListener("touchend", touchEnd)

      return () => {
        document.removeEventListener("touchstart", touchStart)
        document.removeEventListener("touchend", touchEnd)
      }
    },
    [ state ]
  )

  return state // 0 = idle, 1 = tap, 2 = hold
}

function useBreathing() {
  const [ state, setState ] = useState([])
  const inhale = () => setState([ ...state, [ 1, Date.now() ] ])
  const exhale = () => setState([ ...state, [ 0, Date.now() ] ])

  const [ isInhaling, start ] = state[state.length - 1] || []
  const length = Date.now() - start || 0
  return { inhale, exhale, state, length }
}

// const BreathTimer = () => {
//   useRaf(1000 * 3600, 0)
//   const { inhale, exhale, state, length } = useBreathing()
//   console.log(state, length)

//   return (
//     <div
//       style={{
//         background: "#5499C7",
//         height: "100%"
//       }}
//       onTouchStart={exhale}
//       onTouchEnd={inhale}
//     >
//       {length}
//     </div>
//   )
// }
const BreathTimer = () => {
  useRaf(1000 * 3600, 0)
  const state = useDetectTouchType()
  const [ cycles, setCycles ] = useState([])

  useEffect(
    () => {
      console.log("state", state)
      setCycles([ ...cycles, { timestamp: Date.now(), type: state } ])
    },
    [ state ]
  )
  // console.log(cycles)
  const time =
    (cycles[cycles.length - 1] || [ { timestamp: Date.now() } ]).timestamp -
    Date.now()
  return (
    <div
      style={{
        background: "#5499C7",
        height: "100%"
      }}
    >
      {state}

      {time}
    </div>
  )
}

export default BreathTimer
