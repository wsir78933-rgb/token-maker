# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: seo-signals.spec.ts >> en SEO signals >> /templates/square-token-maker: unique semantic JSON-LD in raw HTML and hydrated DOM
- Location: e2e/seo-signals.spec.ts:409:7

# Error details

```
Error: Channel closed
```

```
Error: page.goto: Test ended.
Call log:
  - navigating to "http://127.0.0.1:40001/templates/square-token-maker", waiting until "load"

```

# Page snapshot

```yaml
- main [ref=e2]:
  - navigation "Primary" [ref=e5]:
    - link "Token Maker Back to the editor" [ref=e6] [cursor=pointer]:
      - /url: /#editor-workspace
      - generic [ref=e10]:
        - generic [ref=e11]: Token Maker
        - generic [ref=e12]: Back to the editor
    - button "Open navigation" [ref=e14]
  - generic [ref=e16]:
    - generic [ref=e18]:
      - navigation "Breadcrumb" [ref=e19]:
        - list [ref=e20]:
          - listitem [ref=e21]:
            - link "Editor" [ref=e22] [cursor=pointer]:
              - /url: /
          - listitem [ref=e25]:
            - generic [ref=e26]: Square Token Maker for VTT Maps, NPC Portraits, and Grid Tokens
      - generic [ref=e27]:
        - generic [ref=e28]:
          - paragraph [ref=e29]: Square token maker
          - heading "Square Token Maker for VTT Maps, NPC Portraits, and Grid Tokens" [level=1] [ref=e30]
          - paragraph [ref=e31]: Turn character art, monster portraits, and NPC images into square VTT tokens that read cleanly on grid maps and handouts.
          - paragraph [ref=e32]: "People searching for a square token maker usually want a practical 1:1 export, not a long design essay. This page focuses on the decisions that matter before export: when a square token beats a circle, how much shoulder and prop detail to keep, which border style stays readable, and what PNG size works for Roll20, Foundry VTT, Owlbear, and similar tabletop workflows."
          - generic [ref=e33]:
            - generic [ref=e34]: 1:1 square crop
            - generic [ref=e35]: Transparent PNG
            - generic [ref=e36]: Roll20 and Foundry ready
          - generic [ref=e37]:
            - button "Open square token maker" [ref=e38]
            - link "Read more guides" [ref=e41] [cursor=pointer]:
              - /url: /blog
        - complementary [ref=e42]:
          - article [ref=e43]:
            - paragraph [ref=e44]: Use this page when
            - paragraph [ref=e45]: Best for grid-aligned markers, sci-fi portraits, prop-heavy NPC art, and handout style tokens.
          - article [ref=e46]:
            - heading "Best for" [level=2] [ref=e47]
            - list [ref=e48]:
              - listitem [ref=e49]:
                - generic [ref=e53]: Square grid battlemaps
              - listitem [ref=e54]:
                - generic [ref=e58]: Portraits with visible shoulders, hats, or weapons
              - listitem [ref=e59]:
                - generic [ref=e63]: Faction markers and room labels
    - generic [ref=e64]:
      - generic [ref=e65]:
        - article [ref=e66]:
          - heading "Recommended setup" [level=2] [ref=e67]
          - list [ref=e68]:
            - listitem [ref=e69]:
              - generic [ref=e73]: "Mask: square"
            - listitem [ref=e74]:
              - generic [ref=e78]: "Borders: thin ring, metal, or none for a flat card look"
            - listitem [ref=e79]:
              - generic [ref=e83]: "Export size: 512 or 1024 depending on map zoom"
        - article [ref=e84]:
          - heading "Practical tips" [level=2] [ref=e85]
          - list [ref=e86]:
            - listitem [ref=e87]:
              - generic [ref=e91]: Use extra headroom so helmets, banners, or shoulder armor are not cropped away.
            - listitem [ref=e92]:
              - generic [ref=e96]: A square token works well with thin borders when the art already has a decorative frame.
            - listitem [ref=e97]:
              - generic [ref=e101]: Use text only when the token needs a call sign, rank, or room code.
        - article [ref=e102]:
          - heading "Make a square token from your own art" [level=2] [ref=e106]
          - paragraph [ref=e107]: Open the editor with a square mask preset, adjust the crop, choose a border, and export a transparent PNG for your table.
          - button "Open square token maker" [ref=e108]
      - generic [ref=e111]:
        - generic [ref=e112]:
          - paragraph [ref=e113]: Workflow video
          - heading "How to make a square token" [level=2] [ref=e114]
          - paragraph [ref=e115]: The goal is a clean square image that survives small map zoom levels. Start with the subject, then tune the crop, border, and export size.
        - 'button "Load video: How do I Make Tokens for My Online Dungeons and Dragons Game?" [ref=e116]':
          - img "YouTube video cover for making tokens for an online Dungeons and Dragons game" [ref=e117]
          - generic [ref=e119]:
            - generic [ref=e120]: Load video
            - generic [ref=e123]: How do I Make Tokens for My Online Dungeons and Dragons Game?
            - generic [ref=e124]: A practical companion video for users who want to understand the broader online D&D token workflow before exporting square VTT tokens.
      - generic [ref=e125]:
        - article [ref=e126]:
          - generic [ref=e127]: "1"
          - heading "Upload portrait or monster art" [level=2] [ref=e128]
          - paragraph [ref=e129]: Use artwork where the subject is already readable from the waist, shoulders, or head. Square tokens reward a little extra context, so do not crop as tightly as you would for a circular portrait token.
        - article [ref=e130]:
          - generic [ref=e131]: "2"
          - heading "Set a 1:1 square crop" [level=2] [ref=e132]
          - paragraph [ref=e133]: Keep the face near the visual center, then leave enough edge room for hats, horns, weapons, and faction symbols. A square crop can carry more scene detail, but the subject should still win at tabletop scale.
        - article [ref=e134]:
          - generic [ref=e135]: "3"
          - heading "Choose a border and export PNG" [level=2] [ref=e136]
          - paragraph [ref=e137]: Use a thin ring, metal frame, or no border for a card-like look. Export 512 for most live VTT sessions, 1024 for archive quality, and 2048 only when the token is part of a premium pack or long-term asset library.
      - generic [ref=e138]:
        - generic [ref=e139]:
          - heading "Square token settings by VTT workflow" [level=2] [ref=e140]
          - paragraph [ref=e141]: A square token can work across common VTT platforms, but the best export depends on how the token appears on the map.
        - generic [ref=e142]:
          - article [ref=e143]:
            - heading "Roll20 square tokens" [level=3] [ref=e144]
            - paragraph [ref=e145]: Use a transparent PNG when the square frame should sit above the map. Keep the subject centered and avoid tiny labels unless the token is used as a marker rather than a creature portrait.
          - article [ref=e146]:
            - heading "Foundry VTT tokens" [level=3] [ref=e147]
            - paragraph [ref=e148]: Square tokens work well for NPC portraits, vehicles, faction markers, and map objects. Export at 512 or 1024, then tune in Foundry only if the scene uses unusually close zoom levels.
          - article [ref=e149]:
            - heading "Owlbear and lightweight tabletops" [level=3] [ref=e150]
            - paragraph [ref=e151]: For fast prep, use a simpler border and keep file size moderate. Square PNG tokens are especially useful when you want handout-style markers or room labels to align with grid cells.
      - generic [ref=e152]:
        - heading "Square token maker FAQ" [level=2] [ref=e153]
        - generic [ref=e154]:
          - article [ref=e155]:
            - heading "When should I use a square token instead of a circular token?" [level=3] [ref=e156]
            - paragraph: Use a square token when the artwork needs more shoulder, weapon, banner, vehicle, or room-detail context. Circular tokens are better for tight character portraits; square tokens are better for grid markers and prop-heavy art.
          - article [ref=e157]:
            - heading "What size should a square VTT token be?" [level=3] [ref=e158]
            - paragraph: Use 512 for most live table sessions. Use 1024 when you want cleaner archived edges or close zoom. Reserve 2048 for premium packs, print-adjacent output, or long-term libraries.
          - article [ref=e159]:
            - heading "Should square tokens have transparent backgrounds?" [level=3] [ref=e160]
            - paragraph: Usually yes. A transparent PNG keeps the token flexible across Roll20, Foundry VTT, Owlbear, maps, handouts, and character sheets.
          - article [ref=e161]:
            - heading "Can I add borders to square tokens?" [level=3] [ref=e162]
            - paragraph: Yes. Thin borders, metal frames, and flat card-style edges all work. Avoid heavy borders when the original art already has strong edge detail.
    - generic [ref=e164]:
      - generic [ref=e165]:
        - generic [ref=e166]:
          - link "Token Maker home" [ref=e167] [cursor=pointer]:
            - /url: /
            - generic [ref=e169]:
              - generic [ref=e170]: Token Maker
              - generic [ref=e171]: Token Maker
          - paragraph [ref=e172]: Make browser-based DnD and VTT tokens for Roll20, Foundry VTT, Owlbear, and tabletop prep without opening a full image editor.
          - generic [ref=e173]:
            - generic [ref=e174]: Roll20
            - generic [ref=e178]: Foundry VTT
            - generic [ref=e181]: Owlbear
        - navigation "Footer navigation" [ref=e185]:
          - heading "Tools" [level=2] [ref=e191]
          - heading "Learn" [level=2] [ref=e196]
          - heading "Support" [level=2] [ref=e202]
          - list [ref=e203]:
            - listitem [ref=e204]:
              - link "Token Maker" [ref=e205] [cursor=pointer]:
                - /url: /#editor-workspace
            - listitem [ref=e206]:
              - link "Dice Roller" [ref=e207] [cursor=pointer]:
                - /url: /dice-roller-dnd
            - listitem [ref=e208]:
              - link "Coat of Arms Maker" [ref=e209] [cursor=pointer]:
                - /url: /coat-of-arms-maker
          - list [ref=e210]:
            - listitem [ref=e211]:
              - link "Blog" [ref=e212] [cursor=pointer]:
                - /url: /blog
            - listitem [ref=e213]:
              - link "About" [ref=e214] [cursor=pointer]:
                - /url: /about
            - listitem [ref=e215]:
              - link "Changelog" [ref=e216] [cursor=pointer]:
                - /url: /changelog
          - list [ref=e217]:
            - listitem [ref=e218]:
              - link "FAQ" [ref=e219] [cursor=pointer]:
                - /url: /faq
            - listitem [ref=e220]:
              - link "Privacy" [ref=e221] [cursor=pointer]:
                - /url: /privacy
            - listitem [ref=e222]:
              - link "Contact" [ref=e223] [cursor=pointer]:
                - /url: /contact
      - generic [ref=e224]:
        - paragraph [ref=e225]: © 2026 Token Maker. All rights reserved.
        - list [ref=e226]:
          - listitem [ref=e227]:
            - link "Privacy policy" [ref=e228] [cursor=pointer]:
              - /url: /privacy
          - listitem [ref=e229]:
            - link "Contact support" [ref=e230] [cursor=pointer]:
              - /url: /contact
```

# Test source

```ts
  194 |     return;
  195 |   }
  196 |   if (schemaType === 'FAQPage') {
  197 |     assertQuestions(object.mainEntity, `${context}.mainEntity`);
  198 |     return;
  199 |   }
  200 |   requireText(schemaType === 'Article' ? object.headline : object.name, `${context}.name/headline`);
  201 |   requireText(object.description, `${context}.description`);
  202 |   if (schemaType === 'HowTo') {
  203 |     for (const [index, entry] of requireArray(object.step, `${context}.step`).entries()) {
  204 |       const step = requireObject(entry, `${context}.step[${index}]`);
  205 |       expect(step, context).toMatchObject({ '@type': 'HowToStep', position: index + 1 });
  206 |       requireText(step.name, `${context}.step[${index}].name`);
  207 |       requireText(step.text, `${context}.step[${index}].text`);
  208 |     }
  209 |     return;
  210 |   }
  211 |   if (schemaType === 'VideoObject') {
  212 |     expect(requireText(object.embedUrl, context), context).toMatch(/^https:\/\/www\.youtube-nocookie\.com\/embed\/.+/);
  213 |     expect(requireText(object.thumbnailUrl, context), context).toMatch(/^https:\/\/i\.ytimg\.com\//);
  214 |     return;
  215 |   }
  216 |   expect(object.url, context).toBe(canonicalUrl(fixture.route));
  217 |   if (schemaType === 'CollectionPage' || schemaType === 'Article') {
  218 |     expect(object.inLanguage, context).toBe(fixture.locale === 'en' ? 'en-US' : 'zh-CN');
  219 |   }
  220 |   if (schemaType === 'CollectionPage') {
  221 |     expect(object.isPartOf, context).toMatchObject({ '@type': 'WebSite', url: homeUrl });
  222 |   }
  223 |   if (schemaType === 'Article') {
  224 |     requireText(object.datePublished, `${context}.datePublished`);
  225 |     requireText(object.dateModified, `${context}.dateModified`);
  226 |   }
  227 |   if (schemaType === 'SoftwareApplication' || schemaType === 'WebApplication') {
  228 |     expect(object.offers, context).toEqual({ '@type': 'Offer', price: '0', priceCurrency: 'USD' });
  229 |     requireText(object.applicationCategory, `${context}.applicationCategory`);
  230 |     requireArray(object.featureList, `${context}.featureList`).forEach((feature, index) => {
  231 |       requireText(feature, `${context}.featureList[${index}]`);
  232 |     });
  233 |   }
  234 | }
  235 | 
  236 | function assertStructuredData(snapshot: SeoSnapshot, fixture: RouteExpectation, phase: string) {
  237 |   const context = `${fixture.route} ${phase}`;
  238 |   const actualIds = snapshot.scripts.map((script) => script.id);
  239 |   expect(actualIds.sort(), `${context}: exact script IDs, including duplicates`).toEqual(
  240 |     fixture.scripts.map((script) => script.id).sort(),
  241 |   );
  242 |   for (const expected of fixture.scripts) {
  243 |     const script = snapshot.scripts.find((entry) => entry.id === expected.id)!;
  244 |     const scriptContext = `${context} id=${script.id} object=${script.text}`;
  245 |     const root = parseSchema(script.text, scriptContext);
  246 |     expect(root['@context'], scriptContext).toBe('https://schema.org');
  247 |     const objects = root['@graph'] === undefined
  248 |       ? [root]
  249 |       : requireArray(root['@graph'], scriptContext).map((entry) => requireObject(entry, scriptContext));
  250 |     expect(objects.map((object) => object['@type']).sort(), scriptContext).toEqual([...expected.types].sort());
  251 |     for (const object of objects) assertSchemaSemantics(object, fixture, scriptContext);
  252 |   }
  253 | }
  254 | 
  255 | async function confirmHydration(page: Page, locale: SiteLocale) {
  256 |   await page.evaluate(() => window.scrollTo(0, 0));
  257 |   const openLabel = locale === 'en' ? 'Open navigation' : '打开导航';
  258 |   const closeLabel = locale === 'en' ? 'Close navigation' : '关闭导航';
  259 |   await page.getByRole('button', { name: openLabel, exact: true }).click();
  260 |   const dialog = page.getByRole('dialog');
  261 |   await expect(dialog, `${page.url()}: hydrated navigation opens`).toBeVisible();
  262 |   await dialog.getByRole('button', { name: closeLabel, exact: true }).click();
  263 |   await expect(dialog, `${page.url()}: hydrated navigation closes`).toHaveCount(0);
  264 |   await expect(page.getByRole('button', { name: openLabel, exact: true })).toHaveAttribute('aria-expanded', 'false');
  265 | }
  266 | 
  267 | async function readRawHtml(page: Page, route: string) {
  268 |   const response = await page.request.get(route);
  269 |   expect(response.status(), `${route}: raw HTML status`).toBe(200);
  270 |   expect(response.headers()['content-type'], `${route}: raw HTML content type`).toContain('text/html');
  271 |   return page.evaluate(readSeoDocument, await response.text());
  272 | }
  273 | 
  274 | async function assertLoadedRoute(page: Page, fixture: RouteExpectation) {
  275 |   const raw = await readRawHtml(page, fixture.route);
  276 |   assertStructuredData(raw, fixture, 'raw HTML');
  277 |   await confirmHydration(page, fixture.locale);
  278 |   getRuntimeDiagnostics(page).assertNoBlockingMessages(fixture.route);
  279 |   const hydrated = await page.evaluate(readSeoDocument, null);
  280 |   assertStructuredData(hydrated, fixture, 'hydrated DOM');
  281 |   for (const script of raw.scripts) {
  282 |     const current = hydrated.scripts.find((entry) => entry.id === script.id)!;
  283 |     expect(parseSchema(current.text, `${fixture.route} hydrated id=${script.id}`),
  284 |       `${fixture.route}: raw/hydrated object equality id=${script.id}`).toEqual(
  285 |       parseSchema(script.text, `${fixture.route} raw id=${script.id}`),
  286 |     );
  287 |   }
  288 |   return { raw, hydrated };
  289 | }
  290 | 
  291 | async function visitRoute(page: Page, fixture: RouteExpectation) {
  292 |   const diagnostics = getRuntimeDiagnostics(page);
  293 |   diagnostics.trackRoute(fixture.route);
> 294 |   const response = await page.goto(fixture.route, { waitUntil: 'load' });
      |                               ^ Error: page.goto: Test ended.
  295 |   diagnostics.assertNoBlockingMessages(fixture.route);
  296 |   expect(response?.status(), `${fixture.route}: document status`).toBe(200);
  297 |   await expect(page, `${fixture.route}: navigation URL`).toHaveURL(fixture.route);
  298 |   return assertLoadedRoute(page, fixture);
  299 | }
  300 | 
  301 | function contentFixture(locale: SiteLocale, path: string): RouteExpectation {
  302 |   const route = localizedRoute(locale, path);
  303 |   if (path === '/') return { route, locale, scripts: [
  304 |     { id: locale === 'en' ? 'homepage-jsonld' : 'homepage-zh-jsonld', types: ['SoftwareApplication'] },
  305 |   ] };
  306 |   if (path === '/blog') return { route, locale, scripts: [
  307 |     { id: `blog-hub-${locale}-1`, types: ['CollectionPage'] },
  308 |     { id: `blog-hub-breadcrumb-${locale}-1`, types: ['BreadcrumbList'] },
  309 |   ] };
  310 |   if (path === '/faq') return { route, locale, scripts: [
  311 |     { id: `faq-doc-${locale}-collection-jsonld`, types: ['CollectionPage'] },
  312 |     { id: `faq-doc-${locale}-faq-jsonld`, types: ['FAQPage'] },
  313 |     { id: `faq-doc-${locale}-breadcrumb-jsonld`, types: ['BreadcrumbList'] },
  314 |   ] };
  315 |   if (path === `/templates/${templateSlug}`) return { route, locale, scripts: [
  316 |     { id: `template-${locale}-${templateSlug}-jsonld`, types: ['WebApplication', 'HowTo', 'FAQPage', 'VideoObject'] },
  317 |     { id: `template-${locale}-${templateSlug}-breadcrumb-jsonld`, types: ['BreadcrumbList'] },
  318 |   ] };
  319 |   const slug = path.slice('/blog/'.length);
  320 |   const post = path.startsWith('/blog/') ? getBlogPost(locale, slug) : undefined;
  321 |   if (!post) throw new Error(`No published SEO article fixture: locale=${locale}, route=${route}`);
  322 |   return { route, locale, scripts: [
  323 |     { id: `blog-post-${locale}-${slug}`, types: ['Article'] },
  324 |     ...(post.faqItems?.length ? [{ id: `blog-post-faq-${locale}-${slug}`, types: ['FAQPage'] }] : []),
  325 |     { id: `blog-post-breadcrumb-${locale}-${slug}`, types: ['BreadcrumbList'] },
  326 |   ] };
  327 | }
  328 | 
  329 | function categoryFixture(locale: SiteLocale, slug: string, pageNumber: number): RouteExpectation {
  330 |   return { locale, route: categoryRoute(locale, slug, pageNumber), scripts: [
  331 |     { id: `blog-category-${locale}-${slug}`, types: ['CollectionPage'] },
  332 |     { id: `blog-category-breadcrumb-${locale}-${slug}`, types: ['BreadcrumbList'] },
  333 |   ] };
  334 | }
  335 | 
  336 | function assertCategorySignals(
  337 |   snapshot: SeoSnapshot, fixture: RouteExpectation, category: BlogCategoryCopy, pageNumber: number, phase: string,
  338 | ) {
  339 |   const context = `${fixture.route} ${phase}`;
  340 |   const currentUrl = canonicalUrl(fixture.route);
  341 |   expect(snapshot.links.filter((link) => link.rel === 'canonical'), `${context}: canonical`).toEqual([
  342 |     { rel: 'canonical', language: null, href: currentUrl },
  343 |   ]);
  344 |   expect(snapshot.links.filter((link) => link.rel === 'alternate' && link.language)
  345 |     .sort((left, right) => left.language!.localeCompare(right.language!)), `${context}: hreflang`).toEqual([
  346 |     { rel: 'alternate', language: 'en-US', href: canonicalUrl(categoryRoute('en', category.slug, pageNumber)) },
  347 |     { rel: 'alternate', language: 'x-default', href: canonicalUrl(categoryRoute('en', category.slug, pageNumber)) },
  348 |     { rel: 'alternate', language: 'zh-CN', href: canonicalUrl(categoryRoute('zh', category.slug, pageNumber)) },
  349 |   ]);
  350 |   expect(readMeta(snapshot, 'og:url', context), context).toBe(currentUrl);
  351 |   const title = readTitle(snapshot, context);
  352 |   const description = readMeta(snapshot, 'description', context);
  353 |   expect(title, context).toContain(category.label);
  354 |   expect(readMeta(snapshot, 'og:title', context), context).toBe(title);
  355 |   expect(readMeta(snapshot, 'twitter:title', context), context).toBe(title);
  356 |   expect(readMeta(snapshot, 'og:description', context), context).toBe(description);
  357 |   expect(readMeta(snapshot, 'twitter:description', context), context).toBe(description);
  358 |   const firstTitle = `${category.label} | ${getSiteConfig(fixture.locale).name}`;
  359 |   const pageLabel = fixture.locale === 'en' ? `Page ${pageNumber}` : `第 ${pageNumber} 页`;
  360 |   if (pageNumber === 1) {
  361 |     expect(title, context).toBe(firstTitle);
  362 |     expect(description, context).toBe(category.description);
  363 |   } else {
  364 |     expect(title, context).not.toBe(firstTitle);
  365 |     expect(description, context).not.toBe(category.description);
  366 |     expect(title, context).toContain(pageLabel);
  367 |     expect(description, context).toContain(pageLabel);
  368 |   }
  369 |   const collectionScript = snapshot.scripts.find((script) => script.id === `blog-category-${fixture.locale}-${category.slug}`)!;
  370 |   const collection = parseSchema(collectionScript.text, `${context} id=${collectionScript.id}`);
  371 |   expect(collection.description, context).toBe(description);
  372 |   expect(title, context).toBe(`${requireText(collection.name, context)} | ${getSiteConfig(fixture.locale).name}`);
  373 |   const breadcrumbScript = snapshot.scripts.find((script) => script.id === `blog-category-breadcrumb-${fixture.locale}-${category.slug}`)!;
  374 |   const breadcrumb = parseSchema(breadcrumbScript.text, `${context} id=${breadcrumbScript.id}`);
  375 |   const items = requireArray(breadcrumb.itemListElement, context).map((entry) => requireObject(entry, context));
  376 |   expect(items.map((item) => item.item), `${context}: breadcrumb URL sequence`).toEqual([
  377 |     canonicalUrl(localizedRoute(fixture.locale, '/')),
  378 |     canonicalUrl(localizedRoute(fixture.locale, '/blog')),
  379 |     canonicalUrl(categoryRoute(fixture.locale, category.slug, 1)),
  380 |     ...(pageNumber > 1 ? [currentUrl] : []),
  381 |   ]);
  382 |   expect(items.at(-1)?.name, context).toBe(pageNumber === 1 ? category.label : pageLabel);
  383 | }
  384 | 
  385 | async function navigateClient(page: Page, fixture: RouteExpectation) {
  386 |   const diagnostics = getRuntimeDiagnostics(page);
  387 |   diagnostics.trackRoute(fixture.route);
  388 |   const marker = randomUUID();
  389 |   // A DOM attribute would also survive some full-document cache restorations;
  390 |   // this in-memory property must survive the actual link click in this document.
  391 |   await page.evaluate((value) => { Object.assign(window, { __seoNavigationMarker: value }); }, marker);
  392 |   await page.locator(`a[href="${fixture.route}"]:visible`).first().click();
  393 |   await expect(page, `${fixture.route}: client URL`).toHaveURL(fixture.route);
  394 |   await expect(page.locator(`script[id="${fixture.scripts[0].id}"][type="application/ld+json"]`)).toHaveCount(1);
```