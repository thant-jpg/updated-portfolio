# Thant — spaces, stories & interactive design

A responsive, dependency-free portfolio with real, statically generated URLs. Plain HTML/CSS/JavaScript keeps hosting and maintenance simple. Vercel builds it with Node; no framework, paid service or API key is needed.

## Preview

Run `npm run dev` in this directory, then visit http://127.0.0.1:4173. Saving source, content, CSS, JavaScript, or public asset changes automatically rebuilds the site and refreshes the browser.

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

## Interactive 3D flowers

The current homepage uses actual procedural 3D geometry from `public/flower-geometry.js`, rendered in `public/flower-3d.js`. Three flowers have petal surfaces, curved tubular stems and fine stamens. Drag horizontally for a full 360-degree turn; hover and arrow keys also adjust the view. The original generated image is the static fallback for reduced motion or unavailable WebGL.

A scroll-driven grain dissolve carries the flowers into the full-screen black introduction. Edit its two lines in `profile.interlude` in `content.mjs`. Independent floating and sparkling background particles continue through the introduction and work section. Cursor rings and waves in the petals create a stronger water interaction. Fine grain and subtle scan lines support the retro-future direction.

No external 3D library is required. Rendering pauses while hidden; reduced-motion settings disable animated effects. An OBJ export of the geometry is provided alongside the portfolio folder as `flowers.obj`.

The supplied résumé is available as the original Word document at public/resume.docx, linked on About and Contact. The introduction explicitly uses Courier New.

## Current floral scene

The current hero uses the supplied blue-tulip photo, isolated onto a transparent background with the built-in image-generation tool (prompt: remove only the pale background and preserve the two blue flowers, stems, leaves and photographic detail). The asset is public/images/blue-tulips.png. public/floral-scene.js animates this photograph with gentle displacement and cursor influence, then samples its pixels into a drifting point cloud during scroll. This is a photo-based animation, not an AI-generated motion video or full 3D model. A short WebM export is provided beside the portfolio folder. Introductory text fades in, with reduced-motion support. Hero typography is Courier New and side callouts have been removed.

EasyConvo now includes the supplied student/teacher, usability-testing and Figma descriptions. The resume page uses the updated Word content, with previous Additional Information retained by request. About lists software and has no portrait. Confirmed email: waithantthiri101@gmail.com.

## Adding project artwork

Project detail pages use three landscape sheets, adapted to one column on small screens:

1. Opening: title, description, role, disciplines, and a large cover drawing or render.
2. Process: existing project text with two slots for plans, sections, process images, or prototypes.
3. Outcome: a large final image and the existing outcome description.

Place artwork in `public/images/<project-slug>/`. Set its site-relative paths in `project-media.mjs`:

- `cover`: opening drawing or render
- `plan`: first process image (plan, sketch, or flow)
- `section`: second process image (section, development, or prototype)
- `outcome`: final drawing, model, render, or screen

A null or missing file leaves a labelled image space. Text remains in `content.mjs`; sheet markup is in `project-layout.mjs` and styles are in `public/workspace.css`. Run `npm run build` after changing content, or use `npm run dev` for automatic rebuilding.

## Native portfolio project pages

The seven imported architecture projects use a continuous webpage inside one subtle document frame. Headings, descriptions, lists and captions are selectable Geist Mono text. The original PDF is retained unchanged, but complete printed PDF pages are no longer embedded in the project pages.

- `portfolio-editable.mjs`: continuous project layout, with no page count or section buttons.
- `portfolio-artwork.mjs`: 104 individual illustrations, drawings, models and photos.
- `portfolio-sections.mjs`: concise section headings and explanations adapted from the PDF.
- `project-copy.mjs`: project introductions and presentation-cover overrides.
- `portfolio-projects.mjs`: imported project metadata and source-page records, retained for provenance.
- `public/document-rulers.js`: ResizeObserver updates ruler marks to the full document height at a constant pixel scale.
- `public/workspace.css`: subtle rulers/document frame, consistent 4:3 image frames, full-width pile, and joined 1px accent footer divider.

Drawings fit fully inside white 4:3 frames and open at full size when clicked. The Wandering Archive cover has one AI-expanded presentation variant; the original cover and technical artwork remain available in the source files. See `docs/ai-image-notes.md` for generation details.

To regenerate the imported artwork from the source PDF, use the bundled Python/Poppler runtime with `scripts/extract-complete-artwork.py`, followed by `scripts/separate-portfolio-drawings.py`. The second step is required: it separates the nine composite PDF pages into 34 individual visuals and removes PDF text, which is rebuilt in the native section copy. Inspect extracted visuals before rebuilding. Temporary render files are not needed to serve the site.

Project chronology is controlled by `projectDates` in `content.mjs`. Home and Work use newest-first order. Previously is September 2025 internship work, confirmed by the user. App projects remain labelled artwork placeholders until their images are provided.

