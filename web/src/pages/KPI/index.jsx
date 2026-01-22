// ==================== web/src/pages/KPI/index.jsx ====================
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { kpiAPI } from '../../services/api';
import useAuthStore from '../../store/authStore';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import { formatPeriode, getStatusVariant } from '../../utils/helpers';
import toast from 'react-hot-toast';

const KPIPage = () => {
  const { user } = useAuthStore();
  const isManager = user?.role === 'manager';

  const { data, isLoading } = useQuery(
    isManager ? 'kpi-all' : 'kpi-my',
    isManager ? () => kpiAPI.getAll() : () => kpiAPI.getMyKpis()
  );

  const columns = isManager
    ? [
        { header: 'Nama KPI', accessor: 'nama_kpi' },
        { header: 'Devisi', render: (row) => row.devisi?.nama_devisi },
        { header: 'Periode', render: (row) => formatPeriode(row.periode) },
        { header: 'Pertanyaan', render: (row) => <Badge>{row.jumlah_pertanyaan || row.questions?.length || 0}</Badge> },
        { header: 'Status', render: (row) => <Badge variant={row.is_active ? 'success' : 'danger'}>{row.is_active ? 'Aktif' : 'Nonaktif'}</Badge> },
        { header: 'Aksi', render: (row) => <div className="flex gap-2"><Button size="sm" variant="outline"><Eye className="h-4 w-4" /></Button><Button size="sm" variant="outline"><Edit className="h-4 w-4" /></Button></div> },
      ]
    : [
        { header: 'Nama KPI', accessor: 'nama_kpi' },
        { header: 'Periode', render: (row) => formatPeriode(row.periode) },
        { header: 'Status', render: (row) => <Badge variant={getStatusVariant(row.status_pengisian)}>{row.status_pengisian || 'pending'}</Badge> },
        { header: 'Latest Score', render: (row) => row.latest_assessment ? <span className="font-bold text-blue-600">{row.latest_assessment.total_score?.toFixed(1)}</span> : '-' },
        { header: 'Aksi', render: (row) => <Button size="sm">Isi Assessment</Button> },
      ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{isManager ? 'Manajemen KPI' : 'KPI Saya'}</h1>
          <p className="text-gray-600 mt-1">{isManager ? 'Kelola KPI perusahaan' : 'Lihat dan isi KPI assessment'}</p>
        </div>
        {isManager && <Button><Plus className="h-4 w-4 mr-2" /> Tambah KPI</Button>}
      </div>

      <Card>
        <Table columns={columns} data={data?.data?.data || []} loading={isLoading} />
      </Card>
    </div>
  );
};

export default KPIPage;
