# Privacy Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a current-behavior privacy notice and provide a site-wide route to it.

**Architecture:** Add a static `/privacy` route that reuses the established navigation and page styling. Add a minimal server-rendered footer in the root layout so the privacy route remains discoverable without changing the main navigation.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS, Vitest, React Testing Library.

## Global Constraints

- Describe only the site behavior currently implemented in this repository.
- Publish `privacy@rebecca-kleinberg.com` as the privacy contact address.
- Keep primary navigation unchanged; the footer contains the only new site-wide link.
- Do not add cookies, consent management, analytics events, or dependencies.

---

### Task 1: Privacy page

**Files:**
- Create: `app/privacy/page.tsx`
- Create: `app/privacy/__tests__/page.test.tsx`

**Interfaces:**
- Consumes: `Navigation` from `@/components/navigation`.
- Produces: the public `/privacy` route with a page title, contact link, and Vercel policy link.

- [ ] **Step 1: Write the failing test**

```tsx
it('publishes the privacy contact address', () => {
  render(<PrivacyPage />)

  expect(screen.getByRole('link', { name: 'privacy@rebecca-kleinberg.com' }))
    .toHaveAttribute('href', 'mailto:privacy@rebecca-kleinberg.com')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test app/privacy/__tests__/page.test.tsx`

Expected: FAIL because `app/privacy/page.tsx` does not exist.

- [ ] **Step 3: Write minimal implementation**

```tsx
export default function PrivacyPage() {
  return (
    <>
      <Navigation />
      <main>{/* current-behavior privacy notice */}</main>
    </>
  )
}
```

Include the Vercel-hosting, Vercel Analytics, session-storage, external-link, and contact sections specified in the design.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test app/privacy/__tests__/page.test.tsx`

Expected: PASS.

### Task 2: Site-wide footer link

**Files:**
- Create: `components/site-footer.tsx`
- Create: `components/__tests__/site-footer.test.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/__tests__/layout.test.tsx`

**Interfaces:**
- Consumes: Next.js `Link`.
- Produces: `SiteFooter`, rendered once by `RootLayout` after page content.

- [ ] **Step 1: Write the failing test**

```tsx
it('links to the privacy page', () => {
  render(<SiteFooter />)

  expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test components/__tests__/site-footer.test.tsx`

Expected: FAIL because `components/site-footer.tsx` does not exist.

- [ ] **Step 3: Write minimal implementation**

```tsx
export function SiteFooter() {
  return <footer><Link href="/privacy">Privacy</Link></footer>
}
```

Render `<SiteFooter />` once in `RootLayout`, after `{children}` and before `<PublicAnalytics />`.

- [ ] **Step 4: Run focused tests**

Run: `pnpm test components/__tests__/site-footer.test.tsx app/__tests__/layout.test.tsx`

Expected: PASS.

### Task 3: Verify and commit

**Files:**
- Modify: only the files above and the approved design/plan documents.

- [ ] **Step 1: Run static checks**

Run: `pnpm lint`

Expected: exit code 0.

- [ ] **Step 2: Run full tests**

Run: `pnpm test`

Expected: all test files and tests pass.

- [ ] **Step 3: Build the production application**

Run: `pnpm build`

Expected: exit code 0.

- [ ] **Step 4: Inspect the diff and commit the feature**

Run:

```bash
git diff --check
git add app/privacy components/site-footer.tsx components/__tests__/site-footer.test.tsx app/layout.tsx app/__tests__/layout.test.tsx docs/superpowers/specs/2026-07-31-privacy-page-design.md docs/superpowers/plans/2026-07-31-privacy-page.md
git commit -m "feat(privacy-page): add privacy notice"
```

Expected: a single commit containing only the privacy-page feature, tests, and its approved documentation.
