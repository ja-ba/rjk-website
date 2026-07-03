import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { Artwork } from "@/lib/artwork-data"

interface MissingDimensionsBannerProps {
  artworks: Artwork[]
}

/**
 * Renders a warning banner when artworks are missing Aspect Width / Aspect Height
 * (both set to 0). Only visible on non-production builds — on production the
 * build gate in download-notion-images.ts fails before deployment.
 */
export function MissingDimensionsBanner({ artworks }: MissingDimensionsBannerProps) {
  const missing = artworks.filter((a) => a.width === 0 || a.height === 0)
  if (missing.length === 0) return null
  if (process.env.BUILD_ENV === "production") return null

  return (
    <Alert variant="destructive" className="mb-8">
      <AlertTitle>Missing artwork dimensions</AlertTitle>
      <AlertDescription>
        <p className="mb-2">
          The following artworks are missing <strong>Aspect Width</strong> and/or{" "}
          <strong>Aspect Height</strong> in Notion and cannot be displayed in the
          gallery:
        </p>
        <ul className="list-disc list-inside space-y-1">
          {missing.map((a) => (
            <li key={a.id}>
              <strong>{a.title}</strong> — {a.category}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-muted-foreground">
          Set <code>Aspect Width</code> and <code>Aspect Height</code> number
          properties in the Notion artwork database to resolve.
        </p>
      </AlertDescription>
    </Alert>
  )
}
