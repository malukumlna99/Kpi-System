# Devisi API Documentation

## Overview
API untuk manajemen divisi/departemen. Hanya bisa diakses oleh Manager.

## Base URL
```
Development: http://localhost:3000/api/v1/devisi
Production: https://api.soerbaja45.com/v1/devisi
```

**All endpoints require Manager authentication**

---

## Endpoints

### 1. Get All Devisi

**GET** `/`

Mendapatkan daftar semua devisi.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| is_active | boolean | Filter berdasarkan status aktif |
| search | string | Cari berdasarkan nama devisi |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Data devisi berhasil diambil",
  "data": [
    {
      "id": 1,
      "nama_devisi": "Designer",
      "deskripsi": "Tim desain grafis dan creative",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z",
      "jumlah_karyawan": 3,
      "jumlah_kpi": 2
    },
    {
      "id": 2,
      "nama_devisi": "Marketing",
      "deskripsi": "Tim pemasaran dan promosi",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z",
      "jumlah_karyawan": 1,
      "jumlah_kpi": 1
    }
  ]
}
```

---

### 2. Get Devisi by ID

**GET** `/:id`

Mendapatkan detail devisi beserta karyawan dan KPI.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nama_devisi": "Designer",
    "deskripsi": "Tim desain grafis dan creative",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "users": [
      {
        "id": 2,
        "nama_lengkap": "Budi Santoso",
        "email": "budi@soerbaja45.com",
        "role": "karyawan"
      },
      {
        "id": 3,
        "nama_lengkap": "Siti Aminah",
        "email": "siti@soerbaja45.com",
        "role": "karyawan"
      }
    ],
    "kpis": [
      {
        "id": 1,
        "nama_kpi": "Kualitas Desain Produk",
        "periode": "monthly",
        "is_active": true
      }
    ]
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Devisi tidak ditemukan"
}
```

---

### 3. Create Devisi

**POST** `/`

Membuat devisi baru.

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "nama_devisi": "IT Support",
  "deskripsi": "Tim dukungan teknologi informasi"
}
```

**Field Descriptions:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| nama_devisi | string | Yes | Nama devisi (3-100 karakter, harus unik) |
| deskripsi | string | No | Deskripsi devisi |

**Success Response (201):**
```json
{
  "success": true,
  "message": "Devisi berhasil dibuat",
  "data": {
    "id": 7,
    "nama_devisi": "IT Support",
    "deskripsi": "Tim dukungan teknologi informasi",
    "is_active": true,
    "created_at": "2024-01-22T10:00:00.000Z",
    "updated_at": "2024-01-22T10:00:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Nama devisi sudah ada"
}
```

**Validation Error (422):**
```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": {
    "nama_devisi": ["Nama devisi harus 3-100 karakter"]
  }
}
```

---

### 4. Update Devisi

**PUT** `/:id`

Mengupdate data devisi.

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**URL Parameters:**
- `id` (integer, required): Devisi ID

**Request Body:**
```json
{
  "nama_devisi": "Designer & Creative",
  "deskripsi": "Tim desain grafis, creative, dan multimedia",
  "is_active": true
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Devisi berhasil diupdate",
  "data": {
    "id": 1,
    "nama_devisi": "Designer & Creative",
    "deskripsi": "Tim desain grafis, creative, dan multimedia",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-22T10:30:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Nama devisi sudah digunakan"
}
```

---

### 5. Delete Devisi

**DELETE** `/:id`

Menonaktifkan devisi (soft delete).

**Headers:**
```
Authorization: Bearer {access_token}
```

**URL Parameters:**
- `id` (integer, required): Devisi ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Devisi berhasil dinonaktifkan",
  "data": null
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Tidak dapat menghapus devisi. Masih ada 3 karyawan di devisi ini"
}
```

---

## Business Rules

1. **Unique Name**: Nama devisi harus unik
2. **Cannot Delete with Active Users**: Devisi yang masih memiliki karyawan tidak bisa dihapus
3. **Soft Delete**: Delete akan menonaktifkan devisi, bukan menghapus dari database
4. **Minimum Length**: Nama devisi minimal 3 karakter

---

## Pre-seeded Devisi

Setelah running `npm run seed`, devisi berikut akan tersedia:

| ID | Nama Devisi | Deskripsi |
|----|-------------|-----------|
| 1 | Designer | Tim desain grafis dan creative |
| 2 | Marketing | Tim pemasaran dan promosi |
| 3 | Production | Tim produksi percetakan |
| 4 | Sales | Tim penjualan |
| 5 | Finance | Tim keuangan dan akuntansi |
| 6 | Management | Tim manajemen |

---

## cURL Examples

### Get All Devisi
```bash
curl -X GET "http://localhost:3000/api/v1/devisi?is_active=true" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Devisi by ID
```bash
curl -X GET http://localhost:3000/api/v1/devisi/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Devisi
```bash
curl -X POST http://localhost:3000/api/v1/devisi \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "nama_devisi": "IT Support",
    "deskripsi": "Tim dukungan teknologi informasi"
  }'
```

### Update Devisi
```bash
curl -X PUT http://localhost:3000/api/v1/devisi/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "nama_devisi": "Designer & Creative",
    "deskripsi": "Tim desain grafis dan creative"
  }'
```

### Delete Devisi
```bash
curl -X DELETE http://localhost:3000/api/v1/devisi/7 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Notes

- Semua endpoint memerlukan autentikasi dengan role **Manager**
- Response selalu dalam format JSON
- Timestamps menggunakan format ISO 8601
- Pagination tidak diperlukan karena jumlah devisi biasanya tidak banyak
