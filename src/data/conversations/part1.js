/**
 * Teil 1: Konversation mit drei Interaktionsschleifen (erfunden, Skript folgt später).
 * Jeder Schritt: Sprechblasen (Größe dynamisch nach Textumfang) + Antwortoptionen.
 * nextStep = Index des nächsten Schritts, nextPart = Wechsel zu anderem Teil.
 */
export const PART1_CONVERSATION = [
  {
    stepIndex: 0,
    speechBubbles: [
      {
        characterId: 'clara',
        speakerName: 'Clara',
        text: 'Willkommen vor dem Media Lab! Schön, dass ihr da seid. Hier startet euer Sommerpraktikum – wir analysieren Debatten auf TikTalk und schauen uns dabei drei besonders auffällige Profile an.',
        anchor: 'left',
      },
      {
        characterId: 'uwe',
        speakerName: 'Uwe-R.',
        text: 'Bevor es losgeht: Wählt, mit wem ihr ins Praktikum starten wollt – oder ob ihr direkt mehr zu den Fallakten wissen möchtet.',
        anchor: 'right',
      },
    ],
    options: [
      { id: 'clara', label: 'Mit Clara starten.', nextStep: 1 },
      { id: 'uwe', label: 'Mit Uwe-R. starten.', nextStep: 1 },
    ],
  },
  {
    stepIndex: 1,
    speechBubbles: [
      {
        characterId: 'clara',
        speakerName: 'Clara',
        text: 'Super! Die drei Fallakten heißen Emma Pör, Konrad Sens und Didi Fam. Jeder steht für ein typisches Muster: emotionale Zuspitzung, Mitläufereffekt oder Diskreditierung. Im Praktikum lernt ihr, genau das zu erkennen.',
        anchor: 'left',
      },
      {
        characterId: 'uwe',
        speakerName: 'Uwe-R.',
        text: 'Keine Sorge – das ist keine Prüfung. Ihr bekommt Feedback und könnt Dinge wiederholen. Am Ende schafft ihr alle Stufen.',
        anchor: 'right',
      },
    ],
    options: [
      { id: 'ok', label: 'Klingt gut, ich bin bereit.', nextStep: 2 },
      { id: 'frage', label: 'Was genau machen wir in den Fallakten?', nextStep: 2 },
    ],
  },
  {
    stepIndex: 2,
    speechBubbles: [
      {
        characterId: 'clara',
        speakerName: 'Clara',
        text: 'Ihr bekommt Einführungen zu jeder Strategie, dann Beispielposts aus TikTalk – und danach kleine Analyseaufträge. Wenn ihr etwas falsch zuordnet, erklären wir es und ihr probiert es erneut.',
        anchor: 'left',
      },
      {
        characterId: 'uwe',
        speakerName: 'Uwe-R.',
        text: 'Nach jedem Kapitel steigt ihr eine Karrierestufe auf – von der Musterbeobachtung bis zur zertifizierten Debattenarchitektin bzw. zum Debattenarchitekten. Klingt absurd, ist aber so.',
        anchor: 'right',
      },
    ],
    options: [
      { id: 'los', label: 'Ja, lass uns loslegen!', nextStep: 3 },
      { id: 'noch', label: 'Noch eine kurze Frage, bitte.', nextStep: 3 },
    ],
  },
  {
    stepIndex: 3,
    speechBubbles: [
      {
        characterId: 'clara',
        speakerName: 'Clara',
        text: 'Dann auf ins Praktikum! Wir starten im Keller mit der ersten Fallakte – Emma Pör. Bis gleich!',
        anchor: 'left',
      },
      {
        characterId: 'uwe',
        speakerName: 'Uwe-R.',
        text: 'Viel Erfolg. Bei Fragen sind wir da.',
        anchor: 'right',
      },
    ],
    options: [
      { id: 'weiter', label: 'Weiter zum Keller (Teil 2)', nextPart: 2 },
    ],
  },
]

export function getPart1Step(stepIndex) {
  return PART1_CONVERSATION[stepIndex] ?? PART1_CONVERSATION[0]
}
