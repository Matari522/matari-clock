# Matari Coffee Co. — Time Clock

A punch-in app for the shop iPad. Staff type a 4-digit code to clock in and out.
The manager adds people, sets their codes, fixes mistakes, and gets the week's
hours by email.

Runs entirely in the browser. No server, no accounts, no monthly fee.

---

## Putting it on the iPad

1. Publish the files (see **Hosting** below) — you'll get a link like
   `https://YOURNAME.github.io/matari-clock/`
2. On the iPad, open that link **in Safari** (it must be Safari, not Chrome).
3. Tap the **Share** button, then **Add to Home Screen**.
4. Tap the Matari icon on the home screen. It opens full-screen with no
   address bar, like a normal app.

First launch asks for a manager code and the manager's email. After that it
goes straight to the punch screen every time.

---

## Hosting it (free, on a new GitHub account)

1. Make the account at **github.com/signup**.
2. Click **+** (top right) → **New repository**. Name it `matari-clock`,
   set it to **Public**, click **Create repository**.
3. On the new repo page click **uploading an existing file**.
4. Drag in every file from this folder. Click **Commit changes**.
5. Go to **Settings → Pages**. Under *Source* pick **Deploy from a branch**,
   branch **main**, folder **/ (root)**. Click **Save**.
6. Wait about a minute, then reload that page — it shows your live link.

The repo must be Public for free GitHub Pages. Nobody can see the hours: staff
data never leaves the iPad, only the app's code is on GitHub.

To update the app later, upload the changed file and bump `CACHE` in `sw.js`
so the iPads pick it up.

---

## Weekly hours by email

Reports cover the work week (Monday–Sunday by default; change it in Settings).

**When it sends.** Matari closes Sunday at midnight, so the closing shift
punches out in the early hours of Monday. The report deliberately waits for
that: a week only goes out once **everyone from that week has punched out**.
The closer's punch-out is what releases it. If someone forgets to punch out
entirely, it sends anyway 12 hours later with that shift flagged so nothing
gets stuck.

A shift counts toward the day it **started**. A Sunday 4:00 PM → Monday
12:30 AM close belongs to Sunday's week, not the new one.

**Automatic sending.** Free, no account:

1. Go to **web3forms.com**, enter the manager's email, and they email back an
   access key.
2. In the app: gear icon → manager code → **Settings** → paste the key into
   *Web3Forms access key*, set *Send automatically* to **On**, **Save**.
3. Hit **Send a test email** to confirm it works.

Leave the key blank and reports just wait in the **Reports** tab for the
manager to send by hand — the banner on the punch screen is the reminder.

Note: the access key sits in the app's code, so treat it as public. Worst case
someone finds it and can email the manager through it. Web3Forms can rotate it.

---

## What the manager can do

Tap the gear in the top corner and enter the manager code.

- **Staff** — add people, set or change their 4-digit code (**Suggest** picks
  an unused one), mark someone inactive so their code stops working.
- **Timesheet** — week by week, every shift, hours per person, payroll total.
  Fix a wrong punch, add a shift someone missed, export CSV. Anything over 40
  hours is flagged.
- **Reports** — every week's report, whether it sent, and a resend button.
- **Settings** — manager email and code, which day the week starts, overtime
  threshold, backup and restore.

Staff can only punch in and out. Everything else needs the manager code.

---

## Backups — please read

**All hours live on that one iPad**, in Safari's storage. There is no cloud copy.

Clearing Safari's website data, or deleting the app and reinstalling, erases
everything. Before you ever do either, go to **Settings → Export backup** and
email the text to yourself. **Restore from backup** puts it back.

Exporting the CSV after each pay period is a good habit regardless.

---

## Notes

- Works offline — after the first load, the iPad doesn't need wifi to record
  punches. It only needs a connection to email a report.
- Keeps the screen awake while the punch screen is up.
- Double-punch guard: tapping a code twice by accident asks for confirmation
  instead of clocking someone straight back out.
- Best kept on one iPad. Two iPads means two separate sets of hours.
