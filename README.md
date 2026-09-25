# GameApp

Play **Rock Paper Scissors** and **Tic Tac Toe** against a computer opponent.

## How the AI plays

**Tic Tac Toe** (`src/app/ttt-game/ttt-ai.ts`) uses minimax search with alpha-beta pruning,
preferring the quickest win and the slowest loss. Four levels:

| Level | Behaviour |
|---|---|
| Easy | Mostly random, sometimes takes an obvious win |
| Medium | Always wins or blocks when it can, otherwise plays loosely |
| Hard | Optimal about 85% of the time |
| Impossible | Always optimal — the best you can get is a draw |

You can also choose who moves first.

**Rock Paper Scissors** (`src/app/rps-game/rps-ai.ts`) learns from your history. It runs several
predictors (overall frequency, what you play after a given move, after a two-move sequence,
after a win/loss/tie, after a full round) and scores each on recent rounds. It follows the most
accurate one and plays the counter. Modes: Casual (random), Adaptive, Master. Matches can be
first to 3, first to 5, or endless. Keyboard shortcuts: R, P, S.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
