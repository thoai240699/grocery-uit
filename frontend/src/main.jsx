import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'
import MainContext from './context/MainContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
   <Provider store={store}>
    <MainContext>
      <App />
      </MainContext>
    </Provider>
    </BrowserRouter>
  </StrictMode>,
)
