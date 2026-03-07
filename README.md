# Regelreich – Media Lab Praktikum

React-basierte Spieloberfläche (4–5 Szenen, Sprechblasen, Interaktionsbox).

## Spiel starten

**Wichtig:** Dev-Server immer aus **diesem Ordner** starten (nicht aus einem Unterordner `frontend` o. Ä.).

```bash
cd /Users/saschaschnorbach/Local\ Sites/defaulted/app/public
npm install   # nur beim ersten Mal
npm run dev
```

Dann im Browser **http://localhost:5173** öffnen. Es erscheint die Regelreich-Oberfläche mit Teil-Buttons (1–5) und der aktuellen Szene.

Falls stattdessen eine andere App (z. B. LYNX HR) oder Proxy-Fehler zu `/api/reports/` angezeigt werden, läuft der Server im falschen Projektordner – zuerst in diesen Ordner wechseln, dann `npm run dev` ausführen.

## Build

```bash
npm run build
```

Ausgabe in `dist/`.
