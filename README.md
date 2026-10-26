# nerdweddings.ca

One-page Hugo site for a secular humanist wedding officiant (licensed in Ontario) who works with nerd and geek couples.

The design blends three flavours: **tabletop fantasy** (parchment, serif headings, quest cards, d20s), **sci-fi terminal** (starfields, mono `// labels`, a HUD "character sheet") and **cozy comic** (ink outlines, hard offset shadows, speech bubbles, halftone dots).

No theme dependency, no Node build step, no Sass: it builds with the standard `hugo` binary. **Requires Hugo v0.158 or newer** (it uses `hugo.Data` and `locale`).

## Run it locally

```bash
hugo server -D      # http://localhost:1313, live reload, shows drafts and placeholders
hugo --minify       # production build into ./public
```

`hugo server` shows **placeholder** content (marked with a yellow tag) so you can see the full design. The production build leaves it out. See "Before launch" below.

## Where to edit things

| To change | Edit |
| --- | --- |
| Email, phone, region, site description, officiant name | `hugo.toml` under `[params]` |
| Hero text, character sheet, About copy, section headings | `data/home.yaml` |
| Packages and prices | `data/packages.yaml` |
| Testimonials | `data/testimonials.yaml` |
| FAQ | `data/faq.yaml` |
| Articles ("Field notes") | `content/articles/*.md` |
| Colours, fonts, spacing | top of `assets/css/main.css` (`:root` tokens) |
| Page structure | `layouts/index.html` and `layouts/partials/` |

Optional images: drop a `static/images/hero.jpg` and it appears (softly blended) behind the hero. Replace `static/images/og.png` (1200x630) to change the social-share card.

## Articles

```bash
hugo new articles/my-first-idea.md
```

Write it, then set `draft: false`. Once at least one published article exists, a "Field notes" section appears on the home page and in the nav automatically. The included `rolling-for-initiative.md` is a **sample draft** and does not publish until you set `draft: false`.

## Contact form

GitHub and GitLab Pages are static, so there is no server to receive a form. The form builds a pre-filled **`mailto:` email** in the visitor's email app, with a "Copy message instead" fallback for people who use webmail. Nothing passes through a third party. To switch to a form service later (Formspree, Web3Forms and so on), change the `<form>` in `layouts/index.html` and remove the mailto logic in `assets/js/main.js`.

## Before launch

- [ ] Replace the placeholder email in `hugo.toml` (`hello@nerdweddings.ca` is a guess). Add a phone number only if you want one shown.
- [ ] Confirm the **packages, prices, and FAQ answers** (adapted from the Lovable mockup).
- [ ] Replace or delete the **testimonials**. They are placeholders and are hidden from the published site until you replace them and remove the `placeholder: true` lines.
- [ ] Skim `data/home.yaml`: the copy and the character-sheet stats are draft and meant to be personalized.
- [ ] Add your name in `hugo.toml` (`officiantName`) if you want it on the character sheet and in the footer.
- [ ] Publish or delete the sample article.

## Deploy

**GitHub Pages:** push to `main`, then go to Settings > Pages and set Source to **GitHub Actions**. `.github/workflows/hugo.yml` does the rest. Free GitHub accounts can only serve Pages from **public** repos.

**GitLab Pages:** push to your default branch; `.gitlab-ci.yml` builds and publishes. GitLab Pages can serve from private projects. If you deploy at `https://username.gitlab.io/repo/` (a subpath), the CI file already handles it via `CI_PAGES_URL`. Once you attach the custom domain, change the `--baseURL` in `.gitlab-ci.yml` to `https://nerdweddings.ca/`.

**Custom domain (nerdweddings.ca):** add the domain in the Pages settings, then create DNS records at your registrar as the host instructs. For GitHub, that is four `A` records for the apex domain (see GitHub's "Managing a custom domain" docs for the current IPs) and a `CNAME` for `www` pointing at `<username>.github.io`. Turn on "Enforce HTTPS" once the certificate is issued. `static/CNAME` is included for branch-based publishing and is harmless with Actions.

The workflow files pin Hugo `0.166.0` and current major versions of the GitHub Actions; bump them occasionally.

## Fonts

Self-hosted (no requests to Google): Fraunces, Nunito, and JetBrains Mono, all under the SIL Open Font License 1.1, from the Fontsource packages.

## Accessibility notes

Semantic landmarks and skip link, visible focus states, native `<details>` FAQ, colour pairs checked for WCAG AA contrast, reduced-motion support (animations and the die roll switch off), and the whole page works without JavaScript (only the mobile menu collapse, the die and the copy button need it).
