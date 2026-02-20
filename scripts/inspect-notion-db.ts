import { Client } from "@notionhq/client"

const notion = new Client({ auth: process.env.NOTION_API_KEY })

async function main() {
  const db = await notion.databases.retrieve({
    database_id: process.env.NOTION_ARTWORK_DATABASE_ID!,
  })
  console.log("Artwork DB properties:")
  for (const [name, prop] of Object.entries(db.properties)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const extra = prop.type === "select" ? ` — options: ${(prop as any).select.options.map((o: any) => o.name).join(", ")}` : ""
    console.log(`  "${name}": ${prop.type}${extra}`)
  }
}

main().catch(console.error)
