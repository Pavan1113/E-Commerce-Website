import React, { useState } from 'react'
import App from '../App'

const Button = ({text, onClick, style}) => {

  return (
    <div>
      <button style={{backgroundColor:'red', border: 'none', ...style}} onClick={onClick}>{text}</button>
    </div>
  )
}

export default Button
