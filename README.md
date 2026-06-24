# Nutrition Data Project

## Overview

This is a reference to manage everyday nutrition and hitting 100% RDI with
nutrition dense, delicious, and varying foods.

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
