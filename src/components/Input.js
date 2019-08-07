import React from "react"

const Input = ({ label, type, name, min, max, step, value, onChange }) => {
  return (
    <div>
      <label>
        {label} ({value})
      </label>

      <input
        type={type}
        id={name}
        name={name}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        style={{
          width: "100%"
        }}
      />
    </div>
  )
}

export default Input
