# MySteps — hosting on CU's site

MySteps is a single-page app (`public/`) plus two small server functions: `netlify/functions/submit.mjs` files each submission in Planning Center People, and `netlify/functions/profile.mjs` lets people find their serving profile again by email. The Planning Center key lives only on the server, never in the page.

## What happens when someone submits

1. The page sends their answers and top 3 team matches to `/api/submit`.
2. The function looks the person up by email in Planning Center People.
   - Found: uses that profile (no duplicate is created).
   - Not found: creates the person with their name, email and phone.
3. It adds a **note** to their profile with every answer and their MySteps recommendations.
4. If they answered **Yes** to follow-up and a workflow is set, it adds them to that **workflow** so a staff member gets a card.
5. The person sees "Your answers were sent to Central Union", or a clear message with a **Try again** button if it failed. Their serving profile shows either way.

## Coming back to a serving profile

- **Same device:** the profile is remembered in their browser, so **Serving Profile** shows it right away.
- **Any device:** on **Serving Profile**, they enter the email they used and tap **Find my profile** (`/api/profile`).
- Each submission saves a small record in **Netlify Blobs** (built into Netlify, no setup): first name, answer choices, skills note and date. It's stored under a scrambled (hashed) version of the email, and the lookup never returns an email, phone number or anything from Planning Center. Taking MySteps again replaces the saved profile.
- A **"Not [name]? Clear from this device"** button removes a profile from a shared computer or tablet.
- Privacy tradeoff: anyone who knows someone's email could see that person's serving profile (first name, gifts, interests). If that's a concern, the next step is emailing a one-time code before showing it.
- Optional: set a `PROFILE_SALT` environment variable (any long random text) before launch to make the stored keys harder to guess. Don't change it after launch, or saved profiles can't be found.

## One-time setup in Planning Center (about 10 minutes)

1. **Note category (recommended):** People → Settings → Notes → add a category named `MySteps`. Copy its ID from the URL. (Until then you can use the built-in `General` category; its ID is in the URL when you open it.)
2. **Follow-up workflow (recommended):** People → Workflows → New workflow, e.g. `MySteps Follow-Up`, with steps like "Call within 3 days" and "Connect with team leader". Copy its ID from the URL (`/workflows/<ID>`).
3. **Access key:** sign in as a staff account that can edit People, go to <https://api.planningcenteronline.com/oauth/applications>, and under **Personal Access Tokens** create one named `MySteps`. Copy the **Application ID** and **Secret**. Treat the secret like a password.

## Deploy on Netlify (free tier is fine)

1. The code is on GitHub: <https://github.com/ksbrady01/testgit/tree/mysteps-site/mysteps> (repo `ksbrady01/testgit`, branch `mysteps-site`, folder `mysteps`).
2. In Netlify: **Add new site → Import an existing project → GitHub** → pick `ksbrady01/testgit`. Set **Branch to deploy** to `mysteps-site` and **Base directory** to `mysteps/mysteps-site`. Leave the build command empty; the publish directory comes from `netlify.toml`.
3. **Site configuration → Environment variables**, add:

   | Name | Value |
   |---|---|
   | `PCO_APP_ID` | Application ID from step 3 |
   | `PCO_SECRET` | Secret from step 3 |
   | `PCO_NOTE_CATEGORY_ID` | The `MySteps` category ID, or the `General` category ID |
   | `PCO_WORKFLOW_ID` | The follow-up workflow ID (optional) |

4. **Deploys → Trigger deploy.** Then submit MySteps once with your own email and check your Planning Center profile for the note (and workflow card).

## Put it on CU's website

- **Best:** a subdomain like `mysteps.<your-domain>`. In Netlify: **Domain management → Add a domain**, then add the CNAME record it shows at your domain host.
- **Or link to it** from the main site's menu and a "Start MySteps" button.
- **Or embed** it in a page: `<iframe src="https://mysteps.<your-domain>" style="width:100%;height:100vh;border:0"></iframe>`.

## Making changes later

Edit `../mysteps.html`, then run `powershell -ExecutionPolicy Bypass -File .\build.ps1` in this folder to refresh `public/`, and push to GitHub. Netlify redeploys automatically.

## Notes

- A hidden "leave empty" field filters basic spam bots. If spam becomes a problem, add Netlify's rate limiting or a CAPTCHA.
- Errors are logged in Netlify under **Logs → Functions → submit**.
- Not yet tested against the live Planning Center API (it needs CU's access key). Do the test submission in step 4 before announcing it. The workflow step is the part most worth checking; if it fails, the note is still saved.
