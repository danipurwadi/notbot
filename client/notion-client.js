import 'dotenv/config'
import { Client } from "@notionhq/client";

export async function search(params) {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const response = await notion.search({
    query: params.query,
  });
  return response
}

export async function getDatabase(databaseName) {
  const databases = await search({ query: databaseName });
  return databases.results.filter((result) => result.object == "database")
}

console.log(await getDatabase("projects"))