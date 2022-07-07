import 'dotenv/config'
import moment from 'moment';
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

export async function createPage(databaseID, icon, title, project, urgency) {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const response = await notion.pages.create({
    parent: {
      type: "database_id",
      database_id: databaseID,
    },
    icon: {
      type: "emoji",
      emoji: icon
    },
    properties: {
      "title": {
        "title": [
          {
            "type": "text",
            "text": {
              "content": title
            }
          }
        ]
      },
      "Project": {
        "select": {
          "name": project
        }
      },
      "Deadline": {
        "date": {
          "start": moment().format()
        }
      },
      "Urgency": {
        "select": {
          "name": urgency
        }
      }
    },
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

export async function getProjectIcon(projectName) {
  const response = await search({ query: projectName, filter: { value: "page", property: "object" } })
  const project = response.results.filter((result) => result.properties.Project.select.name == projectName)
  return project[0].icon.emoji;
}

export async function getPage(pageID) {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const response = await notion.pages.retrieve({ page_id: pageID });
  return response
}

// const db = await getDatabase("Tasks")
// const dbID = db[0].id
// const template = await getPage("cac26f29-f2f2-4353-852d-1a9835556e01")