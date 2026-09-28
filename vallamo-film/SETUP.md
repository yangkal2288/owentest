# Setup on the new laptop (about 20–30 minutes)

Everything for the "Meet Vallamo" X launch film is in this bundle. Do these steps **in order**, in **Terminal**, on the Mac that will build the film.

---

## 1. Put the bundle in the home folder

Unzip the bundle so you end up with a folder called **`vallamo-film` directly in your home folder**.

**If you have the single zip** (`vallamo-film-bundle.zip`):
```bash
cd ~ && unzip ~/Downloads/vallamo-film-bundle.zip
```

**If you have the two parts** (`vallamo-film-part1-project.zip` and `vallamo-film-part2-references.zip`), unzip both. They merge into the same folder:
```bash
cd ~ && unzip ~/Downloads/vallamo-film-part1-project.zip && unzip ~/Downloads/vallamo-film-part2-references.zip
```

Check it worked. You should see `HANDOFF-launch-film-3d.md`, `Meet-Vallamo-VO-Script.md`, `SETUP.md`, `videos`, `brand`, `sources`, `reference` and `skills-backup`:

```bash
ls ~/vallamo-film
```

---

## 2. Install the basics

**2a. Apple's command-line tools** (git, compilers). If a window pops up, click Install, wait for it to finish, then continue:

```bash
xcode-select --install
```

**2b. Node.js 24 (LTS).** Download and run the macOS installer from https://nodejs.org (pick "LTS"). Then check it:

```bash
node -v
```

**2c. Python packages** (image tools, ffmpeg, downloader):

```bash
python3 -m pip install --user pillow imageio-ffmpeg numpy yt-dlp
```

**2d. Claude Code**, if it isn't installed on this laptop yet:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

Then open a new Terminal window and run `claude` once to sign in to the account that will build the film.

---

## 3. Install the project

```bash
cd ~/vallamo-film/videos && npm install
```

If npm says an install script is waiting for approval (usually **esbuild**), approve it and rebuild:

```bash
npm install-scripts approve esbuild && npm rebuild esbuild
```

Install the headless browser used for UI captures:

```bash
npx playwright install chromium
```

Quick check that the project works (it should run without errors; the list is empty until the film is registered):

```bash
npx remotion compositions src/index.ts
```

---

## 4. Install the skills

Claude Code loads skills from `~/.claude/skills/`. Three are needed.

**4a. product-film** (directing product films in Remotion):

```bash
cd ~ && git clone https://github.com/Rieranthony/product-film-skill && mkdir -p ~/.claude/skills && cp -R product-film-skill/plugins/product-film/skills/product-film ~/.claude/skills/
```

**4b. no-slop-motion** (the process and taste rules that stop it looking AI-made):

```bash
cd ~ && git clone https://github.com/ferndesk/no-slop-motion && cp -r no-slop-motion/skills/no-slop-motion ~/.claude/skills/
```

> If either clone fails, copies are in the bundle. Use these instead:
> ```bash
> mkdir -p ~/.claude/skills && cp -R ~/vallamo-film/skills-backup/product-film ~/vallamo-film/skills-backup/no-slop-motion ~/.claude/skills/
> ```

**4c. Remotion's official skills** (best practices, SaaS videos, captions, rendering). When asked, choose **Claude Code** and **global**:

```bash
npx skills add remotion-dev/skills
```

Check all three are there. You should see `product-film` and `no-slop-motion`, and the Remotion skills either there or in the location `npx skills` reported:

```bash
ls ~/.claude/skills
```

---

## 5. Start the build

1. Open a **new** Terminal window (so new installs are picked up).
2. Go to the home folder and start Claude Code:
   ```bash
   cd ~ && claude
   ```
3. Paste the prompt from **§13 of `~/vallamo-film/HANDOFF-launch-film-3d.md`**.

Claude will start by confirming the script and asking a few questions, then show **6 style frames** for approval before building any motion. Approve those carefully: they set the look.

---

## What's in the bundle

| Folder / file | What |
|---|---|
| `HANDOFF-launch-film-3d.md` | The full brief: references, shot list, rules, file map, prompt |
| `Meet-Vallamo-VO-Script.md` | The voiceover script (recorded separately by Owen's team) |
| `videos/` | A **starter** Remotion project: motion kit, capture scripts and real Vallamo UI pieces and snapshots (no `node_modules`; step 3 installs them). No old films. |
| `brand/` | Brand package: `BRAND.md` (colours, type, logo use, motion, voice), logo SVGs and PNGs, fonts, `tokens.css`, `tailwind.config.mjs` |
| `sources/` | The current deployed Vallamo codebase zip, and the UI demo HTML |
| `reference/` | The three reference launch films (Tessel, Skydive, Shotbase) with frame sheets |
| `skills-backup/` | Copies of the product-film and no-slop-motion skills |
