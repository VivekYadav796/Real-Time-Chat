import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import { Toaster } from 'react-hot-toast'
import ChatPage from "./component/ChatPage";
import { ChatProvider } from "./context/ChatContext";


createRoot(document.getElementById('root')).render(
  
    <BrowserRouter>
      <Toaster position="top-center" />       {/*!--it means alert popup <Toaster position="top-right"/>*/}
      <ChatProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/frontend" element={<h1>This is routing testing in main.jsx</h1>} />
          <Route path="*" element={<h1>404 Page Not Found</h1>} />
        </Routes>
      </ChatProvider>

    </BrowserRouter>
  
)
