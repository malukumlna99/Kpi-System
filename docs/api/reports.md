# Reports API Documentation

## Overview
API untuk mendapatkan laporan dan statistik performa karyawan. Hanya untuk Manager.

## Base URL
```
Development: http://localhost:3000/api/v1/reports
Production: https://api.soerbaja45.com/v1/reports
```

**All endpoints require Manager authentication**

---

## Endpoints

### 1. Dashboard Summary

**GET** `/dashboard`

Mendapatkan ringkasan dashboard untuk manager.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| periode | string | Filter periode (2024-01, 2024-Q1, 2024) |
| devisi_id | integer | Filter berdasarkan devisi |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Dashboard summary berhasil diambil",
  "data": {
    "summary": {
      "total_karyawan": 15,
      "total_devisi": 6,
      "total_kpi": 8,
      "assessment_bulan_ini": 45,
      "assessment_pending_review": 12,
      "avg_score_keseluruhan": 82.5
    },
    "devisi_performance": [
      {
        "devisi_id": 1,
        "nama_devisi": "Designer",
        "jumlah_karyawan": 3,
        "avg_score": 85.5,
        "total_assessment": 15,
        "grade_distribution": {
          "A+": 2,
          "A": 5,
          "B+": 6,
          "B": 2
        }
      },
      {
        "devisi_id": 2,
        "nama_devisi": "Marketing",
        "jumlah_karyawan": 1,
        "avg_score": 88.0,
        "total_assessment": 8,
        "grade_distribution": {
          "A+": 3,
          "A": 4,
          "B+": 1
        }
      }
    ],
    "recent_assessments": [
      {
        "id": 45,
        "user": {
          "id": 2,
          "nama_lengkap": "Budi Santoso",
          "devisi": "Designer"
        },
        "kpi": {
          "id": 1,
          "nama_kpi": "Kualitas Desain Produk"
        },
        "total_score": 88.5,
        "grade": "B+",
        "status": "submitted",
        "tanggal_pengisian": "2024-01-22T00:00:00.000Z",
        "submitted_at": "2024-01-22T10:30:00.000Z"
      }
    ],
    "top_performers": [
      {
        "user_id": 3,
        "nama_lengkap": "Siti Aminah",
        "devisi": "Designer",
        "avg_score": 92.5,
        "total_assessment": 12,
        "grade": "A"
      },
      {
        "user_id": 4,
        "nama_lengkap": "Ahmad Pratama",
        "devisi": "Marketing",
        "avg_score": 88.0,
        "total_assessment": 8,
        "grade": "B+"
      }
    ],
    "trend_monthly": [
      {
        "periode": "2024-01",
        "avg_score": 82.5,
        "total_assessment": 45
      },
      {
        "periode": "2023-12",
        "avg_score": 80.2,
        "total_assessment": 42
      },
      {
        "periode": "2023-11",
        "avg_score": 78.5,
        "total_assessment": 40
      }
    ]
  }
}
```

---

### 2. Employee Performance Report

**GET** `/employees`

Mendapatkan laporan performa semua karyawan.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| devisi_id | integer | Filter berdasarkan devisi |
| periode | string | Filter periode (2024-01, 2024-Q1, 2024) |
| min_score | number | Minimum score filter |
| max_score | number | Maximum score filter |
| grade | string | Filter berdasarkan grade (A+, A, B+, dll) |
| sort_by | string | Sort by (score/name/devisi), default: score |
| order | string | Order (asc/desc), default: desc |
| page | integer | Halaman (default: 1) |
| limit | integer | Jumlah per halaman (default: 10) |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Laporan performa karyawan berhasil diambil",
  "data": [
    {
      "user_id": 2,
      "nama_lengkap": "Budi Santoso",
      "email": "budi@soerbaja45.com",
      "devisi": {
        "id": 1,
        "nama_devisi": "Designer"
      },
      "periode": "2024-01",
      "total_assessment": 5,
      "avg_score": 85.5,
      "grade": "B+",
      "kpi_results": [
        {
          "kpi_id": 1,
          "nama_kpi": "Kualitas Desain Produk",
          "avg_score": 85.5,
          "jumlah_assessment": 5,
          "grade": "B+",
          "trend": "up"
        }
      ],
      "score_trend": [
        {
          "tanggal": "2024-01-22",
          "score": 88.5
        },
        {
          "tanggal": "2024-01-15",
          "score": 82.0
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPages": 2
  }
}
```

---

### 3. User Detailed Report

**GET** `/employees/:id`

Mendapatkan laporan detail untuk user tertentu.

**Headers:**
```
Authorization: Bearer {access_token}
```

**URL Parameters:**
- `id` (integer, required): User ID

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| start_date | date | Tanggal mulai (YYYY-MM-DD) |
| end_date | date | Tanggal akhir (YYYY-MM-DD) |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 2,
      "nama_lengkap": "Budi Santoso",
      "email": "budi@soerbaja45.com",
      "role": "karyawan",
      "foto_profil": null,
      "devisi": {
        "id": 1,
        "nama_devisi": "Designer"
      }
    },
    "overall_stats": {
      "total_assessment": 25,
      "avg_score": 85.5,
      "grade": "B+",
      "best_score": 95.0,
      "worst_score": 72.0,
      "total_reviewed": 20,
      "total_pending": 5
    },
    "kpi_breakdown": [
      {
        "kpi_id": 1,
        "nama_kpi": "Kualitas Desain Produk",
        "periode": "monthly",
        "total_assessment": 12,
        "avg_score": 85.5,
        "grade": "B+",
        "latest_score": 88.5,
        "trend": "improving"
      }
    ],
    "assessment_history": [
      {
        "id": 45,
        "kpi": {
          "id": 1,
          "nama_kpi": "Kualitas Desain Produk"
        },
        "tanggal_pengisian": "2024-01-22T00:00:00.000Z",
        "total_score": 88.5,
        "grade": "B+",
        "status": "reviewed",
        "catatan_karyawan": "Fokus pada katalog produk",
        "catatan_manager": "Bagus! Terus tingkatkan",
        "submitted_at": "2024-01-22T10:30:00.000Z",
        "reviewed_at": "2024-01-23T09:00:00.000Z"
      }
    ],
    "monthly_trend": [
      {
        "periode": "2024-01",
        "avg_score": 88.5,
        "total_assessment": 5,
        "grade": "B+"
      },
      {
        "periode": "2023-12",
        "avg_score": 82.0,
        "total_assessment": 4,
        "grade": "B"
      }
    ],
    "grade_distribution": {
      "A+": 2,
      "A": 5,
      "B+": 10,
      "B": 6,
      "C+": 2
    },
    "strength_areas": [
      {
        "question": "Kreativitas desain",
        "avg_score": 92.0
      },
      {
        "question": "Ketepatan waktu",
        "avg_score": 90.0
      }
    ],
    "improvement_areas": [
      {
        "question": "Kualitas teknis file",
        "avg_score": 75.0
      },
      {
        "question": "Komunikasi dengan klien",
        "avg_score": 78.0
      }
    ]
  }
}
```

---

### 4. KPI Statistics

**GET** `/kpi/:id/statistics`

Mendapatkan statistik untuk KPI tertentu.

**Headers:**
```
Authorization: Bearer {access_token}
```

**URL Parameters:**
- `id` (integer, required): KPI ID

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| periode | string | Filter periode (2024-01, 2024-Q1, 2024) |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "kpi": {
      "id": 1,
      "nama_kpi": "Kualitas Desain Produk",
      "deskripsi": "Penilaian kualitas dan kreativitas desain",
      "devisi": {
        "id": 1,
        "nama_devisi": "Designer"
      },
      "periode": "monthly"
    },
    "overall_stats": {
      "total_assessment": 50,
      "avg_score": 85.5,
      "grade": "B+",
      "total_user_assessed": 5,
      "completion_rate": 95.0
    },
    "score_distribution": {
      "90-100": 12,
      "80-89": 25,
      "70-79": 10,
      "60-69": 3,
      "0-59": 0
    },
    "grade_distribution": {
      "A+": 5,
      "A": 7,
      "B+": 15,
      "B": 10,
      "C+": 8,
      "C": 4,
      "D": 1
    },
    "question_statistics": [
      {
        "question_id": 1,
        "pertanyaan": "Seberapa kreatif desain yang dihasilkan?",
        "avg_score": 88.0,
        "max_score": 100,
        "min_score": 60,
        "bobot_soal": 25
      },
      {
        "question_id": 2,
        "pertanyaan": "Ketepatan mengikuti brief",
        "avg_score": 85.0,
        "max_score": 100,
        "min_score": 65,
        "bobot_soal": 20
      }
    ],
    "user_performance": [
      {
        "user_id": 2,
        "nama_lengkap": "Budi Santoso",
        "total_assessment": 12,
        "avg_score": 88.5,
        "grade": "B+",
        "latest_score": 90.0
      }
    ],
    "monthly_trend": [
      {
        "periode": "2024-01",
        "avg_score": 85.5,
        "total_assessment": 15
      },
      {
        "periode": "2023-12",
        "avg_score": 83.0,
        "total_assessment": 12
      }
    ]
  }
}
```

---

### 5. Export Report (Future Implementation)

**GET** `/export`

Export laporan ke Excel/PDF.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| format | string | excel/pdf |
| report_type | string | dashboard/employees/kpi |
| devisi_id | integer | Filter devisi |
| periode | string | Filter periode |

**Response:**
File download dengan format yang diminta.

---

## Report Types

### Dashboard
- Overall summary
- Devisi performance
- Recent assessments
- Top performers
- Monthly trends

### Employees
- Individual performance
- KPI breakdown
- Assessment history
- Score trends
- Strength & improvement areas

### KPI Statistics
- Overall KPI stats
- Score distribution
- Question analysis
- User performance per KPI
- Monthly trends

---

## Metrics Explanation

### Completion Rate
```
(Total Assessment Submitted / Total Expected Assessment) * 100
```

### Trend Indicator
- `improving`: Score naik > 5% dari periode sebelumnya
- `declining`: Score turun > 5% dari periode sebelumnya
- `stable`: Perubahan < 5%

### Grade Distribution
Jumlah assessment per grade dalam periode tertentu

### Score Distribution
Jumlah assessment dalam range score tertentu

---

## cURL Examples

### Dashboard Summary
```bash
curl -X GET "http://localhost:3000/api/v1/reports/dashboard?periode=2024-01" \
  -H "Authorization: Bearer MANAGER_TOKEN"
```

### Employee Performance
```bash
curl -X GET "http://localhost:3000/api/v1/reports/employees?devisi_id=1&sort_by=score&order=desc" \
  -H "Authorization: Bearer MANAGER_TOKEN"
```

### User Detailed Report
```bash
curl -X GET "http://localhost:3000/api/v1/reports/employees/2?start_date=2024-01-01&end_date=2024-01-31" \
  -H "Authorization: Bearer MANAGER_TOKEN"
```

### KPI Statistics
```bash
curl -X GET "http://localhost:3000/api/v1/reports/kpi/1/statistics?periode=2024-01" \
  -H "Authorization: Bearer MANAGER_TOKEN"
```

---

## Notes

- Semua endpoint memerlukan role **Manager**
- Data yang ditampilkan real-time dari database
- Periode format: `YYYY-MM` (monthly), `YYYY-Q1` (quarterly), `YYYY` (yearly)
- Score selalu dalam range 0-100
- Grade menggunakan standar: A+, A, B+, B, C+, C, D, E
