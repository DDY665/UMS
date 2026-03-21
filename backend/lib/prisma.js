const { PrismaClient } = require("@prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);

const prisma = new PrismaClient({
  adapter,
  log: ["error"] 
});

module.exports = prisma;