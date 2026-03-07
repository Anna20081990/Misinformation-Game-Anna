import { SCENES } from '../../src/data/scenes.js'

function step(stepIndex, type, speechBubbles, options, extras = {}) {
  return { stepIndex, type, speechBubbles, options, ...extras }
}

function bubble(hostId, text, showOnOptionId = null) {
  return {
    hostId,
    text,
    ...(showOnOptionId ? { showOnOptionId } : {}),
  }
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
      bubble('selected', 'Gute Wahl. Ihr startet mit einem klaren Blick auf Muster und Dynamiken.', 'clara'),
      bubble('selected', 'Starke Entscheidung. Dann gehen wir pragmatisch und analytisch vor.', 'uwe'),
      bubble('selected', 'Ihr arbeitet an drei Fallakten: Emma Pör, Konrad Sens und Didi Fam.'),
    ], [
      option('ok', 'Klingt gut, wie laufen die Kapitel ab?', 2),
      option('skepsis', 'Klingt groß. Gibt es klare Aufgaben?', 2),
    ]),
    step(2, 'intro', [
      bubble('selected', 'Kurzfassung: Einführung, Beispiele, zwei Aktivitäten, Zusammenfassung.', 'ok'),
      bubble('selected', 'Ja, es gibt klare Aufgaben und direktes Feedback in jedem Schritt.', 'skepsis'),
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

function scene0Steps() {
  return [
    step(0, 'intro', [
      bubble('ambassador', 'Willkommen in Regelreich. In dieser Stadt entstehen Regeln nicht hinter verschlossenen Türen. Sie entstehen im Gespräch. Neue Vorschläge werden veröffentlicht. Bürger kommentieren. Ideen werden diskutiert, verändert, manchmal verworfen. Der Mittelpunkt dieser Debatten ist TikTalk. Eine Plattform, auf der aus Meinungen Trends werden - und aus Trends mitunter offizielle Entscheidungen. Lange Zeit galt TikTalk als lebhaft, aber berechenbar. Doch in den letzten Monaten hat sich etwas verändert. Bestimmte Diskussionen eskalieren schneller. Einige Beiträge verbreiten sich ungewöhnlich stark. Manche Debatten kippen plötzlich in eine Richtung, die kaum noch sachlich wirkt. Im Media Lab Regelreich spricht man inzwischen von drei auffälligen Mustern. Intern wurden dafür Fallakten angelegt. Um diese Fälle systematisch zu untersuchen, wurden zusätzliche Sommerpraktika ausgeschrieben. Du bist hier, um bei der Aufklärung zu helfen.'),
    ], [
      option('ready', 'Ich bin bereit!', 1),
      option('hesitant', 'Muss ich?', 1),
    ]),
    step(1, 'intro', [
      bubble('ambassador', 'Stark, das passt zu Regelreich. Dann legen wir direkt los.', 'ready'),
      bubble('ambassador', 'Alles gut, du musst nicht perfekt starten. Wir gehen Schritt für Schritt gemeinsam durch.', 'hesitant'),
      bubble('ambassador', 'Wähle jetzt deinen Avatar für das Praktikum.'),
    ], [
      option('avatar1', 'Avatar 1', 2),
      option('avatar2', 'Avatar 2', 2),
      option('avatar3', 'Avatar 3', 2),
    ]),
    step(2, 'transition', [
      bubble('ambassador', 'Perfekt. Weiter geht es jetzt ins Media Lab.'),
    ], [
      option('continue', 'Weiter zu Teil 1', null, 1),
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
      option('submit_confident', 'Ich bin mir sicher.'),
      option('submit_unsure', 'Ich hoffe, es stimmt.'),
    ], {
      activityConfig: {
        mode: 'sentence-marking',
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
      },
    }),
    step(31, 'activity', [
      bubble('selected', 'Knapp daneben: Das war eher neutral. Suche nach Übertreibung und Generalisierung.'),
      bubble('selected', 'Du hast schon einen relevanten Teil markiert, aber noch nicht alles erwischt. Schau auf weitere Zuspitzungen.', 'wrongPartial'),
      bubble('selected', 'Teilweise richtig, aber du hast auch neutrale Teile markiert und nicht alles erwischt. Konzentriere dich auf klare Übertreibung und Generalisierung.', 'wrongMixed'),
    ], [option('retry', 'Ich versuche es nochmal.', 3)]),
    step(4, 'activity', [
      bubble('selected', 'Exakt. Jetzt die nächste Stufe: Welche Variante erzeugt die höchste Empörung?', 'rightA'),
      bubble('selected', 'Guter Retry. Jetzt präzise: Welche Variante erzeugt die höchste Empörung?', 'retry'),
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
      bubble('selected', 'Richtig erkannt. Welche Variante nutzt nun am stärksten die Mehrheitsillusion?', 'rightA'),
      bubble('selected', 'Nach dem Retry: Welche Variante erzeugt jetzt den stärksten Konsensdruck?', 'retry'),
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
      bubble('selected', 'Treffer. Welche Reaktion verschiebt die Debatte jetzt von Sache auf Person?', 'rightA'),
      bubble('selected', 'Weiter geht’s: Wähle die klarste persönliche Verschiebung.', 'retry'),
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
    0: scene0Steps(),
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
