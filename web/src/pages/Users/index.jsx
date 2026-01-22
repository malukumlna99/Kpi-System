// ==================== web/src/pages/Users/index.jsx ====================
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { userAPI } from '../../services/api';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const UsersPage = () => {
  const { data, isLoading } = useQuery('users', () => userAPI.getAll());

  const columns = [
    { header: 'Nama', accessor: 'nama_lengkap', render: (row) => <span className="font-semibold">{row.nama_lengkap}</span> },
    { header: 'Email', accessor: 'email' },
    { header: 'Devisi', render: (row) => row.devisi?.nama_devisi },
    { header: 'Role', render: (row) => <Badge variant={row.role === 'manager' ? 'primary' : 'success'}>{row.role}</Badge> },
    { header: 'Status', render: (row) => <Badge variant={row.is_active ? 'success' : 'danger'}>{row.is_active ? 'Aktif' : 'Nonaktif'}</Badge> },
    { header: 'Last Login', render: (row) => formatDate(row.last_login) },
    { header: 'Aksi', render: (row) => <div className="flex gap-2"><Button size="sm" variant="outline"><Edit className="h-4 w-4" /></Button><Button size="sm" variant="danger"><Trash2 className="h-4 w-4" /></Button></div> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Users</h1>
          <p className="text-gray-600 mt-1">Kelola user dan karyawan</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" /> Tambah User</Button>
      </div>

      <Card>
        <Table columns={columns} data={data?.data?.data || []} loading={isLoading} />
      </Card>
    </div>
  );
};

export default UsersPage;
