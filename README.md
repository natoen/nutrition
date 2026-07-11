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

## Deployment

- The visualizer deploys via GitHub Actions on push to `master`; no manual build
  needed for the live site.
