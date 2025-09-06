import Parser from "rss-parser";
import { PrismaClient } from "./generated/prisma";

const prisma = new PrismaClient();
const parser = new Parser();

export async function fetchFeeds() {
  const sources = await prisma.source.findMany();
  console.log(`Found ${sources.length} sources`);

  for (const source of sources) {
    try {
      const feed = await parser.parseURL(source.feedUrl);
      console.log(`Found ${feed.items.length} items in ${source.name}`);
      for (const item of feed.items) {
        const url = item.link;
        const title = item.title;
        const summary = item.contentSnippet || item.content;
        const published_at = item.isoDate || item.pubDate;

        await prisma.article.upsert({
          where: { url: url },
          update: {
            title,
            summary,
            publishedAt: published_at,
          },
          create: {
            sourceId: source.id,
            url: url,
            title,
            summary,
            publishedAt: published_at,
          },
        });
      }
      await prisma.source.update({
        where: { id: source.id },
        data: { lastFetched: new Date() },
      });

      console.log(`Fetched ${source.name}`);
    } catch (err) {
      console.error(`Failed ${source.name}`, err.message);
    }
  }
}
