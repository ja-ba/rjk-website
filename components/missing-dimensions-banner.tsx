import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { Artwork } from "@/lib/artwork-data"
import { hasDimensions } from "@/lib/types"

interface MissingDimensionsBannerProps {
  artworks: Artwork[]
}

function artworkLabel(a: Artwork): string {
  const filename = a.src.split("/").pop()
  return a.title || (filename ? `Untitled (${filename})` : "Untitled")
}

/**
 * Renders a warning banner when artworks are missing required metadata
 * (filename, Aspect Width, or Aspect Height). Only visible on non-production
 * builds — on production the build gate in download-notion-images.ts fails
 * before deployment.
 */
export function MissingDimensionsBanner({ artworks }: MissingDimensionsBannerProps) {
  // Entries without a filename (src will be "" — the primary issue)
  const missingFilenames = artworks.filter((a) => !a.src)
  // Entries with a filename but missing dimensions (excludes no-filename
  // entries so an artwork isn't listed under both problems)
  const missingDimensions = artworks.filter((a) => a.src && !hasDimensions(a))

  if (missingFilenames.length === 0 && missingDimensions.length === 0) return null
  if (process.env.BUILD_ENV === "production") return null

  return (
    <Alert variant="destructive" className="mb-8">
      <AlertTitle>Incomplete artwork entries</AlertTitle>
      <AlertDescription>
        {missingFilenames.length > 0 && (
          <>
            <p className="mb-2">
              The following artworks are missing a <strong>filename</strong> in
              Notion and cannot be displayed in the gallery:
            </p>
            <ul className="list-disc list-inside space-y-1 mb-4">
              {missingFilenames.map((a) => (
                <li key={a.id}>
                  <strong>{artworkLabel(a)}</strong> — {a.category}
                  {!a.title && (
                    <span className="text-muted-foreground">
                      {" "}
                      (Notion id: <code>{a.id}</code>)
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-1 mb-4 text-muted-foreground">
              Set the <code>filename</code> text property in the Notion artwork
              database to resolve.
            </p>
          </>
        )}

        {missingDimensions.length > 0 && (
          <>
            <p className="mb-2">
              The following artworks are missing{" "}
              <strong>Aspect Width</strong> and/or{" "}
              <strong>Aspect Height</strong> in Notion and cannot be displayed in
              the gallery:
            </p>
            <ul className="list-disc list-inside space-y-1">
              {missingDimensions.map((a) => (
                <li key={a.id}>
                  <strong>{artworkLabel(a)}</strong> — {a.category}
                  {!a.title && (
                    <span className="text-muted-foreground">
                      {" "}
                      (Notion id: <code>{a.id}</code>)
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-muted-foreground">
              Set <code>Aspect Width</code> and <code>Aspect Height</code> number
              properties in the Notion artwork database to resolve.
            </p>
          </>
        )}
      </AlertDescription>
    </Alert>
  )
}
