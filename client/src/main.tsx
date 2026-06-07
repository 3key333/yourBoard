import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Layout } from './layout/Layout'
import './assets/global.css'
import { Provider } from 'react-redux'
import { store } from './redux/store'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
        <Layout/>
    </Provider>
  </StrictMode>,
)
