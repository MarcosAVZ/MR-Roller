const API = import.meta.env.VITE_API_BASE || '' // '' en dev por proxy

export const getJSON = async (path) => {
  const res = await fetch(`${API}${path}`)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}

export const postJSON = async (path, body) => {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export const patchJSON = async (path, body) => {
  const res = await fetch(`${API}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export const del = async (path) => {
  const res = await fetch(`${API}${path}`, { method: 'DELETE' })
  if (!res.ok && res.status !== 204) throw new Error(await res.text())
}
