# KPI API Documentation

## Overview
API untuk manajemen KPI (Key Performance Indicator) dan pertanyaannya.

## Base URL
```
Development: http://localhost:3000/api/v1/kpi
Production: https://api.soerbaja45.com/v1/kpi
```

---

## Endpoints

### 1. Get All KPI (Manager Only)

**GET** `/`

Mendapatkan daftar semua KPI.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| devisi_id | integer | Filter berdasarkan devisi |
| is_active | boolean | Filter berdasarkan status aktif |
| periode | string | Filter berdasarkan periode (monthly/quarterly/yearly) |
| search | string | Cari berdasarkan nama KPI |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Data KPI berhasil diambil",
  "data": [
    {
      "id": 1,
      "devisi_id": 1,
      "nama_kpi": "Kualitas Desain Produk",
      "deskripsi": "Penilaian kualitas dan kreativitas desain yang dihasilkan",
      "periode": "monthly",
      "bobot": 100,
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z",
      "devisi": {
        "id": 1,
        "nama_devisi": "Designer"
      },
      "questions": [
        {
          "id": 1,
          "pertanyaan": "Seberapa kreatif desain yang dihasilkan?",
          "tipe_jawaban": "numeric_1_5",
          "bobot_soal": 25,
          "urutan": 1
        }
      ],
      "jumlah_pertanyaan": 5
    }
  ]
}
```

---

### 2. Get KPI by ID (Manager Only)

**GET** `/:id`

Mendapatkan detail KPI beserta pertanyaan-pertanyaannya.

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
    "devisi_id": 1,
    "nama_kpi": "Kualitas Desain Produk",
    "deskripsi": "Penilaian kualitas dan kreativitas desain yang dihasilkan",
    "periode": "monthly",
    "bobot": 100,
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "devisi": {
      "id": 1,
      "nama_devisi": "Designer",
      "deskripsi": "Tim desain grafis dan creative"
    },
    "questions": [
      {
        "id": 1,
        "kpi_id": 1,
        "pertanyaan": "Seberapa kreatif desain yang dihasilkan?",
        "tipe_jawaban": "numeric_1_5",
        "bobot_soal": 25,
        "urutan": 1,
        "is_mandatory": true,
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z"
      },
      {
        "id": 2,
        "kpi_id": 1,
        "pertanyaan": "Ketepatan dalam mengikuti brief klien",
        "tipe_jawaban": "numeric_1_5",
        "bobot_soal": 20,
        "urutan": 2,
        "is_mandatory": true,
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "KPI tidak ditemukan"
}
```

---

### 3. Create KPI (Manager Only)

**POST** `/`

Membuat KPI baru beserta pertanyaan-pertanyaannya.

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "devisi_id": 1,
  "nama_kpi": "Produktivitas Desain",
  "deskripsi": "Penilaian produktivitas dan efisiensi dalam menghasilkan desain",
  "periode": "monthly",
  "bobot": 100,
  "questions": [
    {
      "pertanyaan": "Berapa jumlah desain yang diselesaikan?",
      "tipe_jawaban": "numeric_0_100",
      "bobot_soal": 30,
      "urutan": 1,
      "is_mandatory": true
    },
    {
      "pertanyaan": "Tingkat kepuasan klien",
      "tipe_jawaban": "numeric_1_5",
      "bobot_soal": 40,
      "urutan": 2,
      "is_mandatory": true
    },
    {
      "pertanyaan": "Catatan tambahan",
      "tipe_jawaban": "text",
      "bobot_soal": 30,
      "urutan": 3,
      "is_mandatory": false
    }
  ]
}
```

**Field Descriptions:**

**KPI Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| devisi_id | integer | Yes | ID devisi |
| nama_kpi | string | Yes | Nama KPI (5-200 karakter) |
| deskripsi | string | No | Deskripsi KPI |
| periode | enum | Yes | monthly/quarterly/yearly |
| bobot | integer | Yes | Bobot KPI (1-100) |

**Question Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| pertanyaan | string | Yes | Teks pertanyaan |
| tipe_jawaban | enum | Yes | numeric_1_5/numeric_0_100/text |
| bobot_soal | integer | Yes | Bobot soal (1-100) |
| urutan | integer | No | Urutan pertanyaan (auto increment) |
| is_mandatory | boolean | No | Wajib dijawab (default: true) |

**Success Response (201):**
```json
{
  "success": true,
  "message": "KPI berhasil dibuat",
  "data": {
    "id": 3,
    "devisi_id": 1,
    "nama_kpi": "Produktivitas Desain",
    "deskripsi": "Penilaian produktivitas dan efisiensi dalam menghasilkan desain",
    "periode": "monthly",
    "bobot": 100,
    "is_active": true,
    "created_at": "2024-01-22T10:00:00.000Z",
    "updated_at": "2024-01-22T10:00:00.000Z",
    "devisi": {
      "id": 1,
      "nama_devisi": "Designer",
      "deskripsi": "Tim desain grafis dan creative"
    },
    "questions": [
      {
        "id": 15,
        "kpi_id": 3,
        "pertanyaan": "Berapa jumlah desain yang diselesaikan?",
        "tipe_jawaban": "numeric_0_100",
        "bobot_soal": 30,
        "urutan": 1,
        "is_mandatory": true
      }
    ]
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Devisi tidak ditemukan"
}
```

---

### 4. Update KPI (Manager Only)

**PUT** `/:id`

Mengupdate KPI beserta pertanyaan-pertanyaannya.

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**URL Parameters:**
- `id` (integer, required): KPI ID

**Request Body:**
```json
{
  "nama_kpi": "Kualitas & Produktivitas Desain",
  "deskripsi": "Penilaian kualitas dan produktivitas desain",
  "periode": "monthly",
  "bobot": 100,
  "is_active": true,
  "questions": [
    {
      "pertanyaan": "Seberapa kreatif desain yang dihasilkan?",
      "tipe_jawaban": "numeric_1_5",
      "bobot_soal": 25,
      "urutan": 1,
      "is_mandatory": true
    }
  ]
}
```

**Note:** Update questions akan menghapus semua pertanyaan lama dan membuat yang baru. Pastikan kirim semua pertanyaan yang diinginkan.

**Success Response (200):**
```json
{
  "success": true,
  "message": "KPI berhasil diupdate",
  "data": {
    "id": 1,
    "nama_kpi": "Kualitas & Produktivitas Desain",
    "updated_at": "2024-01-22T11:00:00.000Z"
  }
}
```

---

### 5. Delete KPI (Manager Only)

**DELETE** `/:id`

Menonaktifkan KPI (soft delete).

**Headers:**
```
Authorization: Bearer {access_token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "KPI berhasil dinonaktifkan",
  "data": null
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Tidak dapat menghapus KPI. Sudah ada 15 assessment terkait"
}
```

---

### 6. Get My KPIs (Karyawan)

**GET** `/my-kpis`

Mendapatkan KPI yang berlaku untuk devisi karyawan.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "KPI Anda berhasil diambil",
  "data": [
    {
      "id": 1,
      "devisi_id": 1,
      "nama_kpi": "Kualitas Desain Produk",
      "deskripsi": "Penilaian kualitas dan kreativitas desain yang dihasilkan",
      "periode": "monthly",
      "bobot": 100,
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z",
      "questions": [
        {
          "id": 1,
          "pertanyaan": "Seberapa kreatif desain yang dihasilkan?",
          "tipe_jawaban": "numeric_1_5",
          "bobot_soal": 25,
          "urutan": 1,
          "is_mandatory": true
        }
      ],
      "latest_assessment": {
        "id": 15,
        "status": "reviewed",
        "total_score": 88.5,
        "tanggal_pengisian": "2024-01-22T00:00:00.000Z"
      },
      "status_pengisian": "reviewed"
    }
  ]
}
```

**Status Pengisian:**
- `pending`: Belum pernah mengisi
- `draft`: Ada draft yang tersimpan
- `submitted`: Sudah submit, menunggu review
- `reviewed`: Sudah direview

---

## Question Types

### 1. numeric_1_5
Skala 1-5 (Rating)
- **Range**: 1 (sangat kurang) - 5 (sangat baik)
- **Normalized**: (value / 5) * 100
- **Example**: 4 → 80 points

### 2. numeric_0_100
Nilai langsung 0-100
- **Range**: 0-100
- **Normalized**: value (direct)
- **Example**: 85 → 85 points

### 3. text
Jawaban teks bebas
- **Type**: String/Text
- **Normalized**: 0 (tidak berkontribusi ke score)
- **Purpose**: Catatan/komentar tambahan

---

## Periode Types

| Periode | Description | Format |
|---------|-------------|--------|
| monthly | Bulanan | 2024-01 |
| quarterly | Per kuartal (3 bulan) | 2024-Q1 |
| yearly | Tahunan | 2024 |

---

## Business Rules

1. **Unique KPI per Devisi**: Satu devisi bisa memiliki multiple KPI
2. **Cannot Delete with Assessments**: KPI yang sudah memiliki assessment tidak bisa dihapus
3. **Question Weight**: Total bobot_soal sebaiknya 100 untuk kemudahan kalkulasi
4. **Mandatory Questions**: Minimal 1 pertanyaan wajib (is_mandatory: true)
5. **Active KPI Only**: Karyawan hanya bisa melihat KPI yang aktif

---

## cURL Examples

### Get All KPI (Manager)
```bash
curl -X GET "http://localhost:3000/api/v1/kpi?devisi_id=1&is_active=true" \
  -H "Authorization: Bearer MANAGER_TOKEN"
```

### Create KPI
```bash
curl -X POST http://localhost:3000/api/v1/kpi \
  -H "Authorization: Bearer MANAGER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "devisi_id": 1,
    "nama_kpi": "Produktivitas Desain",
    "deskripsi": "Penilaian produktivitas",
    "periode": "monthly",
    "bobot": 100,
    "questions": [
      {
        "pertanyaan": "Berapa desain yang selesai?",
        "tipe_jawaban": "numeric_0_100",
        "bobot_soal": 50,
        "urutan": 1,
        "is_mandatory": true
      }
    ]
  }'
```

### Get My KPIs (Karyawan)
```bash
curl -X GET http://localhost:3000/api/v1/kpi/my-kpis \
  -H "Authorization: Bearer KARYAWAN_TOKEN"
```

### Update KPI
```bash
curl -X PUT http://localhost:3000/api/v1/kpi/1 \
  -H "Authorization: Bearer MANAGER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nama_kpi": "Updated KPI Name",
    "periode": "monthly",
    "bobot": 100
  }'
```

### Delete KPI
```bash
curl -X DELETE http://localhost:3000/api/v1/kpi/1 \
  -H "Authorization: Bearer MANAGER_TOKEN"
```
