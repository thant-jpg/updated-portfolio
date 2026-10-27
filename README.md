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

## Additional architecture projects

Ascent (March 2025), Venture (February 2025), and Pause (September 2025, confirmed by the user) were added from the two later portfolio PDFs. The gallery now has 12 unique projects, in newest-first order. These additions contain 22 individual visuals with native section text and the existing same-page image viewer.

- `scripts/import-additional-projects.py` imports the three projects idempotently, preserving the source image colour handling and reassembling Venture's tiled section image.
- `sources/additional-projects-import.json` records the source PDFs, page references, image captions, and date provenance.
- New section-copy keys include the project slug (for example, `ascent:8`) so page numbers from different PDFs cannot collide.
- The original PDFs remain unchanged. Image files retain the detail available in their embedded source assets.
## Weave, furniture and personal art

The gallery now has 15 projects. Weave is May 2025. Butterfly Effect is labelled Early 2025 (year-level sorting, with no invented month). Art studies is intentionally undated and appears after dated projects.

- Previously is now titled Internship work; its existing `/work/previously/` route remains valid.
- Three paintings were separated from Internship work into Art studies, alongside the new waterfront skyline painting. Its full PNG is preserved unchanged; the gallery uses an optimised thumbnail.
- The Art filter shows this separate collection. Furniture is listed under Product.
- Miniature car, Python memory game and LuminaTrail were excluded at the user's request.
- `scripts/import-weave-butterfly-art.py` and `sources/weave-butterfly-art-import.json` record the import and separation. The source PDF remains unchanged.

Art studies now contains 20 pieces, including 16 new uploads. They are grouped into Places and spaces, Portraits and figures, Sketchbook, Light and colour, and Still life. All uploaded originals are preserved unchanged and open in the same-page image viewer. `scripts/import-art-uploads.py` and `sources/art-uploads.json` record these additions; run this importer after the PDF importer when regenerating the collection.

The portrait gesture drawing and eye-and-hand sketch share one cropped white composition, so those 20 pieces appear in 19 gallery images. `scripts/compose-portrait-studies.mjs` builds the SVG composition from the unchanged original JPEGs; run it after the upload importer. The separate eye sketch in the portrait's corner is excluded from the crop. The experimental AI composition was discarded because it altered pencil strokes.

The gallery follows date order with one requested exception: The Wandering Archive appears directly after Pause. Its original February 2025 date is preserved. This order also applies to project navigation.

## Collage layout and typography loading

Native project pages now use responsive masonry collages within their existing sections. Images keep their source proportions, panoramas span the collage, and captions remain visible. The continuous paper document sits on a contrasting pasteboard with margin guides, crop marks, rulers, a document tab and selection handles. The Guides control hides these guides without hiding artwork or captions. The same-page image viewer remains available.

Font declarations moved from `public/editorial.css` to `public/fonts.css`. The build places them in the initial HTML, adds preloads for all four Geist Mono weights, and gives font files content-addressed URLs. Text waits for the fonts rather than flashing a fallback; a 2.5-second failsafe releases the page if loading stalls. With JavaScript disabled, CSS still uses block font loading. The local server caches versioned fonts, CSS and scripts as immutable assets.

## Flow visualisations and enhanced artwork

Flow contains five AI-assisted visualisations and seven approved AI-enhanced process/model/drawing images. The grassy and snowy scenes are the opening pair; timber, weathering steel and a tiled urban illustration remain separate studies. The updated renders use a common three-quarter viewpoint while retaining the three distinct lifted ribbon pieces and the slots between the roofs. The original white paper model is the form reference.

PNG masters are retained under `public/images/portfolio/flow/visualisations/` and `enhanced-artwork/`, alongside unchanged original source assets in `complete-artwork/`. Website images use WebP copies at the generated native dimensions. These are AI image refinements, not exact super-resolution or validated construction drawings.

Run `scripts/publish-flow-visualisations.py` and `scripts/publish-flow-enhancements.py` before `npm run build` to republish the selected assets. The visualisation publisher prioritises `visualisations/separated/`, then `aligned/`, then the earlier masters. Prompts and provenance are recorded in `sources/flow-visualisations.json`, `sources/flow-camera-alignment.json` and `previews/flow-enhancement/generation-record.json`.
