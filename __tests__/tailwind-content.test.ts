import { execFileSync } from "node:child_process"
import { mkdtempSync, readFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

const projectRoot = join(import.meta.dirname, "..")

describe("Tailwind content discovery", () => {
  it("emits the Notion renderer's indentation and mobile image-size utilities", () => {
    const directory = mkdtempSync(join(tmpdir(), "rjk-tailwind-"))
    const outputFile = join(directory, "output.css")

    try {
      execFileSync(
        "pnpm",
        ["exec", "tailwindcss", "-i", "app/globals.css", "-o", outputFile],
        { cwd: projectRoot, stdio: "pipe" }
      )

      const css = readFileSync(outputFile, "utf8")
      expect(css).toMatch(/\.ml-4\s*\{[^}]*margin-left:\s*1rem/)
      expect(css).toMatch(/\.ml-6\s*\{[^}]*margin-left:\s*1.5rem/)
      expect(css).toMatch(/figure\[data-image-size="x-small"\]\s*\{\s*width:\s*30%/)
      expect(css).toMatch(/figure\[data-image-size="small"\]\s*\{\s*width:\s*50%/)
      expect(css).toMatch(/figure\[data-image-size="medium"\]\s*\{\s*width:\s*70%/)
      expect(css).toMatch(/figure\[data-image-size="large"\]\s*\{\s*width:\s*85%/)
    } finally {
      rmSync(directory, { recursive: true, force: true })
    }
  })
})
