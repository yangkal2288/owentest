# vallamo.com: new mid-section and "See it now" website box

| File | What changed |
|---|---|
| `index-a-mid-and-closing.html` | **Version A.** Only the mid-section and the closing section are new. Everything above the Nicky and Ella testimonials is untouched. |
| `index-b-full-refresh.html` | **Version B.** Everything in A, plus cosmetic polish above it. The hero photo is replaced with a layered warm gradient: light behind the headline, a golden glow top-right, sand top-left, a hint of sage, and a faint grain so it never bands. It runs up behind the header seamlessly. The hero layout is unchanged. The dashboard-preview frame is crisper, and the testimonials are shown as cards. |

Previews are in `previews/`, with the current site included for comparison.

## The new sections (both versions)

Everything between the testimonials and the footer is replaced:

1. **What Vallamo does.** The same six capabilities, now as cards, each with a small product vignette.
2. **How it works.** Three steps: enter your website, check what it learned, go live everywhere.
3. **Same care. Different front desks.** The four industries as tiles.
4. **The website box.** This uses the layout of the reference you sent. The card reuses the spa photo from the current hero under an espresso wash, with a warm clay glow at the bottom. Below it is a scrolling strip of capabilities and a "Book a 15-minute demo with the team" link.
   - Headline: *See your front desk answer questions about your business in minutes.*
   - Button: **See it now →**

## What the box does

When someone enters a website and presses **See it now**, they go to `https://vallamo.app/signup?website=https://theirsite.com`. It works with or without JavaScript. If the address isn't a real website, the page asks them to fix it instead.

The website **is not recorded as a lead on its own**. The current app has no public way to accept one: every lead needs an email or phone number (the database enforces this), and the only public form endpoint (`/contact/submit`) needs a name, email and message. What happens today is that the lead arrives when they sign up. Their account is created and the app's existing "account created" lead goes to the CRM. The signup page ignores the `?website=` value until the app is updated to use it.

If you later add an endpoint that records the website, put its URL in the form's `data-lead-endpoint` attribute. The page will then POST the website there first, before redirecting.

## Before publishing

- Keep `hero-spa-bg.png` on the server. The closing card uses it in both versions.
- The industry examples ("Plumbers, electricians, cleaners", etc.) are my wording. Check they match your industry pages.
- The vignette details ("£20.00", "Thursday 10:30") are illustrative.

## Rebuilding

```
python3 source/build.py source/index-original.html .
```
