import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="px-6 pb-8 pt-4 md:px-12 lg:px-16">
      <Link
        className="text-xs tracking-widest uppercase text-muted-foreground transition-opacity hover:opacity-60"
        href="/privacy"
      >
        Privacy
      </Link>
    </footer>
  )
}
