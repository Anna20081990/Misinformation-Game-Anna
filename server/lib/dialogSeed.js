import { SCENES } from '../../src/data/scenes.js'

function step(stepIndex, type, speechBubbles, options) {
  return { stepIndex, type, speechBubbles, options }
}

function bubble(hostId, text) {
  return { hostId, text }
}

function option(id, label, nextStep = null, nextPart = null) {
  const out = { id, label }
  if (nextStep != null) out.nextStep = nextStep
  if (nextPart != null) out.nextPart = nextPart
  return out
}

function scene1Steps() {
  return [
    step(0, 'intro', [
      bubble('clara', 'Willkommen im Media Lab Regelreich. Heute startet euer Sommerpraktikum.'),
      bubble('uwe', 'Ihr könnt wählen, wer euch als Host durch die Fallakten begleitet.'),
    ], [
      option('clara', 'Ich starte mit Clara Blick.', 1),
      option('uwe', 'Ich starte mit Uwe R. Blick.', 1),
    ]),
    step(1, 'intro', [
      bubble('selected', 'Perfekt. Ihr arbeitet an drei Fallakten: Emma Pör, Konrad Sens und Didi Fam.'),
      bubble('selected', 'Jede Fallakte zeigt ein eigenes Manipulationsmuster in Debatten.'),
    ], [
      option('ok', 'Klingt gut, wie laufen die Kapitel ab?', 2),
      option('skepsis', 'Klingt groß. Gibt es klare Aufgaben?', 2),
    ]),
    step(2, 'intro', [
      bubble('selected', 'Jedes Kapitel folgt derselben Struktur: Einführung, Beispiele, zwei Aktivitäten, Zusammenfassung.'),
      bubble('selected', 'Fehler sind erlaubt. Ihr bekommt Feedback und könnt direkt erneut probieren.'),
    ], [
      option('bereit', 'Verstanden, ich bin bereit.', 3),
      option('frage', 'Noch eine kurze Frage, dann los.', 3),
    ]),
    step(3, 'transition', [
      bubble('selected', 'Dann starten wir im Keller mit Fallakte 1: Emma Pör und emotionaler Zuspitzung.'),
    ], [
      option('weiter', 'Weiter in den Keller.', null, 2),
    ]),
  ]
}

function scene2Steps() {
  return [
    step(0, 'intro', [
      bubble('selected', 'Fallakte Emma Pör: Hier dominiert emotionale Zuspitzung.'),
      bubble('selected', 'Achtet auf Wörter, die gezielt Empörung erzeugen und Einzelfälle verallgemeinern.'),
    ], [option('next', 'Alles klar, zeig mir Beispiele.', 1)]),
    step(1, 'example', [
      bubble('selected', 'Beispiel A: Ein Einzelfall wird als Beweis dargestellt, dass „immer alles schlimmer“ wird.'),
      bubble('selected', 'Das wirkt plausibel, aber es fehlt die Einordnung.'),
    ], [option('next', 'Verstanden, nächstes Beispiel.', 2)]),
    step(2, 'example', [
      bubble('selected', 'Beispiel B: Dramatische Formulierungen steigern die Empörung, obwohl die Fakten dünn sind.'),
    ], [option('next', 'Weiter zur Aktivität.', 3)]),
    step(3, 'activity', [
      bubble('selected', 'Aktivität 1: Welche Markierung zeigt die stärkste emotionale Zuspitzung?'),
    ], [
      option('wrongA', '„Es gab Kritik am Vorschlag.“', 31),
      option('rightA', '„Ganz Regelreich wird absichtlich ruiniert!“', 4),
    ]),
    step(31, 'activity', [
      bubble('selected', 'Knapp daneben: Das war eher neutral. Suche nach Übertreibung und Generalisierung.'),
    ], [option('retry', 'Ich versuche es nochmal.', 3)]),
    step(4, 'activity', [
      bubble('selected', 'Aktivität 2: Welche Variante erzeugt die höchste Empörung?'),
    ], [
      option('rightB', '„Das ist ein Skandal, der uns alle bedroht!“', 5),
      option('wrongB', '„Der Punkt sollte genauer geprüft werden.“', 41),
    ]),
    step(41, 'activity', [
      bubble('selected', 'Hier fehlte die emotionale Intensität. Nimm die maximal aufgeladene Version.'),
    ], [option('retry', 'Nochmal wählen.', 4)]),
    step(5, 'summary', [
      bubble('selected', 'Sehr gut. Ihr habt Empörung als Muster erkannt: Übertreibung, Dramatisierung, Einzelfall-Logik.'),
      bubble('selected', 'Karrierestufe freigeschaltet: Junior-Analyst/in für kommunikative Phänomene.'),
    ], [option('next', 'Weiter zu Fallakte 2.', null, 3)]),
  ]
}

function scene3Steps() {
  return [
    step(0, 'intro', [
      bubble('selected', 'Fallakte Konrad Sens: Fokus Mitläufereffekt und scheinbarer Konsens.'),
      bubble('selected', 'Achtet auf Formulierungen wie „alle“, „jeder weiß“ oder vage Mehrheitsbehauptungen.'),
    ], [option('next', 'Klar, Beispiele bitte.', 1)]),
    step(1, 'example', [
      bubble('selected', 'Beispiel A: „Die meisten haben längst verstanden...“ ohne nachvollziehbare Quelle.'),
    ], [option('next', 'Weiter.', 2)]),
    step(2, 'example', [
      bubble('selected', 'Beispiel B: Likes und Kommentare werden als Qualitätsbeweis verkauft.'),
    ], [option('next', 'Zur Aktivität.', 3)]),
    step(3, 'activity', [
      bubble('selected', 'Aktivität 1: Welche Aussage erzeugt am stärksten den Eindruck von Konsens?'),
    ], [
      option('rightA', '„Alle vernünftigen Leute sehen das inzwischen genauso.“', 4),
      option('wrongA', '„Einige finden die Idee interessant.“', 31),
    ]),
    step(31, 'activity', [
      bubble('selected', 'Zu schwach für Social Proof. Suche den höchsten Gruppendruck.'),
    ], [option('retry', 'Nochmal.', 3)]),
    step(4, 'activity', [
      bubble('selected', 'Aktivität 2: Welche Variante nutzt am stärksten die Mehrheitsillusion?'),
    ], [
      option('wrongB', '„Wir sollten Argumente vergleichen.“', 41),
      option('rightB', '„Schon 9 von 10 sind dafür, du willst doch nicht Außenseiter sein.“', 5),
    ]),
    step(41, 'activity', [
      bubble('selected', 'Das war zu neutral. Entscheidend ist der soziale Druck auf Zugehörigkeit.'),
    ], [option('retry', 'Erneut wählen.', 4)]),
    step(5, 'summary', [
      bubble('selected', 'Stark. Ihr habt Konsens-Signale von echten Belegen unterschieden.'),
      bubble('selected', 'Karrierestufe freigeschaltet: Spezialist/in für rhetorische Dynamiken.'),
    ], [option('next', 'Weiter zu Fallakte 3.', null, 4)]),
  ]
}

function scene4Steps() {
  return [
    step(0, 'intro', [
      bubble('selected', 'Fallakte Didi Fam: Hier geht es um Diskreditierung und Diffamierung.'),
      bubble('selected', 'Kernfrage: Wird ein Argument geprüft oder die Person angegriffen?'),
    ], [option('next', 'Verstanden, Beispiele.', 1)]),
    step(1, 'example', [
      bubble('selected', 'Beispiel A: „Der Vorschlag ist falsch, weil die Person dahinter lächerlich ist.“'),
    ], [option('next', 'Weiter.', 2)]),
    step(2, 'example', [
      bubble('selected', 'Beispiel B: Motive werden unterstellt, statt Inhalte zu prüfen.'),
    ], [option('next', 'Zur Aktivität.', 3)]),
    step(3, 'activity', [
      bubble('selected', 'Aktivität 1: Welche Aussage ist klare Diffamierung?'),
    ], [
      option('rightA', '„Mit so einer Person muss man gar nicht diskutieren.“', 4),
      option('wrongA', '„Die Daten im Beitrag sind unvollständig.“', 31),
    ]),
    step(31, 'activity', [
      bubble('selected', 'Das war legitime Kritik am Inhalt. Gesucht ist ein persönlicher Angriff.'),
    ], [option('retry', 'Nochmal.', 3)]),
    step(4, 'activity', [
      bubble('selected', 'Aktivität 2: Welche Reaktion verschiebt die Debatte von Sache auf Person?'),
    ], [
      option('wrongB', '„Dein Argument hat Lücken bei den Zahlen.“', 41),
      option('rightB', '„Man merkt, dass du nur Aufmerksamkeit willst.“', 5),
    ]),
    step(41, 'activity', [
      bubble('selected', 'Noch nicht. Das war sachlich. Wähle die Option mit persönlicher Unterstellung.'),
    ], [option('retry', 'Nochmal wählen.', 4)]),
    step(5, 'summary', [
      bubble('selected', 'Sauber analysiert. Ihr trennt nun klar zwischen Kritik und Diffamierung.'),
      bubble('selected', 'Karrierestufe freigeschaltet: Zertifizierte/r Debattenarchitekt/in.'),
    ], [option('next', 'Weiter zum Abschluss.', null, 5)]),
  ]
}

function scene5Steps() {
  return [
    step(0, 'intro', [
      bubble('clara', 'Willkommen im Corner Office. Das Praktikum ist offiziell abgeschlossen.'),
      bubble('uwe', 'Ihr habt alle drei Fallakten solide durchdrungen.'),
    ], [option('next', 'Danke, was ist das Fazit?', 1)]),
    step(1, 'summary', [
      bubble('clara', 'Empörung erkannt, Konsens-Illusion entlarvt, Diffamierung sauber abgegrenzt.'),
      bubble('uwe', 'Genau diese analytische Trennung macht euch im Media Lab wertvoll.'),
    ], [option('next', 'Wie geht es weiter?', 2)]),
    step(2, 'summary', [
      bubble('clara', 'Wir bieten euch eine feste Stelle im Media Lab Regelreich an.'),
    ], [
      option('accept', 'Ich nehme an. Sehr gern.', 3),
      option('ponder', 'Ich denke kurz nach, klingt aber stark.', 3),
    ]),
    step(3, 'transition', [
      bubble('uwe', 'Abschlussprofil gespeichert. Willkommen im Team der Debattenarchitekt/innen.'),
    ], [option('end', 'Ende anzeigen.')]),
  ]
}

export function buildSeedSceneDialogs(sceneId) {
  const id = Number(sceneId)
  const map = {
    0: [],
    1: scene1Steps(),
    2: scene2Steps(),
    3: scene3Steps(),
    4: scene4Steps(),
    5: scene5Steps(),
  }

  return {
    sceneId: id,
    steps: map[id] ?? [],
  }
}

export function buildSeedDialogs() {
  return SCENES.map((scene) => buildSeedSceneDialogs(scene.id)).sort((a, b) => a.sceneId - b.sceneId)
}
