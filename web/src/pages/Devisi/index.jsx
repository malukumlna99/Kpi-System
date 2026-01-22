import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { devisiAPI } from '../../services/api';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import toast from 'react-hot-toast';

const DevisiPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDevisi, setEditingDevisi] = useState(null);
  const [formData, setFormData] = useState({ nama_devisi: '', deskripsi: '' });

  const { data, isLoading } = useQuery('devisi', () => devisiAPI.getAll());

  const createMutation = useMutation(devisiAPI.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('devisi');
      toast.success('Devisi berhasil dibuat');
      handleCloseModal();
    },
  });

  const updateMutation = useMutation(
    ({ id, data }) => devisiAPI.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('devisi');
        toast.success('Devisi berhasil diupdate');
        handleCloseModal();
      },
    }
  );

  const deleteMutation = useMutation(devisiAPI.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('devisi');
      toast.success('Devisi berhasil dihapus');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingDevisi) {
      updateMutation.mutate({ id: editingDevisi.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (devisi) => {
    setEditingDevisi(devisi);
    setFormData({ nama_devisi: devisi.nama_devisi, deskripsi: devisi.deskripsi });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus devisi ini?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDevisi(null);
    setFormData({ nama_devisi: '', deskripsi: '' });
  };

  const columns = [
    { header: 'Nama Devisi', accessor: 'nama_devisi', render: (row) => <span className="font-semibold">{row.nama_devisi}</span> },
    { header: 'Deskripsi', accessor: 'deskripsi' },
    { header: 'Karyawan', render: (row) => <Badge variant="primary">{row.jumlah_karyawan || 0}</Badge> },
    { header: 'KPI', render: (row) => <Badge variant="success">{row.jumlah_kpi || 0}</Badge> },
    { header: 'Status', render: (row) => <Badge variant={row.is_active ? 'success' : 'danger'}>{row.is_active ? 'Aktif' : 'Nonaktif'}</Badge> },
    {
      header: 'Aksi',
      render: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => handleEdit(row)}><Edit className="h-4 w-4" /></Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(row.id)}><Trash2 className="h-4 w-4" /></Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Devisi</h1>
          <p className="text-gray-600 mt-1">Kelola devisi/departemen perusahaan</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}><Plus className="h-4 w-4 mr-2" /> Tambah Devisi</Button>
      </div>

      <Card>
        <Table columns={columns} data={data?.data?.data || []} loading={isLoading} />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingDevisi ? 'Edit Devisi' : 'Tambah Devisi'}
        footer={
          <>
            <Button variant="outline" onClick={handleCloseModal}>Batal</Button>
            <Button onClick={handleSubmit} loading={createMutation.isLoading || updateMutation.isLoading}>Simpan</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nama Devisi" value={formData.nama_devisi} onChange={(e) => setFormData({ ...formData, nama_devisi: e.target.value })} required />
          <Input label="Deskripsi" value={formData.deskripsi} onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })} />
        </form>
      </Modal>
    </div>
  );
};

export default DevisiPage;

