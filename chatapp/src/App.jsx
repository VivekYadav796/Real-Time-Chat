import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import toast from 'react-hot-toast'

import JoinCreateChat from "./component/JoinCreateChat";


function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      {/* <button
        onClick={() =>{
          toast.success("This is toast Message")
        }}>
          Click me
      </button> */}
      <JoinCreateChat/>
    </div>
  )
}

export default App
