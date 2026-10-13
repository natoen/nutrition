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
  at the **30–49 bracket of the 2025 edition**, the user's age; 340 is 18–29, 370
  is 50–64, 350 is 65–74 and 330 is 75+), Copper **0.9 mg** (2025, 30–64) and Zinc
  **9.5 mg**
  (2025, 30–64 — see the Copper, Magnesium & Zinc note below; the 2020 edition
  said 11). A table computed with the wrong
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
     **Kale vitamin E reconciled to MEXT on 2026-10-11.** The raw-kale baseline had carried
**1.33 mg/100g**, a USDA(0.66)/MEXT(2.4) hybrid flagged since July. It is now MEXT's
**2.4 mg α-tocopherol/100g** in both `Steamed Kale` and `Raw Kale (Bioavailable)`
(vitamin E is heat-stable, so the steamed row takes ×1.00). `King Of Kale Salad` holds
30 g of kale, so its vitamin E rose **3.06 → 3.381 mg/serving (20.4% → 22.5% DV)**.

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

#### Pumpkin Seeds (Alishan 有機かぼちゃの種)

`Pumpkin Seeds (Alishan 有機かぼちゃの種)` is **raw, hulled, organic, unsalted** seeds,
sourced in two tiers because MEXT has no matching preparation:

| tier | source | nutrients |
|---|---|---|
| 1 | **Alishan's own label** | 582 kcal, protein 37 g, fat 46 g, carb 7.6 g, salt 0.03 g |
| 2 | **MEXT 05006 かぼちゃ いり 味付け** | fibre + every micronutrient and the amino acids |

**MEXT's only pumpkin-seed entry is いり 味付け — roasted AND seasoned**, which is a
different product from raw unsalted seeds. Its minerals are still the best available
reference (salting moves sodium, not magnesium or zinc), but **its sodium is deliberately
NOT used**: MEXT 05006 is 47 mg/100g against Alishan's 12 mg (salt 0.03 g).

**The macros disagree between the two sources and Alishan wins**, since it is the actual
product:

| per 100g | Alishan (label) | MEXT 05006 | USDA raw kernels |
|---|---|---|---|
| Energy | **582 kcal** | 590 | 559 |
| Protein | **37.0 g** | 26.5 | 30.2 |
| Fat | **46.0 g** | 51.8 | 49.1 |

Alishan's 37 g protein is well above both references — 1.40× MEXT's. Added oil in the
seasoned MEXT product explains part of the gap (more fat dilutes protein) but not all of
it; variety differences are the likely remainder, since high-protein Styrian-type seeds
are common in organic supply. **Alishan's panel is internally consistent**, which is why
it is trusted: Atwater gives `37×4 + 46×9 + 7.6×4 = 592 kcal` against the stated 582,
2% apart. **A consequence worth noting: the micronutrients come from a 26.5 g-protein
basis while the macros are 37 g, so the minerals are probably slightly conservative.**

What the row is for, per **30 g** (a normal handful):

| | per 30 g | %DV |
|---|---|---|
| **Manganese** | 1.32 mg | **57%** |
| **Magnesium** | 159 mg | **42%** |
| **Phosphorus** | 330 mg | **26%** |
| **Iron** | 1.95 mg | **26%** |
| **Zinc** | 2.31 mg | **24%** |
| Protein | 11.1 g | 22% |
| Calories | 175 | 9% |

**This is now the dataset's best magnesium source per serving** and its best plant zinc —
the two things pumpkin seeds are known for, both confirmed. Note 175 kcal per handful is
not trivial.

- **Arginine is 4,700 mg of the 29,000 mg amino-acid total** — by far the largest single
  amino acid, and ~4.7% of the seed by weight. Characteristic of pumpkin seeds.
- **Iron is the micronutrient with the widest source disagreement**: MEXT 6.5 mg vs USDA
  raw 8.82. MEXT's lower figure is used, per the repo's priority rule.
- **Heavy metals use a seed baseline** (As 0.001, Cd 0.015, Hg 0.0002, Pb 0.002 ppm).
  Cadmium is set below the sunflower row's 0.02 — sunflower is the stronger Cd
  accumulator — but above the nut rows, since cucurbit seeds do take up some cadmium.
- **A keyword trap was hit and fixed.** "Pumpkin Seeds" contains **"pumpkin"**, which
  already maps to Kabocha (🎃, Vegetables 200) — so without intervention this row rendered
  as a 🎃 *vegetable*. A `pumpkin seed`/`かぼちゃの種`/`pepita` rule is therefore placed
  **above** the pumpkin rule in *both* functions (🌱, Nuts/Seeds 600). Verified
  `Kabocha (Raw)` still returns 🎃/200. Same class as "coconut" containing "nut".

#### Oatmeal (日食オートミール)

`Oatmeal (日食オートミール Dry g)` is from **MEXT 01004 えんばく オートミール** used
directly (÷100). The user's product is 日食 (Nisshoku / 日本食品製造) **organic** pure
oatmeal — rolled and steamed — prepared by adding water and microwaving.

**BASIS: DRY weight — the gram you scoop out of the bag, not the cooked porridge.**
MEXT 01004 is the dry product, and this is the third basis convention in the dataset
(alongside per-serving composites and the shell-on clams), so it is spelled out in the
row name. Cooked weight was rejected deliberately: porridge weight depends entirely on
how much water is added, so it is not reproducible, whereas 30 g dry is exact. **Note
this differs from the rice rows, which ARE cooked weight** — `Cooked White Rice` is
1.56 kcal/g against this row's 3.50 kcal/g, and the gap is water, not food.

**No cooking adjustment is applied, and none is needed.** Nisshoku's own page states the
product is *already* heat-processed — whole groats are steamed, roller-flattened, then
roasted — and «そのままお召し上がりいただけます» (edible straight from the bag). Adding
water and microwaving therefore only rehydrates it. There is also **zero leaching**,
since the water is absorbed and eaten. The only heat-labile nutrient in meaningful
supply is B1 (0.20 mg/100g), where even a harsh 15% loss on a 30 g serving costs
0.009 mg ≈ 0.75% DV.

**Nisshoku's own panel corroborates MEXT closely**, which is why MEXT was used whole
rather than stitching the two together (Nisshoku publishes only a partial panel, and
gives *ranges* because «農地、気候、品種、作況» make oat nutrients vary):

| per 100g | MEXT 01004 | Nisshoku (×100/30) |
|---|---|---|
| Energy | 350 kcal | 367 kcal |
| Protein | 13.7 g | 9.0–16.7 g |
| Carbohydrate | 69.1 g | 70.1 g |
| Dietary fibre | 9.4 g | 10.6 g |
| Calcium | 47 mg | 37–63 mg |
| Iron | 3.9 mg | 3.3–5.7 mg |
| Vitamin E | 0.6 mg | 0.33–0.67 mg |

MEXT falls inside Nisshoku's stated range for calcium, iron, B6 and vitamin E.

Things worth knowing, per **30 g dry serving** (Nisshoku's own serving size):

- **Manganese is the standout: 1.08 mg, 47% DV.** Oats are genuinely manganese-rich.
  Note MEXT leaves Mn as "—", so this is a USDA fill (3.6 mg/100g) and therefore the
  softest big number in the row.
- **Biotin 6.6 µg (22% DV) is MEXT-MEASURED**, not filled — 22.0 µg/100g. Oats are a
  real biotin source, in the same league as the nut rows.
- Iron 1.17 mg (16% DV), fibre 2.82 g (10% DV), selenium 5.4 µg (10% DV), protein 4.1 g,
  for 105 kcal.
- **β-glucan is NOT tracked.** Nisshoku prints 1.4 g per 30 g serving, and it is the
  soluble fibre behind oats' cholesterol claims — but this dataset has only a single
  `Dietary Fiber` column, so the β-glucan share is invisible. Same class of gap as
  lycopene, citrulline and cacao's flavanols.
- **Choline (26 mg) and lutein (180 µg) are USDA fills**; MEXT carries neither.
- **Heavy metals use a DRY cereal-grain baseline** (As 0.005, Cd 0.015, Hg 0.0005,
  Pb 0.008 ppm). These sit above the cooked grain rows because those are water-diluted,
  and below the seed rows. Arsenic is kept low because oats are not paddy-grown and are
  not an arsenic accumulator, unlike rice.
- The name needed new `oat`/`オート`/`えんばく` rules (🥣, Carbs 700); `oat` was verified
  against every existing food name first and collides with none. **The name originally
  contained a comma** (`...オートミール, Dry g`) which would have broken the CSV — the
  append guard caught it, the same trap as the wagyu stew row.

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

#### Filipino-Style Batch — Tomato, Sunny Lettuce, Kidney Beans, Crab, Fried Fish, Fried Wings

Seven rows added together (2026-09-20). Four are MEXT used directly; three are
fried and therefore derived.

**Used directly (÷100), all MEXT:**

- **`Tomato (Raw 赤色トマト)`** ← MEXT **06182** 赤色トマト 果実 生
- **`Sunny Lettuce (Raw サニーレタス)`** ← MEXT **06315** サニーレタス 葉 生
- **`Kidney Beans (Boiled いんげんまめ)`** ← MEXT **04008** いんげんまめ 全粒 ゆで
- **`Boiled Crab (ずわいがに ゆで)`** ← MEXT **10336** ずわいがに ゆで

**The frying model (shared by the three fried rows).** None of these are battered
— Filipino-style fried fish and plain fried wings go into the oil bare. The model
is the same one used for the squid 素揚げ reasoning:

```
100 g raw  →  75 g after water loss  →  +5 g absorbed oil  →  80 g fried
per 100 g fried: raw solids × 1.25, plus 6.25 g of frying oil
```

On top of the ×1.25 concentration, thermal retention is applied: **B-vitamins
×0.85, folate ×0.80, vitamin C ×0.75**, minerals and fat-soluble vitamins ×1.00.
The oil contributes 9 kcal/g plus α-tocopherol (15.2 mg/100g) and vitamin K
(120 µg/100g), which is why all three fried rows gain vitamin E and K.

- **`Fried Tilapia (ティラピア)`** ← MEXT **10212** ナイルティラピア 生, fried.
  **Tilapia is a surprise vitamin D source — 11.0 µg/100g raw**, which survives
  frying intact (fat-soluble, ×1.25) to **13.8 µg/100g fried, 69% DV**. That is
  higher than the canned sanma rows.
- **`Fried Bangus (サバヒー)`** ← **USDA raw milkfish**, fried. **MEXT carries no
  milkfish at all** — it is a tropical aquaculture species — so this is the only
  row in the dataset with no MEXT basis whatsoever. See the caveats below.
- **`Fried Chicken Wings (手羽 揚げ)`** ← MEXT **11218** 若どり 手羽 皮つき 生,
  fried. **Fat uses a reduced ×1.05 factor, not ×1.25**, because skin-on poultry
  *renders fat out* during frying — the same reasoning as the Grilled Fish model,
  where rendered fat drips away rather than concentrating.

Things worth knowing:

- **Kidney beans are the dataset's fibre champion: 13.6 g/100g.** A 150 g serving
  is **7.3 g fibre (26% DV)** plus 14 g protein, and MEXT measures the biotin
  (3.7 µg) rather than leaving it "—". Sodium is Tr → 0, so this is the rare
  protein source that adds no salt.
- **Sunny lettuce massively outperforms the romaine rows** on the numbers that
  matter for a leaf: 170 µg RAE vitamin A, 160 µg vitamin K, 120 µg folate and
  **1.8 mg iron** per 100g. It is a genuinely different food from iceberg/romaine,
  not a garnish.
- **Tomato's lycopene is NOT tracked** — the dataset has no lycopene column, and
  the 123 µg lutein fill badly under-describes it, exactly as with watermelon.
  Read the vitamin A figure (45 µg RAE) instead.
- **Boiled crab is measured, not derived**, and is a strong low-calorie protein:
  15 g protein and only 65 kcal per 100g, with **7.2 µg B12 (300% DV)**, 120 mg
  calcium and 3.1 mg zinc. Note MEXT's ずわいがに is **snow crab**; if the intended
  crab is Philippine alimasag, MEXT's species match is **がざみ (10332)** but it
  exists only **raw**, which is why the measured boiled snow crab was used instead.
- **Fried wings are the most calorie-dense of the three** at 292 kcal/100g (21.3 g
  fat), against fried bangus 241 and fried tilapia 211.

Fills and soft numbers:

- **`Fried Bangus` is the softest row in the dataset.** Its base is USDA raw
  milkfish, and USDA reports **no vitamin D, E or K** for it — vitamin D is
  entered as **0 rather than invented**, which likely *understates* a fatty fish.
  Its **amino acids are the tilapia profile scaled ×20.5/19.8** onto the milkfish
  protein basis, not measured. Treat the whole row as an estimate.
- **Selenium and biotin for tilapia are MEXT "—"**, filled with the repo's
  standard fish estimates (45 µg, 5 µg).
- **Crab's selenium (34 µg) and choline (81 mg) are USDA fills**; its biotin
  (4.3 µg) comes from MEXT's raw ずわいがに entry.
- **Heavy metals**: crab uses a crustacean baseline (As 1.5 ppm — again
  overwhelmingly organic arsenobetaine, as with asari and squid; Cd 0.05, Hg 0.03,
  Pb 0.01). The two fried fish use the standard fish baseline; wings reuse the
  poultry baseline.

Two visualizer traps were hit and handled in this batch:

- **`Boiled Crab` contains the substring "oil"** — the fourth time this has
  happened (Boiled Soba, both clams, now crab). The 🦀 rule is placed above the
  oil rule.
- **"Milkfish" contains "milk"**, which would have pinned the row to the top of
  the list with a 🥛 icon *and an `ml` unit*. The row is therefore named
  **`Fried Bangus (サバヒー)`** with no "Milkfish" in it. If anyone renames it,
  that trap returns.

#### Aduna Super Cacao Powder

A **branded product**, not a MEXT entry, so it is sourced in three tiers:

| tier | source | nutrients |
|---|---|---|
| 1 | **the user's packaging panel**, confirmed identical to the manufacturer's 275 g panel at `aduna.com/products/cacao-powder-275g` | 321 kcal, protein 22 g, fat 11 g, carb 50 g total, fibre 33 g, salt 0 g, Mg 495 mg, Ca 130 mg, **K 1526 mg**, **P 738 mg** |
| 2 | **MEXT 16048 ココア ピュアココア** | all vitamins, Cu, **Fe**, Zn |
| 2b | USDA unsweetened cocoa | Mn 3.84 mg, Se 14 µg, choline 12 mg, lutein 0 |

**The energy cross-check confirms the carbohydrate basis exactly.** The packaging's
"carb 50 g" could have been EU-style *available* carbohydrate or total-including-fibre.
Atwater against the label:

```
22×4 + 11×9 + 17×4 + 33×2  =  88 + 99 + 68 + 66  =  321 kcal   (label: 321)
```

An exact match — so the 50 g **is total carbohydrate including the 33 g of fibre**,
splitting as 17 g available + 33 g fibre, which is also precisely what the
manufacturer's panel prints. Had the 50 g been available carb, energy would compute to
~387 kcal, 20% above the label.

**Beware aggregated search results for this product.** A search summary gave fibre 36 g,
K 2050 mg, Mg 600 mg, protein 24 g and **iron 40 mg**, and three of those briefly went
into this row before the manufacturer's page was read directly. It was a mash-up: Aduna
sells the powder in **two pack sizes whose panels differ**, and retailer listings add
stale values. Neither official panel lists iron at all:

| per 100 g | 275 g pack (matches the user's) | 100 g pack |
|---|---|---|
| Energy | **321 kcal** | 319 kcal |
| Carbohydrate | 17 g | 19.5 g |
| Fibre | **33 g** | 25.5 g |
| Protein | **22 g** | 22.8 g |
| Magnesium | **495 mg** | 478 mg |
| Potassium | **1526 mg** | 1515 mg |
| Phosphorus | **738 mg** | 731 mg |
| Salt | 0 g | 0.025 g |

- **Iron is stored as 4.2 mg/100g — a POLYPHENOL-DISCOUNTED value, not total content.**
  See the dedicated note below. The total-content figure is **14.0 mg** (MEXT 14.0,
  USDA 13.9); *neither* Aduna panel reports iron at all, so the "40 mg" that appeared
  in an aggregated search summary has no manufacturer source and was never used.
- **Potassium and phosphorus now come from the manufacturer**, not MEXT — 1526 and
  738 mg against MEXT's 2800 and 660. The potassium correction is large (−45%) and
  matters: MEXT's generic ピュアココア is simply a different powder.
- **Sodium is 10 mg**, from the 100 g pack's printed salt 0.025 g. The 275 g pack rounds
  salt to 0 g, which is a rounding floor rather than a measured zero.
- **Biotin (26.8 µg) now comes from Fineli**, the Finnish national food composition
  database (THL), which reports **7.5 µg per 28 g** for unsweetened cocoa powder.
  MEXT leaves biotin "—" for *both* its cocoa entries (ピュアココア 16048 **and**
  ミルクココア 16049), and USDA FoodData Central does not carry biotin at all, so Fineli
  is the only national database with a figure. **This replaced an unsourced 3 µg
  estimate on 2026-10-11 — a 9× correction.** The 3 µg was guessed from a vague
  "cocoa literature ~2–6 µg" impression and was simply wrong; 26.8 µg fits the
  seed/nut pattern of the surrounding MEXT-measured rows:

  | row (per 100g) | biotin |
  |---|---|
  | Roasted Almonds *(MEXT)* | 60.6 µg |
  | Raw Sunflower Seeds | 33.0 µg |
  | **Aduna Cacao *(Fineli)*** | **26.8 µg** |
  | Natto *(MEXT)* | 18.0 µg |
  | Ground Sesame / Peanut Butter | 15.0 µg |
  | Rice Miso *(MEXT)* | 12.0 µg |

  A 20 g serving went from 0.60 µg (2% DV) to **5.36 µg (17.9% DV)** — so biotin is now
  one of this row's better nutrients rather than a rounding error. Fineli is a
  secondary source for this dataset (not MEXT, not USDA), so treat it as softer than a
  MEXT-measured value, but it is a real named national database rather than a guess.
- **Amino acids** are the MEXT ピュアココア profile scaled ×22/18.5 to the label's
  protein basis.

What the row is actually good for, per **20 g** (a typical dose):

| | per 20 g | %DV |
|---|---|---|
| **Copper** | 0.76 mg | **84%** |
| **Manganese** | 0.77 mg | **33%** |
| **Magnesium** | 99 mg | **27%** |
| **Fibre** | 7.2 g | **26%** |
| Potassium | 560 mg | 19% |
| Iron | 2.8 mg | 37% |
| Calories | 64 | 3% |

**Copper is the headline** — cocoa is the densest copper source in the dataset among
single foods (3.8 mg/100g; only the three composite salads/smoothies total higher).
A 20 g spoonful covers most of a day's copper.

Two caveats worth knowing:

- **Cadmium: this row is the dataset's highest at 0.095 ppm**, and that is *because*
  cacao is a well-known cadmium accumulator. **Origin dominates the number** — Ghana
  (which Aduna sources from) averages **0.094 mg/kg** in cocoa powder against **Peru
  0.53** and **Ecuador 0.44**, a 5× spread, and the EU limit for consumer cocoa powder
  is 0.60. So the figure used is the Ghana-specific mean, and it is low *for cacao*.
  A South American powder would warrant ~0.5 ppm here. Arsenic 0.05, mercury 0.005,
  lead 0.05 ppm.
- **Flavanols — the thing this product is actually sold for — are NOT tracked.** Aduna
  markets ~200 mg flavanols per 20 g serving and "twice the flavanols of regular
  cacao", but this dataset has no flavanol or theobromine column, exactly as with
  lycopene (tomato/watermelon) and citrulline (watermelon). Nothing in the row
  reflects the premium; read it as a mineral and fibre source.
- The name needed new `cacao`/`cocoa`/`カカオ`/`ココア` rules (🍫). **`cocoa` is not a
  substring of `coconut`** (c-o-c-o-a vs c-o-c-o-n-u-t), so the coconut row is safe,
  and "Aduna" contains no `nut`. Sort weight is left at the Others default (800).

##### Iron is polyphenol-discounted (×0.30)

**This row's iron is the one value that does NOT match a label or a composition table.**
Stored: **4.2 mg/100g**, which is MEXT/USDA's 14.0 mg × **0.30**. This follows the same
convention as the `Raw Spinach (Bioavailable)` / `Steamed Spinach` oxalate discount —
a retention factor expressed *relative to the ordinary mixed-diet absorption the RDI
already assumes*, so the number stays comparable to the %DV bars.

Cacao is an unusually hostile matrix for non-heme iron, carrying **three** inhibitors at
once: polyphenols, oxalate (**total 619–783 mg/100g, soluble ~360–567**, i.e. comparable
to spinach's load) and phytate (**590–750 mg/100g**). Two studies bracket the factor:

| source | design | implies |
|---|---|---|
| **Hurrell, Reddy & Cook 1999**, *Br J Nutr* | **human**, erythrocyte radio-Fe incorporation, cocoa beverage + bread meal | **71% inhibition** → ×0.29 |
| **Yokoi & Konomi**, *Br J Nutr* | rat, Hb-regeneration efficiency, 20-day repletion | cocoa-iron **RBV 45.9–48.8%** vs ferrous sulphate (≈ferric citrate's 47.8%) → ×0.47 |

**×0.30 is taken from the human study, deliberately the conservative end.** The two
measure different things: Hurrell measured cocoa suppressing *a meal's* iron, while the
rat RBV measured cocoa's *own* iron — and rat repletion assays generally read more
favourably than human absorption. Cocoa's intrinsic iron sits in the same polyphenol
matrix that produced the 71% figure, so the human number is the better guide. Treat
**×0.29–0.47 as the real uncertainty band**; if a milder reading is wanted, ×0.45 is
defensible on the rat data.

Practical effect: a 20 g serving reads **0.84 mg (11% DV)** instead of 2.80 mg (37% DV).

Two honest caveats about this discount:

- **It makes the dataset inconsistent, in a known way.** Other phytate- and
  polyphenol-rich non-heme sources here — natto, kidney beans, ground sesame, almonds,
  the breads, barley rice — carry **total** iron with no discount. Only spinach and now
  cacao are adjusted. The justification is the README's own test (*"only nutrients with
  a large, well-documented raw penalty are cut"*), and a 71% human-measured inhibition
  clears it. But a reader comparing cacao's iron to kidney beans' is not comparing like
  with like.
- **Calcium is also discounted — ×0.33. Zinc and magnesium are NOT.** See below.

##### Calcium is oxalate-discounted (×0.33); zinc deliberately is not

**Calcium: 130 → 42.9 mg/100g (×0.33).** Cacao's soluble oxalate exceeds its own calcium
in molar terms, so most of that calcium is present as calcium oxalate before it is even
swallowed:

```
soluble oxalate  469 mg ÷ 88   = 5.33 mmol
calcium          130 mg ÷ 40.1 = 3.24 mmol     -> oxalate exceeds calcium 1.65 : 1
```

The factor comes from **Heaney & Weaver, "Oxalate: effect on calcium absorbability"
(*AJCN* 1989)**, which measured fractional calcium absorption in humans:

| | fractional absorption |
|---|---|
| calcium oxalate, alone | **0.100** |
| calcium oxalate + milk | 0.140 |
| milk calcium (reference) | **0.358** |

0.100 ÷ ~0.30 reference ≈ **0.33**. Note this is **milder than spinach's ×0.17**, and
that is deliberate — the same paper observed that calcium oxalate absorbed *better* than
the spinach calcium they had measured previously, and cacao's oxalate:calcium ratio
(1.65:1) is far less extreme than spinach's ~7:1.

Counter-evidence worth knowing: studies at Creighton found chocolate does **not** impair
calcium absorption from *chocolate milk*. That is not a contradiction — it concerns
**milk's** calcium, which arrives in such excess that a spoonful of cocoa's oxalate
cannot bind much of it (Heaney & Weaver saw no interference with milk calcium either).
The discount here applies only to cacao's **own** 130 mg.

In practice this barely moves: a 20 g serving goes from 3.2% to **1.1% DV**. Cacao is
not a calcium food either way.

**Zinc is NOT discounted (7.0 mg/100g, total content).** A ×0.42 phytate discount was
applied on 2026-10-11 and **reverted the same day** — the method did not survive scrutiny,
and the reason is worth recording so it is not repeated.

The WHO/IZiNCG phytate:zinc bands (<5 high, 5–15 moderate, >15 low) are calibrated on
**whole diets, not single foods**. Scored alone, essentially every plant food in this
dataset lands in the ">15, low" band:

| scored in isolation | phytate:zinc ratio |
|---|---|
| Barley Miso | 66 |
| Ground Sesame | 57 |
| Peanut Butter | 51 |
| Natto | 45 |
| Roasted Almonds | 37 |
| Brown Rice | 31 |
| Wheat Bread | 30 |
| Kidney Beans | 29 |
| **Aduna Cacao** | **24.6** |
| Cooked White Rice (bran removed) | 5.0 |

A test that flags almost everything is being misused. A *day's* diet averages 5–15
precisely because these foods are eaten alongside meat, fish, eggs and dairy, which carry
zinc and no phytate. Worked example with the same 20 g of cacao:

| | phytate | zinc | ratio | band |
|---|---|---|---|---|
| cacao alone | 348 mg | 1.40 mg | **24.6** | >15 low |
| cacao inside a realistic day | 1486 mg | 14.93 mg | **9.9** | **5–15 moderate** |

9.9 is the band the 9.5 mg zinc RDA was calibrated on, so **the phytate penalty is already
priced into the target** — discounting the food as well charges it twice. Cacao was simply
the row the rule got applied to first; it is no more deserving than the sesame or miso
above.

**The general rule this establishes for this dataset: discount a nutrient only when there
is a measured absorption outcome for that food, never from a diet-level screening ratio.**
Cacao's iron (Hurrell, 71% inhibition measured in humans) and calcium (Heaney & Weaver,
10% vs 36% measured) meet that test. Zinc did not.

So this row carries **two** bioavailability discounts — iron ×0.30 and calcium ×0.33 —
while zinc, copper, magnesium, manganese, potassium, phosphorus and fibre are total
content. Per 20 g the row reads: copper **84% DV**, manganese 33%, magnesium 26%, fibre
24%, biotin 18%, zinc 15%, iron 11%, calcium 1%.

#### Coconut Water (ココナッツウォーター)

`Coconut Water (ココナッツウォーター)` is per-gram (entered in ml, ≈1 g/ml), from
**MEXT 07157 ココナッツウォーター** used directly (÷100).

**"Coconut juice" means coconut WATER here, not coconut milk** — they are
different foods and MEXT carries both:

| per 100g | ウォーター (07157) | ミルク (07158) |
|---|---|---|
| Calories | **22** | **157** |
| Fat | 0.1 g | **16.0 g** |
| Protein | 0.2 g | 1.9 g |
| Carbohydrate | 5.0 g | 2.8 g |

Coconut **water** is the thin liquid inside the nut; coconut **milk** is pressed
from the grated flesh and is **7× the calories and 160× the fat**. If the intent
was the cooking ingredient (curries, etc.), that is 07158 and needs its own row.

- **Beware old editions here specifically.** MEXT split these two entries because
  **earlier editions filed coconut water's values under coconut milk** — a
  documented mislabelling, not a revision. Any pre-八訂 source for "ココナッツミルク"
  may actually be water. Same class of trap as the 七訂 values for mango/asari.
- **Potassium and manganese are the only notable numbers.** A 250 ml glass is
  575 mg potassium (**19% DV**) and 0.40 mg manganese (**17% DV**) for 55 kcal.
  Everything else is trace — B5 and B6 are MEXT-measured **0**, vitamin A, E and
  D are 0, and copper is Tr.
- **It is not the electrolyte drink it is marketed as, on sodium**: 11 mg/100g is
  negligible (a 250 ml glass is 28 mg, ~1% DV). The potassium is the real story.
- **Four values are MEXT "—" and filled**: selenium (1 µg) and choline (1.1 mg)
  from USDA coconut water; vitamin K filled as **0** (USDA reports 0); biotin as
  **0**. With 0.2 g protein and 22 kcal, none of these move anything.
- **Amino acids are MEXT-measured** (total 220 mg/100g).
- **Heavy metals** use the standard fruit baseline.
- The name needed new `coconut`/`ココナッツ` rules (🥥, Fruits 100). **Watch the
  `nut` substring**: "coconut" contains "nut", so it is only classed as fruit
  because `getFoodTypeWeight`'s Fruits rule runs *above* Nuts/Seeds. Verified —
  it returns 100, and the four Nuts/Seeds rows are unaffected. If those rules are
  ever reordered, coconut silently becomes a nut.

#### Sauteed Spinach (油いため)

`Sauteed Spinach (ほうれんそう 油いため)` is per-gram, from **MEXT 06359 ほうれんそう
葉 通年平均 油いため** — a *measured* cooked entry, so unlike `Steamed Spinach`
(which is derived from the raw baseline) no retention factors are applied.

**It carries the SAME oxalate mineral discount** as `Steamed Spinach` and `Raw
Spinach (Bioavailable)` — **Ca ×0.17, Fe ×0.10, Mg ×0.60** — applied on top of
MEXT's measured values. This is not optional: sautéing cooks the leaf in **oil,
not water, so there is ZERO leaching** — even less oxalate is removed than by
steaming (~42% of soluble oxalate). If anything, sautéed spinach's minerals are
*more* tightly bound than the steamed row's. The stored values are therefore:

| per 100g | MEXT measured | ×discount | stored |
|---|---|---|---|
| Calcium | 88 mg | ×0.17 | **15.0 mg** |
| Iron | 1.2 mg | ×0.10 | **0.12 mg** |
| Magnesium | 52 mg | ×0.60 | **31.2 mg** |

Everything else is MEXT's measured value untouched.

- **Sautéing concentrates hard** — spinach sheds a lot of water. Against the raw
  baseline (06267) the factors are **vitamin A 630/350 = 1.80**, β-carotene
  7600/4200 = 1.81, protein 3.8/2.2 = 1.73. That is why 100 g of sautéed spinach
  reads far denser than 100 g of steamed: **vitamin K 510 vs 270 µg (425% DV!)**,
  vitamin A 630 vs 350 µg RAE, vitamin E 4.8 vs 2.07 mg, lutein 22,000 vs
  12,200 µg. Remember 100 g of sautéed spinach started as ~180 g raw.
- **Folate is the one thing that goes DOWN** — 140 µg vs steamed's 168 — because
  MEXT's sautéing is hotter and longer than the 80%-retention steaming model.
  Sautéed spinach is the better choice for everything *except* folate and the
  water-soluble vitamins.
- **The added oil is most of the calories**: 91 kcal vs steamed's 20, with 8.1 g
  fat against 0.43 g. That fat is not a downside for absorption — it is exactly
  the "eaten with fat" condition the Raw Leafy Greens section relies on, so the
  carotenoids here are genuinely well absorbed.
- **Fills, all concentration-scaled from the raw baseline**: selenium
  (MEXT raw 3 µg → **5.2**), biotin (MEXT raw 2.9 µg → **5.0**), choline (USDA
  raw 19.3 mg → **33**), lutein (USDA raw 12,200 µg → **22,000**, scaled by the
  carotenoid ratio 1.80 rather than the protein ratio).
- **Note an inconsistency with the older `Steamed Spinach` row**: it carries
  selenium 1 µg and biotin 1.53 µg, which look like USDA figures, where **MEXT
  measures raw spinach at 3 µg and 2.9 µg**. This new row follows the repo's
  MEXT-priority rule instead. The two rows therefore disagree on those two
  nutrients; the steamed row is the suspect one and is worth revisiting.
- **Amino acids are MEXT-measured** for the sautéed entry (total 3,500 mg/100g).
- **Heavy metals** are the Steamed Spinach ppm concentrated by the same 1.73
  water-loss factor (ppm is mass/mass).
- The name is caught by the **existing** `spinach` rule (🥬, Vegetables 200); no
  keyword change was needed.

#### Watermelon (すいか)

`Watermelon (すいか 赤肉種)` is per-gram, from **MEXT 07077 すいか 赤肉種 生**
(red-flesh) used directly (÷100). MEXT also carries a 黄肉種 (yellow-flesh)
variant; as with the peach pair, the difference would be mainly carotenoids, so
add a second row rather than reusing this one if yellow watermelon is ever eaten.

**This row is the FLESH only.** MEXT's 廃棄率 for watermelon is **40%** — that is
the rind and seeds, discarded before the composition is measured. So log the
weight of red flesh you actually eat, not the weight of the wedge including rind.

**About the white/green rind** (per the user, sometimes bitten into at the
bottom): **there is no MEXT entry for it, and it is not worth modelling.** The
white layer is ~95% water and very low in sugar, so a stray 10–20 g of it is a
couple of kcal — noise against a 400 g serving of flesh. Its one genuinely
distinctive compound is **citrulline, which is *higher* in the rind than in the
flesh** — but citrulline is **not one of this dataset's 18 amino-acid columns**,
so it would not show up even if a rind row existed. Nothing is lost by ignoring
it; just log the flesh.

Things worth knowing:

- **Watermelon is a surprisingly strong vitamin A source for a fruit** — 69 µg
  RAE/100g, from 830 µg β-carotene. A 400 g wedge is **31% DV vitamin A** and
  **44% DV vitamin C (40 mg)**, plus 16% DV potassium, for 164 kcal.
- **It is mostly water and sugar otherwise**: 9.5 g carbohydrate and only 0.3 g
  fibre per 100g, so a large serving moves carbohydrate meaningfully (a 400 g
  wedge is 38 g, ~14% DV) while contributing almost no fibre.
- **Arginine is 51 mg of the 326 mg total amino acids — about 16%**, far and away
  the largest. That is characteristic of watermelon and is the tracked shadow of
  the citrulline story above; the protein content is tiny either way (0.6 g/100g).
- **Lycopene is watermelon's signature carotenoid and is NOT tracked** by this
  dataset (there is no lycopene column, only lutein+zeaxanthin). The 8 µg lutein
  figure is therefore a poor summary of watermelon's carotenoid content — the
  vitamin A / β-carotene figure is the meaningful one.
- **Choline (4.1 mg) and lutein (8 µg) are the only fills**, both USDA raw
  watermelon; MEXT carries neither. Biotin (0.9 µg) and selenium (0) are
  MEXT-measured, as are the amino acids.
- **Heavy metals** use the standard fruit baseline shared by
  banana/blueberry/mango/peach (As 0.0001, Cd 0.0001, Hg 0, Pb 0.0001 ppm).
- **The keyword trap predicted in the Visualizer notes was real, and the earlier
  choice held.** Watermelon needed new `watermelon`/`すいか`/`西瓜` rules (🍉,
  Fruits 100), and the Fruits rule runs *above* the squid rule. Verified
  explicitly: `'するめいか'.includes('すいか')` is **false**, so the squid rows keep
  🦑 — while `'すいか'.includes('いか')` is **true**, which is exactly why the
  squid rule was written against `するめ` and never a bare `いか`. Had it used
  `いか`, adding this food would have silently turned watermelon into squid.

#### Canned Sanma (秋刀魚) — Both MEXT Variants

**MEXT carries exactly two canned さんま entries, and both are here.** The さんま
block runs 10173–10178 (生 皮つき/皮なし, 焼き, 開き干し, みりん干し, then the two
cans) and stops there — **10179 is しいら (dolphinfish)**, which is how the set was
confirmed complete. Both are used directly (÷100):

- **`Canned Sanma Seasoned (さんま缶詰 味付け)`** ← MEXT **10177**
- **`Canned Sanma Kabayaki (さんま缶詰 かば焼)`** ← MEXT **10178**

**There is no 水煮 (plain water-packed) canned sanma in MEXT**, unlike the mackerel
and tuna rows which have one. Japanese sanma cans are sold seasoned — 味付け or
かば焼 — so both of these carry added sugar and soy, and neither is an unseasoned
baseline. That is a real difference from `Canned Mackerel Water-Packed`, and it
is why both rows are sodium-heavy (see below).

| per 100g can | 味付け (10177) | かば焼 (10178) |
|---|---|---|
| Calories | 259 | 219 |
| Protein | 18.9 g | 17.4 g |
| Fat | 18.9 g | 13.0 g |
| Carbohydrates | 5.6 g | **9.7 g** |
| **Vitamin D** | **13.0 µg (65% DV)** | **12.0 µg (60% DV)** |
| **Vitamin B12** | **12.0 µg (500% DV)** | **12.0 µg (500% DV)** |
| Calcium | **280 mg (35% DV)** | 250 mg (31% DV) |
| Sodium | 540 mg (23% DV) | **600 mg (26% DV)** |
| Iron | 1.9 mg | **2.9 mg** |
| Zinc | **1.1 mg** | **0.1 mg** |

- **Vitamin D is the standout.** 13 µg/100g is 65% DV from one can. That is the
  dataset's **third**-densest source per 100g, behind Salmon Roe (47 µg) and
  Grilled Unagi (19 µg), but ahead of grilled salmon and canned mackerel (11 µg
  each) — and unlike roe, a whole 100g can is an ordinary portion. Paired with
  500% DV B12, one can covers both nutrients several times over.
- **The calcium is real and comes from the softened bones**, which are eaten in a
  canned fish. 280 mg/100g beats a glass of milk, and is far above any fresh-fish
  row in the dataset (grilled sawara is 11 mg).
- **Sodium is the cost.** Both are seasoned products, so a 100g can is roughly a
  quarter of a day's sodium *before* rice or miso soup. かば焼 is the saltier and
  also much the sweeter (9.7 g carbohydrate from the tare glaze).
- **かば焼's zinc (0.1 mg) is an order of magnitude below 味付け's (1.1 mg).**
  That is what MEXT reports for both, not a transcription error — it is the single
  largest discrepancy between the two rows and worth knowing if zinc matters.
- **Two MEXT values are `Tr` and two are `(0)`, all entered as 0**: B1 is Tr in
  both; vitamin K and vitamin C are `(0)` in both.
- **Selenium and biotin are fills** — MEXT leaves both "—" for the canned entries,
  so they come from **MEXT 10173 さんま 皮つき 生** (Se 32 µg, biotin 7.4 µg), the
  same fish raw, protein-scaled to each can. Being the same species, this is a
  tighter borrow than the cross-species fills elsewhere in this dataset.
- **Choline is filled from the `Canned Mackerel` row** (65 mg/100g), the dataset's
  closest canned-oily-fish analog, protein-scaled — 59 mg and 54 mg. It is the
  softest number in both rows.
- **Amino acids are MEXT-measured** for both (アミノ酸成分表), not scaled.
- **Heavy metals: sanma is genuinely low-mercury.** At **0.02 ppm** these sit far
  below grilled sawara (0.08) and gindara (0.45), because sanma is a small,
  short-lived, low-trophic pelagic fish that has little time or trophic position
  to accumulate methylmercury. As 0.001, Cd 0.002, Pb 0.001 ppm.
- The rows needed a new **`sanma`/`さんま`/`秋刀魚`** keyword on the fish rule
  (🐟, weight 500). Verified it does **not** disturb `Grilled Unagi (Kabayaki)`,
  which keeps its 🐉 — the unagi rule matches on `unagi`, not on `kabayaki`.

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
| Tomato (Raw) | 2.3 µg *(MEXT)* | 1 µg *(MEXT)* | 6.7 mg | 123 µg | biotin & Se MEXT-measured; choline + lutein USDA raw tomato. **Lycopene is untracked** — lutein under-describes this row badly |
| Sunny Lettuce (Raw) | 0.7 µg | 0.6 µg | 9.9 mg | 1,730 µg | biotin & Se are MEXT "—"; all four from USDA red leaf lettuce |
| Kidney Beans (Boiled) | 3.7 µg *(MEXT)* | 0 *(MEXT Tr)* | 27.1 mg | 0 | only choline filled (USDA kidney beans, boiled); biotin measured |
| Boiled Crab | 4.3 µg | 34 µg | 81 mg | 0 | biotin from MEXT's raw ずわいがに; Se + choline from USDA cooked crab |
| Fried Tilapia | 5.0 µg | 45 µg | 85 mg | 0 | *pre-frying, per 100g raw.* Both MEXT "—"; repo's standard fish estimates |
| Fried Bangus | 5.0 µg | 12.6 µg *(USDA)* | 85 mg | 0 | *pre-frying.* **No MEXT basis at all** — USDA raw milkfish. USDA reports no vitamin D/E/K; D entered as 0 rather than invented. Amino acids are the tilapia profile scaled ×20.5/19.8. Softest row in the dataset |
| Fried Chicken Wings | 3.1 µg *(MEXT)* | 14 µg *(MEXT)* | 70 mg | 0 | *pre-frying.* Only choline filled (USDA chicken wing, protein-scaled) |
| Aduna Super Cacao Powder | 26.8 µg *(Fineli)* | 14 µg | 12 mg | 0 | branded product, not MEXT. Biotin from **Fineli** (Finnish THL database, 7.5 µg/28 g) — MEXT leaves it "—" for both its cocoa entries and USDA carries no biotin at all. Se/choline/Mn from USDA unsweetened cocoa. **Iron is polyphenol-discounted; total content is 14.0 mg (MEXT), deliberately not the 40 mg from an aggregated search summary** |
| Coconut Water | 0 | 1 µg | 1.1 mg | 0 | MEXT "—" for biotin, Se **and vitamin K**; Se + choline from USDA coconut water, vitamin K and biotin filled as 0. At 22 kcal / 0.2 g protein none of these move anything |
| Sauteed Spinach | 5.0 µg | 5.2 µg | 33 mg | 22,000 µg | all four concentration-scaled off the raw baseline (06267): biotin & Se from **MEXT raw spinach** (2.9 / 3 µg) ×1.73, choline from USDA raw spinach ×1.73, lutein from USDA raw spinach ×1.80 (carotenoid ratio). Note this uses MEXT for Se/biotin where `Steamed Spinach` used USDA — see that section |
| Watermelon (すいか 赤肉種) | 0.9 µg *(MEXT)* | 0 *(MEXT)* | 4.1 mg | 8 µg | biotin & Se MEXT-measured; choline + lutein from USDA raw watermelon. Note lutein badly under-describes watermelon's carotenoids — its signature pigment is **lycopene**, which this dataset has no column for |
| Canned Sanma 味付け | 7.7 µg | 33 µg | 59 mg | 0 | both biotin & Se are MEXT "—" for the cans; borrowed from **MEXT 10173 さんま 皮つき 生** (7.4 µg / 32 µg — same fish, raw) and protein-scaled ×18.9/18.1. Choline from the Canned Mackerel row ×18.9/20.9 |
| Canned Sanma かば焼 | 7.1 µg | 31 µg | 54 mg | 0 | same 10173 source, protein-scaled ×17.4/18.1; choline from Canned Mackerel ×17.4/20.9 |
| Low-Fat Milk (加工乳 低脂肪) | 2.0 µg *(MEXT)* | 3 µg *(MEXT)* | 18 mg | 0 | only choline filled — the whole-milk row's 16 mg protein-scaled ×3.8/3.3; agrees with USDA lowfat milk ~17.7 mg. Biotin & Se measured |
| Grilled Squid | 6.3 µg *(MEXT)* | 46 µg *(MEXT)* | 98 mg | 0 | only choline filled (USDA squid raw 65 mg, protein-scaled ×23.6/15.58); biotin & Se measured. **Vitamin K is also a fill (0)** — MEXT "—", and するめいか 生 carries 0 |
| Fried Squid (天ぷら) | 4.4 µg *(MEXT)* | 31 µg *(MEXT)* | 70 mg | 0 | only choline filled (same USDA squid basis, ×16.7/15.58); everything else measured, including the batter-oil vitamins K/D/E |
| Grilled Chicken Breast | 5.3 µg *(MEXT)* | 29 µg *(MEXT)* | 103 mg | 0 | only choline filled (USDA roasted breast 82.5 mg, protein-scaled ×38.8/31); biotin & Se measured |
| Oatmeal (日食オートミール) | 22.0 µg *(MEXT)* | 18 µg *(MEXT)* | 26 mg | 180 µg | biotin & Se are MEXT-measured and both notable; choline + lutein from USDA oats. **Manganese (3.6 mg) is also a USDA fill** — MEXT leaves it "—" — and it is the row's biggest number at 47% DV per 30 g, so the softest of the four |
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

## Copper, Magnesium & Zinc RDI — the 2025 Edition

Copper and zinc were added to the visualizer's displayed nutrients on 2026-10-03
(`NUTRIENT_GROUPS.Others` plus `RDI_TARGETS`), and all three minerals were put on
the **Japanese MHLW adult-male RDA from 食事摂取基準 2025年版**:

| | label | 2025 bracket used | was (2020年版) | CSV %DV column |
|---|---|---|---|---|
| Copper | **0.9 mg** | 30–64 | 0.9 (18–74) | unchanged — same denominator |
| Magnesium | **380 mg** | **30–49** | 370 (30–64) | **rebased ×370/380 in all 93 tables** (2026-10-04) |
| Zinc | **9.5 mg** | 30–64 | 11 (18–74) | **rebased ×11/9.5 in all 87 tables** |

**Copper never moved** — 0.9 mg in both editions for a 30–64 man, so its column was
already correct. Magnesium was initially set to 370 (correct for 50–64) and **rebased
to 380 on 2026-10-04** once the user's age bracket was confirmed as 30–49. Zinc fell
11 → 9.5
because the 2025 revision adopted Japanese urinary-excretion data and moved to
0.5 mg increments, so **every zinc bar now reads ~16% higher** than before.

**Why the magnesium brackets differ at all — it is body weight, not age.** Dividing
each adult-male RDA by that bracket's 参照体重 (reference body weight) gives the same
figure throughout:

| bracket | RDA | reference weight | per kg |
|---|---|---|---|
| 18–29 | 340 mg | 63.0 kg | **5.4 mg/kg** |
| 30–49 | **380 mg** | 70.0 kg | **5.4 mg/kg** |
| 50–64 | 370 mg | 69.1 kg | **5.4 mg/kg** |

So the requirement is ~**5.4 mg per kg of body weight** across all adult brackets, and
the 340/380/370 spread only reflects MHLW's reference man getting heavier then lighter.
If a weight-specific target is ever wanted instead of a bracket lookup, it is
5.4 × body weight (63 kg → 340, 68 kg → 367, 70 kg → 380). **There is no longevity
basis for preferring one end of this range**: dose–response meta-analyses put the risk
reduction in moving from ~150 to ~400 mg/day, with the curve flat at the top, and no
RCT has tested magnesium against mortality. Japan sets **no upper limit for food
magnesium** (the 350 mg/day UL is supplemental only), so neither figure carries risk.

Full 2025 brackets, for when the age bracket changes:

| | 18–29 | 30–49 | 50–64 | 65–74 | 75+ |
|---|---|---|---|---|---|
| Copper, men | 0.8 | **0.9** | **0.9** | 0.8 | 0.8 |
| Magnesium, men | 340 | **380** | 370 | 350 | 330 |
| Zinc, men | 9.0 | **9.5** | **9.5** | 9.0 | 9.0 |

Reference values deliberately **not** used (recorded so they are not mistaken for
the project targets):

| | Japan 2025 women | US RDA men | US RDA women | US label DV |
|---|---|---|---|---|
| Copper | 0.7 (18+) | 0.9 mg | 0.9 mg | 0.9 mg |
| Magnesium | 280 / 290 / 290 / 280 / 270 | 420 mg | 320 mg | 420 mg |
| Zinc | 7.5 / 8.0 / 8.0 / 7.5 / 7.0 | 11 mg | 8 mg | 11 mg |

Upper limits for reference: copper **7 mg** (Japan) vs 10 mg (US); zinc **40–45 mg**
men / 35 mg women (Japan) vs 40 mg (US); magnesium has a Japanese UL only for
supplemental Mg (350 mg), not food.

Note the dataset as a whole is **not** uniformly Japanese — most vitamin targets
are still US label DVs (vitamin C 90 not 100, B1 1.2 not 1.4, selenium 55 not 30,
etc.). Calcium, iron, potassium, magnesium, copper and zinc are the Japanese ones.
That mix is pre-existing and deliberate; see the Data Structure note.

What the rebase touched, for auditing:

- **84 zinc `% Daily Value` cells** recomputed as `Total ÷ 9.5 × 100`. Verified by
  diff that **no `Total` row changed** and no column other than Zinc and Copper
  was touched.
- **4 tables had a zinc Total but a BLANK %DV cell**, so the app had been counting
  their zinc as **zero**: `Strawberry (Amaou)`, `Chicken Thigh (Grilled)`,
  `Pork Loin (Shougayaki)` and `Beef Hire/Tenderloin (Med)`. The last is the
  significant one — 4 mg zinc per 100 g silently missing. The same four were blank
  for copper too. All eight cells are now filled. This bug was invisible until
  copper/zinc became displayed nutrients.
- **7 copper cells** changed: those 4 blanks plus 3 stale values (Canned Mackerel
  ×2, Boiled Soba). Copper's denominator did not change, so cells that were merely
  less precise (e.g. `23.33` vs `23.3333`) were deliberately **left alone** to keep
  the diff reviewable.
- **Copper got a new icon** (🪙) in `getNutrientStyle()` and magnesium one too
  (💎); zinc already matched the existing `selenium`/`zinc` rule (🛡️). With those
  two added, **no displayed nutrient falls through to the default ✨ icon** any
  more — worth re-checking if a nutrient is ever added to `NUTRIENT_GROUPS`.
- Earlier the same day, 3 copper cells were corrected against the 0.9 denominator
  (Romaine Lettuce, Steamed Spinach, Zespri Green Kiwi), all sub-0.05% DV.

### Audit of the long-invisible rows (2026-10-14)

The five rows that had been invisible for months (no %DV row until 2026-10-03) were
finally audited against MEXT. **Four of the five had drifted materially and were
realigned; the fifth cannot be checked.**

| row | realigned to | columns moved >20% |
|---|---|---|
| `Celery (Raw )` | MEXT **06119** セロリ 葉柄 生 | **17** |
| `Sesame Dressing` | MEXT **17117** ごまドレッシング | **17** |
| `Red Cabbage (Raw )` | MEXT **06064** レッドキャベツ 結球葉 生 | 13 |
| `Blue Cheese` | MEXT **13039** ナチュラルチーズ ブルー | 13 |
| `Granola` | **cannot be audited** — see below | — |

The worst individual errors found:

- **`Celery (Raw )` had protein 0.0 g** — flagged as suspicious beforehand and confirmed
  wrong; MEXT says **0.4 g**. It also had **vitamin A 5× too high** (20 vs 4 µg RAE),
  **vitamin K 3× too high** (30 vs 10 µg), **sodium 2.9× too high** (80 vs 28 mg), and
  copper, manganese and biotin all sitting at **0** where MEXT has real values.
- **`Sesame Dressing` vitamin E was 2.50 mg against MEXT's 4.4** — the July suspicion
  that it "looked conservative for a 37.5%-fat dressing" was correct, low by 1.76×. Its
  **sodium was also understated 1125 → 1800 mg**, the single largest absolute correction
  in this pass.
- **`Blue Cheese` had copper 5× too high** (0.10 vs 0.02 mg), **vitamin K at 0.18×**
  (2 vs 11 µg), vitamin D 3.3× too high and vitamin A at 0.68×.
- `Red Cabbage (Raw )` had **sodium 4.4× too high** (17.5 vs 4 mg) and **folate at half**
  (30 vs 58 µg).

**`Granola` is unauditable: MEXT has no granola entry at all** (食品番号 01996 returns
「食品番号が不正です」). Granola is a formulated commercial product whose composition is
brand-specific, and published figures range ~385–471 kcal/100g against this row's 425.
It therefore stays as-is and joins `Fried Bangus` and `Aduna Super Cacao Powder` as a row
with no MEXT basis. Worth replacing with a specific product's panel if the brand is known.

**`King Of Kale Salad` had to be shifted**, since four of its components changed. It is a
stored gram-weighted sum, so each nutrient was moved by `Σ grams × (new − old)` over the
changed components using the documented recipe (40 g sesame dressing, 40 g red cabbage,
10 g blue cheese, 7 g celery). **Its sodium rose 694 → 966 mg**, almost entirely from the
sesame-dressing correction — a 39% increase and the most consequential single result of
this audit, since the salad was understating a quarter of a day's sodium.

**`Oatmeal` manganese was checked and needed no change.** The 3.6 mg/100g USDA fill is
corroborated by USDA rolled oats at 3.63; other databases span 2.9–5.0, so 3.6 is a
defensible central value. It remains a fill (MEXT leaves Mn "—" for oats) and the row's
largest number, so the 2.9–5.0 spread is the honest uncertainty.

### Duplicate removal, MEXT realignment & spinach fix (2026-10-04)

**Three duplicate tables were deleted** — they had been invisible (no %DV row) until
the consistency pass above revealed them, at which point they collided with existing
foods: `Kale (Raw )` (identical to `Raw Kale (Bioavailable)` except iron, which that
row discounts ×0.60 for absorption), `Romaine Lettuce (Raw )` (a byte-for-byte
duplicate of `Romaine Lettuce`), and `Apple (Raw )` (overlapping `Apple (Jonagold)`).
The food count went 95 → **92**. Note `Kale (Raw )` was the derivation *baseline* for
`Steamed Kale`, `Raw Kale (Bioavailable)` and `King Of Kale Salad`; those rows store
their own values so nothing broke, but the provenance row is gone — the raw-kale
figures are recorded in the Steamed Vegetables section.

**Spinach selenium & biotin moved to MEXT.** `Steamed Spinach` and `Raw Spinach
(Bioavailable)` carried Se 1.0 µg / biotin 1.53 µg per 100g, which look like USDA
figures, where **MEXT 06267 measures raw spinach at 3 µg / 2.9 µg**. Both rows now use
the MEXT values, matching what `Sauteed Spinach` already did. The two composites built
on them were rebuilt from their components, which also made their heavy-metal ppm exact
weight-averages:

| | Selenium | Biotin |
|---|---|---|
| Steamed Spinach Salad | 1.18 → **3.18** | 3.33 → **4.70** |
| Blueberry Spinach Smoothie | 1.10 → **2.74** | 12.26 → **13.39** |

**Four drifting rows were realigned to MEXT.** These were old bulk-imported entries
whose values diverged from MEXT by up to 1.9×:

| row | now sourced from | basis |
|---|---|---|
| `Strawberry (Amaou)` | **07012** いちご 生 | direct ÷100 |
| `Chicken Thigh (Grilled)` | **11222** 若どり もも 皮つき 焼き | direct, measured cooked |
| `Pork Loin (Shougayaki)` | **11124** ロース 脂身つき 焼き | direct, measured cooked |
| `Beef Hire/Tenderloin (Med)` | **11029** 和牛 ヒレ 赤肉 生 | **derived** raw→cooked |

- **`Strawberry (Amaou)` keeps its cultivar name but now holds generic MEXT いちご
  data** — MEXT has no cultivar-specific panel, and あまおう is what is actually
  bought. Its zinc was **exactly half** MEXT's (0.1 vs 0.2 mg/100g), the clearest
  single error found. Calories 38 → 31.
- **`Beef Hire/Tenderloin (Med)` changed most: 175 → 250 kcal, fat 9.0 → 17.7 g.**
  The old row's macros matched *imported* or 乳用肥育牛 fillet, not wagyu. Per the
  user's "I usually use wagyu", it is now 和牛 ヒレ. **MEXT carries no cooked 和牛
  ヒレ**, so it is derived with the same dry-heat model as `Wagyu Roast Beef` (80%
  yield ×1.25, fat ×1.18, B-vitamins ×0.85/×0.80, energy recomputed by Atwater).
  **The 80% yield is the soft assumption** — a steak cooked to medium may retain
  more water than a roast, which would make this row read high.
- **`Pork Loin (Shougayaki)` keeps its seasoned sodium.** MEXT 11124 is 52 mg/100g;
  ~600 mg is added for the ginger-soy sauce, preserving the previous row's seasoned
  basis and following the `Chicken Karaage` precedent rather than the unseasoned
  convention used for the liver and wagyu rows. Protein rose 20.0 → 26.7 g.
- **Choline is the only fill in all four** (MEXT carries none), protein-scaled from
  USDA. Strawberry additionally takes lutein 26 µg from USDA. Beef's selenium and
  biotin are the usual ［乳用肥育牛肉］ 11030 borrow, since 和牛 leaves both "—".

### Full %DV consistency pass (2026-10-03)

Immediately after the zinc rebase, every `% Daily Value (RDI)` cell in the file was
recomputed from its `Total` row as `Total ÷ RDI × 100` — the definition the Data
Structure section already states. This was safe to automate because **%DV carries no
information the Total row does not**; it was verified first that no cell existed
where the Total was blank but the %DV held a value (0 such cells), so nothing could
be lost. Results:

- **371 cells across 55 tables** recomputed. Most were rounding drift, but it also
  cleared real errors up to ~12% relative (e.g. calcium 5 tables, selenium 8,
  iron 1, vitamin B1 3).
- **21 more blank-%DV cells filled** beyond the copper/zinc ones: **16 in manganese**
  and **5 in phosphorus**. Same class of bug — the app read them as zero.
- **The 8 "invisible" tables were fixed.** `Blue Cheese`, `Apple (Raw )`,
  `Sesame Dressing`, `Granola`, `Red Cabbage (Raw )`, `Celery (Raw )`,
  `Romaine Lettuce (Raw )` and `Kale (Raw )` sat as **nine consecutive `Total` rows
  with no `% Daily Value` rows and no separators** (only the 9th, King Of Kale
  Salad, had one). Each now has a computed %DV row plus the required 2-row
  separators. **The app went from 87 to 95 selectable foods.**
- Note this means earlier analyses that enumerated "80 foods" or "87 foods" —
  including the lowest-calorie diet optimisation — silently excluded these eight.

After the pass: **95 Total rows, 95 %DV rows, 0 blanks, 0 inconsistencies** beyond
the file's own 4-decimal storage floor. That floor leaves 54 cells whose stored
value differs from exact by at most **0.00005 percentage points per gram** (0.01 %DV
on a 200 g serving) — an artifact of the `round(x, 4)` display convention, not of the
arithmetic. Any future consistency check should use an absolute tolerance, not a
relative one, or it will keep re-flagging these.

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
  **That "Boiled" → "oil" trap has now bitten four times** — Boiled Soba, both
  clams, and Boiled Crab. Every one of those rules (🍜, 🐚, 🦀) must sit above the
  Oil rule in `getFoodStyle()`; they are placed directly after the fish rule. Any
  future "Boiled …" entry needs the same care.
  **An English food name can also collide with an unrelated category.**
  "Milkfish" contains **"milk"**, and the milk rule is both early in
  `getFoodStyle()` *and* pinned at weight 10 *and* drives the **`ml` unit** — so a
  row named "Fried Milkfish" would render as a pinned 🥛 drink. It is named
  **`Fried Bangus (サバヒー)`** to dodge this. Check new English names against the
  early rules (milk, oil, rice, bean, nut), not just against other foods. (`getFoodTypeWeight()` is safe here
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
    because いか is a substring of **すいか (watermelon)**. `するめ` is specific to
    the squid species actually used here. (The same caution would apply to
    `たこ`/octopus vs たこやき.) **This one stopped being hypothetical**: すいか was
    added on 2026-09-04, and because the squid rule had been written against
    `するめ`, no collision occurred. Both directions are asserted in the code
    comments — `'するめいか'.includes('すいか')` is false (watermelon's rule, which
    runs first, does not steal the squid rows) and `'すいか'.includes('いか')` is
    true (a bare いか rule would have stolen watermelon).
- **RDI targets** live alongside this, in `RDI_TARGETS` in the same file, and
  must stay consistent with the CSV `% Daily Value (RDI)` denominators (see the
  Data Structure note above).

## Deployment

- The visualizer deploys via GitHub Actions on push to `master`; no manual build
  needed for the live site.
