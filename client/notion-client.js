import 'dotenv/config'
import { Client } from "@notionhq/client";

export async function search(params) {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const response = await notion.search({
    query: params.query,
    sort: {
      direction: 'ascending',
      timestamp: 'last_edited_time',
    },
  });
  console.log(response);
  return response
}

await search({ query: "task" });