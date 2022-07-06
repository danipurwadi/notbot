import 'dotenv/config'
import { Client } from "@notionhq/client";

export async function search(params) {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const response = await notion.search(params);
  return response
}

export async function getAllDatabases() {
  const response = await search(null);
  return response.results.filter((result) => result.object == "database")
}

export async function getDatabase(databaseName) {
  const response = await search({ query: databaseName });
  return response.results.filter((result) => result.object == "database")
}

export async function createEntry(databaseID, icon, properties, blocks) {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const response = await notion.pages.create({
    parent: {
      database_id: databaseID,
    },
    icon: icon,
    properties: properties,
    children: blocks,
  });
  return response
}
