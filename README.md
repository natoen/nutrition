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
- **Exception — the composites are per-serving, not per-gram:** `King Of Kale
  Salad`, `Steamed Spinach Salad`, and `Blueberry Spinach Smoothie`. Any food
  whose name contains "salad" **or "smoothie"** is measured in **quantity (whole
  servings)** in the visualizer, not grams, so its `Total` row holds the
  nutrients of one complete serving (the gram-weighted sum of its component
  ingredients) and its `% Daily Value (RDI)` row is that whole serving's %DV.
  The keyword test lives in `isPerServing()` in `MealBuilder.tsx` — a new
  composite whose name matches neither keyword will be treated as per-gram and
  read ~200× too high. Every other food is per-gram (milk is entered in ml,
  ≈1 g/ml).
- The `% Daily Value (RDI)` row is each per-gram value divided by that
  nutrient's RDI, so the app multiplies by grams eaten. Keep it consistent when
  you change a `Total`.
- **Every table must use the same RDI denominators**, and they must match the
  visualizer's `RDI_TARGETS` in `visualizer/src/components/MealBuilder.tsx`.
  Watch the nutrients where this project's (Japanese-style) target differs from
  the US %DV that sources like USDA labels assume: Calcium **800 mg** (not
  1300), Potassium **3000 mg** (not 4700), Sodium **2300 mg** (not 2500),
  Iron **7.5 mg** (not 18 — the Japanese MHLW adult-male RDA; US 18 assumes
  menstruating women), Magnesium **370 mg** (not 420 — Japanese MHLW male RDA
  for ages 30–64; 340 is the 18–29 bracket, 320 the 75+ bracket, and the 2025
  edition raised 30–49 to 380). A table computed with the wrong
  denominator makes its progress bar disagree with the stated target — e.g. on
  2026-07-11 mixed 800/1300 calcium rows made the bar hit 100% around ~1000 mg
  while the label said 800 mg. **The bars read the CSV `% Daily Value (RDI)`
  rows; `RDI_TARGETS` only sets the label — so changing an RDI means recomputing
  that nutrient's %DV column in every table, not just editing `RDI_TARGETS`.**
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
     39.3333) µg/g.) The raw-kale **vitamin A and vitamin K** were also
     reconciled from old USDA to MEXT (A 480 → **240 µg RAE**/100g, K 400 →
     **210 µg**/100g; per-gram 2.4 and 2.1), propagated to Steamed Kale (×1.00)
     and to the salad totals (VitA 295 → 223 RAE, VitK 173.1 → 116.1 µg, so the
     salad's VitK dropped from 144.5% to 96.75% DV).

#### Raw Leafy Greens (Bioavailability-Adjusted)

`Raw Kale (Bioavailable)` and `Raw Spinach (Bioavailable)` are the **raw** greens
adjusted for what the body can actually absorb. Unlike every other entry (which
carries *total* content), these subtract the fraction of certain nutrients that
raw anti-nutrients render non-absorbable. The discount is a **retention factor**
applied to the raw MEXT baseline, expressed *relative to the ordinary mixed-diet
absorption the RDI already assumes* — so the numbers stay directly comparable to
the total-content foods and to the %DV bars. Only nutrients with a large,
well-documented raw penalty are cut; everything else is retained at 100%.

The two greens differ mainly by **oxalate load** (spinach ~970 mg/100g is very
high; kale ~20 mg/100g is very low). Oxalate binds divalent minerals into
insoluble salts that pass through undigested — which is why isotope studies find
calcium absorption of only **~5% from spinach vs ~40% from kale** (≈8× more
from kale), and why spinach iron is largely blocked while kale's is not.

| Nutrient | Raw Spinach ×factor | Raw Kale ×factor | Basis |
|---|---|---|---|
| Calcium | **0.17** (≈5% ÷ ~30% ref) | **1.00** | oxalate binding; kale Ca ≥ milk |
| Iron | **0.10** | **0.60** | non-heme + oxalate; kale aided by its vit C, low oxalate |
| Magnesium | **0.60** | **1.00** | partial oxalate binding |
| Vitamin A (β-carotene) | **1.00** | **1.00** | fat-soluble — **not** discounted; eaten with fat (see below) |
| Lutein + Zeaxanthin | **1.00** | **1.00** | fat-soluble — **not** discounted; eaten with fat |
| Everything else | **1.00** | **1.00** | water-soluble vitamins, protein, fibre etc. absorb adequately raw |

**Eaten-with-fat assumption.** Per the user, these greens are always eaten
**with dietary fat** (oil, nuts, dressing, etc.). Carotenoid absorption
(β-carotene → vitamin A, and lutein/zeaxanthin) is limited raw mainly by the
*absence of fat*, and fat restores it — so those fat-soluble nutrients are **not
discounted here** (factor 1.00). The only cuts that remain are the **oxalate
mineral penalties**, which are a chemical binding effect independent of fat. If
these were ever eaten fat-free, β-carotene/lutein absorption would drop and a
carotenoid discount (roughly ×0.25 for vitamin A, ×0.50 for lutein) would apply.

Notes and caveats:

- **Raw beats cooked on the heat-sensitive vitamins.** These entries keep the
  **full raw folate and vitamin C** (no thermal loss), so raw spinach shows more
  folate (210 vs the steamed 168 µg/100g) and more vitamin C than its steamed
  counterpart — and, since it is eaten with fat, its full β-carotene and lutein
  too. The only raw penalty applied is on the oxalate-bound minerals.
- **Baselines.** Raw kale = the MEXT-aligned `Kale (Raw)` row. Raw spinach is
  reconstructed from `Steamed Spinach` by reversing that entry's folate/C ×0.80
  steaming loss (÷0.80), i.e. the raw MEXT spinach baseline before steaming.
- **Vitamin K** is left at ×1.00 here even though it is fat-soluble and also
  absorbs better with fat, to avoid over-subtraction; treat these greens' K as an
  upper bound.
- **The factors are estimates**, not measured on these exact foods — the
  *direction* (spinach minerals heavily blocked by oxalate, kale minerals fine)
  is well established, but the exact magnitudes are literature-central picks and
  are easy to tune in one place if you want them milder or stricter.
- **`Steamed Spinach` carries the SAME oxalate mineral discount** (Ca ×0.17, Fe
  ×0.10, Mg ×0.60), and so does the `Steamed Spinach Salad` built on it. Oxalate
  is **heat-stable** — steaming does not destroy it; it is only removed by
  *leaching* into water, and steaming (little water contact) removes far less
  than boiling: measured soluble-oxalate cuts are ~**42% steaming** vs ~**87%
  boiling** for spinach. Even the 42% is not enough to free the calcium: raw
  spinach's ~800 mg soluble oxalate (~9 mmol) is ~7× the ~49 mg calcium (~1.2
  mmol), and after steaming ~470 mg (~5 mmol) is still ~4× — so essentially all
  the calcium/iron stays bound. (Only aggressive boil-and-**drain** down toward
  ~100 mg oxalate would start to free it — and that is not what "steamed" is.)
  Steamed spinach keeps full carotenoids (cooking + fat aid absorption); only
  its minerals are cut. Steamed **kale** needs no such discount (low oxalate).

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

#### Composite Salads & Smoothies (Per-Serving, not Per-Gram)

Composites (`King Of Kale Salad`, `Steamed Spinach Salad`, `Blueberry Spinach
Smoothie`) are **whole-serving** entries measured in quantity, not grams (see
Data Structure). Each is the **gram-weighted sum of its component entries**:

- **Steamed Spinach Salad** = 6g Roasted Sesame Oil + 12g Ground Sesame + 100g
  Steamed Spinach (118g total).
- **Blueberry Spinach Smoothie** = 100g Blueberry + 100g `Raw Spinach
  (Bioavailable)` + 10g Roasted Almonds (210g total).
- Nutrients and amino acids are summed as absolutes (`Σ grams_i × per-gram_i`).
- Heavy metals (ppm) are **weight-averaged**, not summed — a concentration is
  mass ÷ total weight, so `Σ(grams_i × ppm_i) / Σ grams_i`.
- The `% Daily Value` row is then the whole serving's %DV (Total ÷ RDI), so
  entering quantity `1` logs one complete serving.

The smoothie builds on the **bioavailability-adjusted raw spinach**, not the
plain raw MEXT baseline, so it inherits that entry's oxalate mineral discount
(Ca ×0.17, Fe ×0.10, Mg ×0.60) — which is why a spinach-heavy drink still only
reaches ~5% DV calcium. The almonds are the only fat source, which matters: the
eaten-with-fat assumption behind raw spinach's undiscounted β-carotene and
lutein (see Raw Leafy Greens) is satisfied by the 10g of almonds, so the
serving's vitamin A (~353 µg RAE) and lutein (~12,280 µg) stand at full value.
Note its **vitamin K is ~241% DV** — by far the serving's largest number, from
the 100g of raw spinach; per that same section, treat the K as an upper bound.

#### Roasted Almonds

`Roasted Almonds` is per-gram, from **MEXT アーモンド いり 無塩 (05040)** used
directly (÷100). Points worth knowing:

- **Vitamin E is α-tocopherol only: 29.0 mg/100g** (the roasted figure; raw is
  30.0), per the project-wide rule — almonds are one of the densest α-tocopherol
  foods in the dataset, so 10g alone carries ~19% DV.
- **Biotin 60.6 µg/100g is MEXT-measured**, not filled, and is unusually high —
  10g covers ~20% DV. It is not an error.
- **Choline (52.1 mg/100g) and lutein (1 µg/100g)** are the filled values (USDA;
  MEXT carries neither), so they are the softest numbers in the row.
- **Amino acids** come from USDA dry-roasted almonds, scaled ×0.956 onto the
  MEXT protein basis (20.3g vs USDA's 21.2g per 100g).
- **Heavy metals** use typical tree-nut baselines (As 0.001, Cd 0.005, Hg
  0.0001, Pb 0.001 ppm) — notably ~4× lower cadmium than the sunflower seed row,
  which reflects the real difference (sunflower is a known Cd accumulator;
  almonds are not).

#### Miso (Rice & Barley)

Both misos come from MEXT used directly (÷100), no derivation:

- **Rice Miso (米みそ・淡色辛みそ)** ← MEXT **17045**, the standard everyday
  "usual" miso (light-coloured salty). MEXT also carries 甘みそ (17044) and
  赤色辛みそ (17046) if a sweet or red variant is ever wanted.
- **Barley Miso (麦みそ)** ← MEXT **17047**. Note **麦みそ is barley-koji miso**,
  though English-speaking sellers commonly label it "wheat miso" — if you are
  looking for a "wheat miso" product, 17047 is the correct entry. (The entry was
  briefly named "Wheat/Barley Miso" to match that labelling; renamed to plain
  Barley Miso on 2026-07-16 at the user's request, since 麦 is barley.)

Things to know about these two rows:

- **Sodium dominates them.** Rice miso is 4,900 mg/100g and barley 4,200
  mg/100g, so a single ~18g bowl of miso soup is ~880 mg (38% DV) or ~760 mg
  (33% DV) respectively — before any other salt in the day. Barley miso is the
  lower-sodium of the two. This is the number to watch when logging miso soup;
  the entry is the **paste**, not the finished soup, so it excludes dashi and any
  added ingredients.
- **Vitamin E is α-tocopherol only, and miso is the textbook case for that rule**
  (see Data Structure): MEXT reports rice miso as **α 0.6 mg vs γ 5.7 mg**, and
  barley as **α 0.4 vs γ 3.5**. Counting γ would overstate vitamin E by
  ~10×. Only the α figures are entered.
- **Biotin is MEXT-measured and high**: 12.0 µg/100g (rice) and 8.4 µg (barley),
  so an 18g bowl carries ~7% and ~5% DV.
- **Two MEXT "Tr" (trace) values are entered as 0**: rice miso's pantothenic acid
  (B5) and barley miso's B12. The B5 "Tr" is *suspicious* — barley
  miso measures 0.26 mg and USDA generic miso 0.256 mg, so rice miso reading
  below MEXT's 0.01 mg reporting floor looks like an artifact rather than a real
  difference. It is left at MEXT's value per this repo's MEXT-priority rule; the
  practical cost is <1% DV per serving either way.
- **Manganese is "—" (unmeasured) in MEXT for BOTH misos** — unusual, since Mn is
  normally carried. Filled from USDA generic miso (0.86 mg/100g) for both. USDA's
  generic miso is a rice miso, so the barley figure is the softer of the two.
- **Amino acids are MEXT-measured** (アミノ酸成分表, per 100g), not USDA fills.
- **No cooking adjustment is applied for dissolving miso in hot soup, and none is
  needed.** Unlike the steamed/stir-fried entries above, there is nothing worth
  deducting: (1) miso's only heat-sensitive nutrient in meaningful supply is
  folate, and an 18g serving holds just 6.3–12.2 µg, so even the harshest factor
  this repo uses (the 80% steaming retention) costs **~0.3–0.6% DV**; (2)
  vitamin C is already 0, so there is nothing to destroy; (3) there is **zero
  leaching** — the broth is consumed, the same reasoning as Stewed Chicken Liver;
  and (4) dissolving happens off the boil, gentler than the 100°C the retention
  factors assume. The traditional "don't boil the miso" rule is about **aroma and
  live koji cultures** (which this dataset does not track), not vitamins. Sodium,
  the row's dominant figure, is a mineral and is fully heat-stable regardless.
- **Heavy metals** reuse the `Natto` row's soy baseline (As 0.0003, Cd 0.0013, Hg
  0.0001, Pb 0.0005 ppm) as the dataset's closest soy analog.

Cross-check confidence: USDA generic miso agrees closely with MEXT 17045 on
copper (0.41 vs 0.39), selenium (7 vs 9 µg) and protein (12.8 vs 12.5 g), which
is why USDA is a safe fill source for the gaps above.

#### Raclette Cheese

**MEXT carries no raclette entry** (its natural-cheese list stops at Edam,
Emmental, Gouda, Cheddar, Camembert, etc.), so per the sourcing rule the row
comes from the **Norwegian Food Safety Authority's Matvaretabellen** ("Cheese,
Raclette"), an official government food-composition database, used directly
(÷100): 357 kcal, protein 26.4 g, fat 27.9 g, carbs 0, sodium 728 mg, Ca 671
mg, P 492 mg, Zn 3.9 mg, vitamin A 263 µg RAE, B12 1.4 µg, folate 49 µg,
vitamin E 0.7 mg (α-tocopherol) per 100g.

- **Gap fills come from the `Gouda Cheese` row**, the dataset's closest
  semi-hard cheese analog (not USDA): B5 0.32 mg, biotin 2.5 µg, vitamin K 12
  µg, choline 15 mg, manganese 0.01 mg per 100g. These are the softest numbers
  in the row.
- **Amino acids** are the Gouda profile scaled ×1.023 to raclette's protein
  basis (26.4 vs 25.8 g/100g).
- **Heavy metals** reuse the standard cheese baseline shared by
  Gouda/Edam/Cheddar/Blue (As 0.0005, Cd 0.0005, Hg 0.0002, Pb 0.001 ppm).
- **Selenium 8 µg/100g is measured** (Matvaretabellen), notably lower than the
  ~14 µg the other cheese rows carry — a real source difference, not an error.
- **Sodium 728 mg/100g** (≈1.8 g salt) sits below Gouda/Cheddar's 800 mg; a
  typical 30g melted serving is ~218 mg (~9.5% DV).
- The name "Raclette Cheese" is keyword-matched by the visualizer's existing
  `cheese` rule (🧀, Others category); "raclette" collides with no other
  keyword, so no `MealBuilder.tsx` change was needed.

#### Canned Albacore Tuna (Water- & Oil-Packed)

Both rows are MEXT ホワイト (albacore/びんなが) canned entries used directly
(÷100), the white-meat counterparts of the キハダ ライト entries behind the two
yellowfin rows:

- **Canned Albacore Tuna Water-Packed (ビンナガマグロ水煮)** ← MEXT **10261**
  (水煮 フレーク ホワイト).
- **Canned Albacore Tuna Oil-Packed (ビンナガマグロ油漬)** ← MEXT **10264**
  (油漬 フレーク ホワイト). These are the only albacore canned entries MEXT
  carries; 味付けフレーク (10262) is generic まぐろ類, not albacore.

Why albacore earns its own rows instead of logging against the yellowfin ones:
per 100g the oil-packed albacore has **2× the vitamin D (4.0 vs 2.0 µg), ~3× the
vitamin E (α 8.3 vs 2.8 mg), ~2× the B12 (2.0 vs 1.1 µg), and 3.6× the iron
(1.8 vs 0.5 mg)** of oil-packed yellowfin, at similar macros; B6 and potassium
run somewhat lower. MEXT vitamin A is **Tr → entered 0**.

Fills and derived values, mirroring the yellowfin rows' pattern:

- **Selenium** (MEXT "—"): USDA white/albacore canned tuna — **65.7 µg**/100g
  water-packed, **60.3 µg** oil-packed (the yellowfin rows use USDA light-tuna
  70.6/76 the same way). Canned tuna is the dataset's densest selenium source
  either way (~110–120% DV per 100g).
- **Choline** (MEXT "—"): **29.3 mg**/100g, the same USDA canned-tuna figure all
  the tuna rows share (USDA carries no choline for white-in-oil, so the
  oil-packed fill is the softer of the two).
- **Biotin** (MEXT "—"): 0, consistent with the yellowfin rows.
- **Vitamin K, oil-packed**: MEXT 10264 leaves K unmeasured, so it is filled
  with **44 µg**/100g from MEXT **10263** (油漬 ライト), where the K is measured
  and comes from the packing oil — the same oil medium, so the closest-MEXT
  analog. Water-packed K is a measured MEXT **(0)**.
- **Amino acids**: the corresponding yellowfin row's profile scaled to the
  albacore protein basis — ×18.3/16.0 (=1.144) water, ×18.8/17.7 (=1.062) oil.
- **Heavy metals**: same baseline as the yellowfin rows except **mercury 0.35
  ppm** (FDA monitoring mean for albacore; effectively identical to the
  yellowfin rows' 0.354 — the "white tuna is high-mercury" warning is relative
  to *skipjack* light tuna at ~0.14 ppm, not yellowfin).

#### Filling MEXT "—" Micronutrients

MEXT frequently leaves **biotin, selenium, choline, and (for miso) manganese**
unmeasured (shown as `—`, or simply not carried in that food group), and MEXT
tracks no **lutein/zeaxanthin** at all. (Iodine is not a column in this dataset, so it is
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
| Rice Miso (米みそ) | 12.0 µg *(MEXT)* | 9 µg *(MEXT)* | 72.4 mg | 0 | choline + **manganese (0.86 mg)** from USDA generic miso; biotin & Se measured |
| Barley Miso (麦みそ) | 8.4 µg *(MEXT)* | 2 µg *(MEXT)* | 56.1 mg | 0 | manganese 0.86 mg from USDA generic miso; choline scaled ×0.78 (protein 9.7/12.5) off rice miso, as choline tracks the soybean fraction |
| Raclette Cheese | 2.5 µg | 8 µg *(Matvaretabellen)* | 15 mg | 0 | biotin/choline (plus B5, vit K, Mn) from the Gouda Cheese row — closest semi-hard analog; base data is Matvaretabellen (no MEXT raclette entry) |
| Canned Albacore Water-Packed | 0 | 65.7 µg | 29.3 mg | 0 | Se/choline from USDA white canned tuna, same pattern as the yellowfin rows |
| Canned Albacore Oil-Packed | 0 | 60.3 µg | 29.3 mg | 0 | Se from USDA white-in-oil; choline reuses the shared USDA canned-tuna figure (softest); vit K 44 µg filled from MEXT 10263 (same packing oil) |

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

1. **Pinned individual items**, in this exact order: Milk, Banana, Blueberry
   Spinach Smoothie, Sunflower seeds. (The smoothie took the 3rd pinned spot
   from Steamed Spinach Salad on 2026-07-16; both salads and plain Steamed
   Spinach now sort inside Vegetables.)
2. **Categories**, in this order: Fruits → Vegetables → Meat → Chicken → Fish →
   Nuts/Seeds → Beans/Legumes (natto, miso, soy, tofu, edamame, lentils) → Oils
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
  **Composites and dishes named after an ingredient are the sharpest case.**
  "Blueberry Spinach Smoothie" would otherwise be caught by the blueberry
  (Fruits, 🫐) or spinach (Vegetables, 🥬) rules, so its smoothie check runs
  first in both functions. Miso is a **two-sided** example worth studying before
  you add a keyword: the miso check must run **before** the rice rule (or "Rice
  Miso" takes the 🍚 icon) but **after** the fish rule (or "Canned Mackerel
  Miso-Packed (鯖味噌煮)" — a fish dish, not a paste — takes the 🍲 icon). In
  `getFoodStyle()` the miso rule therefore sits between them, and the rice rule
  was moved below fish to make that ordering possible. `getFoodTypeWeight()`
  needs no such care only because its fish rule (500) already precedes
  Beans/Legumes (650).
- **Check for collisions across the whole food list when adding a keyword**, not
  just against the food you are adding — a new substring rule silently
  re-icons/re-sorts every existing name that happens to contain it.
- **RDI targets** live alongside this, in `RDI_TARGETS` in the same file, and
  must stay consistent with the CSV `% Daily Value (RDI)` denominators (see the
  Data Structure note above).

## Deployment

- The visualizer deploys via GitHub Actions on push to `master`; no manual build
  needed for the live site.
