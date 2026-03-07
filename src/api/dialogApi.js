const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3001').replace(/\/$/, '')

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  const contentType = response.headers.get('content-type') || ''
  const payload = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    const message = payload?.message || `API-Fehler (${response.status})`
    throw new Error(message)
  }

  return payload
}

export function getScenes() {
  return request('/api/scenes')
}

export function getSceneDialogs(sceneId) {
  return request(`/api/scenes/${sceneId}/dialogs`)
}

export function createSceneDialogStep(sceneId, stepPayload) {
  return request(`/api/scenes/${sceneId}/dialogs`, {
    method: 'POST',
    body: JSON.stringify(stepPayload),
  })
}

export function updateSceneDialogStep(sceneId, stepIndex, stepPayload) {
  return request(`/api/scenes/${sceneId}/dialogs/${stepIndex}`, {
    method: 'PUT',
    body: JSON.stringify(stepPayload),
  })
}

export function deleteSceneDialogStep(sceneId, stepIndex) {
  return request(`/api/scenes/${sceneId}/dialogs/${stepIndex}`, {
    method: 'DELETE',
  })
}

export function seedDialogsFromGame() {
  return request('/api/dialogs/seed', {
    method: 'POST',
  })
}
