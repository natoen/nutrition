# Nutrition

This is a reference to manage everyday nutrition and hitting 100% RDI with
nutrition dense and delicious foods.

## Data Structure

The `nutrition.csv` file contains individual tables for different food items.
Every table are separated by 2 rows and has a "{TABLE_TITLE} Total" and
"{TABLE_TITLE} % Daily Value (RDI)" for their last 2 rows. The data are sourced
from MEXT as the priority because the user is Japanese followed by USDA and
other sources when the data from MEXT are lacking or suspicious where cross
checking is needed. Since MEXT does not track heavy metals (e.g. Arsenic,
Cadmium, Mercury, Lead), typical baseline values (in ppm) were aggregated from
global food safety bodies (like the FDA Total Diet Study and EFSA reports)
tailored to each specific food category. Extremely small trace values (e.g.,
amino acids in a 5g serving of Celery) have been precisely calculated to ensure
no data is inadvertently rounded to zero unless the value is truly absent. The
unit for heavy metals in the spreadsheet is marked as `(ppm/ug)`. The currently
inputted values represent parts per million (ppm), which is equivalent to mg/kg.

### Data Calculations Methodology

#### Steamed Spinach

Because official databases like MEXT only provide data for "Raw", "Boiled"
(ゆで), and "Sautéed" (油いため) spinach, the dataset uses a custom-calculated
scientific profile for **Steamed Spinach** to reflect a short 3-minute steam.
This prevents the severe underestimation of water-soluble vitamins that occurs
when using the standard "Boiled" fallback where vitamins leach heavily into the
cooking water.

The formula mathematically converts raw spinach data to steamed data through two
simultaneous processes:

1. **Physical Moisture Loss (Yield Rate):** Spinach is ~92% water. Steaming
   causes the cell walls to collapse, resulting in a yield rate of ~70% (i.e.,
   14g of raw spinach shrinks down to 10g of cooked spinach). The formula
   applies a 1.4x concentration multiplier to account for this physical density.
2. **Chemical True Retention (TR):** Exact retention factors are applied to
   heat-sensitive nutrients using the **USDA Table of Nutrient Retention Factors
   (Release 6)** and clinical steaming studies:
   - **Vitamin C (75% Retention):** Steaming avoids the extreme 50%+ leaching of
     boiling, but heat still destroys about 25% of the molecules.
   - **Folate / B9 (80% Retention):** Highly heat-sensitive, but preserved well
     without water contact.
   - **B-Vitamins (B1, B2, B3, B5, B6) (85% Retention):** Moderately heat-stable
     during short durations.
   - **Potassium & Minerals (90-100% Retention):** Minerals cannot be destroyed
     by heat. Steaming prevents them from leaching, resulting in near-perfect
     retention (only ~10% loss to condensation drip).
   - **Fat-Soluble Vitamins (Lutein, Vitamin A, Vitamin K) (100% Retention):**
     Highly stable to heat and completely immune to water-leaching. Combined
     with the 30% moisture loss, 100g of steamed spinach contains an incredibly
     dense ~17,000 mcg of Lutein + Zeaxanthin.

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
