import { useEffect, useState } from 'react'
import Auth from './components/Auth'
import Catalog from './components/Catalog'
import CourseDetail from './components/CourseDetail'

function App() {
  const [user, setUser] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)

  useEffect(()=>{
    try {
      const raw = localStorage.getItem('user')
      if (raw) setUser(JSON.parse(raw))
    } catch {}
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>
      <div className="relative max-w-5xl mx-auto p-6 space-y-6">
        <header className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <img src="/flame-icon.svg" className="w-10 h-10" />
            <div>
              <div className="text-xl font-bold">EdTech Platform</div>
              <div className="text-xs opacity-70">Learn better with lessons, quizzes and progress</div>
            </div>
          </div>
          <div>
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm opacity-80">Welcome</span>
                <button onClick={()=>{localStorage.removeItem('user'); setUser(null)}} className="px-3 py-1.5 bg-red-600 rounded">Logout</button>
              </div>
            ) : null}
          </div>
        </header>

        {!user && (
          <div className="pt-8">
            <Auth onLogin={setUser} />
          </div>
        )}

        {user && !selectedCourse && (
          <Catalog onSelectCourse={setSelectedCourse} />
        )}

        {user && selectedCourse && (
          <CourseDetail course={selectedCourse} user={user} />
        )}
      </div>
    </div>
  )
}

export default App
