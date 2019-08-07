import React, { useEffect, useRef, useState } from "react"
import * as Tone from "tone"

import Input from "./Input"

function useAstral({ freq = 965, source }) {
  const [ state, setState ] = useState({ freq })
  const noise = useRef(
    new Tone.Noise({
      type: "pink",
      playbackRate: 1,
      volume: -10
    })
  )
  const filter = useRef(
    new Tone.Filter({
      type: "bandpass",
      frequency: state.freq,
      rolloff: -12,
      Q: 80,
      gain: -10
    })
  )

  noise.current.connect(filter.current)
  noise.current.start()
  filter.current.connect(source)

  function handleChange(e) {
    const { name, value } = e.target
    setState({ ...state, [name]: +value })
    try {
      filter.current.frequency.value = state.freq
    } catch (error) {}
  }

  return [ state, handleChange ]
}

function useBinaural({ beat = 9, carrier = 33, source }) {
  const [ state, setState ] = useState({ beat, carrier, on: false })
  const [ oscs ] = useState(() => ({
    left: new Tone.OmniOscillator({
      frequency: state.carrier,
      volume: -10
    }),
    right: new Tone.OmniOscillator({
      frequency: state.carrier + state.beat,
      volume: -10
    })
  }))
  useEffect(() => {
    const split = new Tone.Merge()
    oscs.left.connect(split.left)
    oscs.right.connect(split.right)
    split.connect(source)
    // source.toMaster()
  }, [])

  useEffect(
    () => {
      if (state.on) {
        oscs.left.start()
        oscs.right.start()
      } else {
        oscs.left.stop()
        oscs.right.stop()
      }
    },
    [ state.on ]
  )

  useEffect(
    () => {
      try {
        oscs.left.frequency.value = state.carrier
        oscs.right.frequency.value = state.carrier + state.beat
      } catch (e) {}
    },
    [ state ]
  )

  return [ state, setState ]
}

const Binaural = ({ beat, carrier, source }) => {
  const [ state, setState ] = useBinaural({ beat, carrier, source })

  console.log(state)

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
        label="Binaural carrier"
        type="range"
        name="carrier"
        min={20}
        max={600}
        value={state.carrier}
        onChange={handleChange}
      />
      <Input
        label="Binaural beat"
        type="range"
        name="beat"
        min={0.1}
        max={10}
        step={0.1}
        value={state.beat}
        onChange={handleChange}
      />
    </div>
  )
}

export default Binaural
