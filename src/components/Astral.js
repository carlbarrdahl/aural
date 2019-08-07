import React, { useEffect, useRef, useState } from "react"
import * as Tone from "tone"

import Input from "./Input"

function useAstral({ beat = 12, carrier = 1296, flutter = 1, source }) {
  const [ state, setState ] = useState({ beat, carrier, flutter, on: false })
  const [ { noise, filter, reverb, phaser } ] = useState(() => ({
    noise: new Tone.Noise({
      type: "pink",
      playbackRate: 1,
      volume: -10
    }),
    filter: new Tone.Filter({
      type: "bandpass",
      frequency: state.carrier,
      rolloff: -12,
      Q: 80,
      gain: -10
    }),
    reverb: new Tone.Reverb(),
    phaser: new Tone.Phaser({
      frequency: beat,
      octaves: flutter,
      baseFrequency: carrier
    })
  }))

  useEffect(
    () => {
      try {
        filter.frequency.value = state.carrier
        phaser.frequency.value = state.beat
        phaser.octaves = state.flutter
      } catch (e) {}
    },
    [ state ]
  )

  useEffect(
    () => {
      if (state.on) {
        noise.start()
      } else {
        noise.stop()
      }
    },
    [ state.on ]
  )

  useEffect(() => {
    reverb.generate().then(() => {
      console.log("generated")
    })
    noise.connect(filter)
    filter.connect(phaser)
    phaser.connect(source)
  }, [])

  return [ state, setState ]
}

const Astral = ({ source }) => {
  const [ state, setState ] = useAstral({ source })

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
        label="Astral beat"
        type="range"
        name="beat"
        min={0.1}
        max={44}
        step={0.1}
        value={state.beat}
        onChange={handleChange}
      />
      <Input
        label="Astral carrier"
        type="range"
        name="carrier"
        min={500}
        max={5000}
        value={state.carrier}
        onChange={handleChange}
      />
      <Input
        label="Astral flutter"
        type="range"
        name="flutter"
        min={0}
        max={10}
        value={state.flutter}
        onChange={handleChange}
      />
    </div>
  )
}

export default Astral
