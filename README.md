# Matari Coffee Co. — Time Clock

Staff punch in and out on the shop iPad with a 4-digit code. Every punch is
timestamped, saved on the iPad, and synced to a Google Sheet the manager can
open from her phone.

**Live app:** https://matari522.github.io/matari-clock/
**Hours sheet:** https://docs.google.com/spreadsheets/d/12SOzoAS9ErtyPdvJNt25mSD6P7evewDMqCDE6O4tQXU/edit

Everything below is already set up and tested. Nothing else is needed to start
using it.

---

## Put it on the iPad

1. Open **Safari** on the iPad — it has to be Safari, not Chrome.
2. Go to **matari522.github.io/matari-clock**
3. Tap the **Share** button (the square with the arrow, top of the screen).
4. Scroll down the list and tap **Add to Home Screen**.
5. It'll suggest the name *Matari Clock* — tap **Add**.
6. Close Safari. Tap the gold **M** icon on the home screen.

It opens full screen with no address bar, like a normal app. The punch screen
is the first thing anyone sees.

**Leave it on that one iPad.** Two iPads means two separate sets of hours.

---

## First things to do

Tap the **gear** in the top corner, enter **1356** (Aiman's manager code).

- **Staff** → *Add team member*. Type a name, tap **Suggest** for an unused
  4-digit code (or type your own), **Save**. Repeat for everyone.
- **Settings** → put Aiman's email in *Manager email* so the weekly report has
  somewhere to go.
- **Settings** → change the manager code from 1356 to something only she knows.

Staff can only punch in and out. Everything else needs the manager code.

---

## Day to day

Someone types their 4-digit code. The app knows whether they're clocking in or
out and shows a green or gold confirmation with the time, their hours for the
shift, the day, and the week so far. It returns to the keypad on its own.

The punch screen shows who's currently on the clock, so Aiman can see at a
glance who's in.

Tap a code twice by accident and it asks you to confirm rather than clocking
you straight back out.

---

## The Google Sheet

Owned by anthonysantoro1997@gmail.com, shared with aimansalim0@gmail.com as an
editor. Tabs:

- **Punches** — one row per shift. Columns A–K are for reading; L–N are
  bookkeeping the app uses to rebuild itself on a replacement iPad. Editing a
  shift in the app updates that same row rather than adding a new one.
- **Totals** — hours per person per week, updates itself.
- **Staff** — current team and their codes.
- **Config** — app settings, for recovery.

Sync happens the moment somebody punches. **The iPad always saves locally
first**, so the clock keeps working when the wifi drops — anything that
couldn't be sent goes up automatically once it's back, and retries every few
minutes. The manager panel shows a green dot and the last sync time.

A shift deleted in the app stays in the sheet marked `DELETED` with zero hours,
so the Totals ignore it but you keep the audit trail.

**If the iPad is lost or replaced:** install the app on the new one, open
Settings, tap **Restore this iPad from the sheet**. Staff, codes and every
recorded shift come back.

---

## Weekly hours by email — optional, not set up yet

The report covers Monday–Sunday (changeable in Settings).

**When it fires.** Matari closes Sunday at midnight, so the closing shift
punches out in the early hours of Monday. The report deliberately waits for
that: a week only goes out once everyone from that week has punched out. The
closer's punch-out is what releases it. If someone forgets to punch out
entirely it sends anyway 12 hours later with that shift flagged, so it never
gets stuck.

A shift counts toward the day it **started** — a Sunday 4:00 PM → Monday
12:30 AM close belongs to Sunday's week.

**To turn it on:** go to web3forms.com, enter Aiman's email, and they email
back an access key. Paste it into Settings → *Web3Forms access key*, set *Send
automatically* to On, Save, then hit **Send a test email**.

Leave the key blank and reports just queue up in the **Reports** tab with a
banner on the punch screen as the reminder — nothing is lost either way.

---

## Where the data lives

Two places only: the iPad, and the Google Sheet. No analytics, no trackers, no
third-party scripts. The only two outside addresses the app can reach are the
Sheet and — if you enable it — the email service.

Not iCloud. Safari's stored data isn't synced to iCloud (that covers bookmarks,
tabs, history and passwords). If the iPad has iCloud Backup on, the encrypted
device backup includes the app's local data the same as any app.

Not GitHub. GitHub Pages serves the app's code only; no punch ever touches it.

---

## Maintenance

**To change the app:** edit the files here and push. Bump `CACHE` in `sw.js`
so installed iPads pick up the new version.

**To change the sync script:** it lives at
script.google.com → *Untitled project*. Editing the code is not enough —
`/exec` keeps serving the deployed version. You must also do
**Deploy → Manage deployments → pencil icon → Version: New version → Deploy**.

**A note on the sheet link.** The web app URL sits in this public repo, so
someone who found it could post junk rows into the sheet. Realistically nobody
will, and junk rows are easy to delete. To close it off properly: open the
script, put any word in the `TOKEN = ''` line, deploy a new version, then type
the same word into Settings → *Sync word* on the iPad.

---

## Backups

The Sheet is the backup — it holds every shift and can rebuild a new iPad from
scratch. For a second copy, Settings → **Export backup** gives you a file to
save, and **Restore from backup** puts it back.
