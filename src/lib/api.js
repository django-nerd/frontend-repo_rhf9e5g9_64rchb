const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function getUser() {
  try {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export async function api(path, { method = 'GET', body, headers = {} } = {}) {
  const user = getUser()
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(user?.user_id ? { 'x-user-id': user.user_id } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    let detail = 'Request failed'
    try {
      const data = await res.json()
      detail = data.detail || JSON.stringify(data)
    } catch {}
    throw new Error(`${res.status} ${res.statusText}: ${detail}`)
  }
  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) return res.json()
  return res.text()
}

export { API_BASE }
