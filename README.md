# LUKINA application

LUKINA is a training application for young and young adults with
reading/writing difficulties, such as dyslexia. LUKINA has been developed
at Tampere University Software Engineering Project course in 2026.

LUKINA name comes from finnish words
**LU**kemis- ja **KI**rjoittamisvaikeuksien tukeminen **N**uorilla ja **A**ikuisilla.

_To-be-added: what the app does_
The theory base and data for the app has been created by
two master's students in logopedics at Tampere University.

### Link to the application page: https://projektiryhma.github.io/lukina/#

### Test coverage

[![Coverage Status](https://coveralls.io/repos/github/projektiryhma/lukina/badge.svg)](https://coveralls.io/github/projektiryhma/lukina)

## Tools

- Stack: React SPA (unit tests with Jest, React Testing Library, Mocha)
- DB: IndexedDB
- CI-pipeline: GitHub Actions
- SAST & code formatting: ESLint with Prettier
- Hosting: GitHub Pages
- Figma for design & prototypes

## How to run the app (locally)

To run this application, you need to have Node installed.

```bash
npm install
```

Before running the app, generate the JSON data.

```bash
npm run convert-data
```

Then you can start the application.

```bash
npm start
```
