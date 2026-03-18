import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { loadSavedTheme } from './utils/themes'

// 저장된 테마를 React 초기화 전에 적용 (FOUC 방지)
loadSavedTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
