import React, { useEffect, useRef, useState } from "react"
import * as Tone from "tone"

import Input from "./Input"
function useIsochronic({
  beat = 12,
  carrier = 576,
  spread = 90,
  type = 0,
  source
}) {
  const types = [ "sine", "sawtooth", "square" ]
  const [ state, setState ] = useState({
    beat,
    carrier,
    spread,
    type,
    on: false
  })
  const [ { osc, tremolo } ] = useState(() => ({
    osc: new Tone.OmniOscillator({
      volume: -30,
      frequency: carrier,
      detune: 0,
      type: "sine",
      phase: 0
    }),
    tremolo: new Tone.Tremolo({
      frequency: beat,
      type: types[type],
      depth: 1,
      spread: spread
    })
  }))

  useEffect(
    () => {
      try {
        osc.frequency.value = state.carrier
        tremolo.frequency.value = state.beat
        tremolo.spread = state.spread
        tremolo.type = types[state.type]
      } catch (e) {}
    },
    [ state ]
  )

  useEffect(
    () => {
      if (state.on) {
        osc.start()
        tremolo.start()
      } else {
        osc.stop()
        tremolo.stop()
      }
    },
    [ state.on ]
  )

  useEffect(() => {
    osc.connect(tremolo)
    tremolo.connect(source)
  }, [])

  return [ state, setState ]
}

const Isochronic = ({ source }) => {
  const [ state, setState ] = useIsochronic({ source })

  function handleStartStop() {
    setState({ ...state, on: !state.on })
  }
  function handleChange(e) {
    setState({ ...state, [e.target.name]: +e.target.value })
  }
  return (
    <div>
      <button onClick={handleStartStop}>{state.on ? "stop" : "start"}</button>
      <Input
        label="Isochronic beat"
        type="range"
        name="beat"
        min={0.1}
        max={22}
        step={0.1}
        value={state.beat}
        onChange={handleChange}
      />
      <Input
        label="Isochronic carrier"
        type="range"
        name="carrier"
        min={10}
        max={1000}
        value={state.carrier}
        onChange={handleChange}
      />
      <Input
        label="Isochronic spread"
        type="range"
        name="spread"
        min={0}
        max={180}
        value={state.spread}
        onChange={handleChange}
      />
      <Input
        label="Isochronic type"
        type="range"
        name="type"
        min={0}
        max={2}
        value={state.type}
        onChange={handleChange}
      />
    </div>
  )
}

export default Isochronic
