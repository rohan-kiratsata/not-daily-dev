import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "./generated/prisma";
import { fetchFeeds } from "./fetcher";

dotenv.config();
const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post("/cron/fetch-feeds", async (req, res) => {
  try {
    console.log("Cron: fetching feeds...");
    await fetchFeeds();
    console.log("Cron: feeds fetched successfully");
    res.json({ success: true, message: "Feeds fetched successfully" });
  } catch (error) {
    console.error("Cron: error fetching feeds:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/v1/feed", async (req, res) => {
  await fetchFeeds();
  const limit = parseInt(req.query.limit) || 20;
  const articles = await prisma.article.findMany({
    take: limit,
    orderBy: {
      publishedAt: "desc",
    },
    include: {
      source: {
        select: {
          name: true,
          url: true,
        },
      },
    },
  });

  const formattedArticles = articles.map((article) => ({
    id: article.id.toString(),
    url: article.url,
    title: article.title,
    summary: article.summary,
    published_at: article.publishedAt,
    source_name: article.source?.name,
    source_url: article.source?.url,
  }));

  res.json(formattedArticles);
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});
