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
- **Exception — the two clams are per gram of SHELL-ON weight, not edible
  portion:** `Boiled Shijimi Clam (Shell-On g)` and `Boiled Asari Clam
  (Shell-On g)`. Every other row (and MEXT itself) is *edible portion*; these
  two are deliberately divided down by MEXT's 廃棄率 so the number you type is
  the weight you actually put in the pot, shell included. See the **Boiled
  Shijimi & Asari Clams** section for the factors. Entering *shelled meat*
  weight against these rows under-reads by 4× (shijimi) or 3.3× (asari); the
  basis is in the food name to make that hard to do by accident.
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
- **Blueberry Spinach Smoothie** = 100g Blueberry + 82g `Raw Spinach
  (Bioavailable)` + 18g Roasted Almonds (200g total).
- Nutrients and amino acids are summed as absolutes (`Σ grams_i × per-gram_i`).
- Heavy metals (ppm) are **weight-averaged**, not summed — a concentration is
  mass ÷ total weight, so `Σ(grams_i × ppm_i) / Σ grams_i`.
- The `% Daily Value` row is then the whole serving's %DV (Total ÷ RDI), so
  entering quantity `1` logs one complete serving.

The smoothie builds on the **bioavailability-adjusted raw spinach**, not the
plain raw MEXT baseline, so it inherits that entry's oxalate mineral discount
(Ca ×0.17, Fe ×0.10, Mg ×0.60) — which is why a spinach-heavy drink still only
reaches ~7.5% DV calcium. The almonds are the only fat source, which matters:
the eaten-with-fat assumption behind raw spinach's undiscounted β-carotene and
lutein (see Raw Leafy Greens) is satisfied by the 18g of almonds, so the
serving's vitamin A (~290 µg RAE) and lutein (~10,084 µg) stand at full value.
Note its **vitamin K is ~201% DV** — by far the serving's largest number, from
the 82g of raw spinach; per that same section, treat the K as an upper bound.

The 18g of almonds also make this the dataset's strongest smoothie for **vitamin
E (7.42 mg, ~49% DV)** and **biotin (12.26 µg, ~41% DV)** — both almond-driven,
so they scale with that component, not the spinach.

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

#### Mango

Per user request, the priority source was **Philippine (carabao) mango** — but
the authoritative Philippine database (**FNRI PhilFCT**,
`i.fnri.dost.gov.ph/fct/library`) sits behind a login and no reputable
secondary source carries a full per-100g carabao micronutrient panel. So per the
user's stated fallback ("if you cannot find any data, use the mangoes sold in
Japan next"), the `Mango` row is built from **MEXT マンゴー 生 (07132)** used
directly (÷100). This is a close proxy for the intended fruit: Japan's fresh
imported mango is predominantly the **Philippine carabao** (plus Mexican), so the
generic MEXT mango largely *is* the carabao mango as sold in Japan. If FNRI
carabao data is ever obtained, this row is the one to revisit.

MEXT 07132 per 100g: 68 kcal, protein 0.6 g, fat 0.1 g, carbs 16.9 g, fibre
1.3 g, Na 1 mg, K 170 mg, Ca 15 mg, Mg 12 mg, P 12 mg, Fe 0.2 mg, Zn 0.1 mg, Cu
0.08 mg, Mn 0.1 mg, vitamin A 51 µg RAE (β-carotene 610 µg), folate **84 µg**,
vitamin C **20 mg**, vitamin B6 0.13 mg, B5 0.22 mg, niacin 0.7 mg, biotin 0.8
µg, vitamin K 3 µg, vitamin D/B12 0.

Things to know about this row:

- **Vitamin E is α-tocopherol only: 1.8 mg/100g** (the current MEXT 8th-edition
  figure), per the project-wide rule. Some older mirrors (e.g. Slism) still show
  the 7th-edition **0.9 mg** — do not use it. At 1.8 mg, a 150g mango carries
  ~18% DV vitamin E, one of this row's stronger numbers alongside folate.
- **Folate and vitamin C are the headline nutrients** — 84 µg and 20 mg per
  100g, so a ~150g serving is ~32% DV folate and ~33% DV vitamin C, both raw and
  heat-intact (mango is eaten raw).
- **Choline (7.6 mg) and lutein+zeaxanthin (23 µg)** are filled from **USDA raw
  mango** — MEXT carries neither — so they are the softest numbers in the row.
- **Selenium is MEXT-measured at 0** (kept, not filled — USDA's 0.6 µg is
  negligible either way).
- **Amino acids** come from USDA raw mango scaled ×0.732 onto the MEXT protein
  basis (0.6 g vs USDA's 0.82 g/100g); mango protein is tiny, so every per-gram
  value rounds to ≤0.0004 g.
- **Heavy metals** use the dataset's standard **fruit baseline** shared by
  banana/blueberry (As 0.0001, Cd 0.0001, Hg 0, Pb 0.0001 ppm).
- The name "Mango" is keyword-matched by new `mango` rules added to
  `getFoodStyle()` (🥭) and `getFoodTypeWeight()` (Fruits, weight 100) in
  `MealBuilder.tsx`; "mango" collides with no other food name.

#### Peach

`Peach (White-Fleshed 白桃)` is per-gram, from **MEXT もも 白肉種 生 (07136)** used
directly (÷100) — the white-fleshed 白桃 that dominates Japanese production
(Hakutō, Akatsuki and similar). MEXT per 100g: 38 kcal, protein 0.6 g, fat 0.1 g,
carbs 10.2 g, fibre 1.3 g, Na 1 mg, K 180 mg, Ca 4 mg, Mg 7 mg, P 18 mg, Fe
0.1 mg, Zn 0.1 mg, Cu 0.05 mg, Mn 0.04 mg, vitamin C 8 mg, folate 5 µg, B5
0.13 mg, niacin 0.6 mg, biotin 0.3 µg, vitamin K 1 µg.

- **MEXT also carries 黄肉種 (yellow-fleshed) as 07184**, and it is a genuinely
  different food, not a rounding difference: 48 kcal, β-carotene **210 µg** vs
  white's **5 µg** (vitamin A 17 vs ~0 µg RAE), α-tocopherol 1.3 vs 0.7 mg,
  fibre 1.9 vs 1.3 g, but *less* vitamin C (6 vs 8 mg). If yellow peaches are
  what's actually being eaten, add a second row from 07184 rather than logging
  against this one.
- **Vitamin A is 0.** MEXT reports the white peach's retinol activity equivalent
  as **Tr**, consistent with its 5 µg β-carotene. A white peach is not a vitamin
  A food; the yellow one mildly is.
- **The headline numbers are modest but real**: a 200g peach is ~18% DV vitamin
  C, ~12% DV potassium, ~9% DV fibre and ~9% DV vitamin E, for 76 kcal.
- **Lutein (2 µg) is a rescaled fill and the softest number in the row.** MEXT
  tracks no lutein, and USDA's only raw peach is **yellow**-fleshed (91 µg/100g).
  Since lutein is a carotenoid and this row is the *white* variety, using 91
  directly would overstate it ~40×. It is scaled by the two MEXT entries'
  β-carotene ratio — 91 × (5 ÷ 210) ≈ 2 µg — the same closest-analog scaling used
  for barley miso's choline. Peach is a negligible lutein source either way.
- **Choline (6.1 mg) is filled from USDA raw peach unscaled**, because choline is
  not a carotenoid and does not track flesh colour. Watch the unit trap here:
  USDA-derived sites often quote 9.39 mg choline and 140 µg lutein, which are
  **per 154g cup**, not per 100g.
- **Biotin (0.3 µg) and selenium (0) are MEXT-measured**, not filled.
- **Aspartic acid dominates the amino acids** — 260 mg of the 480 mg total per
  100g, i.e. over half. That is correct and characteristic of peach, which
  carries a large free-aspartate pool; the remaining amino acids are all ≤34 mg.
- **Heavy metals** use the dataset's standard **fruit baseline** shared by
  banana/blueberry/mango (As 0.0001, Cd 0.0001, Hg 0, Pb 0.0001 ppm).
- The name is keyword-matched by new `peach`/`桃` rules in `getFoodStyle()` (🍑)
  and `getFoodTypeWeight()` (Fruits, weight 100). **`もも` is deliberately NOT a
  keyword** — see the Visualizer Food Ordering notes.

#### Boiled Shijimi & Asari Clams (Shell-On Basis)

Both rows come from the **raw** MEXT entries — しじみ 生 (**10297**) and あさり 生
(**10281**), 八訂増補2023 via `fooddb.mext.go.jp` — not from MEXT's cooked
entries, and both are rebased onto **shell-on weight**.

**Why raw, not MEXT's 水煮/蒸し.** MEXT carries しじみ 水煮 (10413) and あさり 蒸し
(10466), but those measure the *meat after the cooking liquid was discarded*.
These clams are boiled ~1 minute for **miso soup, and the broth is drunk**, so
there is **zero leaching loss** — the same reasoning as Stewed Chicken Liver and
Miso. Using 水煮 would understate the serving: comparing 生 against 水煮 at its
~49% meat yield implies roughly **40% of the calcium, 40% of the B12 and 60% of
the potassium** leave the meat for the water. In this dish that water is the
soup. Only thermal degradation is deducted, per the Steamed Spinach model:

- **Folate / B9 & Vitamin C: ×0.80.** Both are tiny here either way (a 50g
  shell-on serving is ~2.6 µg folate).
- **Everything else — minerals, B12, fat-soluble vitamins, amino acids: ×1.00.**

**The shell-on rebase.** Unlike every other row, these are **per gram of clam in
the shell**, so the number entered is the weight actually put in the pot. MEXT's
edible-portion values are multiplied by the edible fraction from its 廃棄率:

| | 廃棄率 | edible fraction | per-gram factor |
|---|---|---|---|
| Shijimi | 75% | **0.25** | per-100g-meat ÷ 100 × 0.25 |
| Asari | 70% | **0.30** | per-100g-meat ÷ 100 × 0.30 |

**The shell itself contributes nothing, and that is correct.** 廃棄率 is a
weight-accounting figure, not a claim about nutrient transfer — no shell calcium
is counted. Shell is ~95% calcium carbonate, near-insoluble in water (~14 mg/L);
miso soup's ~pH 5.5 barely touches a smooth, low-surface-area shell in 60
seconds. Extracting carbonate calcium takes hours plus acid — the bone-broth
literature yields only ~5–30 mg per cup after 12+ hours. The real contribution
is low single-digit mg, under 1% DV.

Things to know about these two rows:

- **Both are B12 monsters, and that is the headline.** Per 100g meat, shijimi is
  **68.0 µg** and asari **44.8 µg** — 28× and 19× the 2.4 µg target. Even on the
  diluted shell-on basis a 50g serving is **8.5 µg (354% DV)** shijimi or
  **6.7 µg (280% DV)** asari. One bowl covers B12 several times over.
- **Watch asari's sodium.** 800 mg/100g meat = 2.4 mg per shell-on gram, so a 50g
  serving is **120 mg (5% DV) before any miso is added** — and an 18g bowl of
  rice miso is another ~880 mg. Shijimi is far lower (180 mg/100g meat, ~22 mg
  per serving), making it the better choice if sodium is the binding constraint.
- **Shijimi is the mineral one:** per 50g shell-on serving, iron **1.04 mg (14%
  DV)**, calcium 30 mg, manganese 0.35 mg (15% DV), plus 33 µg RAE/100g vitamin A
  and 1.7 mg α-tocopherol — all of which asari lacks. Asari's counter-strengths
  are **magnesium** (92 vs 10 mg/100g meat) and measured biotin.
- **Vitamin E is α-tocopherol only** per the project-wide rule (shijimi 1.7 mg,
  asari 0.4 mg per 100g meat).
- **Beware non-MEXT mirrors — they still serve 七訂 values**, the same trap as
  mango/Slism. For asari, older mirrors show iron **3.8 mg**, B12 **52.4 µg**,
  sodium **870 mg**, protein 6.0g; the current edition is **2.2 mg, 44.8 µg,
  800 mg, 5.7 g**. For shijimi, 七訂 shows 64 kcal / B12 68.4 µg vs the current
  **54 kcal / 68.0 µg**. `fooddb.mext.go.jp` is the source of truth.
- **Amino acids are MEXT-measured** (アミノ酸成分表, per 100g edible), then scaled
  by the same edible fraction.
- **Heavy metals are the softest and most variable part of these rows.** Clams
  are filter feeders and are used as pollution *biomonitors*, so real values
  swing by an order of magnitude with harvest water — treat these as category
  baselines, not properties of your specific clams. Stored ppm are rebased to
  shell-on weight like every other column; the underlying **meat** concentrations
  are:

  | | Arsenic | Cadmium | Mercury | Lead |
  |---|---|---|---|---|
  | Shijimi (freshwater *Corbicula*) | 0.1 | 0.016 | 0.01 | 0.006 |
  | Asari (marine Manila clam) | 1.5 | 0.07 | 0.04 | 0.20 |

  Asari's arsenic looks alarming next to the fish rows but is **total** arsenic,
  which in marine bivalves is overwhelmingly organic arsenobetaine — non-toxic
  and excreted; marine shellfish routinely run 1–4 ppm total As. Freshwater
  shijimi carries far less because arsenobetaine is a marine-food phenomenon.
  Both clams are **low-mercury** (0.01–0.04 ppm) — roughly a tenth of the
  albacore rows' 0.35 ppm.

#### Barley Rice (麦ご飯)

`Barley Rice (麦ご飯 5割麦)` is per-gram and is a **blend**, not a single MEXT
entry — MEXT has no 麦ご飯 row. It is the gram-weighted mix of **MEXT 押麦 めし
(01170)** and this dataset's own `Cooked White Rice` row.

**The ratio is 5割麦 — equal rice and barley by DRY grain**, per the user (the
more common everyday convention is 2〜3割; the big 押麦 brands print 米1合 + 押麦
50g on the bag, ≈25%). Two ratios are in play and they are easy to confuse:

| basis | barley share |
|---|---|
| dry grain (what you measure into the pot) | **50%** |
| **cooked weight (what the per-gram row holds)** | **57.1%** |

They differ because barley expands more than rice: 重量変化率 **280% for 押麦めし**
vs **210% for 白米めし**. So 100g + 100g dry → 280g + 210g = 490g cooked, and
barley is 280/490 = 57.1% of it. Both expansion figures were cross-checked
against MEXT's own dry-vs-めし energy ratios (押麦 329/118 = 2.79; 精白米
342/156 = 2.19). **If the ratio ever changes, the cooked-weight fractions must be
recomputed — do not just edit the dry percentage.**

- **Fibre is the entire point of this row.** Cooked 押麦 carries **4.2g/100g**
  against white rice's 0.3g, so a 150g bowl goes from ~0.45g fibre (plain white
  rice) to **3.79g (13.5% DV)** — an 8× lift, for slightly *fewer* calories
  (1.34 vs 1.56 kcal/g, since barley is less energy-dense than rice).
- **Magnesium, manganese and biotin also ride with the barley**: per 150g bowl,
  Mg 13.1 mg, Mn 0.43 mg (12.5% DV — barley's 0.24 mg/100g dwarfs rice's), biotin
  1.0 µg.
- **Several MEXT values are Tr and are entered as 0**: sodium, B2, vitamin E and
  selenium for the barley. The rice row supplies small non-zero amounts of some
  of these, so the blend is not zero where rice contributes.
- **Choline (13.4 mg/100g barley) is the only fill** — USDA *barley, pearled,
  cooked*; MEXT carries none. It is the softest number in the barley half.
- **Amino acids are MEXT-measured** (アミノ酸成分表 for 01170). Note barley is
  glutamic-acid- and proline-heavy (590 and 280 mg/100g of a 2,300 mg total),
  characteristic of a hordein-type cereal protein.
- **Heavy metals use a grain baseline with deliberately LOW arsenic**
  (As 0.00005 ppm) — about a third of the rice rows' 0.00015–0.0002. That is
  real, not an oversight: paddy-grown rice is a well-known arsenic accumulator
  and barley is not, so blending barley in actually *dilutes* the arsenic of a
  bowl of rice.
- The name is matched by the **existing** `rice` rule (🍚, Carbs 700) — no new
  keyword was added. See the Visualizer notes for why a bare `麦` keyword must
  never be added.

#### Wagyu Beef — Stew & Roast Cuts

Two **和牛肉** (wagyu) rows, both **derived from raw MEXT entries into cooked
weight**, so the gram you log is the gram you eat off the plate, not the raw
weight you bought:

- **`Wagyu Stew Beef (シチュー用牛肉 Stewed)`** ← MEXT **11006** 和牛肉 かた
  赤肉 生 (chuck, lean) — 角切り cubes with no separable fat on them.
- **`Wagyu Roast Beef (ローストビーフ用牛肉)`** ← MEXT **11021** 和牛肉 もも 赤肉
  生 (round, lean) — the standard ウチモモ roast-beef block.

**Breed matters more than almost anything else here.** MEXT splits beef four ways
— ［和牛肉］/［乳用肥育牛肉］/［交雑牛肉］/［輸入牛肉］ — and they are not
interchangeable. Per the user these rows use **和牛肉** throughout. Logging wagyu
against an imported-beef row would understate fat badly.

**Cut and trim matter nearly as much.** Within wagyu, MEXT carries 脂身つき /
皮下脂肪なし / 赤肉 for most cuts, and the spread is enormous: wagyu ばら 脂身つき
is **472 kcal / 50g fat** per 100g against かた 赤肉's **183 kcal / 12.2g** —
2.6×, same animal. If a different cut or trim is ever wanted, swap the MEXT
number at the top of the derivation rather than scaling these rows.

**What MEXT's three trim levels actually mean — marbling is NOT excluded by
赤肉.** This is the easiest thing to get wrong, because 赤肉/赤身 reads like
"lean, so barely any fat":

| level | 皮下脂肪 (cap) | 筋間脂肪 (between muscles) | 筋内脂肪 = **marbling/サシ** |
|---|---|---|---|
| 脂身つき | included | included | **included** |
| 皮下脂肪なし | removed | included | **included** |
| 赤肉 | removed | removed | **still included** |

The levels separate only the fat a butcher can physically cut away. Intramuscular
fat cannot be separated from muscle, so **赤肉 keeps every bit of the marbling** —
which is exactly why wagyu かた 赤肉 still carries **12.2 g fat/100g**, roughly
3× a lean imported-beef round. In a marbled wagyu cut that 12.2 g essentially
*is* the サシ. A wagyu 赤肉 row reading ~4 g fat would mean the marbling had been
wrongly excluded, and would be an error.

**These rows use 赤肉** (both of them), per the user: the 角切り cubes as bought
carry visible marbling but no separable fat to trim off. Note the cut, not just
the trim, is an assumption — supermarket シチュー用 trays are commonly すね, ばら,
もも, or a deliberate mix, and MEXT carries **no すね entry at all** (もも is the
usual proxy). かた is the pick here.

**Trimming fat concentrates the minerals, it does not only remove calories.**
Going 脂身つき → 赤肉 on the chuck raises iron from 0.9 to **2.7 mg/100g** and
zinc from 4.9 to 5.7, because those live in muscle tissue and the fat was
diluting them. So the lean row is not merely "the same meat minus fat" — it is
denser in almost everything except fat and calories.

**Cooking derivations** (both are *calculated*, not measured):

| | yield | concentration | fat | B2/B3/B5/B6/B12 | B1 | folate | vit C |
|---|---|---|---|---|---|---|---|
| Stewed | 65% | ×1.538 | ×1.538 | ×0.85 | ×0.75 | ×0.80 | ×0.75 |
| Roasted | 80% | ×1.25 | **×1.18** | ×0.85 | ×0.80 | ×0.85 | ×0.80 |

(retentions are applied *on top of* the concentration factor)

- **Stewed assumes zero leaching, because the sauce is eaten** — the same
  reasoning as Stewed Chicken Liver and the clams. Nutrients (and rendered fat)
  that leave the meat end up in the シチュー, so **fat takes the full ×1.538**
  rather than the reduced factor used for dry heat. B1 gets the harshest
  retention (0.75) because thiamin is the most heat-labile B vitamin and a stew
  is a long, hot, wet cook.
- **Roasted uses the Grilled Fish dry-heat model**: **fat ×1.18 rather than
  ×1.25**, because some fat renders out and drips away and is *not* recovered.
  B1 survives better than in the stew (0.80) since roast beef is cooked gently to
  rare/medium and rested.
- **Roast-beef energy is recomputed from the derived macros**, not scaled — the
  differing fat factor makes a flat scale wrong. Atwater (4/9/4) is applied to the
  cooked macros then corrected by the raw Atwater:MEXT ratio (183.9 vs 176, a
  4.5% overshoot), giving **213.5 kcal/100g cooked**. The stew needs no such care
  because every macro there shares one factor, so its energy is a clean ×1.538.
- **Both are unseasoned baselines.** Sodium is the raw meat's only (47/48 mg per
  100g raw); the roux, wine, demi-glace and salt of a real シチュー and the soy/salt
  of a roast-beef marinade are all excluded, per the same convention as Stewed
  Chicken Liver and Stir-fried Pork Liver. **A real beef stew's sodium comes
  almost entirely from what you add, so this row will understate a seasoned dish.**
- **Heavy metals are concentrated by the yield factor too** (ppm is mass/mass, so
  losing water raises the concentration) — ×1.538 and ×1.25 respectively, off the
  standard beef baseline already shared by `Beef Hire/Tenderloin` (As 0.0001,
  Cd 0.0001, Hg 0, Pb 0.0002 ppm).
- **Amino acids: the round's are MEXT-measured; the chuck's are scaled.** MEXT
  renders no amino-acid panel for 11006, so the measured **11021** profile is
  scaled onto the chuck-lean protein basis (×20.2/21.3 = 0.948) — the same
  closest-analog scaling used for raclette←gouda and albacore←yellowfin.

What the two rows are actually good for, per 100g cooked:

| | Stew (chuck 赤肉) | Roast (round 赤肉) |
|---|---|---|
| Calories | 282 | **214** |
| Protein | **31.1 g (62% DV)** | 26.6 g (53% DV) |
| Fat | 18.8 g (24% DV) | **12.6 g (16% DV)** |
| Iron | **4.2 mg (55%)** | 3.5 mg (47%) |
| Zinc | **8.8 mg (80%)** | 5.6 mg (51%) |
| B12 | **2.22 µg (93%)** | 1.38 µg (58%) |

Now that both are 赤肉 the two rows are much closer, and both are strong protein
sources. The stew row leads on everything except calories and fat, largely because
its 65% stewing yield concentrates harder than the roast's 80% — **100g of the
stewed beef is nearly a full day of B12 and 80% of a day's zinc**. The roast row
stays the leaner choice per gram of protein.

#### Squid (Grilled & Tempura) and Grilled Chicken Breast

All three are **MEXT-measured cooked entries used directly** (÷100) — no cooking
derivation, no retention factors, no yield assumptions. They are among the
best-sourced rows in the dataset; contrast the wagyu rows, which had to be
derived raw→cooked.

- **`Grilled Squid (するめいか焼き)`** ← MEXT **10347** するめいか 焼き
- **`Fried Squid (するめいか天ぷら)`** ← MEXT **10419** するめいか 胴 皮なし 天ぷら
- **`Grilled Chicken Breast (むね 皮なし焼き)`** ← MEXT **11288** 若どり むね
  皮なし 焼き

**"Fried squid" here means 天ぷら, not パン粉 イカフライ.** MEXT's only *measured
cooked* squid-fry entry is the tempura one, so it is used rather than deriving a
breaded fry. MEXT does carry いかフライ at **18008**, but that is
「フライ用冷凍食品／冷凍」 — the breaded product **before** you fry it, so it
carries neither the absorbed oil nor the cooking water loss and would badly
understate the eaten food. If panko イカフライ is what is actually eaten, it needs
constructing the way `Chicken Karaage` was (raw squid + breading carbs + oil
absorption), not swapping in 18008. Note 10419 is 胴 (mantle) 皮なし — the body
tube, which is what fry is normally cut from.

**The chicken breast is 皮なし (skinless).** MEXT carries both, and the skin is a
large difference — per 100g grilled: **皮つき (11287) 215 kcal / 34.7g protein /
9.1g fat** vs **皮なし (11288) 177 kcal / 38.8g protein / 3.3g fat**. Skin-on is
~2.8× the fat. Swap the entry number if the skin is eaten.

Things worth knowing about these rows:

- **Grilled chicken breast is the most protein-dense row in the entire dataset:
  38.8 g/100g, 77.6% DV.** That is not an error — MEXT's 焼き entries are measured
  *after* the cooking water loss, so a 100g cooked portion traces back to ~140g
  raw. It is also 18 mg niacin (112% DV) and 2.58 mg B5 (52% DV) per 100g.
- **Grilled squid is the leanest protein in the dataset** — 23.6g protein for
  **1.0g fat and 108 kcal**. It also carries **5.4 µg B12 (225% DV)** and 46 µg
  selenium (84% DV) per 100g, plus an unusually high 2.5 mg α-tocopherol for a
  seafood.
- **The tempura row INCLUDES the batter (衣) and the absorbed oil** — it is the
  whole fried piece as eaten, not the squid inside it. So `100` against this row
  means 100g of tempura on the plate, not 100g of squid meat. Verified against
  MEXT's own same-cut raw entry, **10418 するめいか 胴 皮なし 生**:

  | per 100g | raw mantle (10418) | tempura (10419) | source |
  |---|---|---|---|
  | Carbohydrates | 0.1 g | **6.3 g** | flour |
  | **Dietary fibre** | **(0)** | **0.8 g** | **flour — decisive** |
  | Fat | 0.6 g | **10.8 g** | frying oil |
  | Manganese | 0.01 mg | 0.06 mg | wheat |
  | Calcium | 10 mg | 26 mg | batter |
  | Vitamin K | — | 6 µg | oil |
  | Protein | 18.6 g | 16.7 g | *diluted* |

  **The fibre is the proof**: squid is an animal and carries no fibre at all, so
  0.8 g/100g can only be wheat. The second proof is that **protein falls** — dry
  heat drives off water and should *concentrate* it (grilling does exactly that,
  to 23.6 g), so a drop to 16.7 g is only possible if non-protein batter mass was
  added. Because B12 comes solely from the squid (flour and oil have none),
  3.8 ÷ 4.3 implies **100 g of tempura carries roughly 85 g of raw squid's
  worth**; selenium independently gives ~82 g.
- **Squid grilled vs tempura is therefore a clean before/after of deep frying**,
  both from the same MEXT species: calories 108 → 175, fat 1.0 → 10.8 g, and the
  micronutrients dilute in step (B12 5.4 → 3.8 µg, selenium 46 → 31 µg). Note the
  grilled row is whole squid and the tempura row is 胴 皮なし, so for a strictly
  like-for-like comparison use 10418 above as the baseline.
- **Vitamin E rises with frying** (2.5 → 3.0 mg) because the frying oil
  contributes α-tocopherol — the same effect noted for the oil-packed tuna rows.
  Vitamin K likewise goes 0 → 6 µg, and vitamin D 0 → 0.2 µg, both from the oil.
- **Grilled squid's vitamin K is a MEXT "—" entered as 0**, not a measured zero.
  するめいか 生 carries 0 and dry grilling adds no fat, so 0 is the right fill; the
  tempura row's 6 µg is measured and comes from the batter oil.
- **Manganese for grilled squid is MEXT Tr → 0.**
- **Amino acids are MEXT-measured for all three** (アミノ酸成分表), not scaled
  fills. The chicken breast totals 39,000 mg/100g, the highest in the dataset.
- **Choline is the only nutrient filled in any of the three** (MEXT carries none
  for these), each protein-scaled from a USDA baseline: squid 65 mg/100g at
  15.58g protein → **98 mg** grilled and **70 mg** tempura; roasted chicken breast
  82.5 mg at ~31g protein → **103 mg**. Watch the standard unit trap here —
  USDA-derived sites quote choline per 3 oz (85 g), so a "67.8 mg" figure is
  **79.7** mg/100g, not the ~239 a careless ×3 would give.
- **Squid heavy metals are category baselines with wide error bars**, like the
  clams. Total arsenic looks high (1.2 ppm grilled) but, exactly as with the
  asari row, marine cephalopod arsenic is overwhelmingly organic arsenobetaine —
  non-toxic and excreted. Cadmium concentrates in squid **viscera**, not the
  mantle, so the tempura row (胴 only, plus batter dilution) is set lower across
  the board: As 0.8, Cd 0.015, Hg 0.017, Pb 0.007 vs the grilled row's 1.2 /
  0.03 / 0.025 / 0.01. Both are low-mercury. The chicken row reuses the existing
  poultry baseline (As 0.0001, Cd 0.0001, Hg 0, Pb 0.0002).
- **Squid sodium is worth noting**: grilled is 330 mg/100g *before* any soy sauce,
  since grilling concentrates the squid's own salt. The tempura is lower (180 mg)
  from batter dilution.
- The squid rows needed a **new `squid`/`するめ` keyword** (🦑, Fish weight 500);
  the chicken breast needed nothing, matching the existing `chicken` rule. See the
  Visualizer notes for why a bare `いか` keyword must never be used.

#### Low-Fat Milk

`Low-Fat Milk (加工乳 低脂肪)` is from **MEXT 13005 加工乳 低脂肪** used directly
(÷100), and like the existing `Regular Whole Milk / Hokkaido` row (MEXT 13003
普通牛乳) it is **entered in ml**, not grams (≈1 g/ml).

**It is not simply "whole milk minus the fat".** Japanese 加工乳 低脂肪 is
manufactured by removing butterfat and topping the non-fat solids back up, so the
protein, calcium, potassium and B2 all come out *higher* than whole milk, not
lower. What actually falls is the fat and everything that dissolves in it:

| per 200 ml glass | Whole (13003) | Low-fat (13005) | |
|---|---|---|---|
| Calories | 122 | **84** | −31% |
| Fat | 7.6 g | **2.0 g** | −74% |
| Protein | 6.6 g | **7.6 g** | **+15%** |
| Calcium | 220 mg | **260 mg (32.5% DV)** | **+18%** |
| Potassium | 300 mg | **380 mg** | +27% |
| Vitamin B2 | 0.30 mg | **0.36 mg (27.7% DV)** | +20% |
| Sodium | 82 mg | 120 mg | **+46%** |
| Vitamin A | 76 µg RAE | **26 µg** | **−66%** |
| Vitamin D | 0.6 µg | **0** | **gone** |
| Vitamin E | 0.2 mg | **0** | **gone** |
| Vitamin K | 4 µg | **0** | **gone** |

- **The fat-soluble vitamin collapse is the thing to know.** A, D, E and K ride in
  the butterfat, so skimming it takes them along: MEXT reports **D, E and K all as
  Tr** for 13005 (entered as 0) and vitamin A drops by two thirds. If milk is a
  meaningful vitamin D or A source in the day, swapping whole → low-fat silently
  removes it. Conversely, if milk is being drunk for **calcium and protein per
  calorie, low-fat is strictly better** — 32.5% DV calcium for 84 kcal.
- **Watch the sodium.** 60 mg/100ml vs whole milk's 41 — nearly +50%, from the
  added non-fat solids. Small in absolute terms, but it moves the wrong way.
- **Four MEXT Tr values are entered as 0**: vitamin D, vitamin E, vitamin K and
  folate (plus vitamin C). Note whole milk's folate is a measured 5 µg, so this
  is a real difference in the source data, not a transcription slip.
- **Choline (18 mg) is the only fill** — MEXT carries none for milk. It is the
  whole-milk row's 16 mg protein-scaled ×3.8/3.3; that lands on 18.4, which
  agrees closely with USDA lowfat milk (~17.7 mg), so the two methods converge.
- **Amino acids are MEXT-measured** (アミノ酸成分表 for 13005), not scaled from the
  whole-milk row — and they are correspondingly higher across the board (総計
  3,900 mg vs whole milk's ~3,400).
- **Heavy metals are 0 across the board**, matching the existing whole-milk row's
  dairy baseline.
- The name is matched by the **existing** `milk` rule, so it needs no new keyword
  and inherits both the 🥛 icon and the **ml** unit. It also inherits milk's
  pinned weight of 10, so the two milk rows now sort together at the very top of
  the list ("Low-Fat" before "Regular" on the alphabetical tiebreak).

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
| Mango | 0.8 µg *(MEXT)* | 0 *(MEXT)* | 7.6 mg | 23 µg | biotin & Se MEXT-measured; choline + lutein from USDA raw mango (MEXT carries neither) |
| Peach (White-Fleshed) | 0.3 µg *(MEXT)* | 0 *(MEXT)* | 6.1 mg | 2 µg | biotin & Se MEXT-measured; choline from USDA raw peach; lutein from USDA *yellow* peach rescaled ×(5/210) by the MEXT white:yellow β-carotene ratio |
| Low-Fat Milk (加工乳 低脂肪) | 2.0 µg *(MEXT)* | 3 µg *(MEXT)* | 18 mg | 0 | only choline filled — the whole-milk row's 16 mg protein-scaled ×3.8/3.3; agrees with USDA lowfat milk ~17.7 mg. Biotin & Se measured |
| Grilled Squid | 6.3 µg *(MEXT)* | 46 µg *(MEXT)* | 98 mg | 0 | only choline filled (USDA squid raw 65 mg, protein-scaled ×23.6/15.58); biotin & Se measured. **Vitamin K is also a fill (0)** — MEXT "—", and するめいか 生 carries 0 |
| Fried Squid (天ぷら) | 4.4 µg *(MEXT)* | 31 µg *(MEXT)* | 70 mg | 0 | only choline filled (same USDA squid basis, ×16.7/15.58); everything else measured, including the batter-oil vitamins K/D/E |
| Grilled Chicken Breast | 5.3 µg *(MEXT)* | 29 µg *(MEXT)* | 103 mg | 0 | only choline filled (USDA roasted breast 82.5 mg, protein-scaled ×38.8/31); biotin & Se measured |
| Barley Rice (麦ご飯) | 0.8 µg *(MEXT)* | 0 *(MEXT Tr)* | 13.4 mg | 0 | *barley half only, per 100g cooked 押麦.* Biotin & Se from MEXT 01170; choline from USDA barley, pearled, cooked. The rice half contributes its own row's values |
| Wagyu Stew Beef (chuck 赤肉) | 2.0 µg | 17 µg | 84 mg | 0 | *per 100g raw, before the ×1.538 cooking concentration.* Biotin & Se are MEXT "—" for all 和牛肉, borrowed from **MEXT 11030** (乳用肥育牛肉 かた 脂身つき) and protein-scaled ×20.2/17.1; choline from USDA beef chuck 87 mg scaled ×20.2/21 |
| Wagyu Roast Beef (round) | 2.1 µg | 17 µg | 88 mg | 0 | *per 100g raw, before the ×1.25 cooking concentration.* Same 11030 source, protein-scaled ×21.3/17.1 since the round is leaner and denser in protein; choline USDA beef ×21.3/21 |
| Boiled Shijimi Clam | 21.6 µg | 35 µg | 65 mg | 0 | *per 100g meat, before the shell-on rebase.* Both biotin and Se are MEXT "—" for shijimi and are borrowed wholesale from the あさり row (closest MEXT bivalve); choline from USDA clams, mixed species, raw |
| Boiled Asari Clam | 21.6 µg *(MEXT)* | 35 µg *(MEXT)* | 65 mg | 0 | *per 100g meat, before the shell-on rebase.* Only choline filled (USDA clams, mixed species, raw); biotin & Se are measured |

Rationale for the specific picks:

- **Selenium in fish (45 µg):** fish are reliably selenium-rich (~30–60 µg/100g
  across species); 45 µg is a mid-range oily-fish estimate used for both sawara
  and gindara since neither MEXT entry reports it.
- **All 和牛肉 selenium and biotin are fills, for every wagyu row.** MEXT leaves
  both "—" across the entire ［和牛肉］ group, so they come from ［乳用肥育牛肉］
  (dairy-fattened steer), the closest MEXT beef with measured values. The breed
  differs but selenium and biotin track feed and organ chemistry far more than
  marbling, so this is a much safer borrow than the shijimi one below. Note MEXT
  leaves them "—" for many dairy-beef cuts too (e.g. 11053 そともも) — **11030 is
  one of the few with both measured**, which is why it is the source.
- **Shijimi's biotin (21.6 µg) is the weakest fill in the dataset.** MEXT leaves
  it "—" for shijimi, and bivalve biotin varies enormously in the entries that
  *are* measured — あさり 21.6 µg vs かき (oyster) ~4.8 µg, a 4.5× spread. Taking
  あさり's figure is a closest-analog guess with a wide error bar, not a derived
  value; it is worth ~7% DV per serving, so the practical cost of being wrong is
  small. Shijimi's selenium (35 µg, same source) is soft for the same reason.
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
   Spinach now sort inside Vegetables.) **"Milk" is a keyword, not a single
   row** — every name containing "milk" shares the pinned weight of 10, so the
   two milk rows (Low-Fat, Regular Whole) both sit at the top and order between
   themselves alphabetically. Any future milk lands there too.
2. **Categories**, in this order: Fruits → Vegetables → Meat → Chicken → Fish
   (**shellfish included** — the clams share the Fish weight of 500) →
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
  **That "Boiled" → "oil" trap has now bitten twice** — both clam entries begin
  with "Boiled", so the shellfish rule (🐚) must also sit above the Oil rule in
  `getFoodStyle()`; it is placed directly after the fish rule. Any future
  "Boiled …" entry needs the same care. (`getFoodTypeWeight()` is safe here
  because its Oils rule matches only names *ending* in "oil".)
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
- **The best keyword is often no new keyword at all.** `Barley Rice (麦ご飯
  5割麦)`, `Wagyu Stew Beef (シチュー用牛肉 Stewed)` and `Wagyu Roast Beef
  (ローストビーフ用牛肉)` were all added with **zero** changes to either function:
  the English words `rice` and `beef` in their names already route them to Carbs
  (🍚) and Meat (🥩). Naming a new food so an existing rule catches it correctly
  is safer than adding a rule. In particular, **do not add a bare `麦` keyword**
  to make 麦ご飯 match — `麦` is also in `Barley Miso (麦みそ)`, and depending on
  where the rule landed it would drag the miso into Carbs or repaint it 🍚.
  (Today the miso survives only because its own `miso`/`みそ` rule runs first.)
- **Also weigh collisions with names that do not exist yet**, where a Japanese
  keyword is ambiguous. There are now two worked examples, and both were resolved
  by picking a *narrower* keyword:
  - **Peach** matches `peach` and `桃` but deliberately **not `もも`**, because
    鶏もも is chicken thigh and the Fruits rule runs *above* the chicken rule in
    both functions — a future 鶏もも entry would silently become a 🍑 in Fruits.
    `桃` carries no such ambiguity.
  - **Squid** matches `squid` and `するめ` but deliberately **not `いか`**,
    because いか is a substring of **すいか (watermelon)** — a future すいか entry
    would land in Fish as a 🦑. `するめ` is specific to the squid species actually
    used here. (The same caution would apply to `たこ`/octopus vs たこやき.)
- **RDI targets** live alongside this, in `RDI_TARGETS` in the same file, and
  must stay consistent with the CSV `% Daily Value (RDI)` denominators (see the
  Data Structure note above).

## Deployment

- The visualizer deploys via GitHub Actions on push to `master`; no manual build
  needed for the live site.
