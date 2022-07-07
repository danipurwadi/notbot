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

export async function getDatabasePages(databaseID, filter, sorts) {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const response = await notion.databases.query({
    database_id: databaseID,
    filter: filter,
    sorts: sorts,
  });
  return response
}

export async function getTasksDueToday() {
  const tasksDatabase = await getDatabase("Tasks");
  const databaseID = tasksDatabase[0].id;
  const filter = {
    property: "Deadline",
    date: {
      on_or_before: new Date().toISOString()
    }
  }
  const sorts = [
    {
      property: 'Urgency',
      direction: 'descending',
    },
  ]
  const response = await getDatabasePages(databaseID, filter, sorts);
  return response.results.filter((result) => result.object == "page" && result.properties.Status.status.name != "Done")
}
