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
      heading: 'A - Sachlich',
      text: '„Die Stadt prüft die Einführung einer täglichen Mittagsglocke. Ziel ist eine bessere Zeitstruktur im Zentrum.“',
    },
    {
      id: 'b',
      heading: 'B - Leicht emotionalisiert',
      text: '„Die geplante Mittagsglocke sorgt für Diskussionen unter Anwohnern.“',
    },
    {
      id: 'c',
      heading: 'C - Stark zugespitzt',
      text: '„Jetzt soll uns sogar eine Glocke vorschreiben, wann Mittag ist. Wie lange lassen wir uns noch durchtakten?“',
    },
  ],
  correctChoiceId: 'c',
  success: { id: 'rightB', nextStep: 5 },
  failure: { id: 'wrongB', nextStep: 41 },
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
  const appendedStepKeysRef = useRef(new Set())
  const transitionTimerRef = useRef(null)
  const resetOnActivity2TransitionRef = useRef(false)
  const previousStepMetaRef = useRef({ part: null, type: null, stepIndex: null })

  useEffect(() => {
    setStepIndex(0)
    setLastSelectedOptionId(null)
    setChatMessages([])
    setSceneDialogs(null)
    setSelectedSentenceIndexes([])
    setLastSubmittedSentenceIndexes([])
    setSelectedIntensityChoiceId('')
    appendedStepKeysRef.current = new Set()
  }, [currentPart])

  useEffect(() => {
    if (!stepJumpRequest) return

    setStepIndex(stepJumpRequest.stepIndex ?? 0)
    setLastSelectedOptionId(null)
    setChatMessages([])
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
    ? (stepData.activityConfig || PART2_ACTIVITY1_FALLBACK_CONFIG)
    : null
  const isPart2Activity2InputStep = currentPart === 2 && Number(stepData.stepIndex) === 4
  const isPart2Activity2Context = isPart2Activity2InputStep
  const part2Activity2Config = isPart2Activity2Context
    ? (stepData.activityConfig || PART2_ACTIVITY2_FALLBACK_CONFIG)
    : null
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
  const intensityChoiceOptions = isPart2Activity2Context
    ? (part2Activity2Config?.choices || []).map((choice) => ({
      id: choice.id,
      kind: 'choice',
      label: choice.heading,
      detailText: choice.text,
      selected: selectedIntensityChoiceId === choice.id,
      choiceId: choice.id,
      groupTitle: part2Activity2Config?.title || 'Aktivität 2',
      topic: part2Activity2Config?.topic || '',
    }))
    : []
  const backendSubmitOptions = options
    .filter((item) => item.id === 'submit_confident' || item.id === 'submit_unsure')
    .map((item) => ({ ...item, kind: 'submit', disabled: selectedSentenceIndexes.length === 0 }))
  const backendActivity2SubmitOptions = options
    .filter((item) => item.id === 'submit_easy' || item.id === 'submit_unsure2')
    .map((item) => ({ ...item, kind: 'submit', disabled: !selectedIntensityChoiceId }))
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
      : displayOptions
  const monitorOptions = isPart2Activity1Context
    ? [...sentenceOptions, ...submitOptions]
    : isPart2Activity2Context
      ? [...intensityChoiceOptions, ...submitOptions]
      : displayOptions

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
  }, [isPart2Activity1Context, selectedSentenceIndexes.length, lastSubmittedSentenceIndexes.length, isPart2Activity2Context, selectedIntensityChoiceId])

  useEffect(() => {
    onStepChange?.(currentPart, stepData.stepIndex ?? 0)
  }, [currentPart, stepData.stepIndex, onStepChange])

  useEffect(() => {
    const currentType = String(stepData.type || '').toLowerCase()
    const prev = previousStepMetaRef.current
    const samePart = prev.part === currentPart
    const enteredActivity = samePart && prev.type !== 'activity' && currentType === 'activity'
    const enteredSummary = samePart && prev.type === 'activity' && currentType === 'summary'

    // For Teil 2 monitor flow: start each activity phase and summary with a clean thread.
    if (currentPart === 2 && (enteredActivity || enteredSummary)) {
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
    const conditional = speechBubbles.filter((bubble) => bubble.showOnOptionId)
    const unconditioned = speechBubbles.filter((bubble) => !bubble.showOnOptionId)
    const selectedConditional = conditional.filter((bubble) => bubble.showOnOptionId === lastSelectedOptionId)
    const effectiveBubbles = conditional.length
      ? (selectedConditional.length ? selectedConditional : unconditioned)
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

    const resetOnRetry = currentPart === 2 && option?.id === 'retry'

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

        if (resetOnRetry) {
          setChatMessages([])
          setSelectedSentenceIndexes([])
          setLastSubmittedSentenceIndexes([])
          setSelectedIntensityChoiceId('')
          appendedStepKeysRef.current = new Set()
          setLastSelectedOptionId(null)
        }

        resetOnActivity2TransitionRef.current = false
        setStepIndex(option.nextStep)
      }
    }, 220)
  }

  if (isMonitorActivityMode) {
    return (
      <MonitorActivityScene
        messages={chatMessages}
        options={monitorOptions}
        onSelectOption={handleSelectOption}
        variant={(isPart2Activity1Context || isPart2Activity2Context) ? 'monitor-select' : (activityVariantByPart[currentPart] || 'monitor')}
      />
    )
  }

  return (
    <Scene
      scene={scene}
      messages={chatMessages}
      options={displayOptions}
      onSelectOption={handleSelectOption}
      selectedAvatarId={selectedAvatarId}
      selectedHostId={selectedHostId}
    />
  )
}
