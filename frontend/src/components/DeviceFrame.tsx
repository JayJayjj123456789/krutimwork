import { ReactNode } from 'react'
import './DeviceFrame.css'

interface DeviceFrameProps {
  children: ReactNode
}

export default function DeviceFrame({ children }: DeviceFrameProps) {
  return (
    <div className="device-frame-wrapper">
      <div className="device-frame">
        <div className="device-screen">
          {children}
        </div>
      </div>
    </div>
  )
}
