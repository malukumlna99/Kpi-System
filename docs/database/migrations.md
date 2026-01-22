# Database Migrations Guide

## Overview
Guide untuk mengelola database migrations menggunakan Sequelize.

---

## Migration Files Location
```
backend/src/database/migrations/
```

---

## Create Migration

### Method 1: Using Sequelize CLI (Recommended for Production)

**Install Sequelize CLI:**
```bash
npm install --save-dev sequelize-cli
```

**Initialize Sequelize:**
```bash
npx sequelize-cli init
```

**Create Migration:**
```bash
npx sequelize-cli migration:generate --name create-devisi-table
```

**Example Migration File:**
```javascript
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('devisi', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nama_devisi: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      deskripsi: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('devisi', ['nama_devisi'], {
      unique: true,
      name: 'devisi_nama_devisi_unique'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('devisi');
  }
};
```

---

### Method 2: Using Sequelize Sync (Current Implementation)

**For Development Only:**
```javascript
// In app.js or migrate.js
const { syncDatabase } = require('./models');

// Sync without dropping tables
await syncDatabase(false);

// Sync with drop (DANGER: deletes all data)
await syncDatabase(true);
```

---

## Migration Scripts

### `backend/src/database/migrate.js`

```javascript
require('dotenv').config();
const { sequelize } = require('../config/database');
const models = require('../models');

const migrate = async () => {
  try {
    console.log('🔄 Starting database migration...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('✅ Database migrated successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

migrate();
```

**Run Migration:**
```bash
npm run migrate
```

---

## Migration History

### Initial Schema (v1.0.0)

**Tables Created:**
1. `devisi`
2. `users`
3. `kpi`
4. `kpi_questions`
5. `kpi_assessments`
6. `kpi_answers`
7. `kpi_results`

**Indexes Created:**
- `devisi.nama_devisi` (UNIQUE)
- `users.email` (UNIQUE)
- `users.devisi_id` (INDEX)
- `kpi.devisi_id` (INDEX)
- `kpi_questions.kpi_id` (INDEX)
- `kpi_assessments.user_id, kpi_id, tanggal_pengisian` (INDEX)
- `kpi_assessments.status` (INDEX)
- `kpi_answers.assessment_id` (INDEX)
- `kpi_results.user_id, kpi_id, periode` (UNIQUE)

---

## Common Migration Tasks

### Add Column

```javascript
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'phone_number', {
      type: Sequelize.STRING(20),
      allowNull: true,
      after: 'email'
    });
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'phone_number');
  }
};
```

### Modify Column

```javascript
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'nama_lengkap', {
      type: Sequelize.STRING(150),
      allowNull: false
    });
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'nama_lengkap', {
      type: Sequelize.STRING(100),
      allowNull: false
    });
  }
};
```

### Add Index

```javascript
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('kpi_assessments', ['submitted_at'], {
      name: 'kpi_assessments_submitted_at_idx'
    });
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('kpi_assessments', 'kpi_assessments_submitted_at_idx');
  }
};
```

### Add Foreign Key

```javascript
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('users', {
      fields: ['devisi_id'],
      type: 'foreign key',
      name: 'users_devisi_id_fkey',
      references: {
        table: 'devisi',
        field: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('users', 'users_devisi_id_fkey');
  }
};
```

### Seed Data

```javascript
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('devisi', [
      {
        nama_devisi: 'Designer',
        deskripsi: 'Tim desain grafis dan creative',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nama_devisi: 'Marketing',
        deskripsi: 'Tim pemasaran dan promosi',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('devisi', null, {});
  }
};
```

---

## Migration Best Practices

### 1. Always Create Down Migration
```javascript
// Good
module.exports = {
  async up(queryInterface, Sequelize) {
    // Migration logic
  },
  async down(queryInterface, Sequelize) {
    // Rollback logic
  }
};
```

### 2. Use Transactions
```javascript
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('users', 'new_column', {
        type: Sequelize.STRING
      }, { transaction });
      
      await queryInterface.addIndex('users', ['new_column'], {
        transaction
      });
      
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
```

### 3. Test Migrations
```bash
# Run migration
npx sequelize-cli db:migrate

# Rollback last migration
npx sequelize-cli db:migrate:undo

# Rollback all migrations
npx sequelize-cli db:migrate:undo:all

# Check migration status
npx sequelize-cli db:migrate:status
```

### 4. Backup Before Migration
```bash
# PostgreSQL
pg_dump kpi_soerbaja45 > backup_before_migration_$(date +%Y%m%d).sql

# MySQL
mysqldump -u kpi_user -p kpi_soerbaja45 > backup_before_migration_$(date +%Y%m%d).sql
```

---

## Environment-Specific Migrations

### Development
```bash
NODE_ENV=development npm run migrate
```

### Staging
```bash
NODE_ENV=staging npm run migrate
```

### Production
```bash
NODE_ENV=production npm run migrate
```

---

## Troubleshooting

### Migration Failed
```bash
# Check current migration status
npx sequelize-cli db:migrate:status

# Rollback problematic migration
npx sequelize-cli db:migrate:undo

# Fix migration file

# Run again
npx sequelize-cli db:migrate
```

### Table Already Exists
```javascript
// Check if table exists first
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableExists = await queryInterface.showAllTables()
      .then(tables => tables.includes('table_name'));
    
    if (!tableExists) {
      await queryInterface.createTable('table_name', {
        // columns
      });
    }
  }
};
```

### Column Already Exists
```javascript
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('users');
    
    if (!table.phone_number) {
      await queryInterface.addColumn('users', 'phone_number', {
        type: Sequelize.STRING(20)
      });
    }
  }
};
```

---

## Migration Workflow

```
1. Create Migration File
   ↓
2. Write Up/Down Logic
   ↓
3. Test Locally
   ↓
4. Backup Database
   ↓
5. Run Migration
   ↓
6. Verify Changes
   ↓
7. Update Documentation
```

---

## Quick Commands

```bash
# Create migration
npx sequelize-cli migration:generate --name migration-name

# Run migrations
npx sequelize-cli db:migrate

# Undo last migration
npx sequelize-cli db:migrate:undo

# Undo all migrations
npx sequelize-cli db:migrate:undo:all

# Check migration status
npx sequelize-cli db:migrate:status

# Create seeder
npx sequelize-cli seed:generate --name seed-name

# Run all seeders
npx sequelize-cli db:seed:all

# Undo all seeders
npx sequelize-cli db:seed:undo:all
```

---

## Notes

- Always backup database before migration
- Test migrations in development first
- Use transactions for complex migrations
- Document all schema changes
- Keep migration files in version control
- Never modify existing migration files that have been run in production
