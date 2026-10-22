import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.tsx'
import { AppProvider } from './contexts'
import { store } from './store/store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AppProvider>
        <App />
      </AppProvider>
    </Provider>
  </StrictMode>,
)

// Fade out the preloader from index.html once fonts and images have loaded
const siteLoader = document.getElementById('site-loader')
if (siteLoader) {
  let hidden = false
  const hideLoader = () => {
    if (hidden) return
    hidden = true
    siteLoader.classList.add('is-hidden')
    document.documentElement.classList.remove('is-loading')
    setTimeout(() => siteLoader.remove(), 700)
  }

  if (document.readyState === 'complete') {
    requestAnimationFrame(hideLoader)
  } else {
    window.addEventListener('load', hideLoader, { once: true })
  }

  // Never keep the site hidden behind a slow third-party asset
  setTimeout(hideLoader, 8000)
}
