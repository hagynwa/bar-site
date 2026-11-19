"""Build plan.html (the full campaign plan as a right-to-left page) from plan.md.

Run:  python3 00-campaign/build_plan.py      (needs: pip install markdown)
The page is published as an Artifact; it is written without <html>/<body>, which the publisher adds.
"""
import datetime as dt
import os
import re

import markdown

HERE = os.path.dirname(os.path.abspath(__file__))
MONTHS = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"]

# ---------------------------------------------------------------- the timeline (drawn to scale, time runs right to left)
ROWS = [
    ("מטה והכנות", "2026-12-01", "2026-12-31", ""),
    ("מסיבות חנוכה: פיילוט", "2026-12-05", "2026-12-12", ""),
    ("סקרי פתיחה וחוגי בית", "2027-01-03", "2027-01-20", ""),
    ("השמשות", "2027-01-17", "2027-01-21", ""),
    ("פרקים 1 עד 4", "2027-01-21", "2027-02-11", "ep"),
    ("נטיעות ט\"ו בשבט, וערכה לכל בית", "2027-01-22", "2027-01-22", ""),
    ("100 שעות חצר", "2027-01-22", "2027-04-08", ""),
    ("שבוע הקופסה", "2027-02-07", "2027-02-13", ""),
    ("דרור: ערב הורים", "2027-02-16", "2027-02-16", "dror"),
    ("פרקים 5 עד 7", "2027-02-25", "2027-03-11", "ep"),
    ("שבוע ההורים", "2027-03-07", "2027-03-13", ""),
    ("אסיפות הכיתה", "2027-03-14", "2027-03-25", ""),
    ("דרור: הורים וילדים", "2027-03-16", "2027-03-16", "dror"),
    ("פורים", "2027-03-23", "2027-03-23", ""),
    ("פרק 8 ומבצע החתימות", "2027-03-25", "2027-04-08", "ep"),
    ("טקס החתימה", "2027-04-08", "2027-04-08", "go"),
    ("שומרים", "2027-04-11", "2027-04-30", ""),
]
T0, T1 = dt.date(2026, 12, 1), dt.date(2027, 5, 1)
SPAN = (T1 - T0).days


def d(s):
    return dt.date.fromisoformat(s)


def heb(date):
    return f"{date.day} ב{MONTHS[date.month - 1]}"


def when(a, b):
    if a == b:
        return heb(a)
    if a.month == b.month:
        return f"{a.day} עד {heb(b)}"
    return f"{heb(a)} עד {heb(b)}"


def timeline():
    months = []
    m = T0
    while m < T1:
        nxt = dt.date(m.year + (m.month == 12), m.month % 12 + 1, 1)
        months.append(f'<span style="width:{(nxt - m).days / SPAN * 100:.3f}%">{MONTHS[m.month - 1]}</span>')
        m = nxt
    go = (d("2027-04-08") - T0).days / SPAN * 100
    out = ['<figure class="gantt" aria-label="לוח הזמנים של הקמפיין, מדצמבר 2026 עד אפריל 2027"><div class="gantt-in">',
           f'<div class="g-row g-head"><span class="g-name"></span><span class="g-when"></span><div class="g-track g-months">{"".join(months)}</div></div>']
    for name, a, b, kind in ROWS:
        a, b = d(a), d(b)
        start = (a - T0).days / SPAN * 100
        width = max((b - a).days, 0) / SPAN * 100
        mark = (f'<i class="g-dot {kind}" style="right:{start:.3f}%"></i>' if a == b
                else f'<i class="g-bar {kind}" style="right:{start:.3f}%;width:{width:.3f}%"></i>')
        out.append(f'<div class="g-row {"g-go" if kind == "go" else ""}"><span class="g-name">{name}</span><span class="g-when">{when(a, b)}</span>'
                   f'<div class="g-track"><i class="g-line" style="right:{go:.3f}%"></i>{mark}</div></div>')
    out.append('</div><figcaption>הזמן מתקדם מימין לשמאל. הקו המקווקו הוא טקס החתימה, 8 באפריל 2027.</figcaption></figure>')
    return "".join(out)


# ---------------------------------------------------------------- markdown to page
def build():
    md = open(os.path.join(HERE, "plan.md"), encoding="utf-8").read()
    body = markdown.markdown(md, extensions=["tables", "sane_lists"])
    body = body.replace("<p>[[TIMELINE]]</p>", timeline())
    body = body.replace("<table>", '<div class="table-wrap"><table>').replace("</table>", "</table></div>")
    # the title, the version line and the opening paragraph get their own header block
    m = re.match(r"\s*<h1>(.*?)</h1>\s*<p>(.*?)</p>\s*<p>(.*?)</p>", body, flags=re.S)
    title, byline, lead = m.groups()
    body = body[m.end():]
    toc, n = [], 0

    def tag(mm):
        nonlocal n
        n += 1
        level, text = mm.group(1), mm.group(2)
        toc.append((level, n, re.sub(r"<[^>]+>", "", text)))
        return f'<h{level} id="s{n}">{text}</h{level}>'

    body = re.sub(r"<h([23])>(.*?)</h\1>", tag, body)
    items, open_part = [], False
    for level, i, text in toc:
        if level == "2":
            if open_part:
                items.append("</ul></li>")
            items.append(f'<li><a class="toc-part" href="#s{i}">{text}</a><ul>')
            open_part = True
        else:
            items.append(f'<li><a href="#s{i}">{text}</a></li>')
    items.append("</ul></li>")
    icon = open(os.path.join(HERE, "..", "brand", "logo", "icon-transparent.svg"), encoding="utf-8").read()
    icon = re.sub(r"<svg ", '<svg class="mark" aria-hidden="true" ', icon, count=1)
    page = TEMPLATE.replace("{{ICON}}", icon).replace("{{TITLE}}", title.split(" · ")[-1]).replace("{{BYLINE}}", byline)
    page = page.replace("{{LEAD}}", lead).replace("{{TOC}}", "".join(items)).replace("{{BODY}}", body)
    open(os.path.join(HERE, "plan.html"), "w", encoding="utf-8").write(page)
    print("plan.html", len(page) // 1024, "KB,", len(toc), "headings")


TEMPLATE = """<title>תוכנית עוד קצת ילדות</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playpen+Sans+Hebrew:wght@500..800&family=Rubik:wght@400..700&display=swap">
<style>
/* layout: one right-to-left reading column, tables and the timeline scroll inside their own frames */
:root {
  --bg: #FBFAF3; --surface: #FFFFFF; --ink: #001A3F; --muted: #46506B; --line: #E2DFCF;
  --green: #4A7302; --leaf: #EDF6D8; --sun: #FECC0C; --sun-soft: #FFF3C2; --band: #001A3F; --on-band: #FBFAF3;
  --display: 'Playpen Sans Hebrew', 'Rubik', 'Arial Hebrew', Arial, sans-serif;
  --text: 'Rubik', 'Arial Hebrew', Arial, sans-serif;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {
  --bg: #0A1529; --surface: #11203C; --ink: #F2F0E6; --muted: #B5BFD4; --line: #293A5C;
  --green: #B5D96E; --leaf: #1B3020; --sun: #FECC0C; --sun-soft: #3B3310; --band: #16284A; --on-band: #F2F0E6; color-scheme: dark } }
:root[data-theme="dark"] {
  --bg: #0A1529; --surface: #11203C; --ink: #F2F0E6; --muted: #B5BFD4; --line: #293A5C;
  --green: #B5D96E; --leaf: #1B3020; --sun: #FECC0C; --sun-soft: #3B3310; --band: #16284A; --on-band: #F2F0E6; color-scheme: dark }
body { background: var(--bg); color: var(--ink); font-family: var(--text); font-size: 17px; line-height: 1.65; direction: rtl; text-align: right; }
.page { max-width: 880px; margin-inline: auto; padding-block: 28px 80px; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); }
.top { display: flex; flex-direction: column; gap: 10px; padding-bottom: 22px; border-bottom: 3px solid var(--sun); }
.brand { display: flex; align-items: center; gap: 12px; }
.mark { width: 72px; height: auto; flex: none; }
.brand-name { font-family: var(--display); font-weight: 800; font-size: 26px; line-height: 1.2; }
h1 { font-family: var(--display); font-weight: 800; font-size: clamp(34px, 6vw, 52px); line-height: 1.2; margin: 6px 0 0; text-wrap: balance; }
.byline { color: var(--muted); font-size: 15px; margin: 0; }
.lead { font-size: 20px; line-height: 1.6; margin: 8px 0 0; }
nav.toc { margin-top: 26px; background: var(--surface); border: 1px solid var(--line); border-radius: 14px; padding: 18px 22px; }
nav.toc > ul { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 14px 28px; }
nav.toc ul ul { list-style: none; margin: 4px 0 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }
nav.toc li { margin: 0; line-height: 1.5; }
nav.toc a { color: var(--ink); text-decoration: none; font-size: 15px; }
nav.toc a:hover, nav.toc a:focus-visible { text-decoration: underline; }
nav.toc a.toc-part { font-family: var(--display); font-weight: 700; font-size: 16px; color: var(--green); }
h2 { font-family: var(--display); font-weight: 800; font-size: 28px; line-height: 1.3; margin: 56px 0 0; padding: 14px 20px; background: var(--band); color: var(--on-band); border-radius: 12px; }
h3 { font-family: var(--display); font-weight: 700; font-size: 24px; line-height: 1.3; margin: 36px 0 6px; text-wrap: balance; scroll-margin-top: 12px; }
h3::before { content: ""; display: inline-block; width: 14px; height: 14px; border-radius: 50%; background: var(--sun); margin-inline-end: 10px; }
p { margin: 12px 0; }
main > p, main > ul, main > ol { max-width: 70ch; }
ul, ol { margin: 12px 0; padding-inline-start: 24px; }
li { margin: 6px 0; }
strong { font-weight: 600; }
.table-wrap { overflow-x: auto; margin: 16px 0 22px; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); }
table { border-collapse: collapse; width: 100%; min-width: 560px; font-size: 15.5px; line-height: 1.5; font-variant-numeric: tabular-nums; }
th, td { text-align: right; vertical-align: top; padding: 10px 14px; border-bottom: 1px solid var(--line); }
th { background: var(--leaf); font-weight: 600; white-space: nowrap; }
tr:last-child td { border-bottom: 0; }
td:first-child { font-weight: 500; }
/* timeline */
.gantt { margin: 16px 0 22px; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); overflow-x: auto; }
.gantt-in { min-width: 720px; padding: 14px 16px 6px; }
.g-row { display: grid; grid-template-columns: 210px 170px 1fr; align-items: center; gap: 10px; min-height: 30px; font-size: 14.5px; }
.g-name { font-weight: 500; }
.g-when { color: var(--muted); font-size: 13.5px; }
.g-go .g-name, .g-go .g-when { font-weight: 700; color: var(--ink); }
.g-track { position: relative; height: 30px; border-right: 1px solid var(--line); }
.g-months { display: flex; height: 26px; border-bottom: 1px solid var(--line); }
.g-months span { box-sizing: border-box; border-left: 1px solid var(--line); font-size: 13px; color: var(--muted); text-align: center; }
.g-bar { position: absolute; top: 8px; height: 14px; border-radius: 7px; background: var(--muted); opacity: .45; }
.g-bar.ep { background: var(--green); opacity: .85; }
.g-dot { position: absolute; top: 8px; width: 14px; height: 14px; margin-right: -7px; border-radius: 3px; transform: rotate(45deg); background: var(--muted); }
.g-dot.dror { background: var(--green); }
.g-dot.go { background: var(--sun); outline: 2px solid var(--ink); }
.g-line { position: absolute; top: 0; bottom: 0; width: 0; border-right: 2px dashed var(--sun); }
.gantt figcaption { padding: 6px 16px 12px; font-size: 13.5px; color: var(--muted); }
@media (max-width: 560px) { body { font-size: 16px; } .lead { font-size: 18px; } h2 { font-size: 23px; } h3 { font-size: 21px; } }
</style>
<div class="page">
<header class="top">
<div class="brand">{{ICON}}<span class="brand-name">עוד קצת ילדות</span></div>
<h1>{{TITLE}}</h1>
<p class="byline">{{BYLINE}}</p>
<p class="lead">{{LEAD}}</p>
</header>
<nav class="toc" aria-label="תוכן העניינים"><ul>{{TOC}}</ul></nav>
<main>
{{BODY}}
</main>
</div>
"""

if __name__ == "__main__":
    build()
