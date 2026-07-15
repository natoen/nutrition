# Nutrition

This is a reference to manage everyday nutrition and hitting 100% RDI with
nutrition dense and delicious foods.

This repo's `nutrition.csv` Follow these rules when working on it. The
repository-root **`README.md`** holds the full per-food calculation methodology
— **read it** for the detailed recipes (Steamed Spinach, Stir-fried Pork Liver,
Stewed Chicken Liver, Chicken Karaage, etc.).

## Data Structure

The `nutrition.csv` file contains individual tables for different food items. It
is a reference for hitting 100% RDI with nutrient-dense foods.

- Each Foot has its own table.
- Every table are separated by 2 rows and has a "{TABLE_TITLE} Total" and
  "{TABLE_TITLE} % Daily Value (RDI)" for their last 2 rows.
- The `Total` row holds **per-gram** nutrient values (e.g. a 9 kcal/g oil is
  `9.00`).
- **Exception — the two salads are per-serving, not per-gram:** `King Of Kale
  Salad` and `Steamed Spinach Salad`. Any food whose name contains "salad" is
  measured in **quantity (whole servings)** in the visualizer, not grams, so its
  `Total` row holds the nutrients of one complete salad (the gram-weighted sum
  of its component ingredients) and its `% Daily Value (RDI)` row is that whole
  serving's %DV. Every other food is per-gram (milk is entered in ml, ≈1 g/ml).
- The `% Daily Value (RDI)` row is each per-gram value divided by that
  nutrient's RDI, so the app multiplies by grams eaten. Keep it consistent when
  you change a `Total`.
- **Every table must use the same RDI denominators**, and they must match the
  visualizer's `RDI_TARGETS` in `visualizer/src/components/MealBuilder.tsx`.
  Watch the nutrients where this project's (Japanese-style) target differs from
  the US %DV that sources like USDA labels assume: Calcium **800 mg** (not
  1300), Potassium **3000 mg** (not 4700), Sodium **2300 mg** (not 2500). A
  table computed with the wrong denominator makes its progress bar disagree
  with the stated target — e.g. on 2026-07-11 mixed 800/1300 calcium rows made
  the bar hit 100% around ~1000 mg while the label said 800 mg.
- The data are sourced from MEXT as the priority because the user is Japanese
  followed by USDA and other reputable sources when the data from MEXT are
  lacking or suspicious where cross checking is needed.
- Since MEXT does not track heavy metals (e.g. Arsenic, Cadmium, Mercury, Lead),
  typical baseline values (in ppm) were aggregated from global food safety
  bodies (like the FDA Total Diet Study and EFSA reports) tailored to each
  specific food category. Extremely small trace values (e.g., amino acids in a
  5g serving of Celery) have been precisely calculated to ensure no data is
  inadvertently rounded to zero unless the value is truly absent.
- The unit for heavy metals in the spreadsheet is marked as `(ppm/ug)`. The
  currently inputted values represent parts per million (ppm), which is
  equivalent to mg/kg.
- **Vitamin E = α-tocopherol only.** Do NOT count γ-tocopherol — it is a vitamin
  E compound chemically but is not retained by the body and does not count
  toward the RDA or Nutrition-Facts %DV. Sesame products especially are mostly
  γ-tocopherol; use the MEXT α-tocopherol figure. (Sesame oil α ≈ 0.4 mg/100g,
  roasted sesame α ≈ 0.1 mg/100g.)
- When a packaged product lists a per-cup/per-serving label, confirm whether the
  entry's per-gram basis matches the real serving weight before trusting derived
  values.
- Derived micronutrients for a product often come from the closest MEXT generic
  entry; sanity-check outliers against that entry (a value ~10–20× off is
  usually an error).

### Data Calculations Methodology

#### Steamed Spinach (1:1 Yield)

Based on experimental culinary data where mostly spinach leaves are steamed
briefly (e.g. 3 minutes) without aggressively squeezing out the water, the
physical weight yield is effectively 1:1 (e.g., 100g of raw spinach yields ~98g
of steamed spinach).

To ensure maximum accuracy, the dataset uses the **Raw Spinach** baseline
mapping at a 1:1 ratio, rather than standard theoretical yield multipliers that
underestimate volume.

The formula mathematically deducts thermal degradation penalties for
heat-sensitive vitamins based on the **USDA Table of Nutrient Retention Factors
(Release 6)** and clinical steaming studies:

- **Folate / B9 & Vitamin C (80% Retention):** These specific molecules are
  structurally fragile and degrade under intense 100°C steam heat. A strict 20%
  deduction is applied to account purely for thermal destruction (not water
  leaching, as steaming avoids direct water contact).
- **All Other Vitamins & Minerals (100% Retention):** Because the cell walls are
  not boiled in water, there is zero leaching. Minerals, Fiber, and Fat-Soluble
  Vitamins (like Lutein, Vitamin A, and Vitamin K) are completely immune to this
  brief heat exposure and are thus preserved at 100% of their raw baseline.

#### Stir-fried Pork Liver

"Stir-fried" (油いため) (e.g. Rebanira - レバニラ) implies cooking the liver in
oil. The dataset mathematically constructs this profile using the official MEXT
base data for raw pork liver (11166) combined with standard stir-fry culinary
parameters:

1. **Cooking Fat Integration:** The calories and fat of the small amount of
   cooking oil absorbed during the stir-frying process are added to the
   baseline.
2. **Physical Moisture Loss (Yield Rate):** Cooking liver causes it to shrink by
   approximately 30%. Therefore, a 10g serving of _cooked_ liver requires about
   14.3g of raw pork liver. A 1.43x concentration multiplier is applied to
   account for this density.
3. **Chemical True Retention (TR):** Stir-frying involves intense, rapid heat:
   - **B-Vitamins (B1, B2, B3, B5, B6) (85% Retention):** Slight degradation
     from pan heat.
   - **Folate / B9 (80% Retention):** Heat-sensitive, but avoids water-leaching.
   - **Minerals & Fat-Soluble Vitamins (100% Retention):** Perfectly preserved.
     This results in an astronomical Vitamin A and Vitamin B12 concentration in
     the final cooked weight.
4. **Unseasoned Baseline:** To ensure data purity, the sodium from the soy sauce
   and salt typically used in stir-frying like Rebanira is omitted to make it
   general stir-frying, focusing strictly on the physical chemistry of the liver
   and oil.

#### Stewed Chicken Liver

The data for **Stewed Chicken Liver (50g)** was custom-calculated to simulate
the stewed cooking style (e.g. Amakara-ni - 甘辛煮), rather than using standard
boiled or raw data.

1. **Zero-Leaching Retention:** In standard boiling, massive amounts of vitamins
   leach into the water and are discarded. In stewing, the liquid reduces into a
   thick glaze that is consumed. Therefore, there is **zero water leaching
   loss**, only thermal breakdown. Heat-sensitive vitamins (like Vitamin C and
   Folate) were reduced by approximately 20-25% to account purely for thermal
   destruction.
2. **Physical Moisture Loss:** Simmering liver causes it to yield at about 70%.
   To construct a 50g stewed (_cooked_) serving, the math traces back to
   approximately 71.4g of raw chicken liver. The nutrients from 71.4g of raw
   liver are mathematically condensed into the 50g final product.
3. **Unseasoned Baseline:** By strict user request, the highly variable sugars
   and sodium coming from the soy sauce and mirin used in stewing like
   Amakara-ni glaze style were explicitly excluded to make it a general stewing
   data. The data represents only the pure, condensed chemistry of the cooked
   chicken liver itself.

#### Chicken Karaage (Deep Fried)

"Karaage" (鶏の唐揚げ) is mathematically constructed using official MEXT data
for raw chicken thigh (11119) mixed with the physics of deep frying.

1. **Yield & Tissue Density (The 1:1 Rule):** Frying drives out extreme amounts
   of moisture (up to 30% weight loss). However, Karaage is coated in potato
   starch/flour which adds physical weight back. The final calculated protein
   density of 1g of Karaage (0.242g protein) is nearly identical to 1g of
   Grilled Chicken Thigh (0.241g protein). Thus, the core chicken tissue density
   (and therefore all intrinsic vitamins, minerals, and amino acids) per gram
   remains effectively identical to grilled chicken thigh.
2. **Oil & Carbohydrate Integration:**
   - **Carbohydrates:** Increased significantly (0.133g per 1g) to account for
     the batter crust.
   - **Fat & Calories:** Oil absorption during deep frying increases the fat
     content to 0.181g per 1g, bringing the caloric density to 3.07 kcal/g.
   - **Vitamin E & K:** A slight bump was added to account for the trace
     fat-soluble vitamins present in the frying oil.
3. **Sodium Marinade:** Because Karaage is deeply marinated in soy sauce, the
   sodium value is set to 10mg per gram (equivalent to MEXT 11289's 2.5g salt
   per 100g).

#### Steamed Vegetables (Microwave Proxy)

MEXT has no 蒸し (steamed) entry for most vegetables, so steamed entries are
built one of two ways, in this order of preference:

1. **MEXT microwave (電子レンジ調理) entry, used directly.** Microwaving, like
   steaming, cooks the vegetable in its own moisture with no water bath, so
   there is effectively **zero leaching** — the closest measured analog to
   steaming MEXT offers. Used as-is (÷100 for per-gram) when it exists.
   - **Steamed Broccoli** ← MEXT microwave broccoli (06395)
   - **Steamed Corn** ← MEXT microwave sweet corn (06339)
   - Note these microwave entries already bake in the cooking water-loss, so
     they read denser per 100g than raw — that is correct, not an error.
2. **Derived from the raw baseline** when MEXT has no microwave entry, using the
   Steamed Spinach retention model above: **folate/B9 and vitamin C at 80%**
   (thermal degradation only, no leaching), **everything else at 100%**, at ~1:1
   yield. Heat-stable pigments like beta-carotene are fully preserved.
   - **Steamed Carrots** ← derived from MEXT raw carrot (folate/C × 0.80,
     beta-carotene and all else × 1.00)
   - **Steamed Kale** ← derived from the raw-kale baseline (folate/C × 0.80, all
     else × 1.00). MEXT carries **only raw kale (06080)** — no ゆで/油いため or
     microwave entry — and USDA's only cooked kale is "boiled, drained," a
     *leaching* preparation (its calcium ~72–150 mg, folate ~13–65 µg, C ~18–41
     mg per 100g run far below MEXT raw because water-soluble nutrients drain
     into the discarded water). Steaming avoids that leaching, so USDA
     boiled-drained would understate it; deriving from the (MEXT-aligned:
     folate 120 µg, C 80 mg, Ca 220 mg) raw baseline is the correct source.
     Lutein/zeaxanthin (heat-stable, ×1.00) uses the **modern USDA FoodData
     Central figure, 6,256 µg/100g** — *not* the legacy ~40 mg (39,550 µg)
     figure that USDA has since revised away from. (The original bulk-imported
     raw-kale row carried 3,933 µg/100g, a 10× scale slip off the legacy value;
     corrected to 6,256 in both raw and steamed kale. The `King Of Kale Salad`
     total lutein was recomputed to match — it is a gram-weighted sum with ~30g
     kale, so its lutein rose from 1,890 to 2,586.8 µg, i.e. +30 g × (62.56 −
     39.3333) µg/g.)

#### Grilled Fish

Preferred source is the MEXT 焼き (grilled) entry, used directly:

- **Grilled Sawara** ← MEXT さわら 焼き (10172), measured data.

When MEXT has **no** 焼き entry, grilled fish is **derived** from the raw entry
using dry-heat physics (flagged as calculated, not measured):

- **Grilled Gindara** ← derived from MEXT raw ぎんだら (10115). Applied
  factors: **protein, minerals, and fat-soluble vitamins ×1.30** (water-loss
  concentration, ~77% yield); **fat ×1.20** (lower than 1.30 because rendered
  fat drips away); **B-vitamins ×1.10** (concentration net of thermal loss).
  These multipliers are calibrated to how MEXT's own raw→焼き fish pairs behave.

**Choline (both fishes).** MEXT does not report choline for fish, so it is
estimated from USDA oily-fish values (~65–95 mg/100g), not calculated from the
MEXT entry:

- **Grilled Sawara: 85 mg/100g** — a flat typical oily-fish value (MEXT さわら
  焼き carries no choline figure to scale from).
- **Grilled Gindara: 90 mg/100g** — a raw-sablefish choline baseline (~70 mg/100g)
  lifted toward the grilled figure by the same water-loss concentration applied
  to the rest of the entry. Rounded, so it does **not** exactly equal
  baseline × 1.30; treat it as an estimate, not a derived value.

Because these are estimates, choline is one of the softest numbers in both
rows (see "Filling MEXT '—' Micronutrients" below).

#### Composite Salads (Per-Serving, not Per-Gram)

Salads (`King Of Kale Salad`, `Steamed Spinach Salad`) are **whole-serving**
entries measured in quantity, not grams (see Data Structure). Each is the
**gram-weighted sum of its component entries**:

- **Steamed Spinach Salad** = 6g Roasted Sesame Oil + 12g Ground Sesame + 100g
  Steamed Spinach (118g total).
- Nutrients and amino acids are summed as absolutes (`Σ grams_i × per-gram_i`).
- Heavy metals (ppm) are **weight-averaged**, not summed — a concentration is
  mass ÷ total weight, so `Σ(grams_i × ppm_i) / Σ grams_i`.
- The `% Daily Value` row is then the whole serving's %DV (Total ÷ RDI), so
  entering quantity `1` logs one complete salad.

#### Filling MEXT "—" Micronutrients

MEXT frequently leaves **biotin, selenium, and choline** unmeasured (shown as
`—`, or simply not carried in that food group), and MEXT tracks no
**lutein/zeaxanthin** at all. (Iodine is not a column in this dataset, so it is
never filled.) These four are filled from USDA or the closest MEXT generic,
scaled to the entry's basis. They are the **softest numbers** in any row —
sanity-check them first when a value looks off.

Exact fills for the recent entries (per 100g; *(MEXT)* = actually measured, not
filled):

| Entry | Biotin | Selenium | Choline | Lutein+Zea | Fill source |
|---|---|---|---|---|---|
| Steamed Broccoli | 14 µg *(MEXT)* | 2.8 µg | 38 mg | 1500 µg | Se/choline/lutein scaled from the raw-broccoli baseline (concentrated for cooking water loss) |
| Steamed Corn | 3 µg | 0.6 µg | 23 mg | 700 µg | all four from USDA sweet corn (lutein is corn's signature carotenoid) |
| Grilled Sawara | 5 µg | 45 µg | 85 mg | 0 | typical oily-fish values (USDA mackerel range) |
| Grilled Gindara | 5 µg | 45 µg | 90 mg | 0 | typical/USDA sablefish; see Grilled Fish section for choline derivation |
| Anchovy (Oil-Packed) | 22 µg *(MEXT)* | 52 µg *(MEXT)* | 90 mg | 0 | only choline filled (USDA); biotin & Se are measured |

Rationale for the specific picks:

- **Selenium in fish (45 µg):** fish are reliably selenium-rich (~30–60 µg/100g
  across species); 45 µg is a mid-range oily-fish estimate used for both sawara
  and gindara since neither MEXT entry reports it.
- **Biotin (3–5 µg for corn/fish):** low-to-moderate typical values; broccoli
  and anchovy keep their higher MEXT-measured figures (14 and 22 µg).
- **Lutein/zeaxanthin:** set to 0 for fish (negligible), pulled from USDA for the
  yellow plants where it matters — 1500 µg for broccoli, 700 µg for corn.
- **Choline for the fishes** is derived as documented under **Grilled Fish**
  above (85 mg sawara, 90 mg gindara).

## Visualizer Food Ordering

The order foods appear in the visualizer's "Available Foods" list is **not** the
CSV row order — it is computed at runtime by `getFoodTypeWeight()` in
`visualizer/src/components/MealBuilder.tsx`. Each food is assigned a numeric
weight by keyword-matching its name (lower weight sorts first); ties break
alphabetically.

The sequence is:

1. **Pinned individual items**, in this exact order: Milk, Banana, Steamed
   Spinach Salad, Sunflower seeds. (Plain Steamed Spinach is not pinned — it
   sorts inside Vegetables.)
2. **Categories**, in this order: Fruits → Vegetables → Meat → Chicken → Fish →
   Nuts/Seeds → Beans/Legumes (natto, soy, tofu, edamame, lentils) → Oils
   (matched by name ending in "oil", e.g. sesame oil, olive oil) → Carbs
   (rice, bread, soba, granola) → Eggs → Others (cheeses and anything
   unmatched).
3. **Ice cream is always last.**

Two things to remember when adding a food:

- **Ordering and the icon are both driven by keyword matching on the food
  name**, in `getFoodTypeWeight()` and `getFoodStyle()` respectively. A new food
  whose name lacks a known keyword lands in "Others" with a generic icon — add a
  keyword rule if it should sit elsewhere.
- **Keyword order matters within a rule.** More specific checks must come before
  broader ones that would also match: e.g. Chicken is tested before Meat so
  "chicken liver" is not caught by the meat rule, and the Soba/noodle check runs
  before the Oil check because "Boiled Soba" contains the substring "oil".
- **RDI targets** live alongside this, in `RDI_TARGETS` in the same file, and
  must stay consistent with the CSV `% Daily Value (RDI)` denominators (see the
  Data Structure note above).

## Deployment

- The visualizer deploys via GitHub Actions on push to `master`; no manual build
  needed for the live site.
