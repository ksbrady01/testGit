# Central Texas Fellowship: GoHighLevel import

GoHighLevel can't import a whole HTML site in one step. You build a page in its builder and paste this code into a **Custom Code** element. Everything the site needs is in these files.

## The files

| File | What it is |
|---|---|
| `central-texas-fellowship-ALL-IN-ONE.html` | **Start with this one.** The whole site (fonts, styles, page and animations) in one paste. |
| `1-header-tracking-code.html` | Fonts only. Used for Option B. |
| `2-custom-css.css` | Styles only. Used for Option B. |
| `3-custom-code-element.html` | Page content and animations only. Used for Option B. |
| `index.html` | The full site as a normal web page. Open it in a browser to preview it, or host it somewhere else. |

## Option A: one paste (recommended)

1. In GoHighLevel, go to **Sites → Websites** (or **Funnels**) and create a new website, then add a **blank page**.
2. **Page settings:** set the page background color to `#140A3A` and remove any page padding or margins.
3. Add a **Section** and make it **Full Width**. Set its padding to `0` on all sides and its background to `#140A3A`.
4. In that section, add a **Row** set to full width, with one **Column**. Set the padding to `0` on both.
5. Drag in a **Custom Code** element (it may be labeled "Code" or "Custom JS/HTML").
6. Open `central-texas-fellowship-ALL-IN-ONE.html` in a text editor, select everything, copy it, paste it into the element and click **Save**.
7. Delete any other default sections and turn off the builder's own header and footer. The site has its own navigation bar and footer.
8. **Preview** or **publish** the page. The builder canvas usually doesn't run animations, so check them on the preview or the live page.
9. Under **Page settings → SEO**, set the title to "Central Texas Fellowship" and add a meta description.

## Option B: split into pieces

Use this if the Custom Code element cuts off a long paste, or if your team prefers to keep CSS separate.

1. **Settings → Tracking Code → Header** (or the page's Header code): paste `1-header-tracking-code.html`.
2. **Page settings → Custom CSS:** paste `2-custom-css.css`.
3. Set up the section, row and column as in Option A, steps 2–4. In the **Custom Code** element, paste `3-custom-code-element.html`.

## Good to know

- **Styles are self-contained.** Every style is limited to a wrapper (`<div id="ctf">`), so GoHighLevel's theme won't change the site and the site won't change anything else on the page.
- **Animation libraries load themselves.** GSAP 3.12.5 and three.js r128 come from cdnjs, in the right order. You don't need to add any script tags.
- **Leave the builder settings above as they are.** Sections need **0 padding** and **full width**. The full-bleed hero and the sideways-scrolling gallery depend on it. Don't turn on "sticky" or animation effects on the GoHighLevel section either: GoHighLevel's own section animations can interfere with the scroll effects.
- **The nav menu links to sections on the same page** (`#sunday`, `#life`, `#messages`, `#watch`, `#visit`), so it works as a one-page site.

## Before you go live, update these placeholders

Search the pasted code for each item and change it:

- **Service times:** `9:00 AM`, `11:00 AM`, `Wed 7:00 PM`, and the line "Sundays · 9:00 & 11:00 AM".
- **Directions:** the button currently runs a Google Maps search. Replace `https://www.google.com/maps/search/Central+Texas+Fellowship` with your real Maps link.
- **Livestream and sermons:** the buttons currently run YouTube searches (`https://www.youtube.com/results?search_query=...`). Replace them with your channel or livestream URL.
- **Ministry details and sermon series:** the times and names in the gallery and the "Now preaching" cards are examples.
- **Online giving:** not included yet. A GoHighLevel payment link or your giving provider's link can go in the nav bar or the Watch section.
- **Real photos:** the artwork is drawn in code. If you want church photos instead, upload them to the GoHighLevel Media Library and ask me to swap them in.
