import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import pg from "pg";

const connectionString = process.env.DATABASE_URL ?? "";
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const discordId = process.argv[2];

    if (!discordId) {
        console.error("Please provide a Discord ID as an argument");
        console.log("Usage: bun prisma/seed.ts <DISCORD_ID>");
        process.exit(1);
    }

    const user = await prisma.user.upsert({
        where: { discordId },
        update: {},
        create: {
            discordId,
        },
    });

    console.log("✅ User added/updated:", user);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
