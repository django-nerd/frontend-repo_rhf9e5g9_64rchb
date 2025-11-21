import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function CourseDetail({ course, user }) {
  const [lessons, setLessons] = useState([])
  const [selected, setSelected] = useState(null)
  const [answers, setAnswers] = useState([])
  const [result, setResult] = useState(null)

  useEffect(()=>{ if (course) loadLessons() }, [course?._id])

  async function loadLessons() {
    const data = await api(`/api/courses/${course._id}/lessons`)
    setLessons(data)
  }

  async function enroll() {
    await api('/api/enroll', { method: 'POST', body: { user_id: user.user_id, course_id: course._id } })
    alert('Enrolled!')
  }

  async function submitQuiz(lesson) {
    const r = await api(`/api/lessons/${lesson._id}/submit-quiz`, { method: 'POST', body: { answers } })
    setResult(r)
    if (r.passed) alert('Passed! Next lesson unlocked.')
  }

  return (
    <div className="bg-white/10 border border-white/10 rounded-2xl p-4 text-white">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-xl font-semibold">{course.title}</h3>
          <p className="text-sm opacity-80">{course.category}{course.subcategory? ` / ${course.subcategory}`: ''}</p>
        </div>
        <button onClick={enroll} className="px-3 py-2 bg-blue-600 rounded">Enroll</button>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-1 space-y-2">
          {lessons.map(l => (
            <button key={l._id} onClick={()=>{setSelected(l); setAnswers([]); setResult(null)}} className={`w-full text-left px-3 py-2 rounded border border-white/10 ${selected?._id===l._id? 'bg-blue-600' : 'bg-slate-900/40'}`}>
              <div className="font-medium">{l.order+1}. {l.title}</div>
              {l.is_free_preview && <div className="text-xs opacity-70">Free preview</div>}
            </button>
          ))}
          {lessons.length===0 && <p className="text-sm opacity-80">No lessons yet.</p>}
        </div>
        <div className="md:col-span-2">
          {!selected && <p className="opacity-80">Select a lesson to view details and quiz.</p>}
          {selected && (
            <div className="space-y-3">
              {selected.video_url ? (
                <video controls src={selected.video_url} className="w-full rounded" />
              ) : (
                <div className="w-full aspect-video bg-black/30 rounded flex items-center justify-center">No video</div>
              )}
              <QuizPanel lesson={selected} answers={answers} setAnswers={setAnswers} onSubmit={()=>submitQuiz(selected)} result={result} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function QuizPanel({ lesson, answers, setAnswers, onSubmit, result }) {
  const [quiz, setQuiz] = useState(null)
  useEffect(()=>{ load() }, [lesson._id])

  async function load() {
    const data = await api(`/api/lessons/${lesson._id}/quiz`)
    setQuiz(data)
    setAnswers(new Array(data.questions?.length || 0).fill(-1))
  }

  if (!quiz) return <div className="p-4 bg-slate-900/40 rounded">Loading quiz...</div>

  return (
    <div className="p-4 bg-slate-900/40 rounded border border-white/10">
      <h4 className="font-semibold mb-2">Lesson Quiz</h4>
      {(quiz.questions || []).map((q, qi) => (
        <div key={qi} className="mb-3">
          <div className="font-medium mb-1">Q{qi+1}. {q.prompt}</div>
          <div className="space-y-1">
            {q.options.map((opt, oi) => (
              <label key={oi} className="flex items-center gap-2">
                <input type="radio" name={`q${qi}`} checked={answers[qi]===oi} onChange={()=>{
                  const next = [...answers]; next[qi] = oi; setAnswers(next)
                }} />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      <button onClick={onSubmit} className="px-3 py-2 bg-green-600 rounded">Submit Quiz</button>
      {result && (
        <div className="mt-3 text-sm">
          Score: {result.score}/{result.total} ({result.percentage}%) — {result.passed? 'Passed' : 'Try again'}
        </div>
      )}
    </div>
  )
}
