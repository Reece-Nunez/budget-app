'use client'

import { useState } from 'react'
import Login from './Login'
import Signup from './SignUp'

export default function AuthToggle() {
  const [showLogin, setShowLogin] = useState(true)

  return showLogin ? (
    <Login toggle={() => setShowLogin(false)} />
  ) : (
    <Signup toggle={() => setShowLogin(true)} />
  )
}
