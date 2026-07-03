import { hasDimensions } from "../lib/types"

export interface ValidationEntry {
  title: string
  filename: string
  category: string
  width: number
  height: number
}

export function findMissingFilenames(entries: ValidationEntry[]): ValidationEntry[] {
  return entries.filter((e) => !e.filename)
}

export function findMissingDimensions(entries: ValidationEntry[]): ValidationEntry[] {
  return entries.filter((e) => !hasDimensions(e))
}

export function shouldFailBuild(
  missingFilenames: number,
  missingDimensions: number,
  buildEnv: string | undefined
): boolean {
  if (buildEnv !== "production") return false
  return missingFilenames > 0 || missingDimensions > 0
}
