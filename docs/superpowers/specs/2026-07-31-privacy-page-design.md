# Privacy Page Design

## Goal

Publish a concise, accurate privacy notice for Rebecca Kleinberg's portfolio and make it available from every public page.

## Scope

The notice describes current behavior only:

- Vercel hosting and the technical request data it processes to serve the site.
- Vercel Web Analytics, enabled only for production builds and restricted to `rebecca-kleinberg.com` and `www.rebecca-kleinberg.com`.
- The mobile About-page session-storage marker, which prevents the introductory menu from reopening in the same tab.
- Instagram as an external service after a visitor follows its link.

The page identifies Rebecca Kleinberg as the operator, provides `privacy@rebecca-kleinberg.com` for questions, links to Vercel's privacy notice, and shows its last-updated date. It makes no claims about future services and includes no consent banner or settings UI.

## Architecture

Create `app/privacy/page.tsx` as a static page that renders the existing `Navigation` component and uses the existing page typography and spacing. Add a small `SiteFooter` server component with one `/privacy` link, rendered from `app/layout.tsx` so it appears after every page's content without changing the primary navigation.

## Verification

Add page tests that assert the page's title, public privacy contact, and Vercel notice link. Add a footer test for its accessible Privacy link, then update the root-layout test to assert the footer is included once. Run the focused tests, then the full Vitest suite, lint, and a production build.
