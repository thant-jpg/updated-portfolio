# Thant — spaces, stories & interactive design

A responsive, dependency-free portfolio with real, statically generated URLs. Plain HTML/CSS/JavaScript keeps hosting and maintenance simple. Vercel builds it with Node; no framework, paid service or API key is needed.

## Preview

Run `node server.mjs` in this directory, then visit http://127.0.0.1:4173. After changing source files, restart the preview to rebuild.

## Edit your content

Edit `content.mjs`: profile name, location, intro, email, résumé path, and all project titles, summaries and case-study sections. Unknown contact details and résumé are intentionally left empty. Project descriptions are draft scaffolding, with no invented research results, dates or impact metrics.

Put images in `public/images/`, then set a project's `image` to `/images/file-name.jpg`. The same image appears in its project card and case study. Put your résumé PDF in `public/` and set `profile.resume` to `/resume.pdf`. Set `profile.email` to enable the email link. The abstract particle studies and portrait initial are explicit placeholders, not actual submitted work. Replace the homepage artwork in `build.mjs` with your chosen visual when available. Case-study process slots can be replaced with additional image elements in that template.

`build.mjs` contains reusable page templates. `public/style.css` contains the design; `public/app.js` contains the filters and temporary interactive wireframe studies.

## GitHub + Vercel

This directory is initialized as a local Git repository. To publish, create an empty GitHub repository (suggested name: `thant-portfolio`), then connect it:

```
git remote add origin https://github.com/YOUR-USERNAME/thant-portfolio.git
git push -u origin main
```

In Vercel choose **Add New → Project**, import that repository, choose **Other** as the framework preset, and deploy. The included `vercel.json` sets `node build.mjs` as the build command and `dist` as the output directory. Every later push rebuilds the site. Generated `dist/` is ignored in Git.

## Before public launch

Replace the placeholder visuals and draft project copy. Add your full name if desired, contact email and résumé. Verify project credit and individual contribution, especially the Linked Hybrid study. The site uses optional Google Fonts with local system fallbacks.

## Floral art direction

The black gallery direction uses original AI-generated translucent floral artwork at `public/images/ghost-flowers.png`, made with the built-in image-generation tool. This is visual identity artwork, not a project render. Prompt: three airy translucent X-ray-like glass flowers with flowing tendrils, icy silver and pale cyan with violet iridescence, on pure black with generous negative space; no text, UI or logos. The homepage has gentle motion with reduced-motion support.

## Interactive flowers

The homepage uses a lightweight WebGL texture effect in public/flower-motion.js: slow rotation, cursor/tap ripple trails, local swirl, and a scroll-driven turn, scale and fade. It animates the floral image rather than a 3D model. Rendering pauses off-screen and when the tab is hidden. Reduced-motion settings and unavailable WebGL keep the still image. No additional dependencies are required.

