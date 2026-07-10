---
name: nutrition-data
description: Conventions and methodology for the nutrition.csv food database. Use whenever adding, editing, or cross-checking a food entry — its calories/macros, vitamins, minerals, amino acids, or heavy metals — choosing a data source, computing %DV rows, or reasoning about cooking-retention/yield. Read this before touching nutrition.csv.
---

# Nutrition data conventions

This repo's `nutrition.csv` is a reference for hitting 100% RDI with nutrient-dense
foods. Follow these rules when working on it. The repository-root **`README.md`** holds
the full per-food calculation methodology — **read it** for the detailed recipes
(Steamed Spinach, Stir-fried Pork Liver, Stewed Chicken Liver, Chicken Karaage, etc.).

## Table layout
- Each food is its own table; tables are separated by 2 blank rows.
- The last two rows of every table are `{TITLE} Total` and `{TITLE} % Daily Value (RDI)`.
- The `Total` row holds **per-gram** nutrient values (e.g. a 9 kcal/g oil is `9.00`).
- The `% Daily Value (RDI)` row is each per-gram value divided by that nutrient's RDI,
  so the app multiplies by grams eaten. Keep it consistent when you change a `Total`.

## Sourcing priority
1. **MEXT** (Japanese Standard Tables of Food Composition) first — the user is Japanese.
   Use the food DB at https://fooddb.mext.go.jp/ .
2. **USDA** next, then other reputable sources, when MEXT lacks the nutrient or its value
   looks suspicious and needs cross-checking.
- **Heavy metals** (Arsenic, Cadmium, Mercury, Lead): MEXT does not track these. Use
  category-tailored baseline values in **ppm** (= mg/kg) aggregated from FDA Total Diet
  Study / EFSA. Do not round tiny trace amino-acid/metal values to zero unless truly absent.

## Cross-checking conventions (learned)
- **Vitamin E = α-tocopherol only.** Do NOT count γ-tocopherol — it is a vitamin E
  compound chemically but is not retained by the body and does not count toward the RDA
  or Nutrition-Facts %DV. Sesame products especially are mostly γ-tocopherol; use the
  MEXT α-tocopherol figure. (Sesame oil α ≈ 0.4 mg/100g, roasted sesame α ≈ 0.1 mg/100g.)
- When a packaged product lists a per-cup/per-serving label, confirm whether the entry's
  per-gram basis matches the real serving weight before trusting derived values.
- Derived micronutrients for a product often come from the closest MEXT generic entry;
  sanity-check outliers against that entry (a value ~10–20× off is usually an error).

## After editing
- Keep the two CSV copies in sync: `cp nutrition.csv visualizer/public/nutrition.csv`.
- The visualizer deploys via GitHub Actions on push to `master`; no manual build needed
  for the live site.
