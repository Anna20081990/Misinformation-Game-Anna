import { SCENES } from '../../src/data/scenes.js'
import { PART1_CONVERSATION } from '../../src/data/conversations/part1.js'

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
  return PART1_CONVERSATION.map((item) => {
    const stepType = item.stepIndex === 3 ? 'transition' : 'intro'
    const speechBubbles = (item.speechBubbles || []).map((entry) => {
      const rawId = String(entry.characterId || entry.hostId || 'selected').toLowerCase()
      const hostId = rawId === 'clara' || rawId === 'uwe' || rawId === 'ambassador' ? rawId : 'selected'
      return bubble(hostId, entry.text)
    })
    const options = (item.options || []).map((entry) =>
      option(entry.id, entry.label, entry.nextStep ?? null, entry.nextPart ?? null),
    )

    return step(item.stepIndex, stepType, speechBubbles, options)
  })
}

function scene0Steps() {
  return [
    step(0, 'intro', [
      bubble('ambassador', 'Willkommen in Regelreich.\nIn dieser Stadt entstehen Regeln nicht hinter verschlossenen Türen - sie entstehen im Gespräch.'),
      bubble('ambassador', 'Neue Vorschläge werden veröffentlicht. Bürger und Bürgerinnen kommentieren. Ideen werden diskutiert, verändert, manchmal verworfen.'),
      bubble('ambassador', 'Der Mittelpunkt dieser Debatten ist TikTalk.\n\nEine Plattform, auf der aus Meinungen Trends werden - und aus Trends mitunter offizielle Entscheidungen.'),
    ], [
      option('plausible', 'Klingt vernünftig.', 1),
      option('tiktalk_ernst', 'TikTalk - dein Ernst?', 1),
    ]),
    step(1, 'intro', [
      bubble('ambassador', 'Lange Zeit galt TikTalk als lebhaft, aber berechenbar. Man wusste: Es wird diskutiert, es wird kommentiert - und irgendwann kehrt wieder Ordnung ein.'),
      bubble('ambassador', 'Doch in den letzten Monaten hat sich etwas verschoben. Bestimmte Diskussionen eskalieren schneller. Einige Beiträge verbreiten sich ungewöhnlich stark. Und manchmal wirkt es, als würde sich eine Richtung durchsetzen, noch bevor jemand gefragt hat, ob es überhaupt eine Richtung braucht.'),
    ], [
      option('zufall', 'Zufall?', 2),
    ]),
    step(2, 'intro', [
      bubble('ambassador', 'Im Media Lab spricht man inzwischen von drei besonders aktiven Profilen.\nSie treten unter Pseudonymen auf.\nSie behaupten, sie würden Debatten nur beschleunigen.\nIntern werden sie "Die notorischen Drei" genannt.'),
    ], [
      option('wer_sie', 'Wer sind sie?', 3),
    ]),
    step(3, 'intro', [
      bubble('ambassador', 'Emma Pör. Konrad Sens. Didi Fam. Sie arbeiten verdeckt - und sie haben ein bemerkenswertes Talent.'),
    ], [
      option('welches_talent', 'Welches Talent?', 4),
    ]),
    step(4, 'intro', [
      bubble('ambassador', 'Diskussionen in eine Richtung zu lenken. Mal lauter, mal leiser - aber selten zufällig.'),
      bubble('ambassador', 'Du bist hier, um bei einem Sommerpraktikum bei der Aufklärung zu helfen.\nDeine Aufgabe: Herausfinden, wie sie das tun.'),
    ], [
      option('spannend', 'Klingt spannend.', 5),
      option('hoffe_unbekannt', 'Ich hoffe, sie wissen nicht, dass ich komme.', 5),
    ]),
    step(5, 'transition', [
      bubble('ambassador', 'Stark. Neugier ist hier ein Vorteil. Dann legen wir direkt los.', 'spannend'),
      bubble('ambassador', 'Keine Sorge.\nSie wissen nur, dass jemand kommt - nicht, wer.', 'hoffe_unbekannt'),
    ], [
      option('continue', 'Zum Media Lab gehen', null, 1),
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
      bubble('selected', '„In Regelreich wird aktuell diskutiert, ob bei öffentlichen Veranstaltungen nur noch Regenschirme in „Einheitsgrau“ erlaubt sein sollen. Ziel ist eine „optische Harmonie bei Niederschlag“.“'),
      bubble('selected', '„Emma Pör arbeitet gern mit einzelnen Vorfällen, um große Empörung zu erzeugen. Markiere alle Textstellen, die in Emmas Stil aus einem Einzelfall ein allgemeines Problem machen.“'),
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
      bubble('selected', 'Stark erkannt, genau das war die emotionale Zuspitzung.', 'rightA'),
      bubble('selected', 'Aktivität 2: Welche Variante erzeugt die höchste Empörung?'),
      bubble('selected', 'Welche Version würde Emma Pör am ehesten posten, um maximale Empörung zu erzeugen?'),
      bubble('selected', 'Guter Retry. Prüfe erneut, welche Variante am stärksten emotional aufgeladen ist.', 'retry'),
    ], [
      option('submit_easy', 'Das ist einfach.'),
      option('submit_unsure2', 'Ich habe eigentlich keine Ahnung.'),
    ], {
      activityConfig: {
        mode: 'intensity-choice',
        title: 'Aktivität 2: Intensitätswahl',
        topic: 'Thema: Einführung einer offiziellen Mittagsglocke',
        randomizeChoices: true,
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
      },
    }),
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
      option('submit_easy3', 'Das schreit nach Konrad!'),
      option('submit_unsure3', 'Konrad - bist du es?'),
    ], {
      activityConfig: {
        mode: 'intensity-choice',
        title: 'Aktivität 1: Trend-Detektor',
        topic: 'Thema: Einführung eines verpflichtenden Wochenmottos',
        randomizeChoices: true,
        choices: [
          {
            id: 'p1',
            text: '„Die Stadt prüft die Einführung eines wöchentlichen Mottos für öffentliche Einrichtungen.“',
          },
          {
            id: 'p2',
            text: '„Immer mehr Menschen sprechen sich für ein Wochenmotto aus.“',
          },
          {
            id: 'p3',
            text: '„Inzwischen sind sich alle einig: Ein Wochenmotto bringt endlich klare Linie ins Stadtleben.”',
          },
        ],
        correctChoiceId: 'p3',
        success: { id: 'rightA', nextStep: 4 },
        failure: { id: 'wrongA', nextStep: 31 },
      },
    }),
    step(31, 'activity', [
      bubble('selected', 'Noch nicht ganz. Suche den Beitrag mit der stärksten Mehrheitsbehauptung.'),
    ], [option('retry', 'Nochmal.', 3)]),
    step(4, 'activity', [
      bubble('selected', 'Richtig erkannt, das war die stärkste Mehrheitsbehauptung.', 'rightA'),
      bubble('selected', 'Aktivität 2: Welche Ergänzungen lassen einen neutralen Beitrag wie breiten Konsens wirken?'),
      bubble('selected', 'Guter Retry. Wähle jetzt wieder die stärksten Konsens-Verstärker.', 'retry'),
    ], [
      option('submit_confident4', 'Das wirkt nach echtem Konsens.'),
      option('submit_unsure4', 'Ich bin unsicher.'),
    ], {
      activityConfig: {
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
      },
    }),
    step(41, 'activity', [
      bubble('selected', 'Das waren nur neutrale oder irrelevante Ergänzungen. Suche nach klaren Mehrheits- oder Metriksignalen.'),
      bubble('selected', 'Du hast schon einen richtigen Verstärker gewählt, aber noch nicht alle erwischt.', 'wrongBPartial'),
      bubble('selected', 'Teilweise richtig, aber du hast auch neutrale Ergänzungen gewählt. Fokussiere auf starke Konsenssignale.', 'wrongBMixed'),
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
      bubble('selected', 'In mehreren Verwaltungsgebäuden wurde eine neue, einheitliche Aufzugmusik eingeführt. Offiziell soll sie „Verweildauer emotional rahmen“.'),
      bubble('selected', 'Aktivität 1: Didi Fam verschiebt Diskussionen gern von der Sachebene auf Personen. Ordne die Aussagen: Was ist sachliche Kritik und was ist typisch für Didi?'),
    ], [
      option('submit_sorted5', 'Einsortiert. Didi kann kommen.'),
      option('submit_unsure5', 'Ich hoffe, ich habe niemanden falsch beschuldigt.'),
    ], {
      activityConfig: {
        mode: 'bucket-sort',
        title: 'Aktivität 1: Sache oder Angriff',
        topic: 'Thema: Einführung einer einheitlichen Aufzugmusik',
        prompt: 'Ordne alle Aussagen in die zwei Buckets ein.',
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
      },
    }),
    step(31, 'activity', [
      bubble('selected', 'Noch nicht vollständig: Ordne bitte alle Aussagen ein, bevor du bestätigst.', 'wrongAIncomplete'),
      bubble('selected', 'Du hast nur sachliche Kritik markiert. Prüfe, welche Aussagen Personen angreifen.', 'wrongAOnlyContent'),
      bubble('selected', 'Das passt noch nicht. Du hast die Aussagen größtenteils in die falschen Buckets eingeordnet.', 'wrongAAllWrong'),
      bubble('selected', 'Teilweise richtig. Einige Aussagen sind noch im falschen Bucket.', 'wrongAMixed'),
      bubble('selected', 'Noch nicht ganz. Ordne klar zwischen Sachebene und persönlichem Angriff.', 'wrongA'),
    ], [option('retry', 'Nochmal.', 3)]),
    step(4, 'activity', [
      bubble('selected', 'Stark sortiert. Weiter mit Aktivität 2.', 'rightA'),
      bubble('selected', 'Der Stadtrat plant eine offizielle Stadtfarbe. Ziel ist ein „klarer Wiedererkennungswert - auch für zukünftigen Tourismus aus dem Orbit“.'),
      bubble('selected', 'Aufgabe: Wo kippt die Debatte von der Idee zur Person?'),
      bubble('selected', 'Retry: Wähle jetzt erneut den Beitrag mit klarer Diskreditierung.', 'retry'),
    ], [
      option('submit_ouch6', 'Autsch. Unter die Gürtellinie.'),
      option('submit_far6', 'Geht das schon zu weit?'),
    ], {
      activityConfig: {
        mode: 'intensity-choice',
        title: 'Aktivität 2: Wo kippt es zur Person?',
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
      },
    }),
    step(41, 'activity', [
      bubble('selected', 'Noch nicht ganz. Gesucht ist die Aussage, die klar die Person statt die Idee angreift.'),
    ], [option('retry', 'Nochmal prüfen.', 4)]),
    step(5, 'summary', [
      bubble('selected', 'Richtig erkannt: Das war eine klare Diffamierung.', 'rightB'),
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
