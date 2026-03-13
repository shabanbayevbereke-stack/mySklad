import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../user/user.entity';
import { Warehouse } from '../warehouse/warehouse.entity';
import { Cargo, CargoType } from '../warehouse/cargo.entity';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function seed() {
  // Ensure password is always a string
  const dbPassword = process.env.DB_PASSWORD;
  const password = dbPassword != null ? String(dbPassword) : '';

  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: password,
    database: process.env.DB_DATABASE || 'warehouse',
    entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('Database connection established');

    const userRepository = dataSource.getRepository(User);
    const warehouseRepository = dataSource.getRepository(Warehouse);
    const cargoRepository = dataSource.getRepository(Cargo);

    // Clear existing data (using CASCADE to handle foreign key constraints)
    console.log('Clearing existing data...');
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      // Clear in order: cargo first (has FK to warehouses), then warehouses, then users
      await queryRunner.query('TRUNCATE TABLE "cargo" CASCADE');
      await queryRunner.query('TRUNCATE TABLE "warehouses" CASCADE');
      await queryRunner.query('TRUNCATE TABLE "users" CASCADE');
    } finally {
      await queryRunner.release();
    }

    // Seed Users
    console.log('Seeding users...');
    const users = [
      {
        email: 'admin@warehouse.com',
        password: await bcrypt.hash('admin123', 10),
        firstName: 'Иван',
        lastName: 'Иванов',
        middleName: 'Иванович',
        position: 'Главный менеджер',
        department: 'Управление',
        role: UserRole.MANAGER,
        isActive: true,
      },
      {
        email: 'manager1@warehouse.com',
        password: await bcrypt.hash('manager123', 10),
        firstName: 'Петр',
        lastName: 'Петров',
        middleName: 'Петрович',
        position: 'Менеджер склада',
        department: 'Склад №1',
        role: UserRole.MANAGER,
        isActive: true,
      },
      {
        email: 'manager2@warehouse.com',
        password: await bcrypt.hash('manager123', 10),
        firstName: 'Мария',
        lastName: 'Сидорова',
        middleName: 'Сергеевна',
        position: 'Менеджер склада',
        department: 'Склад №2',
        role: UserRole.MANAGER,
        isActive: true,
      },
      {
        email: 'test@warehouse.com',
        password: await bcrypt.hash('test123', 10),
        firstName: 'Тест',
        lastName: 'Тестов',
        position: 'Тестовый пользователь',
        department: 'Тестирование',
        role: UserRole.MANAGER,
        isActive: true,
      },
    ];

    const savedUsers = await userRepository.save(users);
    console.log(`Created ${savedUsers.length} users`);

    // Seed Warehouses
    console.log('Seeding warehouses...');
    const warehouses = [
      {
        x: 100,
        y: 100,
        z: 10,
        name: 'Склад №1 - Основной',
        description:
          'Главный склад компании, расположен в центральной части города',
      },
      {
        x: 200,
        y: 150,
        z: 12,
        name: 'Склад №2 - Северный',
        description: 'Склад для хранения крупногабаритных грузов',
      },
      {
        x: 150,
        y: 200,
        z: 8,
        name: 'Склад №3 - Южный',
        description: 'Склад для хранения скоропортящихся товаров',
      },
      {
        x: 80,
        y: 80,
        z: 15,
        name: 'Склад №4 - Западный',
        description: 'Склад для хранения контейнеров',
      },
      {
        x: 250,
        y: 100,
        z: 10,
        name: 'Склад №5 - Восточный',
        description: 'Склад для временного хранения',
      },
    ];

    const savedWarehouses = await warehouseRepository.save(warehouses);
    console.log(`Created ${savedWarehouses.length} warehouses`);

    // Seed Cargo
    console.log('Seeding cargo...');
    const cargoItems: Partial<Cargo>[] = [];

    // Cargo for Warehouse 1
    for (let i = 0; i < 10; i++) {
      const netWeight = Math.round((Math.random() * 500 + 50) * 100) / 100;
      const packWeight = Math.round((Math.random() * 50 + 5) * 100) / 100;
      const totalWeight = netWeight + packWeight;

      cargoItems.push({
        guid: `WH1-CARGO-${String(i + 1).padStart(3, '0')}`,
        warehouseId: savedWarehouses[0].id,
        type: CargoType.CARGO,
        name: `Груз ${i + 1} - Склад 1`,
        description: `Описание груза ${i + 1} на складе №1`,
        netWeight,
        packWeight,
        totalWeight,
        maxLoadWeight:
          i % 3 === 0 ? Math.round(totalWeight * 1.5 * 100) / 100 : null,
        sizeX: Math.floor(Math.random() * 200 + 50),
        sizeY: Math.floor(Math.random() * 200 + 50),
        sizeZ: Math.floor(Math.random() * 200 + 50),
        containSizeX: i % 2 === 0 ? Math.floor(Math.random() * 150 + 30) : null,
        containSizeY: i % 2 === 0 ? Math.floor(Math.random() * 150 + 30) : null,
        containSizeZ: i % 2 === 0 ? Math.floor(Math.random() * 150 + 30) : null,
        transportNumber:
          i % 4 === 0 ? `TR-${Math.floor(Math.random() * 10000)}` : null,
        storageDate: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
        ),
        x: Math.floor(Math.random() * 50),
        y: Math.floor(Math.random() * 50),
        z: Math.floor(Math.random() * 5),
      });
    }

    // Containers for Warehouse 1
    for (let i = 0; i < 5; i++) {
      const netWeight = Math.round((Math.random() * 2000 + 500) * 100) / 100;
      const packWeight = Math.round((Math.random() * 200 + 50) * 100) / 100;
      const totalWeight = netWeight + packWeight;

      cargoItems.push({
        guid: `WH1-CONT-${String(i + 1).padStart(3, '0')}`,
        warehouseId: savedWarehouses[0].id,
        type: CargoType.CONTAINER,
        name: `Контейнер ${i + 1} - Склад 1`,
        description: `Морской контейнер ${i + 1} на складе №1`,
        netWeight,
        packWeight,
        totalWeight,
        maxLoadWeight: Math.round(totalWeight * 2 * 100) / 100,
        sizeX: 1200,
        sizeY: 2350,
        sizeZ: 2600,
        containSizeX: 1150,
        containSizeY: 2300,
        containSizeZ: 2550,
        transportNumber: `CONT-${Math.floor(Math.random() * 100000)}`,
        storageDate: new Date(
          Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000,
        ),
        x: Math.floor(Math.random() * 30),
        y: Math.floor(Math.random() * 30),
        z: 0,
      });
    }

    // Cargo for Warehouse 2
    for (let i = 0; i < 8; i++) {
      const netWeight = Math.round((Math.random() * 800 + 100) * 100) / 100;
      const packWeight = Math.round((Math.random() * 80 + 10) * 100) / 100;
      const totalWeight = netWeight + packWeight;

      cargoItems.push({
        guid: `WH2-CARGO-${String(i + 1).padStart(3, '0')}`,
        warehouseId: savedWarehouses[1].id,
        type: CargoType.CARGO,
        name: `Груз ${i + 1} - Склад 2`,
        description: `Крупногабаритный груз ${i + 1}`,
        netWeight,
        packWeight,
        totalWeight,
        maxLoadWeight: Math.round(totalWeight * 1.3 * 100) / 100,
        sizeX: Math.floor(Math.random() * 300 + 100),
        sizeY: Math.floor(Math.random() * 300 + 100),
        sizeZ: Math.floor(Math.random() * 300 + 100),
        containSizeX: null,
        containSizeY: null,
        containSizeZ: null,
        transportNumber: `TR-${Math.floor(Math.random() * 10000)}`,
        storageDate: new Date(
          Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000,
        ),
        x: Math.floor(Math.random() * 60),
        y: Math.floor(Math.random() * 60),
        z: Math.floor(Math.random() * 8),
      });
    }

    // Containers for Warehouse 2
    for (let i = 0; i < 3; i++) {
      const netWeight = Math.round((Math.random() * 2500 + 800) * 100) / 100;
      const packWeight = Math.round((Math.random() * 300 + 100) * 100) / 100;
      const totalWeight = netWeight + packWeight;

      cargoItems.push({
        guid: `WH2-CONT-${String(i + 1).padStart(3, '0')}`,
        warehouseId: savedWarehouses[1].id,
        type: CargoType.CONTAINER,
        name: `Контейнер ${i + 1} - Склад 2`,
        description: `Контейнер для крупногабаритных грузов`,
        netWeight,
        packWeight,
        totalWeight,
        maxLoadWeight: Math.round(totalWeight * 2.5 * 100) / 100,
        sizeX: 1200,
        sizeY: 2350,
        sizeZ: 2600,
        containSizeX: 1150,
        containSizeY: 2300,
        containSizeZ: 2550,
        transportNumber: `CONT-${Math.floor(Math.random() * 100000)}`,
        storageDate: new Date(
          Date.now() - Math.random() * 45 * 24 * 60 * 60 * 1000,
        ),
        x: Math.floor(Math.random() * 40),
        y: Math.floor(Math.random() * 40),
        z: 0,
      });
    }

    // Cargo for Warehouse 3
    for (let i = 0; i < 12; i++) {
      const netWeight = Math.round((Math.random() * 200 + 20) * 100) / 100;
      const packWeight = Math.round((Math.random() * 20 + 2) * 100) / 100;
      const totalWeight = netWeight + packWeight;

      cargoItems.push({
        guid: `WH3-CARGO-${String(i + 1).padStart(3, '0')}`,
        warehouseId: savedWarehouses[2].id,
        type: CargoType.CARGO,
        name: `Груз ${i + 1} - Склад 3`,
        description: `Скоропортящийся товар ${i + 1}`,
        netWeight,
        packWeight,
        totalWeight,
        maxLoadWeight: null,
        sizeX: Math.floor(Math.random() * 100 + 20),
        sizeY: Math.floor(Math.random() * 100 + 20),
        sizeZ: Math.floor(Math.random() * 100 + 20),
        containSizeX: null,
        containSizeY: null,
        containSizeZ: null,
        transportNumber:
          i % 3 === 0 ? `TR-${Math.floor(Math.random() * 10000)}` : null,
        storageDate: new Date(
          Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000,
        ),
        x: Math.floor(Math.random() * 40),
        y: Math.floor(Math.random() * 40),
        z: Math.floor(Math.random() * 4),
      });
    }

    // Containers for Warehouse 4
    for (let i = 0; i < 7; i++) {
      const netWeight = Math.round((Math.random() * 1800 + 400) * 100) / 100;
      const packWeight = Math.round((Math.random() * 150 + 30) * 100) / 100;
      const totalWeight = netWeight + packWeight;

      cargoItems.push({
        guid: `WH4-CONT-${String(i + 1).padStart(3, '0')}`,
        warehouseId: savedWarehouses[3].id,
        type: CargoType.CONTAINER,
        name: `Контейнер ${i + 1} - Склад 4`,
        description: `Контейнер для хранения`,
        netWeight,
        packWeight,
        totalWeight,
        maxLoadWeight: Math.round(totalWeight * 2 * 100) / 100,
        sizeX: 1200,
        sizeY: 2350,
        sizeZ: 2600,
        containSizeX: 1150,
        containSizeY: 2300,
        containSizeZ: 2550,
        transportNumber: `CONT-${Math.floor(Math.random() * 100000)}`,
        storageDate: new Date(
          Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000,
        ),
        x: Math.floor(Math.random() * 50),
        y: Math.floor(Math.random() * 50),
        z: 0,
      });
    }

    // Cargo for Warehouse 5
    for (let i = 0; i < 6; i++) {
      const netWeight = Math.round((Math.random() * 300 + 50) * 100) / 100;
      const packWeight = Math.round((Math.random() * 30 + 5) * 100) / 100;
      const totalWeight = netWeight + packWeight;

      cargoItems.push({
        guid: `WH5-CARGO-${String(i + 1).padStart(3, '0')}`,
        warehouseId: savedWarehouses[4].id,
        type: CargoType.CARGO,
        name: `Груз ${i + 1} - Склад 5`,
        description: `Временное хранение груза ${i + 1}`,
        netWeight,
        packWeight,
        totalWeight,
        maxLoadWeight: null,
        sizeX: Math.floor(Math.random() * 150 + 30),
        sizeY: Math.floor(Math.random() * 150 + 30),
        sizeZ: Math.floor(Math.random() * 150 + 30),
        containSizeX: null,
        containSizeY: null,
        containSizeZ: null,
        transportNumber: `TR-${Math.floor(Math.random() * 10000)}`,
        storageDate: new Date(
          Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000,
        ),
        x: Math.floor(Math.random() * 35),
        y: Math.floor(Math.random() * 35),
        z: Math.floor(Math.random() * 6),
      });
    }

    const savedCargo = await cargoRepository.save(cargoItems);
    console.log(`Created ${savedCargo.length} cargo items`);

    console.log('\n✅ Database seeded successfully!');
    console.log(`\nSummary:`);
    console.log(`- Users: ${savedUsers.length}`);
    console.log(`- Warehouses: ${savedWarehouses.length}`);
    console.log(`- Cargo items: ${savedCargo.length}`);
    console.log(`\nTest credentials:`);
    console.log(`- admin@warehouse.com / admin123`);
    console.log(`- manager1@warehouse.com / manager123`);
    console.log(`- manager2@warehouse.com / manager123`);
    console.log(`- test@warehouse.com / test123`);

    await dataSource.destroy();
  } catch (error) {
    console.error('Error seeding database:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

seed().catch((error) => {
  console.error('Fatal error in seed script:', error);
  process.exit(1);
});
