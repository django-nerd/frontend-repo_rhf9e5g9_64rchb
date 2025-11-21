import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function Catalog({ onSelectCourse }) {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [category, setCategory] = useState('')

  useEffect(()=>{ fetchCourses() }, [category])

  async function fetchCourses() {
    setLoading(true); setError('')
    try {
      const qs = new URLSearchParams()
      if (category) qs.set('category', category)
      const data = await api(`/api/courses?${qs.toString()}`)
      setCourses(data)
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  return (
    <div className="bg-white/10 border border-white/10 rounded-2xl p-4 text-white">
      <div className="flex items-center gap-3 mb-4">
        <select value={category} onChange={e=>setCategory(e.target.value)} className="bg-white/10 border border-white/10 rounded px-3 py-2">
          <option value="">All Categories</option>
          <option>KTET</option>
          <option>LP</option>
          <option>UP</option>
        </select>
        <button onClick={fetchCourses} className="px-3 py-2 bg-blue-600 rounded">Refresh</button>
      </div>
      {loading && <p>Loading courses...</p>}
      {error && <p className="text-red-300">{error}</p>}
      <div className="grid md:grid-cols-2 gap-4">
        {courses.map(c => (
          <div key={c._id} className="bg-slate-900/40 border border-white/10 rounded-xl p-4">
            <h3 className="font-semibold text-lg">{c.title}</h3>
            <p className="text-blue-200/80 text-sm mb-3">{c.description}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="opacity-80">{c.category}{c.subcategory? ` / ${c.subcategory}`: ''}</span>
              <button onClick={()=>onSelectCourse(c)} className="px-3 py-1.5 bg-green-600 rounded">View</button>
            </div>
          </div>
        ))}
        {(!loading && courses.length===0) && <p className="text-sm opacity-80">No courses yet.</p>}
      </div>
    </div>
  )
}
