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
      bubble('ambassador', 'Willkommen in Regelreich.\n\nIn dieser Stadt entstehen Regeln nicht hinter verschlossenen Türen – sie entstehen im Gespräch.'),
      bubble('ambassador', 'Neue Vorschläge werden veröffentlicht. Bürger und Bürgerinnen kommentieren. Ideen werden diskutiert, verändert, manchmal verworfen.'),
      bubble('ambassador', 'Der Mittelpunkt dieser Debatten ist TikTalk.\n\nEine Plattform, auf der aus Meinungen Trends werden – und aus Trends mitunter offizielle Entscheidungen.'),
    ], [
      option('plausible', 'Klingt vernünftig.', 1),
      option('tiktalk_ernst', 'TikTalk – dein Ernst?', 1),
    ]),
    step(1, 'intro', [
      bubble('ambassador', 'Lange Zeit galt TikTalk als lebhaft, aber berechenbar.\n\nMan wusste: Es wird diskutiert, es wird kommentiert – und irgendwann kehrt wieder Ordnung ein.'),
      bubble('ambassador', 'Doch in den letzten Monaten hat sich etwas verschoben.\n\nBestimmte Diskussionen eskalieren schneller.\n\nEinige Beiträge verbreiten sich ungewöhnlich stark.\n\nUnd manchmal wirkt es, als würde sich eine Richtung durchsetzen, noch bevor jemand gefragt hat, ob es überhaupt eine Richtung braucht.'),
    ], [
      option('zufall', 'Zufall?', 2),
    ]),
    step(2, 'intro', [
      bubble('ambassador', 'Im Media Lab spricht man inzwischen von drei besonders aktiven Profilen.\n\nSie treten unter Pseudonymen auf.\n\nSie behaupten, sie würden Debatten nur ‚beschleunigen‘.\n\nIntern werden sie ‘Die notorischen Drei’ genannt.'),
    ], [
      option('wer_sie', 'Wer sind sie?', 3),
    ]),
    step(3, 'intro', [
      bubble('ambassador', 'Emma Pör. Konrad Sens. Didi Fam.\n\nSie arbeiten verdeckt – und sie haben ein bemerkenswertes Talent.'),
    ], [
      option('welches_talent', 'Welches Talent?', 4),
    ]),
    step(4, 'intro', [
      bubble('ambassador', 'Diskussionen in eine Richtung zu lenken.\n\nMal lauter, mal leiser – aber selten zufällig.'),
      bubble('ambassador', 'Du bist hier, um bei einem Sommerpraktikum bei der Aufklärung zu helfen.\n\nDeine Aufgabe: Herausfinden, wie sie das tun.'),
    ], [
      option('spannend', 'Klingt spannend.', 5),
      option('hoffe_unbekannt', 'Ich hoffe, sie wissen nicht, dass ich komme.', 5),
    ]),
    step(5, 'transition', [
      bubble('ambassador', 'Stark. Neugier ist hier ein Vorteil.\n\nDann legen wir direkt los.', 'spannend'),
      bubble('ambassador', 'Keine Sorge.\n\nSie wissen nur, dass jemand kommt – nicht, wer.', 'hoffe_unbekannt'),
    ], [
      option('continue', 'Zum Media Lab gehen', null, 1),
    ]),
  ]
}

function scene2Steps() {
  return [
    step(0, 'intro', [
      bubble('selected', 'Willkommen im Keller.\n\nHier beginnt jede gute Analyse – zwischen Staub, alten Protokollen und überraschend viel Kaffee.'),
    ], [
      option('cozy', 'Gemütlich.', 10),
      option('magic', 'Hier unten passiert also die Magie?', 10),
    ]),
    step(10, 'intro', [
      bubble('selected', 'Gemütlich trifft es.\n\nDie wirklich lauten Diskussionen entstehen meist weiter oben.', 'cozy'),
      bubble('selected', 'Magie wäre übertrieben.\n\nSagen wir: Hier sortieren wir, was oben chaotisch wirkt.', 'magic'),
    ], [option('first_case', 'Was schauen wir uns als Erstes an?', 11)]),
    step(11, 'intro', [
      bubble('selected', 'Fallakte 1: Emma Pör.'),
      bubble('selected', 'Wenn eine Diskussion plötzlich sehr laut wird, und alle das Gefühl haben, dass gerade etwas Grundsätzliches passiert, ist Emma meist nicht weit.'),
    ], [
      option('drama', 'Also sorgt sie für Drama?', 12),
      option('name_reason', 'Deshalb der Name?', 12),
    ]),
    step(12, 'intro', [
      bubble('selected', 'Sagen wir: Sie hat ein gutes Gespür dafür, wo Drama – Empörung, Wut, Angst – entstehen könnte.', 'drama'),
      bubble('selected', 'Gut erkannt!\n\nSie hat ein gutes Gespür dafür, wo Drama – Empörung, Wut, Angst – entstehen könnte.', 'name_reason'),
      bubble('selected', 'Emma braucht nur einen kleinen Funken – den Rest erledigt die Debatte selbst.'),
    ], [option('how_does_she', 'Wie macht sie das?', 13)]),
    step(13, 'intro', [
      bubble('selected', 'Indem sie einen Einzelfall nimmt\n\nund ihn wie ein großes Muster aussehen lässt.\n\nPlötzlich wirkt alles dringlich, wichtig, und sehr… emotional.'),
      bubble('selected', 'Das schauen wir uns jetzt an.'),
    ], [option('ready', 'Ich bin bereit.', 1)]),
    step(1, 'example', [
      bubble('selected', 'Perfekt.\n\nHier siehst du typische Beiträge von Emma.', 'ready'),
      bubble('selected', 'Die Stadt hat heute eine neue Taubenstatistik veröffentlicht.\n\nMein Onkel meinte gestern schon, dass vor seinem Balkon plötzlich drei Tauben saßen.\n\nSchon wieder wird uns etwas verschwiegen.\n\nWenn selbst Tauben hier strategisch verteilt werden, läuft etwas gewaltig schief.'),
      bubble('selected', 'Ein einzelner Satz eines Verwandten – und plötzlich wirkt das Ganze wie ein großes Problem.'),
    ], [option('next', 'Verstanden, nächstes Beispiel.', 2)]),
    step(2, 'example', [
      bubble('selected', 'Die Stadt testet eine neue Anzeige für öffentliche Uhren.\n\nEin Freund meinte, die Uhr am Bahnhof sei gestern für einen Moment stehen geblieben.\n\nWenn selbst die Zeit hier nicht mehr zuverlässig läuft, was gerät dann noch ins Stocken?\n\nIrgendetwas fühlt sich hier nicht mehr stabil an.'),
      bubble('selected', 'Eine stehende Uhr – und schon soll uns das verunsichern.'),
    ], [option('next', 'Weiter.', 20)]),
    step(20, 'intro', [
      bubble('selected', 'Emma arbeitet immer ähnlich. Ein Einzelfall. Ein Gefühl. Und am Ende wirkt es, als wäre die ganze Stadt betroffen.'),
      bubble('selected', 'Jetzt bist du dran.'),
    ], [
      option('ready_drama', 'Kein Problem für mich!', 3),
      option('watch_drama', 'Ok, ich halte nach Drama Ausschau!', 3),
    ]),
    step(3, 'activity', [
      bubble('selected', '„In Regelreich wird aktuell diskutiert, ob bei öffentlichen Veranstaltungen nur noch Regenschirme in „Einheitsgrau“ erlaubt sein sollen. Ziel ist eine „optische Harmonie bei Niederschlag“.“'),
      bubble('selected', '„Emma Pör arbeitet gern mit einzelnen Vorfällen, um große Empörung zu erzeugen. Markiere alle Textstellen, die in Emmas Stil aus einem Einzelfall ein allgemeines Problem machen.“'),
    ], [
      option('submit_confident', 'Empörungs-Level: Hoch.'),
      option('submit_unsure', 'Das klingt verdächtig dramatisch.'),
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
      bubble('selected', 'Sehr gut! Ein Einzelfall wird zum Beweis erklärt, daraus wird Empörung, und am Ende steht die große Warnung: Das ist Emma in Reinform!', 'rightA'),
      bubble('selected', 'Die Stadt erwägt, die Wartebereiche im Hauptbahnhof künftig mit einem festgelegten Farbverlauf zu gestalten, um eine ‚emotionale Aufenthaltskurve‘ beim Warten auf Züge zu unterstützen.'),
      bubble('selected', 'Welche Version würde Emma Pör am ehesten posten, um maximale Empörung zu erzeugen?'),
      bubble('selected', 'Guter Retry. Prüfe erneut, welche Variante am stärksten emotional aufgeladen ist.', 'retry'),
    ], [
      option('submit_easy', 'Das eskaliert stilvoll.'),
      option('submit_unsure2', 'Ist das schon Drama?'),
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
      bubble('selected', 'Damit hast du Emma Pör einmal in Aktion erlebt.\n\nSie braucht keinen großen Skandal.\n\nEin Einzelfall reicht. Ein Gefühl reicht. Und plötzlich wirkt es, als stünde die ganze Stadt auf dem Spiel.'),
      bubble('selected', 'Sie vergrößert. Sie verallgemeinert. Und sie dreht an der Lautstärke.'),
    ], [option('and_now', 'Und jetzt?', 51)]),
    step(51, 'transition', [
      bubble('selected', 'Fallakte 1 ist somit abgeschlossen.'),
      bubble('selected', 'Herzlichen Glückwunsch zur Beförderung zum Junior-Analyst für kommunikative Phänomene.'),
      bubble('selected', 'Damit steigst du eine Etage höher.'),
    ], [
      option('stairs', 'Ich nehme die Treppe.', null, 3),
      option('no_elevator_soundtrack', 'Bitte kein Aufzug mit Soundtrack.', null, 3),
    ]),
  ]
}

function scene3Steps() {
  return [
    step(0, 'intro', [
      bubble('selected', 'Willkommen in deinem neuen Büro!\n\nHier ist es heller.\n\nUnd meistens etwas voller.'),
    ], [
      option('lively', 'Klingt lebendig.', 10),
      option('stressful', 'Klingt anstrengend.', 10),
    ]),
    step(10, 'intro', [
      bubble('selected', 'Lebendig ist ein gutes Wort.', 'lively'),
      bubble('selected', 'Man gewöhnt sich daran.', 'stressful'),
      bubble('selected', 'Im Keller ging es um Lautstärke. Hier geht es um Zustimmung.'),
    ], [option('who_agrees', 'Wer stimmt hier wem zu?', 11)]),
    step(11, 'intro', [
      bubble('selected', 'Fallakte 2: Konrad Sens.'),
      bubble('selected', 'Er braucht keine Empörung. Er braucht nur den Eindruck, dass alle schon überzeugt sind.'),
    ], [option('too_simple', 'Das wirkt zu einfach.', 12)]),
    step(12, 'intro', [
      bubble('selected', 'Konrad nutzt ein einfaches Prinzip: Wenn etwas klingt, als seien alle schon überzeugt, wird es schwer, dagegen zu sein.'),
      bubble('selected', 'Alle wissen doch ... Immer mehr sagen ... Das ist längst klar.'),
    ], [
      option('all_really', 'Alle? Wirklich alle?', 13),
      option('group_pressure', 'Klingt nach Gruppendruck.', 13),
    ]),
    step(13, 'intro', [
      bubble('selected', 'Genau. Je größer das alle, desto kleiner der Widerspruch.', 'all_really'),
      bubble('selected', 'Und genau so fühlt es sich an.', 'group_pressure'),
      bubble('selected', 'Konrad Sens ist also ein Mehrheitsmagier. Eine Meinung wirkt schließlich stärker, wenn sie wie Konsens aussieht.'),
    ], [option('show_me', 'Zeig mir, wie das aussieht.', 1)]),
    step(1, 'example', [
      bubble('konrad', 'Immer mehr Schulen unterstützen den offiziellen Regelreich-Sticker für Hefte und Ordner. In vielen Klassen ist er längst Standard. Es wäre nur konsequent, ihn jetzt stadtweit einzuführen.'),
      bubble('selected', '„Immer mehr“ - und schon fühlt es sich wie Mehrheit an.'),
    ], [option('next', 'Weiter.', 2)]),
    step(2, 'example', [
      bubble('konrad', 'Die meisten sprechen sich klar gegen die Abschaffung der Parkuhr-Symbole aus. Niemand, mit dem ich gesprochen habe, hält das für eine gute Idee. Man sollte Bewährtes nicht leichtfertig ändern.'),
      bubble('selected', 'Wenn angeblich alle dagegen sind, möchte niemand der Einzige dafür sein.'),
      bubble('selected', 'Wenn es nach Mehrheit klingt, dann ist Konrad Sens nicht weit.\n\nEr hebt nicht die Stimme. Er hebt nur die Zahl.'),
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
      bubble('selected', 'Nun kennst du dich mit Konrad Sens\' Eigenheiten bestens aus. Er argumentiert nicht. Er zählt.'),
      bubble('selected', 'Wenn etwas wie Konsens klingt, fühlt sich Widerspruch plötzlich unnötig an.'),
    ], [
      option('ready_challenge', 'Ich bin bereit für eine echte Challenge.', 51),
      option('much_work', 'Ganz schön viel Arbeit hier.', 51),
    ]),
    step(51, 'transition', [
      bubble('selected', 'Fallakte Konrad Sens: abgeschlossen.'),
      bubble('selected', 'Gratulation zur nächsten Beförderung: Spezialist für rhetorische Dynamiken.'),
      bubble('selected', 'Und Spezialisten sitzen nicht mehr im Großraumbüro.'),
    ], [
      option('cozy_here', 'War doch gemütlich hier.', null, 4),
      option('want_quiet', 'Ich will meine Ruhe.', null, 4),
    ]),
  ]
}

function scene4Steps() {
  return [
    step(0, 'intro', [
      bubble('selected', 'Willkommen in deinem eigenen Büro!\n\nEin Schreibtisch.\n\nUnd – ganz wichtig – nur eine Person pro Raum.'),
      bubble('selected', 'Passend, denn in dieser Fallakte geht es genau darum:\n\nWenn aus einem Thema plötzlich eine einzelne Person gemacht wird.'),
    ], [
      option('less_discussion', 'Also weniger Diskussion, mehr Demontage?', 10),
      option('single_office_attacks', 'Einzelbüro für Einzelangriffe?', 10),
    ]),
    step(10, 'intro', [
      bubble('selected', 'Exakt. Das Thema rückt in den Hintergrund. Im Vordergrund steht plötzlich jemand, der ‘schuld’ sein soll.', 'less_discussion'),
      bubble('selected', 'Sehr treffend. Die Idee wird nebensächlich. Entscheidend ist, wer sie angeblich verbrochen hat.', 'single_office_attacks'),
      bubble('selected', 'Fallakte 3: Didi Fam.'),
      bubble('selected', 'Didi diskutiert ungern auf der Sachebene.\n\nArgumente kann man prüfen. Personen kann man beschädigen.'),
    ], [option('how_exactly', 'Wie genau macht er das?', 11)]),
    step(11, 'intro', [
      bubble('selected', 'Er verschiebt den Fokus.\n\nWeg von der Frage: Ist das sinnvoll? Hin zur Frage: Was stimmt mit dieser Person nicht?'),
      bubble('selected', 'Kritik am Inhalt – Fehlanzeige.\n\nStattdessen unterstellt er Motive, streut Zweifel an Kompetenz und arbeitet mit Spott.'),
      bubble('selected', 'Kurz: Er betreibt Diffamierung.'),
    ], [
      option('theme_to_target', 'Vom Thema zur Zielperson in drei Sekunden.', 12),
      option('attack_not_argument', 'Also: Angriff statt Argument?', 12),
    ]),
    step(12, 'intro', [
      bubble('selected', 'Du hast es erfasst.\n\nSchauen wir uns das in freier Wildbahn an.'),
    ], [
      option('fresh_air', 'Endlich frische Luft!', 1),
      option('netflix_series', 'Gibt es das auch als Netflix-Serie?', 1),
    ]),
    step(1, 'example', [
      bubble('didi', 'Die Stadt testet neue, leisere Müllwagen. Wer so etwas priorisiert, hat offenbar noch nie echte Probleme gesehen.'),
      bubble('selected', 'Der Müllwagen wird kurz erwähnt. Aber der eigentliche Treffer gilt den Entscheidenden.'),
    ], [option('next', 'Noch eins.', 2)]),
    step(2, 'example', [
      bubble('didi', 'Die Verwaltung schlägt vor, Parkbänke ergonomisch anzupassen. Typisch für Leute, die vermutlich noch nie länger als fünf Minuten draußen waren.'),
      bubble('selected', 'Die Maßnahme ist nebensächlich. Wichtig ist die Botschaft: Diese Menschen taugen nichts.'),
      bubble('selected', 'Didi diskutiert nicht – er diskreditiert.'),
    ], [
      option('unpleasant', 'Klingt unerquicklich.', 20),
      option('personal_mission', 'Klingt nach persönlicher Mission.', 20),
    ]),
    step(20, 'example', [
      bubble('selected', 'Und genau deshalb braucht diese Fallakte ein Einzelbüro.\n\nMan muss hier sehr sauber trennen: Zwischen legitimer Kritik und persönlichem Angriff.'),
    ], [option('ready_analysis', 'Ich bin bereit für die Analyse.', 3)]),
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
      bubble('selected', 'Du hast gesehen, wie subtil – oder auch gar nicht subtil – eine Debatte kippen kann.'),
      bubble('selected', 'Sobald nicht mehr über Inhalte gesprochen wird, sondern über angebliche Charakterfehler, Motive oder Kompetenzen, befinden wir uns im Terrain der Diskreditierung.'),
      bubble('selected', 'Kritik prüft Argumente. Diffamierung prüft Personen – und fällt meist durch.'),
    ], [option('career_end', 'Ich sehe schon das Ende der Karriereleiter.', 51)]),
    step(51, 'transition', [
      bubble('selected', 'Fallakte Didi Fam: abgeschlossen.'),
      bubble('selected', 'Du hast Reputationsangriffe durchschaut. Damit erreichst du die höchste Karrierestufe im Praktikum: Zertifizierter Debattenarchitekt.'),
    ], [option('what_now', 'Was kommt jetzt?', 52)]),
    step(52, 'transition', [
      bubble('selected', 'Ganz oben wartet ein besonderer Ausblick. Und ein Gespräch, das man nicht jedem Praktikanten anbietet.'),
      bubble('selected', 'Komm. Wir gehen ins oberste Stockwerk.'),
    ], [
      option('no_fear_heights', 'Gut, dass ich keine Höhenangst habe.', null, 5),
      option('higher_faster', 'Höher, schneller, weiter.', null, 5),
    ]),
  ]
}

function scene5Steps() {
  return [
    step(0, 'intro', [
      bubble('clara', 'Willkommen ganz oben.\n\nVon hier aus sieht Regelreich erstaunlich friedlich aus.'),
      bubble('uwe', 'Keine eskalierenden Kommentarspalten. Keine angeblichen Mehrheiten. Keine persönlichen Angriffe.'),
      bubble('uwe', 'Nur Muster.'),
    ], [option('looks_harmless', 'Sieht harmlos aus.', 1)]),
    step(1, 'summary', [
      bubble('clara', 'Das tut es meistens von oben.'),
      bubble('clara', 'Aber du weißt inzwischen: Unter der Oberfläche arbeiten Dynamiken.'),
      bubble('uwe', 'Emma verstärkt Emotionen. Konrad konstruiert Konsens. Didi setzt auf Diffamierung.'),
    ], [
      option('three_strategies', 'Drei Strategien. Drei Stockwerke.', 2),
      option('each_differs', 'Und jede funktioniert anders.', 2),
    ]),
    step(2, 'summary', [
      bubble('clara', 'Sehr architektonisch gedacht. Struktur hilft beim Durchblick.', 'three_strategies'),
      bubble('uwe', 'Unterschiedliche Werkzeuge – gleiche Wirkung: Debatten verschieben.', 'each_differs'),
    ], [option('what_for_internship', 'Was heißt das für mein Praktikum?', 3)]),
    step(3, 'summary', [
      bubble('clara', 'Es heißt: Du bist nicht mehr Praktikant.'),
      bubble('clara', 'Du bist jetzt offiziell Zertifizierter Debattenarchitekt.'),
      bubble('uwe', 'Du erkennst rhetorische Konstruktionen – und weißt, wo tragende Wände fehlen.'),
    ], [option('business_card', 'Gibt es dafür eine Visitenkarte?', 4)]),
    step(4, 'summary', [
      bubble('clara', 'Selbstverständlich. Mit sehr kleiner Schrift und sehr großem Titel.'),
      bubble('uwe', 'Regelreich wird weiter diskutieren. Neue Vorschläge. Neue Trends. Neue Kommentare.'),
      bubble('clara', 'Die Frage ist nicht, ob diskutiert wird.\n\nSondern wie.'),
    ], [option('watch_how', 'Und ich achte jetzt auf das Wie.', 5)]),
    step(5, 'transition', [
      bubble('uwe', 'Genau darum geht es.\n\nNicht jede laute Stimme ist wichtig. Nicht jede Mehrheit ist real. Und nicht jede Kritik ist sachlich.'),
      bubble('uwe', 'Aber wer die Muster kennt, bleibt handlungsfähig.'),
      bubble('clara', 'Willkommen im Media Lab. Diesmal nicht als Praktikant. Sondern als Mitgestalter der Diskussionskultur in Regelreich.'),
    ], [
      option('to_work', 'Dann mal an die Arbeit.'),
      option('keep_overview', 'Ich behalte den Überblick.'),
    ]),
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
