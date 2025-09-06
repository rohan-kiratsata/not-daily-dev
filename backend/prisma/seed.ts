import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // Create sources
  const sources = await prisma.source.createMany({
    data: [
      {
        name: "Hacker News",
        url: "https://news.ycombinator.com",
        feedUrl: "https://hnrss.org/frontpage",
      },
      {
        name: "Dev.to",
        url: "https://dev.to",
        feedUrl: "https://dev.to/feed",
      },
      {
        name: "CSS-Tricks",
        url: "https://css-tricks.com",
        feedUrl: "https://css-tricks.com/feed/",
      },
    ],
    skipDuplicates: true,
  });

  console.log(`Created ${sources.count} sources`);
  console.log("Database seed completed!");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
