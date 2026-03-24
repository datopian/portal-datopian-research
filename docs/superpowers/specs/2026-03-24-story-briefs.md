# Story Briefs for PortalJS Research Demo

## 1. The Great Decoupling That Hasn't Happened Yet

### Working title
The Great Decoupling That Hasn't Happened Yet

### Deck
Carbon concentrations, temperatures, and fossil-fuel emissions all point in the same direction. The energy transition has started, but the atmosphere is still keeping score.

### Why this story fits the portal
This is the strongest multi-dataset story currently available in the catalog. The portal already contains a clean climate trio:

- `atmospheric-co2-ppm`
- `global-surface-temperature`
- `national-fossil-co2-emissions`

These datasets are globally legible, time-oriented, and narratively compatible. They support a story that moves from atmospheric change, to observed warming, to the countries driving emissions.

### Core narrative
The public conversation often assumes that climate progress is already translating into atmospheric relief. The data in this portal argues otherwise. CO2 concentrations continue to rise. Global temperature anomalies continue to rise. Fossil-fuel emissions remain heavily concentrated among major national emitters. The core point is not that nothing is changing, but that the claimed decoupling between economic activity and climate damage is still incomplete at the planetary level.

### Suggested structure
1. Open with the idea of "decoupling" and why it matters.
2. Show atmospheric CO2 rising over the long run.
3. Show global temperature anomalies rising alongside it.
4. Shift to national fossil CO2 emissions to show who still dominates the totals.
5. Close on the distinction between transition progress and atmospheric outcomes.

### Chart plan
1. **Atmospheric CO2 concentration over time**
   Dataset: `atmospheric-co2-ppm`
   Resource candidates:
   - `co2-annmean-gl`
   - `co2-annmean-mlo`

2. **Global surface temperature anomalies over time**
   Dataset: `global-surface-temperature`
   Resource candidates:
   - `annual`
   - optionally `monthly` for a more detailed inset

3. **Top fossil CO2 emitters**
   Dataset: `national-fossil-co2-emissions`
   Resource candidate:
   - `top-emitters`

4. **Optional juxtaposition panel**
   A combined annotated layout placing CO2 concentration and temperature anomaly on separate aligned timelines.

### Editorial angle
This story should avoid overstating causality in a single chart. The strength is in the accumulation of evidence across datasets. The tone should be analytical rather than alarmist.


## 2. Biology Got Cheap. Medicine Didn't.

### Working title
Biology Got Cheap. Medicine Didn't.

### Deck
The cost of reading the human genome collapsed in two decades. Health spending did not. That gap says something important about how innovation reaches real systems.

### Why this story fits the portal
This is the most interesting cross-domain story currently supported by the catalog. It connects:

- `genome-sequencing-costs`
- `pharmaceutical-drug-spending`

The first captures a dramatic technology-cost collapse. The second captures persistent health-system expenditure. Together they support a strong argument about the difference between scientific capability and downstream affordability.

### Core narrative
One of the great clichés of modern science is that innovation makes everything cheaper. That is only partly true. Genome sequencing costs have fallen by orders of magnitude, making previously impossible forms of research and diagnostics technically feasible. But pharmaceutical spending remains high across countries, and in some systems continues to climb. The story is not that genomics failed. It is that cheaper scientific tools do not automatically produce cheaper healthcare.

### Suggested structure
1. Open with the fall in sequencing costs as a symbol of scientific acceleration.
2. Show how extreme that decline actually was.
3. Contrast with pharmaceutical spending levels across OECD countries.
4. Explain the gap between discovery cost and treatment-system cost.
5. Close on what "innovation" really means for patients and policymakers.

### Chart plan
1. **Genome sequencing cost collapse**
   Dataset: `genome-sequencing-costs`
   Resource candidate:
   - `sequencing-costs`

2. **Cross-country pharmaceutical spending comparison**
   Dataset: `pharmaceutical-drug-spending`
   Resource candidate:
   - the dataset's main CSV resource

3. **Optional slope or ranked comparison**
   If the pharma dataset supports year and country comparisons cleanly, use a ranked latest-year chart or a small-multiple trend comparison.

### Editorial angle
This story should explicitly avoid implying that sequencing costs directly determine drug prices. The stronger and more defensible claim is that scientific capability has become cheaper far faster than healthcare delivery and medicine financing.


## Recommendation

Build **The Great Decoupling That Hasn't Happened Yet** first.

Reason:

- The datasets align more naturally.
- The narrative requires less interpretation.
- The visual sequence is clearer.
- It broadens the portal beyond the existing UAE trade stories without feeling disconnected from the site's research focus.

Build **Biology Got Cheap. Medicine Didn't.** second as the more analytical, cross-domain story.
