import { readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { buildSeedDialogs } from './dialogSeed.js'
import { SCENES } from '../../src/data/scenes.js'

const DATA_FILE = path.resolve(process.cwd(), 'server/data/dialogs.json')
const SEED_SOURCE_FILES = [
  path.resolve(process.cwd(), 'server/lib/dialogSeed.js'),
  path.resolve(process.cwd(), 'src/data/conversations/part1.js'),
]
let writeQueue = Promise.resolve()

function clone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

async function readData() {
  try {
    const raw = await readFile(DATA_FILE, 'utf-8')
    let parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.scenes)) {
      throw new Error('Ungültiges Datenformat in dialogs.json')
    }

    parsed = await syncDataFromSeedIfSourcesChanged(parsed)
    return parsed
  } catch (error) {
    if (error?.code === 'ENOENT') {
      const seeded = { scenes: buildSeedDialogs() }
      await writeFile(DATA_FILE, `${JSON.stringify(seeded, null, 2)}\n`, 'utf-8')
      return seeded
    }
    throw error
  }
}

async function syncDataFromSeedIfSourcesChanged(currentData) {
  if (process.env.DIALOGS_AUTO_SYNC_SEED === '0') {
    return currentData
  }

  const dataStat = await stat(DATA_FILE).catch(() => null)
  if (!dataStat) return currentData

  const sourceStats = await Promise.all(SEED_SOURCE_FILES.map((file) => stat(file).catch(() => null)))
  const latestSourceMtimeMs = sourceStats.reduce((max, item) => Math.max(max, item?.mtimeMs ?? 0), 0)

  if (!latestSourceMtimeMs || latestSourceMtimeMs <= dataStat.mtimeMs) {
    return currentData
  }

  const seeded = { scenes: buildSeedDialogs() }
  await writeFile(DATA_FILE, `${JSON.stringify(seeded, null, 2)}\n`, 'utf-8')
  return seeded
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
  const sceneMap = new Map((data.scenes || []).map((scene) => [Number(scene.sceneId), scene]))
  let mutated = false

  for (const scene of SCENES) {
    if (!sceneMap.has(scene.id)) {
      sceneMap.set(scene.id, { sceneId: scene.id, steps: [] })
      mutated = true
    }
  }

  const scenes = [...sceneMap.values()].sort((a, b) => Number(a.sceneId) - Number(b.sceneId))
  const hasAnySteps = scenes.some((scene) => (scene.steps || []).length > 0)

  if (!hasAnySteps) {
    const seededScenes = buildSeedDialogs()
    await queueWrite({ scenes: seededScenes })
    return seededScenes
  }

  if (mutated) {
    await queueWrite({ scenes })
  }

  return scenes
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
