import React, { useState } from "react"
import * as Tone from "tone"

import { Link } from "gatsby"

import Layout from "../components/layout"
import BreathTimer from "../components/BreathTimer"
import Astral from "../components/Astral"
import Binaural from "../components/Binaural"
import Image from "../components/image"
import SEO from "../components/seo"
import Isochronic from "../components/Isochronic"

const useSource = () => {
  const [ source ] = useState(
    () =>
      new Tone.Compressor({
        ratio: 12,
        threshold: -24,
        release: 0.25,
        attack: 0.003,
        knee: 30
      })
  )

  source.toMaster()

  return source
}

const presets = [
  {
    name: "Pyramid",
    params: {
      beat: 9.41,
      carrier: 33
    }
  },
  {
    name: "Heart",
    params: {
      carrier: 341,
      beat: 10.5
    }
  },
  {
    name: "Root",
    params: {
      carrier: 65.8,
      beat: 0.5
    }
  },
  {
    name: "A",
    params: {
      carrier: 54,
      beat: 0.5
    }
  }
]

const IndexPage = () => {
  const source = useSource()

  return (
    <Layout>
      <Astral source={source} />
      <Isochronic source={source} />
      <Binaural {...presets[3].params} source={source} />
      {/* <Binaural {...presets[1].params} source={source} /> */}
      {/* <BreathTimer /> */}
    </Layout>
  )
}

export default IndexPage
