import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { LandingPage } from './pages/LandingPage'
import { Home } from './pages/Home'
import { Study } from './pages/Study'
import { Quiz } from './pages/Quiz'
import { Progress } from './pages/Progress'
import { Feynman } from './pages/Feynman'
import { SmoothScrollProvider } from './components/layout/SmoothScroll'

export default function App() {
  return (
    <SmoothScrollProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Study App Workspace */}
          <Route element={<AppShell />}>
            <Route path="/app" element={<Home />} />
            <Route path="/study" element={<Study />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/feynman" element={<Feynman />} />
            <Route path="/progress" element={<Progress />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SmoothScrollProvider>
  )
}
