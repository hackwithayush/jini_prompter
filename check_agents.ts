import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const agents = await prisma.agent.findMany({ where: { isTemplate: true } });
  console.log('Template Agents:', agents.length);
  console.log(agents.map(a => a.name));
}
main();
