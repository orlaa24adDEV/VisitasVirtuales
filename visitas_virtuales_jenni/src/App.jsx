import { useState } from 'react'
import './App.css'
import Login from './components/Login'

function App() {
   const login = (user) => {
    setUser(user);
  }
  

  return (
    <>
    <main>

      <Login handleLogin={login}></Login>

    </main>
      
    </>
  )
}

export default App
