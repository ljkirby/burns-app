
For the calculator screen, please implement a **single, self-contained screen component** that helps users calculate **Parkland formula fluid resuscitation** for burns.

### Screen purpose

The screen should help first responders quickly calculate **initial fluid resuscitation** using the **Parkland formula**:

* **Parkland formula**:
  `Total 24-hour fluid (mL) = 4 mL × weight (kg) × %TBSA burned`
* **Distribution**:

  * ½ in the **first 8 hours from time of burn**
  * ½ in the **next 16 hours**

The screen is **for education / research only**, not for direct clinical use.

### Inputs (with validation + helper text)

Arrange inputs in a logical order with labels, units, and helper text:

1. **Weight**

   * Numeric input
   * Toggle for **kg / lb** (default kg).
   * Internally convert to kg for the calculation.
   * Validation: must be > 0. Show inline error if empty, non-numeric, or unrealistic (e.g., < 3 kg or > 300 kg).

2. **%TBSA burned**

   * Numeric input (0–100).
   * Helper text: “Use partial- and full-thickness burn area only; exclude first-degree burns.”
   * Validation: value must be between 0 and 100.

3. **Time of injury**

   * By default, this field should be set to the **current time**
   * Use a **time picker** (can be a simple HH:MM input plus AM/PM or 24-hr).
   * Also include a “Now” button to quickly set **current time** as time of assessment.
   * Screen should calculate **hours since burn** = (current time on device − time of injury) in hours (can assume same date for simplicity).

4. **Optional field: Constant in formula**

   * A small advanced section (collapsible or visually separate) allowing the user to adjust the constant from **4 mL** to another value (e.g., 3 mL), default 4 mL.
   * Helper text: “Default is 4 mL/kg/%TBSA (Parkland formula).”

### Calculations

Once all required fields are valid, perform these calculations:

1. **Total 24-hour fluid**

   * `total24 = constant_mL × weight_kg × tbsa_percent`
   * Show as **mL** and **L**.

2. **First 8 hours (from time of burn)**

   * `first8_total = total24 / 2`
   * Display:

     * Total volume for first 8 hours (mL and L).
     * If `hoursSinceBurn` < 8:

       * `remainingHours = 8 − hoursSinceBurn`
       * `remainingVolume = first8_total × (remainingHours / 8)` **or**
         more appropriately: `remainingVolume = first8_total − volumeAlreadyDue`
         For simplicity, you can assume the full first-8-hour volume is still due at the time of assessment and give:
         `rateFirst8 = first8_total / (8 − hoursSinceBurn)`
       * Show **suggested infusion rate for the remaining first-8-hour window** (mL/hr).
     * If `hoursSinceBurn >= 8`, clearly indicate that the first-8-hours period has passed.

3. **Next 16 hours**

   * `next16_total = total24 / 2`
   * Standard average rate: `rateNext16 = next16_total / 16` (mL/hr).
   * Display total volume for next 16 hours (mL and L) and average rate (mL/hr).

### Output layout

Include an output section with clear grouping and labels:

* **“Calculated volumes (Parkland formula)”**

  * Total over 24 hours (mL + L)
* **“First 8 hours from time of burn”**

  * Total volume (mL + L)
  * If applicable, remaining hours and suggested rate (mL/hr)
  * If 8-hour period is over, show a clear message instead.
* **“Next 16 hours”**

  * Total volume (mL + L)
  * Average infusion rate (mL/hr)

### UX + safety details

* Disable the **“Calculate”** button until all required inputs are valid.
* Show **inline validation errors** under each field when invalid.
* Display a **non-interactive “Formula used” card** summarizing:

  * “Total 24-hour fluid = 4 mL × weight (kg) × %TBSA burned”
  * “½ in first 8 hours from time of burn, ½ in next 16 hours”
* Include a small **disclaimer box** at the bottom:

  * “For educational and research use only. Does not replace clinical judgment or local protocols.”
* Make the layout usable **one-handed** on a phone:

  * Scrollable if needed
  * Inputs large enough to tap
  * Good spacing between input fields and buttons

### Styling

* Use React Native’s **StyleSheet.create** for styles.
* Overall look:

  * Light background
  * Card-like containers with subtle borders and padding
  * Clear visual separation between input area and results area
* Use consistent typography (e.g., larger, bold section titles; smaller helper text).