# Database Schema Documentation

## Overview
Database schema untuk KPI Management System menggunakan PostgreSQL/MySQL dengan Sequelize ORM.

## Database Name
```
kpi_soerbaja45
```

---

## Tables

### 1. devisi
Tabel untuk menyimpan data divisi/departemen.

```sql
CREATE TABLE devisi (
  id SERIAL PRIMARY KEY,
  nama_devisi VARCHAR(100) NOT NULL UNIQUE,
  deskripsi TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**
| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | INTEGER | NO | AUTO_INCREMENT | Primary key |
| nama_devisi | VARCHAR(100) | NO | - | Nama devisi (unique) |
| deskripsi | TEXT | YES | NULL | Deskripsi devisi |
| is_active | BOOLEAN | NO | true | Status aktif |
| created_at | TIMESTAMP | NO | NOW() | Waktu dibuat |
| updated_at | TIMESTAMP | NO | NOW() | Waktu diupdate |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE on `nama_devisi`

---

### 2. users
Tabel untuk menyimpan data user (manager dan karyawan).

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  devisi_id INTEGER NOT NULL,
  nama_lengkap VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'karyawan',
  foto_profil VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (devisi_id) REFERENCES devisi(id)
);
```

**Columns:**
| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | INTEGER | NO | AUTO_INCREMENT | Primary key |
| devisi_id | INTEGER | NO | - | Foreign key ke devisi |
| nama_lengkap | VARCHAR(100) | NO | - | Nama lengkap user |
| email | VARCHAR(100) | NO | - | Email (unique) |
| password | VARCHAR(255) | NO | - | Password (bcrypt hashed) |
| role | ENUM | NO | 'karyawan' | manager/karyawan |
| foto_profil | VARCHAR(255) | YES | NULL | URL foto profil |
| is_active | BOOLEAN | NO | true | Status aktif |
| last_login | TIMESTAMP | YES | NULL | Waktu login terakhir |
| created_at | TIMESTAMP | NO | NOW() | Waktu dibuat |
| updated_at | TIMESTAMP | NO | NOW() | Waktu diupdate |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE on `email`
- INDEX on `devisi_id`
- INDEX on `role`

**Foreign Keys:**
- `devisi_id` → `devisi(id)`

---

### 3. kpi
Tabel untuk menyimpan data KPI (Key Performance Indicator).

```sql
CREATE TABLE kpi (
  id SERIAL PRIMARY KEY,
  devisi_id INTEGER NOT NULL,
  nama_kpi VARCHAR(200) NOT NULL,
  deskripsi TEXT,
  periode VARCHAR(20) NOT NULL DEFAULT 'monthly',
  bobot INTEGER NOT NULL DEFAULT 100,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (devisi_id) REFERENCES devisi(id)
);
```

**Columns:**
| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | INTEGER | NO | AUTO_INCREMENT | Primary key |
| devisi_id | INTEGER | NO | - | Foreign key ke devisi |
| nama_kpi | VARCHAR(200) | NO | - | Nama KPI |
| deskripsi | TEXT | YES | NULL | Deskripsi KPI |
| periode | ENUM | NO | 'monthly' | monthly/quarterly/yearly |
| bobot | INTEGER | NO | 100 | Bobot KPI (1-100) |
| is_active | BOOLEAN | NO | true | Status aktif |
| created_at | TIMESTAMP | NO | NOW() | Waktu dibuat |
| updated_at | TIMESTAMP | NO | NOW() | Waktu diupdate |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `devisi_id`
- INDEX on `is_active`

**Foreign Keys:**
- `devisi_id` → `devisi(id)`

---

### 4. kpi_questions
Tabel untuk menyimpan pertanyaan-pertanyaan dalam KPI.

```sql
CREATE TABLE kpi_questions (
  id SERIAL PRIMARY KEY,
  kpi_id INTEGER NOT NULL,
  pertanyaan TEXT NOT NULL,
  tipe_jawaban VARCHAR(20) NOT NULL DEFAULT 'numeric_1_5',
  bobot_soal INTEGER NOT NULL DEFAULT 10,
  urutan INTEGER NOT NULL DEFAULT 1,
  is_mandatory BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (kpi_id) REFERENCES kpi(id) ON DELETE CASCADE
);
```

**Columns:**
| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | INTEGER | NO | AUTO_INCREMENT | Primary key |
| kpi_id | INTEGER | NO | - | Foreign key ke kpi |
| pertanyaan | TEXT | NO | - | Teks pertanyaan |
| tipe_jawaban | ENUM | NO | 'numeric_1_5' | numeric_1_5/numeric_0_100/text |
| bobot_soal | INTEGER | NO | 10 | Bobot soal (1-100) |
| urutan | INTEGER | NO | 1 | Urutan pertanyaan |
| is_mandatory | BOOLEAN | NO | true | Wajib dijawab |
| created_at | TIMESTAMP | NO | NOW() | Waktu dibuat |
| updated_at | TIMESTAMP | NO | NOW() | Waktu diupdate |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `kpi_id`
- INDEX on `urutan`

**Foreign Keys:**
- `kpi_id` → `kpi(id)` ON DELETE CASCADE

---

### 5. kpi_assessments
Tabel untuk menyimpan penilaian/assessment KPI.

```sql
CREATE TABLE kpi_assessments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  kpi_id INTEGER NOT NULL,
  tanggal_pengisian TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  total_score DECIMAL(5,2) DEFAULT 0,
  catatan_karyawan TEXT,
  catatan_manager TEXT,
  submitted_at TIMESTAMP,
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (kpi_id) REFERENCES kpi(id)
);
```

**Columns:**
| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | INTEGER | NO | AUTO_INCREMENT | Primary key |
| user_id | INTEGER | NO | - | Foreign key ke users |
| kpi_id | INTEGER | NO | - | Foreign key ke kpi |
| tanggal_pengisian | TIMESTAMP | NO | NOW() | Tanggal pengisian |
| status | ENUM | NO | 'draft' | draft/submitted/reviewed |
| total_score | DECIMAL(5,2) | YES | 0 | Total score (0-100) |
| catatan_karyawan | TEXT | YES | NULL | Catatan dari karyawan |
| catatan_manager | TEXT | YES | NULL | Catatan dari manager |
| submitted_at | TIMESTAMP | YES | NULL | Waktu submit |
| reviewed_at | TIMESTAMP | YES | NULL | Waktu review |
| created_at | TIMESTAMP | NO | NOW() | Waktu dibuat |
| updated_at | TIMESTAMP | NO | NOW() | Waktu diupdate |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `user_id, kpi_id, tanggal_pengisian`
- INDEX on `status`
- INDEX on `user_id`
- INDEX on `kpi_id`

**Foreign Keys:**
- `user_id` → `users(id)`
- `kpi_id` → `kpi(id)`

---

### 6. kpi_answers
Tabel untuk menyimpan jawaban dari setiap pertanyaan.

```sql
CREATE TABLE kpi_answers (
  id SERIAL PRIMARY KEY,
  assessment_id INTEGER NOT NULL,
  question_id INTEGER NOT NULL,
  nilai_jawaban DECIMAL(5,2),
  jawaban_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assessment_id) REFERENCES kpi_assessments(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES kpi_questions(id)
);
```

**Columns:**
| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | INTEGER | NO | AUTO_INCREMENT | Primary key |
| assessment_id | INTEGER | NO | - | Foreign key ke kpi_assessments |
| question_id | INTEGER | NO | - | Foreign key ke kpi_questions |
| nilai_jawaban | DECIMAL(5,2) | YES | NULL | Nilai jawaban (numeric) |
| jawaban_text | TEXT | YES | NULL | Jawaban teks |
| created_at | TIMESTAMP | NO | NOW() | Waktu dibuat |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `assessment_id`
- INDEX on `question_id`

**Foreign Keys:**
- `assessment_id` → `kpi_assessments(id)` ON DELETE CASCADE
- `question_id` → `kpi_questions(id)`

---

### 7. kpi_results
Tabel untuk menyimpan hasil agregat penilaian per periode.

```sql
CREATE TABLE kpi_results (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  kpi_id INTEGER NOT NULL,
  periode VARCHAR(20) NOT NULL,
  avg_score DECIMAL(5,2) NOT NULL DEFAULT 0,
  total_score DECIMAL(8,2) NOT NULL DEFAULT 0,
  jumlah_assessment INTEGER NOT NULL DEFAULT 0,
  grade VARCHAR(5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (kpi_id) REFERENCES kpi(id),
  UNIQUE (user_id, kpi_id, periode)
);
```

**Columns:**
| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | INTEGER | NO | AUTO_INCREMENT | Primary key |
| user_id | INTEGER | NO | - | Foreign key ke users |
| kpi_id | INTEGER | NO | - | Foreign key ke kpi |
| periode | VARCHAR(20) | NO | - | Format: 2024-01, 2024-Q1, 2024 |
| avg_score | DECIMAL(5,2) | NO | 0 | Rata-rata score |
| total_score | DECIMAL(8,2) | NO | 0 | Total score |
| jumlah_assessment | INTEGER | NO | 0 | Jumlah assessment |
| grade | ENUM | YES | NULL | A+/A/B+/B/C+/C/D/E |
| created_at | TIMESTAMP | NO | NOW() | Waktu dibuat |
| updated_at | TIMESTAMP | NO | NOW() | Waktu diupdate |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE INDEX on `user_id, kpi_id, periode`
- INDEX on `user_id`
- INDEX on `kpi_id`
- INDEX on `periode`

**Foreign Keys:**
- `user_id` → `users(id)`
- `kpi_id` → `kpi(id)`

---

## Entity Relationship Diagram

```
┌──────────┐         ┌──────────┐         ┌──────────┐
│  devisi  │────1:N──│  users   │────1:N──│kpi_assess│
└──────────┘         └──────────┘         │  ments   │
     │                                     └──────────┘
     │                                          │
     │1:N                                       │1:N
     │                                          │
┌──────────┐         ┌──────────┐         ┌──────────┐
│   kpi    │────1:N──│kpi_quest │         │kpi_answer│
└──────────┘         │  ions    │────1:N──│    s     │
     │               └──────────┘         └──────────┘
     │1:N
     │
┌──────────┐
│kpi_result│
│    s     │
└──────────┘
```

---

## Relationships

### devisi → users
- One-to-Many
- One devisi has many users
- Cascade: RESTRICT (cannot delete devisi with users)

### devisi → kpi
- One-to-Many
- One devisi has many KPIs
- Cascade: RESTRICT (cannot delete devisi with KPIs)

### kpi → kpi_questions
- One-to-Many
- One KPI has many questions
- Cascade: CASCADE (delete questions when KPI deleted)

### users → kpi_assessments
- One-to-Many
- One user has many assessments
- Cascade: RESTRICT

### kpi → kpi_assessments
- One-to-Many
- One KPI has many assessments
- Cascade: RESTRICT

### kpi_assessments → kpi_answers
- One-to-Many
- One assessment has many answers
- Cascade: CASCADE (delete answers when assessment deleted)

### kpi_questions → kpi_answers
- One-to-Many
- One question has many answers
- Cascade: RESTRICT

### users/kpi → kpi_results
- Many-to-One
- Results are aggregated from assessments
- Cascade: RESTRICT

---

## Enums

### users.role
```sql
ENUM('manager', 'karyawan')
```

### kpi.periode
```sql
ENUM('monthly', 'quarterly', 'yearly')
```

### kpi_questions.tipe_jawaban
```sql
ENUM('numeric_1_5', 'numeric_0_100', 'text')
```

### kpi_assessments.status
```sql
ENUM('draft', 'submitted', 'reviewed')
```

### kpi_results.grade
```sql
ENUM('A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'E')
```

---

## Sample Data

### devisi
```sql
INSERT INTO devisi (nama_devisi, deskripsi) VALUES
('Designer', 'Tim desain grafis dan creative'),
('Marketing', 'Tim pemasaran dan promosi'),
('Production', 'Tim produksi percetakan'),
('Sales', 'Tim penjualan'),
('Finance', 'Tim keuangan dan akuntansi'),
('Management', 'Tim manajemen');
```

### users (passwords are bcrypt hashed)
```sql
INSERT INTO users (devisi_id, nama_lengkap, email, password, role) VALUES
(6, 'John Doe', 'manager@soerbaja45.com', '$2a$12$...', 'manager'),
(1, 'Budi Santoso', 'budi@soerbaja45.com', '$2a$12$...', 'karyawan');
```

---

## Migration Strategy

1. Create database: `CREATE DATABASE kpi_soerbaja45`
2. Run Sequelize sync: `await sequelize.sync()`
3. Seed initial data: `npm run seed`

---

## Backup Strategy

### Daily Backup
```bash
pg_dump kpi_soerbaja45 > backup_$(date +%Y%m%d).sql
```

### Restore
```bash
psql kpi_soerbaja45 < backup_20240122.sql
```

---

## Performance Optimization

### Recommended Indexes
Already defined in schema above

### Query Optimization
- Use `include` carefully in Sequelize
- Add `attributes` to select only needed columns
- Use pagination for large datasets
- Implement caching for frequently accessed data

### Database Monitoring
- Monitor slow queries
- Check index usage
- Optimize table statistics
- Regular VACUUM (PostgreSQL)
