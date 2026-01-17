require('dotenv').config();
const { sequelize } = require('../config/database');
const {
  Devisi,
  User,
  Kpi,
  KpiQuestion,
} = require('../models');

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Sync database
    await sequelize.sync({ force: true });
    console.log('✅ Database synced');

    // 1. Create Devisi
    const devisi = await Devisi.bulkCreate([
      {
        nama_devisi: 'Designer',
        deskripsi: 'Tim desain grafis dan creative',
        is_active: true,
      },
      {
        nama_devisi: 'Marketing',
        deskripsi: 'Tim pemasaran dan promosi',
        is_active: true,
      },
      {
        nama_devisi: 'Production',
        deskripsi: 'Tim produksi percetakan',
        is_active: true,
      },
      {
        nama_devisi: 'Sales',
        deskripsi: 'Tim penjualan',
        is_active: true,
      },
      {
        nama_devisi: 'Finance',
        deskripsi: 'Tim keuangan dan akuntansi',
        is_active: true,
      },
      {
        nama_devisi: 'Management',
        deskripsi: 'Tim manajemen',
        is_active: true,
      },
    ]);
    console.log('✅ Devisi created');

    // 2. Create Manager
    const manager = await User.create({
      devisi_id: devisi[5].id, // Management
      nama_lengkap: 'John Doe',
      email: 'manager@soerbaja45.com',
      password: 'Manager123',
      role: 'manager',
      is_active: true,
    });
    console.log('✅ Manager created');

    // 3. Create Karyawan
    const karyawan = await User.bulkCreate([
      {
        devisi_id: devisi[0].id, // Designer
        nama_lengkap: 'Budi Santoso',
        email: 'budi@soerbaja45.com',
        password: 'Karyawan123',
        role: 'karyawan',
        is_active: true,
      },
      {
        devisi_id: devisi[0].id,
        nama_lengkap: 'Siti Aminah',
        email: 'siti@soerbaja45.com',
        password: 'Karyawan123',
        role: 'karyawan',
        is_active: true,
      },
      {
        devisi_id: devisi[1].id, // Marketing
        nama_lengkap: 'Ahmad Pratama',
        email: 'ahmad@soerbaja45.com',
        password: 'Karyawan123',
        role: 'karyawan',
        is_active: true,
      },
      {
        devisi_id: devisi[2].id, // Production
        nama_lengkap: 'Rina Wijaya',
        email: 'rina@soerbaja45.com',
        password: 'Karyawan123',
        role: 'karyawan',
        is_active: true,
      },
      {
        devisi_id: devisi[3].id, // Sales
        nama_lengkap: 'Dedi Kusuma',
        email: 'dedi@soerbaja45.com',
        password: 'Karyawan123',
        role: 'karyawan',
        is_active: true,
      },
    ]);
    console.log('✅ Karyawan created');

    // 4. Create KPI for Designer
    const kpiDesigner = await Kpi.create({
      devisi_id: devisi[0].id,
      nama_kpi: 'Kualitas Desain Produk',
      deskripsi: 'Penilaian kualitas dan kreativitas desain yang dihasilkan',
      periode: 'monthly',
      bobot: 100,
      is_active: true,
    });

    await KpiQuestion.bulkCreate([
      {
        kpi_id: kpiDesigner.id,
        pertanyaan: 'Seberapa kreatif desain yang dihasilkan?',
        tipe_jawaban: 'numeric_1_5',
        bobot_soal: 25,
        urutan: 1,
        is_mandatory: true,
      },
      {
        kpi_id: kpiDesigner.id,
        pertanyaan: 'Ketepatan dalam mengikuti brief klien',
        tipe_jawaban: 'numeric_1_5',
        bobot_soal: 20,
        urutan: 2,
        is_mandatory: true,
      },
      {
        kpi_id: kpiDesigner.id,
        pertanyaan: 'Kecepatan penyelesaian desain',
        tipe_jawaban: 'numeric_1_5',
        bobot_soal: 20,
        urutan: 3,
        is_mandatory: true,
      },
      {
        kpi_id: kpiDesigner.id,
        pertanyaan: 'Tingkat revisi yang dibutuhkan',
        tipe_jawaban: 'numeric_1_5',
        bobot_soal: 15,
        urutan: 4,
        is_mandatory: true,
      },
      {
        kpi_id: kpiDesigner.id,
        pertanyaan: 'Kualitas file output (teknis)',
        tipe_jawaban: 'numeric_0_100',
        bobot_soal: 20,
        urutan: 5,
        is_mandatory: true,
      },
    ]);

    // 5. Create KPI for Marketing
    const kpiMarketing = await Kpi.create({
      devisi_id: devisi[1].id,
      nama_kpi: 'Efektivitas Marketing Campaign',
      deskripsi: 'Penilaian efektivitas campaign dan reach',
      periode: 'monthly',
      bobot: 100,
      is_active: true,
    });

    await KpiQuestion.bulkCreate([
      {
        kpi_id: kpiMarketing.id,
        pertanyaan: 'Tingkat engagement social media',
        tipe_jawaban: 'numeric_0_100',
        bobot_soal: 30,
        urutan: 1,
        is_mandatory: true,
      },
      {
        kpi_id: kpiMarketing.id,
        pertanyaan: 'Jumlah leads yang dihasilkan',
        tipe_jawaban: 'numeric_0_100',
        bobot_soal: 35,
        urutan: 2,
        is_mandatory: true,
      },
      {
        kpi_id: kpiMarketing.id,
        pertanyaan: 'Kreativitas konten marketing',
        tipe_jawaban: 'numeric_1_5',
        bobot_soal: 20,
        urutan: 3,
        is_mandatory: true,
      },
      {
        kpi_id: kpiMarketing.id,
        pertanyaan: 'Konsistensi posting schedule',
        tipe_jawaban: 'numeric_1_5',
        bobot_soal: 15,
        urutan: 4,
        is_mandatory: true,
      },
    ]);

    console.log('✅ KPI and Questions created');

    console.log('\n🎉 Seeding completed successfully!');
    console.log('\n📝 Default Credentials:');
    console.log('Manager: manager@soerbaja45.com / Manager123');
    console.log('Karyawan: budi@soerbaja45.com / Karyawan123');
    console.log('         siti@soerbaja45.com / Karyawan123');
    console.log('         ahmad@soerbaja45.com / Karyawan123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();