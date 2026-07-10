# Nutrition Visualizer

A small React + TypeScript + Vite app that reads `public/nutrition.csv` and lets
you build meals and see how they track against RDI.

## Develop

```sh
npm install
npm run dev      # http://localhost:5173/
```

The app fetches `nutrition.csv` at runtime relative to the Vite `base`, so
editing `public/nutrition.csv` is reflected on reload with no rebuild.

## Data

`public/nutrition.csv` is a copy of the repo-root `nutrition.csv`. After editing
the root file, copy it over: `cp ../nutrition.csv public/nutrition.csv`.

## Deploy

Pushing to `master` triggers `.github/workflows/deploy.yml`, which builds the app
and publishes it to GitHub Pages at https://natoen.github.io/nutrition/. There is
no `gh-pages` branch and no committed build output — CI builds from source. The
`base` in `vite.config.ts` is `/nutrition/` to match the Pages project path.
