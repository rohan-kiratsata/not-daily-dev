-- CreateTable
CREATE TABLE "public"."sources" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "feed_url" TEXT NOT NULL,
    "last_fetched" TIMESTAMPTZ,

    CONSTRAINT "sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."articles" (
    "id" BIGSERIAL NOT NULL,
    "source_id" INTEGER,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "summary" TEXT,
    "published_at" TIMESTAMPTZ,
    "fetched_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sources_feed_url_key" ON "public"."sources"("feed_url");

-- CreateIndex
CREATE UNIQUE INDEX "articles_url_key" ON "public"."articles"("url");

-- AddForeignKey
ALTER TABLE "public"."articles" ADD CONSTRAINT "articles_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE SET NULL ON UPDATE CASCADE;
