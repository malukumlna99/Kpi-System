import React from 'react';
import { useQuery } from 'react-query';
import { BarChart3, Users, TrendingUp } from 'lucide-react';
import { reportsAPI } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';

const ReportsPage = () => {
  const { data, isLoading } = useQuery('reports-dashboard', () => reportsAPI.getDashboard());

  if (isLoading) return <Loading fullScreen />;

  const summary = data?.data?.data?.summary || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Laporan & Analytics</h1>
        <p className="text-gray-600 mt-1">Analisis performa dan statistik</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={Users} label="Total Karyawan" value={summary.total_karyawan || 0} color="blue" />
        <StatCard icon={BarChart3} label="Total Assessment" value={summary.assessment_bulan_ini || 0} color="green" />
        <StatCard icon={TrendingUp} label="Avg Score" value={summary.avg_score_keseluruhan?.toFixed(1) || '0'} color="purple" />
      </div>

      <Card>
        <h2 className="text-lg font-bold mb-4">Performa per Devisi</h2>
        <p className="text-gray-500">Chart dan detail akan ditampilkan di sini</p>
      </Card>
    </div>
  );
};

export default ReportsPage;

