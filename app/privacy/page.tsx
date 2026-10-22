import type { Metadata } from 'next'

import { Navigation } from '@/components/navigation'

export const metadata: Metadata = {
  title: 'Privacy | Rebecca Kleinberg',
  description: 'Privacy information for Rebecca Kleinberg’s portfolio website.',
}

export default function PrivacyPage() {
  return (
    <>
      <Navigation />
      <main className="max-w-3xl px-6 pb-16 pt-24 md:px-12 lg:px-16">
        <h1 className="font-serif text-3xl text-foreground md:text-4xl">Privacy</h1>

        <div className="mt-10 space-y-10 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="font-serif text-xl text-foreground">Overview</h2>
            <p className="mt-3">
              This portfolio is operated by Rebecca Kleinberg. This page explains how the
              site currently handles information when you visit it.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground">Hosting</h2>
            <p className="mt-3">
              The site is hosted by Vercel. Vercel processes the technical request
              information needed to deliver and protect the site, such as network and
              device information.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground">Website analytics</h2>
            <p className="mt-3">
              This site uses Vercel Web Analytics to understand aggregate traffic to the
              public website. It may collect page and route information, referrer,
              approximate location, browser, operating system, device type, and time of
              visit. Analytics is enabled only for rebecca-kleinberg.com and
              www.rebecca-kleinberg.com.
            </p>
            <p className="mt-3">
              Vercel Web Analytics does not use analytics cookies or track visitors
              across websites. Vercel uses a short-lived daily hash to count visitors in
              aggregate. This site does not send custom analytics events or use analytics
              for advertising.
            </p>
            <p className="mt-3">
              Learn more in{' '}
              <a
                className="underline underline-offset-4 transition-opacity hover:opacity-70"
                href="https://vercel.com/legal/privacy-notice"
                rel="noreferrer"
                target="_blank"
              >
                Vercel&apos;s Privacy Notice
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground">Browser storage</h2>
            <p className="mt-3">
              On mobile devices, the About page stores a sessionStorage value named{' '}
              <code>rjk-mobile-menu-intro-seen-v1</code> after the introductory menu has
              appeared. This value only prevents the menu from automatically reopening in
              the same browser tab and is not used for analytics.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground">External links</h2>
            <p className="mt-3">
              The site links to Instagram. If you follow that link, Instagram&apos;s privacy
              practices apply to your use of its service.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground">Questions</h2>
            <p className="mt-3">
              For privacy questions, email{' '}
              <a
                className="underline underline-offset-4 transition-opacity hover:opacity-70"
                href="mailto:privacy@rebecca-kleinberg.com"
              >
                privacy@rebecca-kleinberg.com
              </a>
              .
            </p>
          </section>

          <p className="text-xs tracking-wide">Last updated: July 31, 2026</p>
        </div>
      </main>
    </>
  )
}
