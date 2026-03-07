import { useEffect, useRef, useState } from 'react'
import { Scene } from '../components/scene/Scene.jsx'
import { MonitorActivityScene } from '../components/scene/MonitorActivityScene.jsx'
import { getSceneById } from '../data/scenes.js'
import { getPart1Step } from '../data/conversations/part1.js'
import { getSceneDialogs } from '../api/dialogApi.js'

const PART0_FALLBACK_STEPS = [
  {
    stepIndex: 0,
    type: 'intro',
    speechBubbles: [
      {
        hostId: 'ambassador',
        text: 'Willkommen in Regelreich. In dieser Stadt entstehen Regeln nicht hinter verschlossenen Türen. Sie entstehen im Gespräch. Neue Vorschläge werden veröffentlicht. Bürger kommentieren. Ideen werden diskutiert, verändert, manchmal verworfen. Der Mittelpunkt dieser Debatten ist TikTalk. Eine Plattform, auf der aus Meinungen Trends werden - und aus Trends mitunter offizielle Entscheidungen. Lange Zeit galt TikTalk als lebhaft, aber berechenbar. Doch in den letzten Monaten hat sich etwas verändert. Bestimmte Diskussionen eskalieren schneller. Einige Beiträge verbreiten sich ungewöhnlich stark. Manche Debatten kippen plötzlich in eine Richtung, die kaum noch sachlich wirkt. Im Media Lab Regelreich spricht man inzwischen von drei auffälligen Mustern. Intern wurden dafür Fallakten angelegt. Um diese Fälle systematisch zu untersuchen, wurden zusätzliche Sommerpraktika ausgeschrieben. Du bist hier, um bei der Aufklärung zu helfen.',
      },
    ],
    options: [
      { id: 'ready', label: 'Ich bin bereit!', nextStep: 1 },
      { id: 'hesitant', label: 'Muss ich?', nextStep: 1 },
    ],
  },
  {
    stepIndex: 1,
    type: 'intro',
    speechBubbles: [
      {
        hostId: 'ambassador',
        text: 'Stark, das passt zu Regelreich. Dann legen wir direkt los.',
        showOnOptionId: 'ready',
      },
      {
        hostId: 'ambassador',
        text: 'Alles gut, du musst nicht perfekt starten. Wir gehen Schritt für Schritt gemeinsam durch.',
        showOnOptionId: 'hesitant',
      },
      {
        hostId: 'ambassador',
        text: 'Wähle jetzt deinen Avatar für das Praktikum.',
      },
    ],
    options: [
      { id: 'avatar1', label: 'Avatar 1', nextStep: 2 },
      { id: 'avatar2', label: 'Avatar 2', nextStep: 2 },
      { id: 'avatar3', label: 'Avatar 3', nextStep: 2 },
    ],
  },
  {
    stepIndex: 2,
    type: 'transition',
    speechBubbles: [
      {
        hostId: 'ambassador',
        text: 'Perfekt. Weiter geht es jetzt ins Media Lab.',
      },
    ],
    options: [
      { id: 'continue', label: 'Weiter zu Teil 1', nextPart: 1 },
    ],
  },
]
const PART2_ACTIVITY1_FALLBACK_CONFIG = {
  sentences: [
    { id: 's1', text: 'Die Stadt plant, die Parkzeiten im Zentrum anzupassen.' },
    { id: 's2', text: 'Mein Nachbar hat gestern schon keinen Parkplatz mehr gefunden.' },
    { id: 's3', text: 'Schon wieder trifft es die normalen Leute.' },
    { id: 's4', text: 'Der Vorschlag wird nächste Woche beraten.' },
    { id: 's5', text: 'So fängt es immer an - erst eine kleine Änderung, dann ist alles durcheinander.' },
  ],
  correctSentenceIds: ['s2', 's3', 's5'],
  success: { id: 'rightA', nextStep: 4 },
  failure: { id: 'wrongA', nextStep: 31 },
}
const PART2_ACTIVITY2_FALLBACK_CONFIG = {
  mode: 'intensity-choice',
  title: 'Aktivität 2: Intensitätswahl',
  topic: 'Thema: Einführung einer offiziellen Mittagsglocke',
  choices: [
    {
      id: 'a',
      text: '„Die Stadt prüft die Einführung einer täglichen Mittagsglocke. Ziel ist eine bessere Zeitstruktur im Zentrum.“',
    },
    {
      id: 'b',
      text: '„Die geplante Mittagsglocke sorgt für Diskussionen unter Anwohnern.“',
    },
    {
      id: 'c',
      text: '„Jetzt soll uns sogar eine Glocke vorschreiben, wann Mittag ist. Wie lange lassen wir uns noch durchtakten?“',
    },
  ],
  correctChoiceId: 'c',
  success: { id: 'rightB', nextStep: 5 },
  failure: { id: 'wrongB', nextStep: 41 },
}
const PART3_ACTIVITY1_FALLBACK_CONFIG = {
  mode: 'intensity-choice',
  title: 'Aktivität 1: Trend-Detektor',
  topic: 'Thema: Einfuehrung eines verpflichtenden Wochenmottos',
  randomizeChoices: true,
  choices: [
    { id: 'p1', text: '„Die Stadt prüft die Einführung eines wöchentlichen Mottos für öffentliche Einrichtungen.“' },
    { id: 'p2', text: '„Immer mehr Menschen sprechen sich für ein Wochenmotto aus.“' },
    { id: 'p3', text: '„Inzwischen sind sich alle einig: Ein Wochenmotto bringt endlich klare Linie ins Stadtleben.”' },
  ],
  correctChoiceId: 'p3',
  success: { id: 'rightA', nextStep: 4 },
  failure: { id: 'wrongA', nextStep: 31 },
}
const PART3_ACTIVITY2_FALLBACK_CONFIG = {
  mode: 'consensus-boosters',
  title: 'Aktivität 2: Konsens-Verstärker',
  topic: 'Thema: Einführung einer offiziellen Geh-Richtung in Fußgängerzonen',
  prompt: 'Aktivität 2: Welche Ergänzungen lassen den Beitrag so wirken, als gäbe es bereits breiten Konsens?',
  neutralPost: '„Die Stadt prüft die Einführung einer festen Geh-Richtung in Fußgängerzonen. Der Vorschlag wird kommende Woche diskutiert.“',
  choices: [
    { id: 'a', text: '„Ich finde die Idee interessant.“' },
    { id: 'b', text: '„Mein Nachbar unterstützt das inzwischen auch.“' },
    { id: 'c', text: '„89 % sprechen sich laut einer aktuellen Umfrage dafür aus.“' },
    { id: 'd', text: '„#EndlichOrdnung“' },
    { id: 'e', text: '„Dieser Beitrag hat bereits mehr als 4.200 Likes.“' },
    { id: 'f', text: '„Mal sehen, was daraus wird.“' },
  ],
  correctChoiceIds: ['c', 'e'],
  success: { id: 'rightB', nextStep: 5 },
  failure: { id: 'wrongB', nextStep: 41 },
}
const PART4_ACTIVITY1_FALLBACK_CONFIG = {
  mode: 'bucket-sort',
  title: 'Aktivität 1: Sache oder Angriff',
  topic: 'Thema: Einheitliche Aufzugmusik in Verwaltungsgebäuden',
  prompt: 'Ordne die Aussagen ein: Was ist Kritik am Inhalt und was ist ein Angriff auf Personen?',
  unassignedLabel: 'Beiträge',
  bucketDefinitions: [
    { id: 'content', label: 'Kritik am Inhalt' },
    { id: 'person', label: 'Angriff auf Person' },
  ],
  items: [
    { id: 'a1', text: '„Die neue Aufzugmusik ist deutlich lauter als bisher und überdeckt Gespräche.“' },
    { id: 'a2', text: '„Wer diese Musik gut findet, hat offenbar keinen Geschmack.“' },
    { id: 'a3', text: '„Die Entscheidung wurde ohne ausreichende Rückmeldung der Nutzer getroffen.“' },
    { id: 'a4', text: '„Typisch für diese Entscheidungsträger - immer am Alltag vorbei.“' },
  ],
  correctAssignments: {
    a1: 'content',
    a2: 'person',
    a3: 'content',
    a4: 'person',
  },
  success: { id: 'rightA', nextStep: 4 },
  failure: { id: 'wrongA', nextStep: 31 },
}
const PART4_ACTIVITY2_FALLBACK_CONFIG = {
  mode: 'intensity-choice',
  title: 'Aktivität 2: Figurentest',
  topic: 'Thema: Offizielle Stadtfarbe',
  randomizeChoices: true,
  choices: [
    { id: 'a', text: '„Ich bezweifle, dass man Beige aus dem All wirklich gut erkennt.“' },
    { id: 'b', text: '„Beige als Leuchtsignal für Außerirdische - das muss man sich erstmal trauen.“' },
    { id: 'c', text: '„Kein Wunder, dass so ein Vorschlag von jemandem kommt, der offensichtlich keine Ahnung von Gestaltung hat.“' },
  ],
  correctChoiceId: 'c',
  success: { id: 'rightB', nextStep: 5 },
  failure: { id: 'wrongB', nextStep: 41 },
}

function resolveSentenceMarkingConfig(config, fallback) {
  if (!config || typeof config !== 'object') return fallback
  return {
    ...fallback,
    ...config,
    sentences: Array.isArray(config.sentences) && config.sentences.length ? config.sentences : fallback.sentences,
    correctSentenceIds: Array.isArray(config.correctSentenceIds) && config.correctSentenceIds.length
      ? config.correctSentenceIds
      : fallback.correctSentenceIds,
    success: config.success && typeof config.success === 'object' ? config.success : fallback.success,
    failure: config.failure && typeof config.failure === 'object' ? config.failure : fallback.failure,
  }
}

function resolveIntensityChoiceConfig(config, fallback) {
  if (!config || typeof config !== 'object') return fallback
  return {
    ...fallback,
    ...config,
    choices: Array.isArray(config.choices) && config.choices.length ? config.choices : fallback.choices,
    success: config.success && typeof config.success === 'object' ? config.success : fallback.success,
    failure: config.failure && typeof config.failure === 'object' ? config.failure : fallback.failure,
    correctChoiceId: config.correctChoiceId || fallback.correctChoiceId,
  }
}

function resolveBoosterChoiceConfig(config, fallback) {
  if (!config || typeof config !== 'object') return fallback
  return {
    ...fallback,
    ...config,
    choices: Array.isArray(config.choices) && config.choices.length ? config.choices : fallback.choices,
    correctChoiceIds: Array.isArray(config.correctChoiceIds) && config.correctChoiceIds.length
      ? config.correctChoiceIds
      : fallback.correctChoiceIds,
    success: config.success && typeof config.success === 'object' ? config.success : fallback.success,
    failure: config.failure && typeof config.failure === 'object' ? config.failure : fallback.failure,
  }
}

function resolveBucketSortConfig(config, fallback) {
  if (!config || typeof config !== 'object') return fallback
  return {
    ...fallback,
    ...config,
    bucketDefinitions:
      Array.isArray(config.bucketDefinitions) && config.bucketDefinitions.length
        ? config.bucketDefinitions
        : fallback.bucketDefinitions,
    items: Array.isArray(config.items) && config.items.length ? config.items : fallback.items,
    correctAssignments: config.correctAssignments && typeof config.correctAssignments === 'object'
      ? config.correctAssignments
      : fallback.correctAssignments,
    success: config.success && typeof config.success === 'object' ? config.success : fallback.success,
    failure: config.failure && typeof config.failure === 'object' ? config.failure : fallback.failure,
  }
}

function shuffleArray(items = []) {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

function isAvatarOption(option) {
  const id = String(option?.id || '').toLowerCase()
  return option?.kind === 'avatar' || id === 'avatar1' || id === 'avatar2' || id === 'avatar3'
}

function getHostFullName(hostId) {
  if (hostId === 'ambassador') return 'Botschafter Regelreich'
  if (hostId === 'clara') return 'Clara Blick'
  if (hostId === 'uwe') return 'Uwe R. Blick'
  return 'Host'
}

function normalizeHostId(raw, selectedHostId) {
  const id = String(raw || 'selected').toLowerCase()
  if (id === 'ambassador') return 'ambassador'
  if (id === 'clara' || id === 'uwe') return id
  if (id === 'selected') return selectedHostId || 'selected'
  return selectedHostId || 'selected'
}

function getFallbackStep(scene, currentPart, stepIndex) {
  if (currentPart === 0) {
    return PART0_FALLBACK_STEPS.find((step) => step.stepIndex === stepIndex) || PART0_FALLBACK_STEPS[0]
  }

  if (currentPart === 1) {
    const step = getPart1Step(stepIndex)
    return {
      stepIndex: step.stepIndex,
      speechBubbles: (step.speechBubbles || []).map((bubble) => ({
        hostId: bubble.characterId === 'uwe' ? 'uwe' : 'clara',
        text: bubble.text,
      })),
      options: step.options || [],
    }
  }

  return {
    stepIndex: 0,
    speechBubbles: (scene.speechBubbles || []).map((bubble) => ({
      hostId: bubble.characterId === 'host' ? 'selected' : bubble.characterId,
      text: bubble.text,
    })),
    options: scene.interaction?.options || [],
  }
}

export function GameScreen({
  currentPart,
  onPartChange,
  onSelectOption,
  stepJumpRequest,
  onStepChange,
  selectedAvatarId,
  onSelectAvatar,
  selectedHostId,
  onSelectHost,
}) {
  const scene = getSceneById(currentPart)
  const [stepIndex, setStepIndex] = useState(0)
  const [lastSelectedOptionId, setLastSelectedOptionId] = useState(null)
  const [chatMessages, setChatMessages] = useState([])
  const [sceneDialogs, setSceneDialogs] = useState(null)
  const [selectedSentenceIndexes, setSelectedSentenceIndexes] = useState([])
  const [lastSubmittedSentenceIndexes, setLastSubmittedSentenceIndexes] = useState([])
  const [selectedIntensityChoiceId, setSelectedIntensityChoiceId] = useState('')
  const [lastSubmittedIntensityChoiceId, setLastSubmittedIntensityChoiceId] = useState('')
  const [intensityChoiceOrder, setIntensityChoiceOrder] = useState([])
  const [lastSubmittedIntensityChoiceOrder, setLastSubmittedIntensityChoiceOrder] = useState([])
  const [selectedTrendChoiceId, setSelectedTrendChoiceId] = useState('')
  const [lastSubmittedTrendChoiceId, setLastSubmittedTrendChoiceId] = useState('')
  const [trendChoiceOrder, setTrendChoiceOrder] = useState([])
  const [lastSubmittedTrendChoiceOrder, setLastSubmittedTrendChoiceOrder] = useState([])
  const [selectedBoosterChoiceIds, setSelectedBoosterChoiceIds] = useState([])
  const [lastSubmittedBoosterChoiceIds, setLastSubmittedBoosterChoiceIds] = useState([])
  const [bucketAssignments, setBucketAssignments] = useState({})
  const [lastSubmittedBucketAssignments, setLastSubmittedBucketAssignments] = useState({})
  const [selectedPart4ChoiceId, setSelectedPart4ChoiceId] = useState('')
  const [lastSubmittedPart4ChoiceId, setLastSubmittedPart4ChoiceId] = useState('')
  const [part4ChoiceOrder, setPart4ChoiceOrder] = useState([])
  const [lastSubmittedPart4ChoiceOrder, setLastSubmittedPart4ChoiceOrder] = useState([])
  const appendedStepKeysRef = useRef(new Set())
  const transitionTimerRef = useRef(null)
  const resetOnActivity2TransitionRef = useRef(false)
  const resetOnPart3Activity2TransitionRef = useRef(false)
  const resetOnPart3SummaryTransitionRef = useRef(false)
  const resetOnPart4Activity2TransitionRef = useRef(false)
  const resetOnPart4WrongFeedbackTransitionRef = useRef(false)
  const resetOnPart4SummaryTransitionRef = useRef(false)
  const previousStepMetaRef = useRef({ part: null, type: null, stepIndex: null })

  useEffect(() => {
    setStepIndex(0)
    setLastSelectedOptionId(null)
    setChatMessages([])
    setSceneDialogs(null)
    setSelectedSentenceIndexes([])
    setLastSubmittedSentenceIndexes([])
    setSelectedIntensityChoiceId('')
    setLastSubmittedIntensityChoiceId('')
    setIntensityChoiceOrder([])
    setLastSubmittedIntensityChoiceOrder([])
    setSelectedTrendChoiceId('')
    setLastSubmittedTrendChoiceId('')
    setTrendChoiceOrder([])
    setLastSubmittedTrendChoiceOrder([])
    setSelectedBoosterChoiceIds([])
    setLastSubmittedBoosterChoiceIds([])
    setBucketAssignments({})
    setLastSubmittedBucketAssignments({})
    setSelectedPart4ChoiceId('')
    setLastSubmittedPart4ChoiceId('')
    setPart4ChoiceOrder([])
    setLastSubmittedPart4ChoiceOrder([])
    appendedStepKeysRef.current = new Set()
  }, [currentPart])

  useEffect(() => {
    if (!stepJumpRequest) return

    setStepIndex(stepJumpRequest.stepIndex ?? 0)
    setLastSelectedOptionId(null)
    setChatMessages([])
    setSelectedBoosterChoiceIds([])
    setLastSubmittedBoosterChoiceIds([])
    setBucketAssignments({})
    setLastSubmittedBucketAssignments({})
    setSelectedPart4ChoiceId('')
    setLastSubmittedPart4ChoiceId('')
    setPart4ChoiceOrder([])
    setLastSubmittedPart4ChoiceOrder([])
    appendedStepKeysRef.current = new Set()
  }, [stepJumpRequest])

  useEffect(() => {
    let active = true

    async function loadDialogs() {
      try {
        const data = await getSceneDialogs(currentPart)
        if (!active) return
        if (Number(data?.sceneId) !== Number(currentPart)) {
          setSceneDialogs(null)
          return
        }
        setSceneDialogs(data)
      } catch {
        if (!active) return
        setSceneDialogs(null)
      }
    }

    loadDialogs()
    return () => {
      active = false
    }
  }, [currentPart])

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current)
    }
  }, [])

  const effectiveSceneDialogs = Number(sceneDialogs?.sceneId) === Number(currentPart) ? sceneDialogs : null
  const sortedBackendSteps = [...(effectiveSceneDialogs?.steps || [])].sort((a, b) => a.stepIndex - b.stepIndex)
  const stepData =
    sortedBackendSteps.find((step) => step.stepIndex === stepIndex) ||
    sortedBackendSteps[0] ||
    getFallbackStep(scene, currentPart, stepIndex)

  const options = stepData.options || []
  const isPart2Activity1InputStep = currentPart === 2 && Number(stepData.stepIndex) === 3
  const isPart2Activity1Context = currentPart === 2 && [3, 31].includes(Number(stepData.stepIndex))
  const part2Activity1Config = isPart2Activity1Context
    ? resolveSentenceMarkingConfig(stepData.activityConfig, PART2_ACTIVITY1_FALLBACK_CONFIG)
    : PART2_ACTIVITY1_FALLBACK_CONFIG
  const isPart2Activity2InputStep = currentPart === 2 && Number(stepData.stepIndex) === 4
  const isPart2Activity2Context = currentPart === 2 && [4, 41].includes(Number(stepData.stepIndex))
  const part2Activity2Config = isPart2Activity2Context
    ? resolveIntensityChoiceConfig(stepData.activityConfig, PART2_ACTIVITY2_FALLBACK_CONFIG)
    : PART2_ACTIVITY2_FALLBACK_CONFIG
  const isPart3Activity1InputStep = currentPart === 3 && Number(stepData.stepIndex) === 3
  const isPart3Activity1Context = currentPart === 3 && [3, 31].includes(Number(stepData.stepIndex))
  const part3Activity1Config = isPart3Activity1Context
    ? resolveIntensityChoiceConfig(stepData.activityConfig, PART3_ACTIVITY1_FALLBACK_CONFIG)
    : PART3_ACTIVITY1_FALLBACK_CONFIG
  const isPart3Activity2InputStep = currentPart === 3 && Number(stepData.stepIndex) === 4
  const isPart3Activity2Context = currentPart === 3 && [4, 41].includes(Number(stepData.stepIndex))
  const part3Activity2Config = isPart3Activity2Context
    ? resolveBoosterChoiceConfig(stepData.activityConfig, PART3_ACTIVITY2_FALLBACK_CONFIG)
    : PART3_ACTIVITY2_FALLBACK_CONFIG
  const isPart4Activity1InputStep = currentPart === 4 && Number(stepData.stepIndex) === 3
  const isPart4Activity1Context = currentPart === 4 && [3, 31].includes(Number(stepData.stepIndex))
  const part4Activity1Config = isPart4Activity1Context
    ? resolveBucketSortConfig(stepData.activityConfig, PART4_ACTIVITY1_FALLBACK_CONFIG)
    : PART4_ACTIVITY1_FALLBACK_CONFIG
  const isPart4Activity2InputStep = currentPart === 4 && Number(stepData.stepIndex) === 4
  const isPart4Activity2Context = currentPart === 4 && [4, 41].includes(Number(stepData.stepIndex))
  const part4Activity2Config = isPart4Activity2Context
    ? resolveIntensityChoiceConfig(stepData.activityConfig, PART4_ACTIVITY2_FALLBACK_CONFIG)
    : PART4_ACTIVITY2_FALLBACK_CONFIG
  const isMonitorActivityMode = [2, 3, 4].includes(currentPart) && String(stepData.type || '').toLowerCase() === 'activity'
  const activityVariantByPart = { 2: 'monitor', 3: 'tablet', 4: 'hologram' }
  const displayOptions = options.map((option) => {
    if (currentPart === 0 && String(option?.id || '').toLowerCase() === 'continue') {
      return { ...option, disabled: !selectedAvatarId }
    }

    return option
  })
  const effectiveSentenceSelection = isPart2Activity1InputStep ? selectedSentenceIndexes : lastSubmittedSentenceIndexes
  const sentenceOptions = isPart2Activity1Context
    ? (part2Activity1Config?.sentences || []).map((sentence, index) => ({
      id: sentence.id || `sentence-${index + 1}`,
      kind: 'sentence',
      label: sentence.text,
      selected: effectiveSentenceSelection.includes(sentence.id),
      disabled: !isPart2Activity1InputStep,
      sentenceId: sentence.id,
    }))
    : []
  const effectiveIntensityChoiceId = isPart2Activity2InputStep ? selectedIntensityChoiceId : lastSubmittedIntensityChoiceId
  const part2ChoiceOrder = isPart2Activity2InputStep ? intensityChoiceOrder : lastSubmittedIntensityChoiceOrder
  const orderedPart2Choices = (() => {
    const choices = part2Activity2Config?.choices || []
    if (!part2ChoiceOrder.length) return choices
    const byId = new Map(choices.map((choice) => [choice.id, choice]))
    return part2ChoiceOrder.map((id) => byId.get(id)).filter(Boolean)
  })()
  const intensityChoiceOptions = isPart2Activity2Context
    ? orderedPart2Choices.map((choice) => ({
      id: choice.id,
      kind: 'choice',
      text: choice.text,
      selected: effectiveIntensityChoiceId === choice.id,
      disabled: !isPart2Activity2InputStep,
      choiceId: choice.id,
      groupTitle: part2Activity2Config?.title || 'Aktivität 2',
      topic: part2Activity2Config?.topic || '',
    }))
    : []
  const effectiveTrendChoiceId = isPart3Activity1InputStep ? selectedTrendChoiceId : lastSubmittedTrendChoiceId
  const part3ChoiceOrder = isPart3Activity1InputStep ? trendChoiceOrder : lastSubmittedTrendChoiceOrder
  const orderedPart3Choices = (() => {
    const choices = part3Activity1Config?.choices || []
    if (!part3ChoiceOrder.length) return choices
    const byId = new Map(choices.map((choice) => [choice.id, choice]))
    return part3ChoiceOrder.map((id) => byId.get(id)).filter(Boolean)
  })()
  const trendChoiceOptions = isPart3Activity1Context
    ? orderedPart3Choices.map((choice) => ({
      id: choice.id,
      kind: 'choice',
      text: choice.text,
      selected: effectiveTrendChoiceId === choice.id,
      disabled: !isPart3Activity1InputStep,
      choiceId: choice.id,
      groupTitle: part3Activity1Config?.title || 'Aktivität 1',
      topic: part3Activity1Config?.topic || '',
    }))
    : []
  const effectiveBoosterChoiceIds = isPart3Activity2InputStep ? selectedBoosterChoiceIds : lastSubmittedBoosterChoiceIds
  const boosterChoiceOptions = isPart3Activity2Context
    ? (part3Activity2Config?.choices || []).map((choice) => ({
      id: choice.id,
      kind: 'booster',
      text: choice.text,
      selected: effectiveBoosterChoiceIds.includes(choice.id),
      disabled: !isPart3Activity2InputStep,
      choiceId: choice.id,
      groupTitle: part3Activity2Config?.title || 'Aktivität 2',
      topic: part3Activity2Config?.topic || '',
      prompt: part3Activity2Config?.prompt || '',
      neutralPost: part3Activity2Config?.neutralPost || '',
    }))
    : []
  const effectiveBucketAssignments = isPart4Activity1InputStep ? bucketAssignments : lastSubmittedBucketAssignments
  const bucketAssignmentOptions = isPart4Activity1Context
    ? (part4Activity1Config?.items || []).map((item) => ({
      id: item.id,
      itemId: item.id,
      kind: 'bucket-assignment',
      text: item.text,
      assignedBucketId: effectiveBucketAssignments[item.id] || '',
      disabled: !isPart4Activity1InputStep,
      groupTitle: part4Activity1Config?.title || 'Aktivität 1',
      topic: part4Activity1Config?.topic || '',
      prompt: part4Activity1Config?.prompt || '',
      unassignedLabel: part4Activity1Config?.unassignedLabel || 'Beiträge',
      bucketDefinitions: part4Activity1Config?.bucketDefinitions || [],
    }))
    : []
  const effectivePart4ChoiceId = isPart4Activity2InputStep ? selectedPart4ChoiceId : lastSubmittedPart4ChoiceId
  const part4ChoiceOrderSource = isPart4Activity2InputStep ? part4ChoiceOrder : lastSubmittedPart4ChoiceOrder
  const orderedPart4Choices = (() => {
    const choices = part4Activity2Config?.choices || []
    if (!part4ChoiceOrderSource.length) return choices
    const byId = new Map(choices.map((choice) => [choice.id, choice]))
    return part4ChoiceOrderSource.map((id) => byId.get(id)).filter(Boolean)
  })()
  const part4ChoiceOptions = isPart4Activity2Context
    ? orderedPart4Choices.map((choice) => ({
      id: choice.id,
      kind: 'choice',
      text: choice.text,
      selected: effectivePart4ChoiceId === choice.id,
      disabled: !isPart4Activity2InputStep,
      choiceId: choice.id,
      groupTitle: part4Activity2Config?.title || 'Aktivität 2',
      topic: part4Activity2Config?.topic || '',
    }))
    : []
  const backendSubmitOptions = options
    .filter((item) => item.id === 'submit_confident' || item.id === 'submit_unsure')
    .map((item) => ({ ...item, kind: 'submit', disabled: selectedSentenceIndexes.length === 0 }))
  const backendActivity2SubmitOptions = options
    .filter((item) => item.id === 'submit_easy' || item.id === 'submit_unsure2')
    .map((item) => ({ ...item, kind: 'submit', disabled: !selectedIntensityChoiceId }))
  const backendTrendSubmitOptions = options
    .filter((item) => item.id === 'submit_easy3' || item.id === 'submit_unsure3')
    .map((item) => ({ ...item, kind: 'submit', disabled: !selectedTrendChoiceId }))
  const backendBoosterSubmitOptions = options
    .filter((item) => item.id === 'submit_confident4' || item.id === 'submit_unsure4')
    .map((item) => ({ ...item, kind: 'submit', disabled: !selectedBoosterChoiceIds.length }))
  const totalBucketItems = (part4Activity1Config?.items || []).length
  const assignedBucketItemsCount = Object.keys(bucketAssignments || {}).filter((id) => Boolean(bucketAssignments[id])).length
  const backendBucketSubmitOptions = options
    .filter((item) => item.id === 'submit_sorted5' || item.id === 'submit_unsure5')
    .map((item) => ({ ...item, kind: 'submit', disabled: assignedBucketItemsCount < totalBucketItems }))
  const backendPart4SubmitOptions = options
    .filter((item) => item.id === 'submit_ouch6' || item.id === 'submit_far6')
    .map((item) => ({ ...item, kind: 'submit', disabled: !selectedPart4ChoiceId }))
  const submitOptions = isPart2Activity1InputStep
    ? (backendSubmitOptions.length
      ? backendSubmitOptions
      : [
        { id: 'submit_confident', label: 'Ich bin mir sicher.', kind: 'submit', disabled: selectedSentenceIndexes.length === 0 },
        { id: 'submit_unsure', label: 'Ich hoffe, es stimmt.', kind: 'submit', disabled: selectedSentenceIndexes.length === 0 },
      ])
    : isPart2Activity2InputStep
      ? (backendActivity2SubmitOptions.length
        ? backendActivity2SubmitOptions
        : [
          { id: 'submit_easy', label: 'Das ist einfach.', kind: 'submit', disabled: !selectedIntensityChoiceId },
          { id: 'submit_unsure2', label: 'Ich habe eigentlich keine Ahnung.', kind: 'submit', disabled: !selectedIntensityChoiceId },
        ])
      : isPart3Activity1InputStep
        ? (backendTrendSubmitOptions.length
          ? backendTrendSubmitOptions
          : [
            { id: 'submit_easy3', label: 'Das schreit nach Konrad!', kind: 'submit', disabled: !selectedTrendChoiceId },
            { id: 'submit_unsure3', label: 'Konrad - bist du es?', kind: 'submit', disabled: !selectedTrendChoiceId },
          ])
        : isPart3Activity2InputStep
          ? (backendBoosterSubmitOptions.length
            ? backendBoosterSubmitOptions
            : [
              { id: 'submit_confident4', label: 'Das wirkt nach echtem Konsens.', kind: 'submit', disabled: !selectedBoosterChoiceIds.length },
              { id: 'submit_unsure4', label: 'Ich bin unsicher.', kind: 'submit', disabled: !selectedBoosterChoiceIds.length },
            ])
          : isPart4Activity1InputStep
            ? (backendBucketSubmitOptions.length
              ? backendBucketSubmitOptions
              : [
                { id: 'submit_sorted5', label: 'Einsortiert. Didi kann kommen.', kind: 'submit', disabled: assignedBucketItemsCount < totalBucketItems },
                { id: 'submit_unsure5', label: 'Ich hoffe, ich habe niemanden falsch beschuldigt.', kind: 'submit', disabled: assignedBucketItemsCount < totalBucketItems },
              ])
            : isPart4Activity2InputStep
              ? (backendPart4SubmitOptions.length
                ? backendPart4SubmitOptions
                : [
                  { id: 'submit_ouch6', label: 'Autsch. Unter die Gürtellinie.', kind: 'submit', disabled: !selectedPart4ChoiceId },
                  { id: 'submit_far6', label: 'Geht das schon zu weit?', kind: 'submit', disabled: !selectedPart4ChoiceId },
                ])
          : displayOptions
  const monitorOptions = isPart2Activity1Context
    ? [...sentenceOptions, ...submitOptions]
    : isPart2Activity2Context
      ? [...intensityChoiceOptions, ...submitOptions]
      : isPart3Activity1Context
        ? [...trendChoiceOptions, ...submitOptions]
        : isPart3Activity2Context
          ? [...boosterChoiceOptions, ...submitOptions]
          : isPart4Activity1Context
            ? [...bucketAssignmentOptions, ...submitOptions]
            : isPart4Activity2Context
              ? [...part4ChoiceOptions, ...submitOptions]
          : displayOptions

  useEffect(() => {
    if (!isPart2Activity2InputStep) return
    if (intensityChoiceOrder.length) return
    const ids = (part2Activity2Config?.choices || []).map((choice) => choice.id)
    if (!ids.length) return
    const randomized = part2Activity2Config?.randomizeChoices === false ? ids : shuffleArray(ids)
    setIntensityChoiceOrder(randomized)
  }, [isPart2Activity2InputStep, intensityChoiceOrder.length, part2Activity2Config])

  useEffect(() => {
    if (!isPart3Activity1InputStep) return
    if (trendChoiceOrder.length) return
    const ids = (part3Activity1Config?.choices || []).map((choice) => choice.id)
    if (!ids.length) return
    const randomized = part3Activity1Config?.randomizeChoices === false ? ids : shuffleArray(ids)
    setTrendChoiceOrder(randomized)
  }, [isPart3Activity1InputStep, trendChoiceOrder.length, part3Activity1Config])

  useEffect(() => {
    if (!isPart4Activity2InputStep) return
    if (part4ChoiceOrder.length) return
    const ids = (part4Activity2Config?.choices || []).map((choice) => choice.id)
    if (!ids.length) return
    const randomized = part4Activity2Config?.randomizeChoices === false ? ids : shuffleArray(ids)
    setPart4ChoiceOrder(randomized)
  }, [isPart4Activity2InputStep, part4ChoiceOrder.length, part4Activity2Config])

  useEffect(() => {
    if (!isPart2Activity1Context && selectedSentenceIndexes.length) {
      setSelectedSentenceIndexes([])
    }
    if (!isPart2Activity1Context && lastSubmittedSentenceIndexes.length) {
      setLastSubmittedSentenceIndexes([])
    }
    if (!isPart2Activity2Context && selectedIntensityChoiceId) {
      setSelectedIntensityChoiceId('')
    }
    if (!isPart2Activity2Context && lastSubmittedIntensityChoiceId) {
      setLastSubmittedIntensityChoiceId('')
    }
    if (!isPart2Activity2Context && intensityChoiceOrder.length) {
      setIntensityChoiceOrder([])
    }
    if (!isPart2Activity2Context && lastSubmittedIntensityChoiceOrder.length) {
      setLastSubmittedIntensityChoiceOrder([])
    }
    if (!isPart3Activity1Context && selectedTrendChoiceId) {
      setSelectedTrendChoiceId('')
    }
    if (!isPart3Activity1Context && lastSubmittedTrendChoiceId) {
      setLastSubmittedTrendChoiceId('')
    }
    if (!isPart3Activity1Context && trendChoiceOrder.length) {
      setTrendChoiceOrder([])
    }
    if (!isPart3Activity1Context && lastSubmittedTrendChoiceOrder.length) {
      setLastSubmittedTrendChoiceOrder([])
    }
    if (!isPart3Activity2Context && selectedBoosterChoiceIds.length) {
      setSelectedBoosterChoiceIds([])
    }
    if (!isPart3Activity2Context && lastSubmittedBoosterChoiceIds.length) {
      setLastSubmittedBoosterChoiceIds([])
    }
    if (!isPart4Activity1Context && Object.keys(bucketAssignments).length) {
      setBucketAssignments({})
    }
    if (!isPart4Activity1Context && Object.keys(lastSubmittedBucketAssignments).length) {
      setLastSubmittedBucketAssignments({})
    }
    if (!isPart4Activity2Context && selectedPart4ChoiceId) {
      setSelectedPart4ChoiceId('')
    }
    if (!isPart4Activity2Context && lastSubmittedPart4ChoiceId) {
      setLastSubmittedPart4ChoiceId('')
    }
    if (!isPart4Activity2Context && part4ChoiceOrder.length) {
      setPart4ChoiceOrder([])
    }
    if (!isPart4Activity2Context && lastSubmittedPart4ChoiceOrder.length) {
      setLastSubmittedPart4ChoiceOrder([])
    }
  }, [isPart2Activity1Context, selectedSentenceIndexes.length, lastSubmittedSentenceIndexes.length, isPart2Activity2Context, selectedIntensityChoiceId, lastSubmittedIntensityChoiceId, intensityChoiceOrder.length, lastSubmittedIntensityChoiceOrder.length, isPart3Activity1Context, selectedTrendChoiceId, lastSubmittedTrendChoiceId, trendChoiceOrder.length, lastSubmittedTrendChoiceOrder.length, isPart3Activity2Context, selectedBoosterChoiceIds.length, lastSubmittedBoosterChoiceIds.length, isPart4Activity1Context, bucketAssignments, lastSubmittedBucketAssignments, isPart4Activity2Context, selectedPart4ChoiceId, lastSubmittedPart4ChoiceId, part4ChoiceOrder.length, lastSubmittedPart4ChoiceOrder.length])

  useEffect(() => {
    onStepChange?.(currentPart, stepData.stepIndex ?? 0)
  }, [currentPart, stepData.stepIndex, onStepChange])

  useEffect(() => {
    const currentType = String(stepData.type || '').toLowerCase()
    const prev = previousStepMetaRef.current
    const samePart = prev.part === currentPart
    const enteredActivity = samePart && prev.type !== 'activity' && currentType === 'activity'
    const enteredSummary = samePart && prev.type === 'activity' && currentType === 'summary'
    const enteredPart3Activity1 = currentPart === 3 && Number(stepData.stepIndex) === 3 && Number(prev.stepIndex) !== 3

    // For monitor activities: start with a clean thread when entering activity sections.
    if (
      ((currentPart === 2) && (enteredActivity || enteredSummary)) ||
      ((currentPart === 3) && (enteredActivity || enteredPart3Activity1)) ||
      ((currentPart === 4) && enteredActivity)
    ) {
      setChatMessages([])
      appendedStepKeysRef.current = new Set()
    }

    previousStepMetaRef.current = {
      part: currentPart,
      type: currentType,
      stepIndex: stepData.stepIndex ?? 0,
    }
  }, [currentPart, stepData.stepIndex, stepData.type])

  useEffect(() => {
    const effectiveStepIndex = stepData.stepIndex ?? stepIndex
    const key = `${currentPart}:${effectiveStepIndex}`
    if (appendedStepKeysRef.current.has(key)) return

    appendedStepKeysRef.current.add(key)
    const speechBubbles = stepData.speechBubbles || []
    const hasConditional = speechBubbles.some((bubble) => bubble.showOnOptionId)
    const effectiveBubbles = hasConditional
      ? speechBubbles.filter((bubble) => !bubble.showOnOptionId || bubble.showOnOptionId === lastSelectedOptionId)
      : speechBubbles

    const hostMessages = effectiveBubbles.map((bubble, index) => {
      const resolvedHostId = normalizeHostId(bubble.hostId, selectedHostId)

      return {
        id: `${key}:host:${index}`,
        speakerType: 'host',
        hostId: resolvedHostId,
        speakerName: getHostFullName(resolvedHostId),
        text: bubble.text,
      }
    })

    setChatMessages((prev) => [...prev, ...hostMessages])
  }, [currentPart, stepData, stepIndex, selectedHostId, lastSelectedOptionId])

  const handleSelectOption = (index, option) => {
    if (isPart2Activity1InputStep && option?.kind === 'sentence') {
      const sentenceId = String(option.sentenceId || '')
      setSelectedSentenceIndexes((prev) => (
        prev.includes(sentenceId)
          ? prev.filter((item) => item !== sentenceId)
          : [...prev, sentenceId].sort()
      ))
      return
    }

    if (isPart2Activity1InputStep && option?.kind === 'submit') {
      const correctSentenceIds = part2Activity1Config?.correctSentenceIds || []
      const selectedCorrectCount = selectedSentenceIndexes.filter((item) => correctSentenceIds.includes(item)).length
      const selectedWrongCount = selectedSentenceIndexes.length - selectedCorrectCount
      const isCorrect =
        selectedSentenceIndexes.length === correctSentenceIds.length &&
        correctSentenceIds.every((item) => selectedSentenceIndexes.includes(item))

      const baseWrongOption = {
        id: part2Activity1Config?.failure?.id || 'wrongA',
        nextStep: part2Activity1Config?.failure?.nextStep ?? 31,
      }
      const mappedOption = isCorrect
        ? {
          id: part2Activity1Config?.success?.id || 'rightA',
          nextStep: part2Activity1Config?.success?.nextStep ?? 4,
        }
        : selectedCorrectCount === 0
          ? baseWrongOption
          : selectedWrongCount === 0
            ? { ...baseWrongOption, id: 'wrongPartial' }
            : { ...baseWrongOption, id: 'wrongMixed' }

      if (!mappedOption) return

      resetOnActivity2TransitionRef.current = Boolean(
        isCorrect && mappedOption.id === (part2Activity1Config?.success?.id || 'rightA')
      )
      setLastSubmittedSentenceIndexes(selectedSentenceIndexes)
      option = { ...mappedOption, label: option.label }
    } else {
      resetOnActivity2TransitionRef.current = false
    }

    if (isPart2Activity2InputStep && option?.kind === 'choice') {
      setSelectedIntensityChoiceId(String(option.choiceId || ''))
      return
    }

    if (isPart2Activity2InputStep && option?.kind === 'submit') {
      const correctChoiceId = String(part2Activity2Config?.correctChoiceId || 'c')
      const isCorrect = selectedIntensityChoiceId === correctChoiceId
      const mappedOption = isCorrect
        ? {
          id: part2Activity2Config?.success?.id || 'rightB',
          nextStep: part2Activity2Config?.success?.nextStep ?? 5,
        }
        : {
          id: part2Activity2Config?.failure?.id || 'wrongB',
          nextStep: part2Activity2Config?.failure?.nextStep ?? 41,
        }

      setLastSubmittedIntensityChoiceId(selectedIntensityChoiceId)
      setLastSubmittedIntensityChoiceOrder(intensityChoiceOrder)
      option = { ...mappedOption, label: option.label }
    }

    if (isPart3Activity1InputStep && option?.kind === 'choice') {
      setSelectedTrendChoiceId(String(option.choiceId || ''))
      return
    }

    if (isPart3Activity1InputStep && option?.kind === 'submit') {
      const correctChoiceId = String(part3Activity1Config?.correctChoiceId || 'p3')
      const isCorrect = selectedTrendChoiceId === correctChoiceId
      const mappedOption = isCorrect
        ? {
          id: part3Activity1Config?.success?.id || 'rightA',
          nextStep: part3Activity1Config?.success?.nextStep ?? 4,
        }
        : {
          id: part3Activity1Config?.failure?.id || 'wrongA',
          nextStep: part3Activity1Config?.failure?.nextStep ?? 31,
        }

      resetOnPart3Activity2TransitionRef.current = Boolean(
        isCorrect && mappedOption.id === (part3Activity1Config?.success?.id || 'rightA')
      )
      setLastSubmittedTrendChoiceId(selectedTrendChoiceId)
      setLastSubmittedTrendChoiceOrder(trendChoiceOrder)
      option = { ...mappedOption, label: option.label }
    } else if (!isPart3Activity1InputStep) {
      resetOnPart3Activity2TransitionRef.current = false
    }

    if (isPart3Activity2InputStep && option?.kind === 'booster') {
      const choiceId = String(option.choiceId || '')
      setSelectedBoosterChoiceIds((prev) => (
        prev.includes(choiceId)
          ? prev.filter((item) => item !== choiceId)
          : [...prev, choiceId].sort()
      ))
      return
    }

    if (isPart3Activity2InputStep && option?.kind === 'submit') {
      const correctChoiceIds = part3Activity2Config?.correctChoiceIds || []
      const selectedCorrectCount = selectedBoosterChoiceIds.filter((item) => correctChoiceIds.includes(item)).length
      const selectedWrongCount = selectedBoosterChoiceIds.length - selectedCorrectCount
      const isCorrect =
        selectedBoosterChoiceIds.length === correctChoiceIds.length &&
        correctChoiceIds.every((item) => selectedBoosterChoiceIds.includes(item))

      const baseWrongOption = {
        id: part3Activity2Config?.failure?.id || 'wrongB',
        nextStep: part3Activity2Config?.failure?.nextStep ?? 41,
      }
      const mappedOption = isCorrect
        ? {
          id: part3Activity2Config?.success?.id || 'rightB',
          nextStep: part3Activity2Config?.success?.nextStep ?? 5,
        }
        : selectedCorrectCount === 0
          ? baseWrongOption
          : selectedWrongCount === 0
            ? { ...baseWrongOption, id: 'wrongBPartial' }
            : { ...baseWrongOption, id: 'wrongBMixed' }

      setLastSubmittedBoosterChoiceIds(selectedBoosterChoiceIds)
      resetOnPart3SummaryTransitionRef.current = Boolean(isCorrect)
      option = { ...mappedOption, label: option.label }
    }

    if (isPart4Activity1InputStep && option?.kind === 'bucket-drop') {
      const itemId = String(option.itemId || '')
      const bucketId = String(option.bucketId || '')
      if (!itemId) return
      setBucketAssignments((prev) => {
        const next = { ...prev }
        if (!bucketId) {
          delete next[itemId]
        } else {
          next[itemId] = bucketId
        }
        return next
      })
      return
    }

    if (isPart4Activity1InputStep && option?.kind === 'submit') {
      const items = part4Activity1Config?.items || []
      const correctAssignments = part4Activity1Config?.correctAssignments || {}
      const selectedAssignments = bucketAssignments || {}
      const totalCount = items.length
      const assignedCount = items.filter((item) => Boolean(selectedAssignments[item.id])).length
      const correctCount = items.filter((item) => selectedAssignments[item.id] === correctAssignments[item.id]).length
      const wrongCount = assignedCount - correctCount
      const assignedPersonCount = items.filter((item) => selectedAssignments[item.id] === 'person').length
      const isCorrect = totalCount > 0 && correctCount === totalCount

      const baseWrongOption = {
        id: part4Activity1Config?.failure?.id || 'wrongA',
        nextStep: part4Activity1Config?.failure?.nextStep ?? 31,
      }
      const mappedOption = isCorrect
        ? {
          id: part4Activity1Config?.success?.id || 'rightA',
          nextStep: part4Activity1Config?.success?.nextStep ?? 4,
        }
        : assignedCount < totalCount
          ? { ...baseWrongOption, id: 'wrongAIncomplete' }
          : assignedPersonCount === 0
            ? { ...baseWrongOption, id: 'wrongAOnlyContent' }
            : correctCount === 0
              ? { ...baseWrongOption, id: 'wrongAAllWrong' }
              : wrongCount > 0
                ? { ...baseWrongOption, id: 'wrongAMixed' }
                : baseWrongOption

      setLastSubmittedBucketAssignments(selectedAssignments)
      resetOnPart4Activity2TransitionRef.current = Boolean(isCorrect)
      resetOnPart4WrongFeedbackTransitionRef.current = Boolean(!isCorrect)
      option = { ...mappedOption, label: option.label }
    }

    if (isPart4Activity2InputStep && option?.kind === 'choice') {
      setSelectedPart4ChoiceId(String(option.choiceId || ''))
      return
    }

    if (isPart4Activity2InputStep && option?.kind === 'submit') {
      const correctChoiceId = String(part4Activity2Config?.correctChoiceId || 'c')
      const isCorrect = selectedPart4ChoiceId === correctChoiceId
      const mappedOption = isCorrect
        ? {
          id: part4Activity2Config?.success?.id || 'rightB',
          nextStep: part4Activity2Config?.success?.nextStep ?? 5,
        }
        : {
          id: part4Activity2Config?.failure?.id || 'wrongB',
          nextStep: part4Activity2Config?.failure?.nextStep ?? 41,
        }

      resetOnPart4SummaryTransitionRef.current = Boolean(isCorrect)
      setLastSubmittedPart4ChoiceId(selectedPart4ChoiceId)
      setLastSubmittedPart4ChoiceOrder(part4ChoiceOrder)
      option = { ...mappedOption, label: option.label }
    }

    onSelectOption?.(index, option, currentPart)
    setLastSelectedOptionId(option?.id ?? null)

    if (currentPart === 0 && isAvatarOption(option)) {
      onSelectAvatar?.(String(option.id).toLowerCase())
    }

    const selectedFromPart1 = currentPart === 1 && stepData.stepIndex === 0 && (option?.id === 'clara' || option?.id === 'uwe')
    if (selectedFromPart1) {
      onSelectHost?.(option.id)
    }

    if (option?.label && !isAvatarOption(option)) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `player:${currentPart}:${Date.now()}:${index}`,
          speakerType: 'player',
          speakerName: 'Du',
          text: option.label,
        },
      ])
    }

    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current)

    const shouldNavigate = option?.nextPart != null || option?.nextStep != null
    if (!shouldNavigate) return

    const resetOnRetryPart2 = currentPart === 2 && option?.id === 'retry'
    const resetOnRetryPart3 = currentPart === 3 && option?.id === 'retry'
    const resetOnRetryPart4 = currentPart === 4 && option?.id === 'retry'

    transitionTimerRef.current = setTimeout(() => {
      if (option?.nextPart != null && onPartChange) {
        onPartChange(option.nextPart)
        setStepIndex(0)
        return
      }

      if (option?.nextStep != null) {
        if (resetOnActivity2TransitionRef.current && currentPart === 2 && Number(option.nextStep) === 4) {
          setChatMessages([])
          setSelectedSentenceIndexes([])
          setLastSubmittedSentenceIndexes([])
          appendedStepKeysRef.current = new Set()
        }

        if (resetOnPart3Activity2TransitionRef.current && currentPart === 3 && Number(option.nextStep) === 4) {
          setChatMessages([])
          setSelectedTrendChoiceId('')
          setLastSubmittedTrendChoiceId('')
          setTrendChoiceOrder([])
          setLastSubmittedTrendChoiceOrder([])
          setSelectedBoosterChoiceIds([])
          setLastSubmittedBoosterChoiceIds([])
          appendedStepKeysRef.current = new Set()
        }

        if (resetOnPart3SummaryTransitionRef.current && currentPart === 3 && Number(option.nextStep) === 5) {
          setChatMessages([])
          setSelectedBoosterChoiceIds([])
          setLastSubmittedBoosterChoiceIds([])
          appendedStepKeysRef.current = new Set()
        }

        if (resetOnPart4Activity2TransitionRef.current && currentPart === 4 && Number(option.nextStep) === 4) {
          setChatMessages([])
          setBucketAssignments({})
          setLastSubmittedBucketAssignments({})
          setSelectedPart4ChoiceId('')
          setLastSubmittedPart4ChoiceId('')
          setPart4ChoiceOrder([])
          setLastSubmittedPart4ChoiceOrder([])
          appendedStepKeysRef.current = new Set()
        }

        if (resetOnPart4WrongFeedbackTransitionRef.current && currentPart === 4 && Number(option.nextStep) === 31) {
          setChatMessages([])
          appendedStepKeysRef.current = new Set()
        }

        if (resetOnPart4SummaryTransitionRef.current && currentPart === 4 && Number(option.nextStep) === 5) {
          setChatMessages([])
          setSelectedPart4ChoiceId('')
          setLastSubmittedPart4ChoiceId('')
          setPart4ChoiceOrder([])
          setLastSubmittedPart4ChoiceOrder([])
          appendedStepKeysRef.current = new Set()
        }

        if (resetOnRetryPart2) {
          setChatMessages([])
          setSelectedSentenceIndexes([])
          setLastSubmittedSentenceIndexes([])
          setSelectedIntensityChoiceId('')
          setLastSubmittedIntensityChoiceId('')
          setIntensityChoiceOrder([])
          setLastSubmittedIntensityChoiceOrder([])
          appendedStepKeysRef.current = new Set()
          setLastSelectedOptionId(null)
        }

        if (resetOnRetryPart3) {
          setChatMessages([])
          setSelectedTrendChoiceId('')
          setLastSubmittedTrendChoiceId('')
          setTrendChoiceOrder([])
          setLastSubmittedTrendChoiceOrder([])
          setSelectedBoosterChoiceIds([])
          setLastSubmittedBoosterChoiceIds([])
          appendedStepKeysRef.current = new Set()
          setLastSelectedOptionId(null)
        }

        if (resetOnRetryPart4) {
          setChatMessages([])
          setBucketAssignments({})
          setLastSubmittedBucketAssignments({})
          setSelectedPart4ChoiceId('')
          setLastSubmittedPart4ChoiceId('')
          setPart4ChoiceOrder([])
          setLastSubmittedPart4ChoiceOrder([])
          appendedStepKeysRef.current = new Set()
          setLastSelectedOptionId(null)
        }

        resetOnActivity2TransitionRef.current = false
        resetOnPart3Activity2TransitionRef.current = false
        resetOnPart3SummaryTransitionRef.current = false
        resetOnPart4Activity2TransitionRef.current = false
        resetOnPart4WrongFeedbackTransitionRef.current = false
        resetOnPart4SummaryTransitionRef.current = false
        setStepIndex(option.nextStep)
      }
    }, 220)
  }

  if (isMonitorActivityMode) {
    const part2SelectMode = isPart2Activity1Context || isPart2Activity2Context
    const monitorVariant = part2SelectMode
      ? 'keller-monitor-select'
      : (isPart3Activity1Context || isPart3Activity2Context || isPart4Activity1Context || isPart4Activity2Context)
        ? 'monitor-select'
        : (activityVariantByPart[currentPart] || 'monitor')

    return (
      <MonitorActivityScene
        messages={chatMessages}
        options={monitorOptions}
        onSelectOption={handleSelectOption}
        variant={monitorVariant}
        backgroundImage={part2SelectMode ? '/backgrounds/keller-monitor.png' : null}
      />
    )
  }

  const sceneForRender =
    currentPart === 2
      ? {
        ...scene,
        backgroundImage:
          selectedHostId === 'clara'
            ? '/backgrounds/keller-klara.png'
            : selectedHostId === 'uwe'
              ? '/backgrounds/keller-uwe.png'
              : scene.backgroundImage,
      }
      : scene

  return (
    <Scene
      scene={sceneForRender}
      messages={chatMessages}
      options={displayOptions}
      onSelectOption={handleSelectOption}
      selectedAvatarId={selectedAvatarId}
      selectedHostId={selectedHostId}
    />
  )
}
