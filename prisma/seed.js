import { PrismaClient } from "@prisma/client";
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data to avoid unique constraint errors during re-seeding
  await prisma.coupon.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.catSubCategory.deleteMany();
  await prisma.subCategory.deleteMany();
  await prisma.category.deleteMany();



  // 1. Create 3 Categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Men' } }),
    prisma.category.create({ data: { name: 'Women' } }),
    prisma.category.create({ data: { name: 'Kids' } }),
  ]);

  // 2. Create several Subcategories
  const subCatNames = ['T-Shirts', 'Hoodies', 'Jeans', 'Shoes', 'Accessories', 'Dresses'];
  const subCategories = await Promise.all(
    subCatNames.map(name => prisma.subCategory.create({ data: { name } }))
  );

  // 3. Create the Bridge (CatSubCategory) pairings
  // We'll pair each category with a few subcategories
  const bridges = [];
  for (const cat of categories) {
    // Give each category 4 random subcategories
    const shuffled = subCategories.sort(() => 0.5 - Math.random()).slice(0, 4);
    for (const sub of shuffled) {
      const bridge = await prisma.catSubCategory.create({
        data: {
          categoryId: cat.id,
          subCategoryId: sub.id,
        },
      });
      bridges.push(bridge);
    }
  }

  

  // 4. Create 100 Products
  for (let i = 0; i < 100; i++) {
    const randomBridge = bridges[Math.floor(Math.random() * bridges.length)];
    const basePrice = parseFloat(
      faker.commerce.price({ min: 20, max: 200 })
    );

    // Pick 3 colors for this product
    const colors = [
      faker.color.human(),
      faker.color.human(),
      faker.color.human(),
    ];

    // Remove duplicate colors if Faker generates the same one twice
    const uniqueColors = [...new Set(colors)];

    const sizes = ["S", "M", "L"];

    const variants = [];

    for (const color of uniqueColors) {
      // Each color has a small price difference
      const colorPrice =
        basePrice + faker.number.int({ min: 0, max: 20 });

      for (const size of sizes) {
        variants.push({
          color,
          size,
          price: size === "L" ? colorPrice + 5 : colorPrice,
          stock: faker.number.int({ min: 50, max: 500 }),
        });
      }
    }

    await prisma.product.create({
      data: {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        imageURL:`https://picsum.photos/id/${faker.number.int({ min: 10, max: 99 })}/400/500`,
        //we removed stock from product to variant
        categoryId: randomBridge.categoryId,
        subCategoryId: randomBridge.subCategoryId,
        // Every product needs a few variants (Sizes/Colors)
        variants: {
          create: variants,
        },
      },
    });
  }



  // 5. Create 3 Coupons
  await prisma.coupon.createMany({
    data: [
      { code: 'WELCOME10', discount: 10.0, expiresAt: faker.date.future() },
      { code: 'WINTER25', discount: 25.0, expiresAt: faker.date.future() },
      { code: 'FREESHIP', discount: 5.0, expiresAt: faker.date.future() },
    ],
  });

  console.log("Database seeded successfully! 🌱");
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });