import { CSSProperties } from 'react'
import useConstants from '../stores/useConstants'

// Put styles here because stylesheets are hard to import in Webflow
const style: CSSProperties = {
  top: 20,
  right: 20,
  padding: 20,
  borderRadius: 5,
  position: 'fixed',
  background: 'black',
  zIndex: Number.MAX_SAFE_INTEGER,
}

const labelStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 20,
}

const spanStyle: CSSProperties = {
  width: 150,
}

export default function GUI() {
  const config = useConstants()

  const numberFields: {
    label: string
    key: keyof typeof config
    step?: number
    min?: number
    max?: number
  }[] = [
    {
      label: 'Cassette X (after click)',
      min: -2000,
      max: 2000,
      key: 'cassetteClickTargetX',
      step: 25,
    },
  ]

  return (
    <details {...{ style }}>
      <summary>
        <strong>Demo settings</strong>
      </summary>

      {numberFields.map(({ label, key, ...rest }) => (
        <label style={labelStyle} key={key}>
          <span style={spanStyle}>{label}</span>
          <input
            type="range"
            value={config[key] as number}
            onChange={e => config.set({ [key]: e.currentTarget.valueAsNumber })}
            {...rest}
          />
          <input
            type="number"
            value={config[key] as number}
            onChange={e => config.set({ [key]: e.currentTarget.valueAsNumber })}
            {...rest}
          />
        </label>
      ))}
    </details>
  )
}
