-- CreateTable
CREATE TABLE "ShopCustomization" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bannerImage" TEXT,
    "bannerLink" TEXT,
    "bannerText" TEXT,
    "featuredProducts" TEXT[],
    "productLayout" TEXT NOT NULL DEFAULT 'grid',
    "accentColor" TEXT NOT NULL DEFAULT '#6366f1',
    "showPrice" BOOLEAN NOT NULL DEFAULT true,
    "showDescription" BOOLEAN NOT NULL DEFAULT true,
    "showThumbnails" BOOLEAN NOT NULL DEFAULT true,
    "customCss" TEXT,
    "customJs" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShopCustomization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShopCustomization_userId_key" ON "ShopCustomization"("userId");

-- AddForeignKey
ALTER TABLE "ShopCustomization" ADD CONSTRAINT "ShopCustomization_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
