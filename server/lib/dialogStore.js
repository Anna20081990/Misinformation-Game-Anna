import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const DATA_FILE = path.resolve(process.cwd(), 'server/data/dialogs.json')
let writeQueue = Promise.resolve()

function clone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

async function readData() {
  const raw = await readFile(DATA_FILE, 'utf-8')
  const parsed = JSON.parse(raw)
  if (!parsed || !Array.isArray(parsed.scenes)) {
    throw new Error('Ungültiges Datenformat in dialogs.json')
  }
  return parsed
}

function queueWrite(nextData) {
  writeQueue = writeQueue.then(async () => {
    const content = `${JSON.stringify(nextData, null, 2)}\n`
    await writeFile(DATA_FILE, content, 'utf-8')
  })
  return writeQueue
}

export async function getAllSceneDialogs() {
  const data = await readData()
  return data.scenes.sort((a, b) => a.sceneId - b.sceneId)
}

export async function getSceneDialogs(sceneId) {
  const all = await getAllSceneDialogs()
  return all.find((entry) => entry.sceneId === Number(sceneId)) ?? null
}

export async function updateSceneDialogs(sceneId, updater) {
  const data = await readData()
  const index = data.scenes.findIndex((entry) => entry.sceneId === Number(sceneId))

  if (index === -1) {
    data.scenes.push({ sceneId: Number(sceneId), steps: [] })
  }

  const effectiveIndex = index === -1 ? data.scenes.length - 1 : index
  const current = clone(data.scenes[effectiveIndex])
  const updated = updater(current)

  data.scenes[effectiveIndex] = {
    sceneId: Number(sceneId),
    steps: Array.isArray(updated.steps)
      ? [...updated.steps].sort((a, b) => a.stepIndex - b.stepIndex)
      : [],
  }

  await queueWrite(data)
  return clone(data.scenes[effectiveIndex])
}

export async function replaceAllSceneDialogs(nextScenes) {
  const data = await readData()
  data.scenes = Array.isArray(nextScenes)
    ? [...nextScenes].sort((a, b) => Number(a.sceneId) - Number(b.sceneId))
    : []

  await queueWrite(data)
  return clone(data.scenes)
}
