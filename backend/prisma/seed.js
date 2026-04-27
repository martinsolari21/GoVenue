const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding GoVenue...');

  // Deportes
  const deportes = ['Fútbol', 'Pádel', 'Tenis', 'Hockey', 'Básquet'];
  for (const nombre of deportes) {
    await prisma.deporte.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });
  }
  console.log('✅ Deportes cargados');

  // Localidades AMBA
  const localidades = [
    { nombre: 'CABA', zona: 'CABA' },
    { nombre: 'San Isidro', zona: 'GBA Norte' },
    { nombre: 'Vicente López', zona: 'GBA Norte' },
    { nombre: 'Tigre', zona: 'GBA Norte' },
    { nombre: 'San Martín', zona: 'GBA Oeste' },
    { nombre: 'Morón', zona: 'GBA Oeste' },
    { nombre: 'La Matanza', zona: 'GBA Oeste' },
    { nombre: 'Lanús', zona: 'GBA Sur' },
    { nombre: 'Quilmes', zona: 'GBA Sur' },
    { nombre: 'Avellaneda', zona: 'GBA Sur' },
  ];
  for (const loc of localidades) {
    await prisma.localidad.upsert({
      where: { id: localidades.indexOf(loc) + 1 },
      update: {},
      create: loc,
    });
  }
  console.log('✅ Localidades cargadas');

  console.log('🎉 Seed completado');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
