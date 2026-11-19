# Paid geo-targeted ads + local signage for Tzofim: feasibility and budget

Research for the "עוד קצת ילדות" campaign (parents' committee, Yonatan school, Tzofim).
Researched 19 Nov 2026. Every figure says where it came from and how old it is. Anything I worked out myself is marked **estimate**.
Exchange rate used: **USD 1 = ILS 3.26** (Bank of Israel representative rate, 18 Nov 2026: 3.261, from the BoI SDMX API, `edge.boi.gov.il`, series RER_USD_ILS).

---

## (a) Summary: channels for a ~1-3 km area around Tzofim

| Channel | Can it target only Tzofim? | Cost range (source age) | Verdict |
|---|---|---|---|
| **Meta (Facebook + Instagram)** | **Yes, roughly.** You can drop a pin with a radius of **1 to 80 km** (Meta Marketing API docs, current Nov 2026). A 1 km pin covers the settlement. Two things need testing in Ads Manager before launch: (1) Tzofim is in the West Bank, and Meta says a radius "doesn't extend into other countries", so check which country Meta puts the pin in. (2) Meta's minimum audience-size checks. | CPM in Israel: median **~$9.15** (≈₪30) for Jul 2025-Jun 2026. The Nov 2025 peak was **$15.18** (SuperAds). Israeli agencies quote **₪15-60** per 1,000 impressions (2026 guides). | **The main paid channel.** A small budget is enough. |
| **Meta: authorization / "Paid for by"** | Israel is on Meta's **"elections or politics only"** list. It is **not** on the social-issues list (Meta help page, read 19 Nov 2026). | Free, but ID verification takes time. | An ad about kids and smartphones is **not** a regulated "social issue" ad in Israel. Keep it non-political: no laws, ministers or parties. |
| **TikTok** | **Not verified, and probably no.** TikTok has city, region and postcode levels in "some countries". I could not confirm which levels Israel gets. A settlement of ~3,000 people almost certainly isn't a selectable "city". TikTok has no radius/pin targeting in its official docs. | Minimums: ad-group daily budget **must exceed $20**, campaign daily budget (if set) **must exceed $50** (TikTok help, Jul 2026). No Israel CPM benchmark found. Global medians are **~$4-5** (2025-26). | **Use organic posting only**, unless an in-account check shows a small enough location option. The minimums alone (~₪4,500 for 10 weeks) are more than the whole Meta budget. NGO/cause advertisers need TikTok approval. |
| **YouTube / Google Ads** | **Partly.** Radius minimum is **1 km**. Google says "small targets might not meet our targeting criteria" and ads may serve "intermittently or not at all". | No Israel-specific CPV/CPM found. Global 2025-26 guides: CPV **~$0.02-0.10**, CPM **~$5-10**. | **An optional small test.** Fine as a second channel in the higher tiers. |
| **Waze** | **No, in practice.** Waze ads in Israel now run only inside Google Ads **Performance Max for store goals**, bidding on store visits / sales / directions (Sept 2026). That requires a physical "store". | No published minimum. | **Skip.** It doesn't fit a parents' campaign without a store. |
| **Physical: roll-ups, PVC banners (שמשונית), posters, flyers, magnets, stickers** | Perfect geo-targeting by definition. | Roll-up 85×200: **₪180-313**. PVC banner: **₪60-151/m²**. 1,000 A5 double-sided flyers: **₪432-859**. 1,000 magnets 5×5: **₪162-410**. 250 stickers 5×5: **₪76-162** (Israeli price guides, undated, live in 2026). | **Essential.** Get permission from the local committee (ועד מקומי) for public spots and from the principal for school grounds. Shomron Regional Council has a signage bylaw. |
| **WhatsApp class groups / school channels** | Exact | Free | Still the strongest channel (see `01-plan.md`). Paid ads amplify it. They don't replace it. |

### Budget tiers in one line (details in section b)
| Tier | Meta | Other digital | Print/physical | **Total (estimate)** |
|---|---|---|---|---|
| **Lean** | ~₪500 | none | ₪530-1,310 | **≈ ₪1,000-1,800 (~$320-560)** |
| **Recommended** | ₪1,080-2,160 | ~₪300 YouTube test | ₪1,550-3,400 | **≈ ₪2,900-5,900 (~$900-1,800)** |
| **Maximal** | ₪3,420-6,840 | ~₪1,000 YouTube + ~₪1,370 TikTok burst | ₪3,500-7,500 | **≈ ₪9,300-16,700 (~$2,900-5,100)** |

---

## (b) Worked budget estimate

### Step 1: how many people we are trying to reach

| Input | Value | Source / age |
|---|---|---|
| Registered residents, Tzofim | **3,147** total: ages 0-5: 391 · 6-18: 892 · 19-45: 1,134 · 46-55: 347 · 56-64: 186 · 65+: 197 | Population Authority registry, data.gov.il, updated **1 Nov 2026** |
| Adults 19+ (registry) | **1,864** (parent-age 19-55: 1,481) | Calculated from the row above |
| CBS-style population | **2,650 (2025)**. English Wikipedia: **2,605 (2024)** | he.wikipedia (2025 figure), en.wikipedia (2024 figure) |
| Adults scaled to CBS level | **≈1,570** (**estimate**: 1,864 × 2,650/3,147) | The registry counts residents living abroad. CBS does not. |
| Share of Israeli adults reachable by Meta ads | Facebook **77.1%**, Instagram **74.0%** of 18+ | DataReportal Digital 2026 Israel (data from late 2025) |

The real target is somewhere between **~1,300** (Meta-reachable adults at CBS level) and **~1,900** (every registered adult). Each tier uses a different point in that range.

### Step 2: impressions = reach × frequency × spill factor
The "spill factor" covers impressions that land on people who aren't residents. Meta counts anyone "living in or recently in" the area (the only option left since 2023, per Jon Loomer). Tzofim is next to Route 6 and the Eyal interchange, so a 1 km pin will catch some passers-by. The spill factor is an **estimate**. Measure the real share in the first week. The CPM values are **estimates** inside the published ranges: national median ≈ ₪30, Israeli agency range ₪15-60. Higher values allow for the Nov-Dec seasonal peak and the price premium of a tiny audience shown ads very often.

| Tier | Reach | Frequency over 8-10 wks | Spill | Impressions | CPM (₪) | **Meta media cost** |
|---|---|---|---|---|---|---|
| Lean | 1,300 | 10 | ×1.3 | 16,900 | 30 | **₪507** (~$156; ~₪7/day over 70 days) |
| Recommended | 1,600 | 15 | ×1.5 | 36,000 | 45 (range 30-60) | **₪1,620** (range ₪1,080-2,160; ~₪23/day) |
| Maximal | 1,900 | 20 | ×2.0 | 76,000 | 70 (range 45-90) | **₪5,320** (range ₪3,420-6,840; ~₪76/day) |

Sensitivity for 36,000 impressions: CPM ₪20 gives ₪720 · ₪30 gives ₪1,080 · ₪45 gives ₪1,620 · ₪60 gives ₪2,160 · ₪90 gives ₪3,240.

**Practical caveat:** with an audience of ~1,500 people, Meta cannot spend much money usefully. Once almost everyone has been reached, extra budget only raises frequency. If the Maximal tier hits frequency 20 early, cut the daily budget instead of paying for frequency 40.

### Step 3: the other line items

**Lean (Meta + basic physical presence)**
| Item | Qty | ₪ range | Source |
|---|---|---|---|
| Meta ads | 10 wks | ~507 | Above |
| Roll-up 85×200 | 1 | 216-313 | d.co.il price list |
| PVC banner (שמשונית) 2×1 m | 1 | 130-350 | d.co.il ₪65-151/m²; midrag example: 200×100 = ₪350 (excl. VAT) |
| Stickers 5×5 cm | 250 | 76-162 | d.co.il |
| Posters 32×48 | 10 | 108-485 | d.co.il |
| **Total** | | **≈ 1,037-1,817** | |

**Recommended**
| Item | Qty | ₪ range |
|---|---|---|
| Meta ads | 10 wks | 1,080-2,160 |
| YouTube Shorts/in-stream test, 1 km radius (**estimate**, optional) | 2-3 wks | ~300 |
| Roll-ups (school gate + community center) | 2 | 432-626 |
| PVC banners 2×1 m (entrance gate, school fence) | 2 | 260-700 |
| A5 double-sided flyers (~600 households + spares) | 1,000 | 432-859 |
| Fridge magnets 5×5 with QR to the pledge | 1,000 | 162-410 |
| Stickers 5×5 | 500 | 152-324 |
| Posters 32×48 | 10 | 108-485 |
| **Total** | | **≈ 2,926-5,864** |

**Maximal**
| Item | Qty | ₪ range |
|---|---|---|
| Meta ads | 10 wks | 3,420-6,840 |
| YouTube/Google (**estimate**, cap) | 10 wks | ~1,000 |
| TikTok burst, only if in-account geo check passes | 21 days × $20.01 minimum | ~1,370 |
| Roll-ups | 3 | 648-939 |
| PVC banners 3×1 m (3 m² × ₪65-151) | 4 | 780-1,812 |
| A5 flyers, two waves (awareness + pledge launch) | 2 × 1,000 | 864-1,718 |
| Magnets 5×5 | 1,000 | 162-410 |
| Stickers 5×5 (priced as 4×250, bulk is usually cheaper) | 1,000 | 304-648 |
| Posters 32×48 | 100 | 243-556 |
| Kapa (foam-board) signs 70×100 for notice boards | 6 | 516-1,428 |
| **Total** | | **≈ 9,307-16,721** |

Notes:
- Print prices are listed without saying whether VAT is included (d.co.il), or are explicitly **excluding VAT** (midrag). Add 18% (Israeli VAT since Jan 2025) to be safe.
- Design and video production are excluded. The committee is producing those in-house.
- **My recommendation:** the "Recommended" tier, built around Meta at ~₪20-25/day, two banners, a roll-up at the school gate, and a magnet + flyer drop to every household at the pledge launch (week 7). Spend 80% of the effort on WhatsApp class groups.

---

## (c) Details per question, with sources

### 1. Tzofim demographics

- **Population (registry):** 3,147 residents, by age group as in the table above. Source: Population and Immigration Authority dataset "תושבים בישראל לפי ישובים וקבוצות גיל - מתעדכן", resource last modified **2026-11-01**. Record: `"שם_ישוב":"צופים","סמל_ישוב":"3791","מועצה_אזורית":"שומרון","סהכ":"3147","גיל_0_5":"391","גיל_6_18":"892"...`. The dataset itself warns that these figures differ from CBS: they count all living registered residents, whether or not they are in Israel. CBS excludes people abroad for more than a year.
  https://data.gov.il/dataset/00172ee8-4433-4d5d-8fd4-11f0f08ce5c4 (API: `datastore_search?resource_id=64edd0ee-3d5d-43ce-8562-c336c24dbc1f`)
- **Population (CBS, via Wikipedia):** he.wikipedia: "בשנת 2025 היישוב מנה 2,650 נפש". Its infobox also shows an estimate of 2,912 for end of Sept 2026. en.wikipedia: "In 2024 it had a population of 2,605."
  https://he.wikipedia.org/wiki/צופים_(יישוב) · https://en.wikipedia.org/wiki/Tzofim
- **Households:** about **600 families**: "כ-600 משפחות". The same page gives a mix of "בערך 45% דתיים ו-55% חילונים". Yoshke settlement guide, undated (it mentions 2021 events).
  https://yoshke.co.il/settlement/tzofim/
- **Children:** 892 registered residents aged 6-18 and 391 aged 0-5 (registry, Nov 2026).
- **Yonatan school is in Tzofim:**
  - Yoshke: "ב-2021 נפתח ביישוב בית ספר יסודי חדש – בית ספר יונתן, שהוא ממלכתי-דתי."
  - he.wikipedia: "בספטמבר 2021 נפתח ביישוב בית ספר יסודי."
  - The Tzofim settlement site lists "בי"ס יונתן" as "יסודי, ממלכתי דתי". Its other listings are קשת (Kochav Yair) and נוף צורים (Tzur Yigal), both state-secular.
  - A Shomron Regional Council page (2022) announced registration to "בי"ס יהונתן בצופים לכתות ג' וד' בשנה"ל תשפ"ג", so the school added grades gradually.
  - https://zufim.org.il/בתי-ספר-יסודיים/ · https://shomron.org.il/960/ (503 when I tried it; the title comes from search results)
- **School size:** allschool.co.il, "בית ספר צופים", "נתונים כללים לשנה"ל 2023": **104 boys + 85 girls = 189 pupils**, grades "א - ו". **Not fully verified** that this record is the Yonatan school, but it is the only elementary school in Tzofim. I found no 2025-26 figure.
  https://www.allschool.co.il/מוסדות/482943/צופים-צופים
- **Distances.** Straight lines between Wikipedia coordinates, calculated by me. Town centers, not edges:
  - Jayyous 2.5 km
  - Alfei Menashe 2.9 km (pop. 8,038 in 2024)
  - Kibbutz Eyal 3.1 km
  - **Qalqilya 3.9 km** (pop. 65,354 in 2024, infobox)
  - Matan 5.6 km
  - Karnei Shomron 8.8 km
  - **Kfar Saba 9.9 km**
  - Hod HaSharon 13.0 km
  - Ra'anana 13.5 km
  - Kochav Yair-Tzur Yigal is to the north-west ("דרום-מזרחית לכוכב יאיר צור יגאל", he.wikipedia). I couldn't get coordinates for it.
- **What this means for radius spill:** a **1 km** pin is about the settlement itself. At **2-3 km** the circle starts to take in Jayyous, Alfei Menashe and Eyal. By ~4 km it reaches Qalqilya, a city of 65,000. The audience would grow 10-20× and almost all of it would be outside the campaign's target. **Use 1 km, never 3 km.**

### 2. Meta (Facebook + Instagram)

**Minimum radius.** The Meta Marketing API reference (current Nov 2026), on `custom_locations`: "specify radius for your location from .63 to 50 miles, or 1 to 80 kilometers." The page names no country limits. A third-party comparison (adflint, 31 Jul 2026) agrees: "0.63 miles (1 km) around a dropped pin or street address", and says a **city-anchored** radius can't go below 10 miles / 17 km. So use **Drop pin**, not the city name. (Some US blogs quote 1 mile because Ads Manager shows miles in US accounts.)
https://developers.facebook.com/docs/marketing-api/audiences/reference/basic-targeting/ · https://www.adflint.com/blog/local-radius-targeting-google-and-meta

**How the radius behaves.** From the Meta help page "How to choose locations for your ad", read 19 Nov 2026:
- "Radius minimum and maximum vary by location type, and don't extend into other countries, even when the visual map extends beyond a border. You need to include each country separately."
- "Your audience reach includes all locations that fall within the radius."
- Uncheck "Reach more people likely to respond to your ads". Otherwise Meta may go beyond the location.

https://www.facebook.com/business/help/365561350785642

**Who counts as "in" the area.** Meta: "Your ads will show to people who spend time in your locations, such as people living there or recently there." The "living in only" option was removed in 2023 (Jon Loomer). Meta also says: "complete accuracy cannot be guaranteed… You might see some ad impressions… from outside your location settings."
https://www.facebook.com/business/help/202297959811696

**West Bank caveat (not verified, test before launch).** Tzofim lies east of the Green Line ("less than 2 kilometres east", en.wikipedia). Meta lists "Palestine, State of" as its own country (on its SIEP availability page). Since a radius "doesn't extend into other countries", check which country Ads Manager puts a Tzofim pin in, and whether the estimated audience looks plausible (~2,000-3,000).

**Will a tiny audience run?** Meta's official text only says "Countries and territories with very small populations may not meet Estimated Audience Size checks". It gives no number for radius audiences. Third-party reports describe a "below 1,000" warning on narrow audiences (bigeyeagency / Skool forum, 2026). Tzofim has ~1,600-1,900 adults, so it should be just above that line. **Not verified. Check the audience estimate in Ads Manager.** Don't stack interest or age filters on top: use age 18+ or 25-55 only.

**SIEP (social issues, elections or politics) status for Israel.** Meta Business Help "Availability for ads about social issues, elections or politics", read 19 Nov 2026:
- The **social-issues + elections/politics** list is: Australia, Brazil, Canada, Chile, the EU (where these ads are banned), India, Mexico, Myanmar, New Zealand, Philippines, Singapore, Taiwan, UK, US, Ukraine.
- **Israel** (and "Palestine, State of") appear only under **"Ads about elections or politics: Countries and territories with authorization and disclaimer requirements to run these ads."**
- Meta also says: "We require authorizations and proactively detect or reactively review possible social issues, electoral or political ads in 220+ countries."
- A secondary table (mockingbird.digital, updated 13 Oct 2026) lists the same countries for the social-issue topics. Israel is not on it.
- Meta's SIEP policy names Israel only in the rule that ads "must not discourage people from voting".

https://www.facebook.com/business/help/2150157295276323 · https://transparency.meta.com/policies/ad-standards/SIEP-advertising/SIEP/ · https://mockingbird.digital/blog/meta-ads-for-nonprofits

**Conclusion (my reading):** an ad about delaying smartphones for children is **not** a regulated "social issue" ad in Israel. It needs no authorization or "Paid for by" label, **as long as it doesn't touch elections or politics**: no Knesset bills, ministers, parties or calls to "demand legislation". Meta's automated review can still flag it. **Fallback:** one committee member completes Meta's ID authorization (https://www.facebook.com/business/help/208949576550051). After that a "Paid for by הנהגת ההורים…" disclaimer can be added, if Meta asks or the committee wants the transparency.

**Minimum daily budget.**
- Meta no longer publishes a fixed table: "This article uses US dollars… Minimum budgets may vary by country and objective… You should see an alert in Meta Ads Manager if your budget doesn't meet our minimum requirements." (help 203183363050448, read Nov 2026).
- Third-party guides (2026) cite **~$1/day** for impression-based ad sets and **~$5/day** for click/conversion goals. **Not confirmed by Meta.**
- Every tier above spends ≥ ₪7/day (~$2.2), so this shouldn't bind.
- The Marketing API currency table lists ILS with offset 100 (agorot).

https://www.facebook.com/business/help/203183363050448 · https://developers.facebook.com/docs/marketing-api/currencies

**CPM benchmarks, Israel:**
- **SuperAds** (aggregated from "thousands of ad accounts", "$3B worth of advertising data"):
  - 12-month median **~$9.15**, start $9.63 (Jul 2025), end $9.79 (Jun 2026)
  - Monthly: Sep 2025 $6.19 · Oct 2025 $8.13 · **Nov 2025 $15.18 (peak)** · Dec 2025 $10.71 · Mar 2026 $6.34 · Apr 2026 $10.33
  - Note: "Conversion campaigns usually have higher CPMs than traffic campaigns." The data mixes objectives.
  - https://www.superads.ai/facebook-ads-costs/cpm-cost-per-mille/israel
- **Lebesgue / Adculator** (2026 tables): Israel average **$7.48**. **Stackmatix** (2026): **$6.80-11.20**. Both found via search; I didn't open the pages.
- **Israeli agencies, ILS:**
  - sol-ix.ai (25 Oct 2026), quoting MediaHub's 2026 guide: "עלות לאלף חשיפות (CPM) בין ₪15 ל-₪50"
  - simple-web.co.il (2026): ₪15-60
  - aston.co.il: ₪25-90
  - alai.co.il: ₪8-60

  https://sol-ix.ai/blog/facebook-instagram-ads-cost-israel
- **Seasonality:** the campaign runs Nov-Feb. November was the most expensive month in the SuperAds series, so the plan uses ₪45 rather than ₪30 for the Recommended tier.

**Cost per ThruPlay / video view.** I found no Israel figure. ThruPlay is billed per impression, so cost per ThruPlay = CPM/1,000 ÷ ThruPlay rate (Dynamoi). Global 2026 guides put ThruPlay rates at **~18-30%** and cost per ThruPlay at **~$0.02-0.15** depending on vertical (third-party, 2026). **Estimate** for Tzofim: at ₪45 CPM and a 25% ThruPlay rate, that's ≈ **₪0.18 per ThruPlay**. Short 25-40 s videos with burned-in captions help.
https://www.1clickreport.com/blog/cost-per-thruplay-meta-ads-benchmark-2026

**Frequency control:**
- **Reservation** (formerly Reach & Frequency) **can't be used here.** Meta's "About reservation" page (read Nov 2026) says it is for advertisers who want to "Reach an audience of more than 200,000 people."
  https://www.facebook.com/business/help/251123081984768
- In normal auction buying, an **Awareness** campaign with the **Reach** performance goal shows a frequency cap control. Third-party guides (2025-26) say the default is 1 impression per 7 days and it can be edited. Meta also launched "target frequency" for awareness (Oct 2023 changes on the reservation page). **Not confirmed on a current Meta page.**
- **Suggested setup (estimate):** Awareness → Reach, cap **2 impressions / 7 days**. Over 10 weeks that gives frequency ≈ 15-20. Add a second ad set with **ThruPlay** optimization for the full videos.

### 3. TikTok

- **Geo granularity:**
  - TikTok "Location targeting" (updated Oct 2026) lists "City, Country / Region, County, Department, District, DMA Regions, Province, State, Urban District, and Zip Code" and warns "Some targeting options are not available in all countries or regions."
  - The per-market availability page (updated June 2025) says the options "depend on the country or region you used to register your TikTok Ads Manager account". Israel (IL) is a registration market, but the page content loads dynamically and I couldn't read Israel's row.
  - No official TikTok page mentions **radius/pin** targeting. One 2026 blog claims 1-50 km radius, unverified.
  - **Verdict:** whether Israel can be targeted below country level is **unverified**. Even if city targeting exists in Israel, a settlement of ~3,000 is very unlikely to be a selectable location. The realistic options are country or a district. Check in an IL-registered account before spending anything.
  - https://ads.tiktok.com/help/article/location-targeting?lang=en · https://ads.tiktok.com/help/article/placements-available-locations?lang=en
- **Minimum budgets** (TikTok "About budgets", updated **Jul 2026**):
  - Daily campaign budget "must exceed $50"
  - Daily ad-group budget "must exceed $20"
  - Lifetime ad-group minimum "= Total Days … × Minimum Daily Budget", e.g. "$20 x 31 = $620"
  - For 70 days that is ≥ **$1,400 ≈ ₪4,560** for one ad group.
  - https://ads.tiktok.com/help/article/budget?lang=en
- **CPM:** no Israel benchmark found. Global medians: Triple Whale **~$4.07** (Oct 2025-Sep 2026), Lebesgue **~$4.80** (2026). Treat these as directional only.
- **Political / cause ads:**
  - TikTok's "Politics, Governments, and Elections" policy (updated **Jul 2026**): "we do not allow paid political advertising". Advocacy "for or against… Legislative, judicial, or executive outcomes, processes, or policy proposals" is prohibited.
  - NGO/NPO page (updated **Sep 2026**): NGOs may advertise "in limited circumstances through an approval process" and must work with a TikTok sales representative.
  - Parenting-behavior messaging isn't explicitly banned. Policy wording would rule out any mention of legislation. Whether an informal parents' committee would be treated as an NGO is **unverified**.
  - https://ads.tiktok.com/help/article/tiktok-ads-policy-politics-government-and-elections?lang=en · https://ads.tiktok.com/help/article/non-governmental-organization-and-non-profit-organization
- **Recommendation:** use TikTok **organically**. Post the vertical videos, and have parents share and duet them.

### 4. Google Ads / YouTube and Waze

- **Radius minimum:** Google Ads help ("Target ads to geographic locations"), quoted via search: Google only permits targets that meet "minimum privacy thresholds where minimum area and minimum user counts are met", e.g. "we do not allow radius targeting under 1 km". It also warns that small targets may show "intermittently or not at all". Google's DV360 docs add a rule that a radius must contain at least 1,000 people. That rule is for DV360, not confirmed for Google Ads.
  https://support.google.com/google-ads/answer/1722043
- **CPV/CPM, Israel:** no Israel-specific figure found. Global 2025-26 guides: skippable in-stream CPV **~$0.02-0.10**, CPM **~$5-10**. These are third-party estimates, not Google rates.
- **Waze:**
  - Standalone Waze Ads ended: "As of September 1, 2023, Waze no longer serves ads" (Google DV360 help).
  - Waze inventory came back inside **Performance Max for store goals** (US, Nov 2025). On **4 Sep 2026** it expanded to 42 countries **including Israel** (Search Engine Roundtable), for campaigns "bidding on Store Visits, Store Sales, or Local Actions Directions".
  - Waze's forum (21 Jan 2026) announced the new ad experience opening in Israel, starting at "1% of Prod… drivers and 100% of beta testers".
  - No minimum spend is published.
  - **Not suitable**: it needs a store/place goal. The only "place" would be the school, which makes little sense for a community pledge.
  - https://www.seroundtable.com/google-expands-waze-ads-42018.html · https://www.waze.com/discuss/t/waze/397731 · https://support.google.com/displayvideo/answer/9222413

### 5. Physical / outdoor: Israeli prices and permissions

Main source: the d.co.il ("דפי זהב") price guides. They show "© 2026" and no update date or VAT note, and they say "המחירים משתנים בין בית דפוס אחד למשנהו". **Treat them as 2025-26 ranges and get 2-3 real quotes.**

| Item | Price (₪) | Exact source wording |
|---|---|---|
| Roll-up 200×80/85 | 216-313 | "הדפסת רול-אפ המחיר לגודל 200x80/85 ס"מ" (d.co.il 12620/12600/12390) |
| Roll-up 85×200 (midrag) | 180-270; 200 "קלאסי" / 500 "מתחלף" | midrag price page (via search; page returned 403 when fetched) |
| PVC banner (שמשונית) | 65-151 per m² | "הדפסה על שמשונית המחיר למ"ר" (d.co.il 12390) |
| PVC banner (midrag) | 60-100 per m², excl. VAT & shipping; 200×100 = 350; 600×200 = 1,000; grommets included | midrag tip 13725 (via search snippet; page 403) |
| Posters 32×48 | 108-485 for 10 · 243-556 for 100 | d.co.il |
| Foam board (קאפה) 70×100 | 86-238 each · 50×70: 85-204 | d.co.il 12390 |
| A0/A1 full-color paper posters | **not verified**. The d.co.il plotter lines (A1 colour lines ₪13-32, A0 ₪19-38) are for line drawings, not full-coverage posters | d.co.il (via search) |
| Stickers 5×5 | 76-162 per 250 (a search snippet of the same list showed 140-350 per 1,000 paper stickers / 230-480 polyester. Conflicting, so use the per-250 figure for budgeting) | d.co.il 12600 |
| Magnets 5×5 | 162-410 per 1,000 | d.co.il |
| Flyers A5 double-sided, 135g | 432-859 per 1,000 · A6 double-sided 247-486 | d.co.il |
| Postcards 10×15 double-sided | 130-281 per 100 | d.co.il |

URLs: https://www.d.co.il/priceList-12620/ · https://www.d.co.il/priceList-12600 · https://www.d.co.il/priceList-12390/ · https://www.midrag.co.il/Content/Price/19216 · https://www.midrag.co.il/Content/Tip/13725

**Permissions (general rule, not legal advice):**
- Shomron Regional Council has a signage bylaw, **"חוק עזר לשומרון (מודעות ושלטים), התשע"ב-2012"**. The council's payments page says sign fees ("אגרת שילוט") are charged under it, "החיוב לשלט נקבע לפי סוגו, גודלו ומיקומו", and any installation, change or removal must be reported through the online forms.
  - The council site returned 503 during this research, so I could not read the bylaw text or any exemptions, for example for non-commercial or temporary notices.
  - https://www.shomron.org.il/אגרת-ביוב-ואגרת-שילוט/ · https://www.shomron.org.il/department/חוקי-עזר-2/חוקי-עזר-כללי-חדש/
- **The usual practice in Israeli local authorities** (my general reading of signage bylaws, not the Shomron text): a sign or notice in public space needs a license from the council head. Notices go only on designated notice boards. In a community settlement the **ועד מקומי / אגודה** controls the gate, fences, public buildings and notice boards.
- **What the committee should do:**
  1. Get written OK from Tzofim's **ועד מקומי** for gate, fence and notice-board placements.
  2. Get the **principal's** OK for anything on school grounds.
  3. Get the owner's OK for private fences.
  4. Phone the Shomron council's signage/revenue department to confirm whether a temporary, non-commercial, 10-week banner is exempt from the fee or needs a permit.

### 6. Examples of hyperlocal / Israeli campaigns (bonus)

- **Kedumim (Samaria):** a headline in 0404 news says more than 50% of parents signed a charter to delay smartphones: "יותר מ-50% מההורים בקדומים חתמו על אמנה לדחיית השימוש בסמארטפון". The page was blocked (403), so I could not get the date, method or spend. It's a close peer settlement, and worth calling the organizers directly.
  https://0404.co.il/article/1190086
- **National context** (search snippets only, articles blocked): Israel's Health Ministry published recommendations of **smartphone from age 13, social networks from 15**, with an awareness campaign (Israel Hayom, Kan, ynet). The Education Ministry issued a director-general circular restricting smartphones in elementary schools (TheMarker, Dec 2025).
  - These are useful as authority cues in the videos. Cite the ministry documents themselves, not the news snippets.
  - https://www.israelhayom.co.il/health/article/21345379 · https://www.kan.org.il/content/kan-news/local/1095673/ · https://www.themarker.com/opinion/2025-12-13/ty-article/0000019b-11e3-d3a9-afbf-1def63280000
- **I found no published spend figures** for an Israeli school or municipal geo-targeted social campaign. Meta's Ad Library shows spend ranges only for SIEP-authorized ads, so a search there is the next step.

---

## (d) What could not be verified

1. **Whether Meta treats a Tzofim pin as Israel or "Palestine"**, and whether that changes delivery or the audience estimate. Test it in Ads Manager.
2. **Meta's minimum audience size for radius targeting.** There is no official number. The "below 1,000" warning comes from third-party reports.
3. **Meta minimum daily budget in ILS.** Meta no longer publishes a table. The ~$1/day figure is third-party.
4. **The Meta frequency-cap UI** in auction Awareness/Reach campaigns (default 1 per 7 days). Confirmed only by third-party sources.
5. **TikTok location granularity for Israel**, and whether TikTok has any radius/pin targeting. The official pages don't say. It needs an in-account check.
6. **Israel-specific CPM for TikTok and YouTube, and cost per ThruPlay for Meta in Israel.** I found only global figures.
7. **Whether the 189-pupil allschool record (2023) is the Yonatan school**, and its current enrollment.
8. **Shomron signage bylaw text and exemptions.** The council website was down (503).
9. **A0/A1 full-color poster prices**, and the conflicting sticker pricing (per 250 vs per 1,000) on d.co.il.
10. **Spend figures from any comparable Israeli hyperlocal campaign.**
11. **Exact distance from Tzofim's edge to the nearest Qalqilya or Jayyous homes.** The distances above are center to center.

All estimates in section (b) (reach, spill factor, CPM choice, YouTube/TikTok allocations, quantities) are **planning assumptions, not quotes**. After week 1 of Meta delivery, replace them with the real reach, frequency and CPM from Ads Manager.
