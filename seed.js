const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const { faker } = require("@faker-js/faker");

const manufacturers = ["Toyota", "Honda", "Ford", "BMW", "Mercedes", "Tesla"];

const getRandomManufacturer = () => manufacturers[Math.floor(Math.random() * manufacturers.length)];

const generateVehicles = (count) => {
  return Array.from({ length: count }, () => {
    const custom_name = faker.vehicle.vehicle();
    const license_plate = faker.string.alphanumeric(7).toUpperCase();
    const vin = faker.vehicle.vin();
    const manufacturer = getRandomManufacturer();
    const slug = `${custom_name}-${license_plate}`.toLowerCase().replace(/\s+/g, "-");

    return { custom_name, license_plate, manufacturer, vin, slug };
  });
};

const seedDatabase = async () => {
  const db = await open({ filename: "./vehicles.db", driver: sqlite3.Database });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      license_plate TEXT UNIQUE NOT NULL,
      manufacturer TEXT NOT NULL,
      vin TEXT UNIQUE NOT NULL,
      custom_name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL
    );
  `);

  const vehicles = generateVehicles(20);

  const insertStmt = await db.prepare(`
    INSERT INTO vehicles (license_plate, manufacturer, vin, custom_name, slug)
    VALUES (?, ?, ?, ?, ?)
  `);

  for (const vehicle of vehicles) {
    try {
      await insertStmt.run(vehicle.license_plate, vehicle.manufacturer, vehicle.vin, vehicle.custom_name, vehicle.slug);
    } catch (error) {
      console.error(`Error inserting vehicle: ${vehicle.license_plate}`, error.message);
    }
  }

  await insertStmt.finalize();
  console.log("Database successfully populated");

  await db.close();
};

seedDatabase().catch((err) => console.error("Error seeding database:", err));
