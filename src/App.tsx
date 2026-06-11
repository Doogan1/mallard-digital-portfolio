import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import Projects from './pages/Projects'
import ProjectPage from './pages/ProjectPage'
import Skills from './pages/Skills'

export default function App() {
  return (
    <BrowserRouter basename="/drake-olejniczak">
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectPage />} />
          <Route path="/skills" element={<Skills />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
