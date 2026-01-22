// ==================== web/src/pages/Dashboard.jsx ====================
import React from 'react';
import { useQuery } from 'react-query';
import { Users, ClipboardList, CheckCircle, TrendingUp } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { reportsAPI, kpiAPI, assessmentAPI } from '../services/api';
import StatCard from '../components/common/StatCard';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import Badge from '../components/common/Badge';
import { formatDate, calculateGrade, getGradeColor, getStatusVariant } from '../utils/helpers';

const Dashboard = () => {
  const { user } = useAuthStore();
  const isManager = user?.role === 'manager';

  // Manager Dashboard Data
  const { data: managerData, isLoading: managerLoading } = useQuery(
    ['dashboard-manager'],
    () => reportsAPI.getDashboard(),
    { enabled: isManager }
  );

  // Karyawan Dashboard Data
  const { data: kpiData, isLoading: kpiLoading } = useQuery(
    ['my-kpis'],
    () => kpiAPI.getMyKpis(),
    { enabled: !isManager }
  );

  const { data: historyData, isLoading: historyLoading } = useQuery(
    ['my-history'],
    () => assessmentAPI.getMyHistory({ limit: 5 }),
    { enabled: !isManager }
  );

  if (isManager && managerLoading) return <Loading fullScreen />;
  if (!isManager && (kpiLoading || historyLoading)) return <Loading fullScreen />;

  // Manager Dashboard
  if (isManager) {
    const stats = managerData?.data?.data?.summary || {};
    const recentAssessments = managerData?.data?.data?.recent_assessments || [];

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Manager</h1>
          <p className="text-gray-600 mt-1">Selamat datang, {user?.nama_lengkap}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Users}
            label="Total Karyawan"
            value={stats.total_karyawan || 0}
            color="blue"
          />
          <StatCard
            icon={ClipboardList}
            label="Total KPI"
            value={stats.total_kpi || 0}
            color="purple"
          />
          <StatCard
            icon={CheckCircle}
            label="Assessment Bulan Ini"
            value={stats.assessment_bulan_ini || 0}
            color="green"
          />
          <StatCard
            icon={TrendingUp}
            label="Avg Score"
            value={stats.avg_score_keseluruhan?.toFixed(1) || '0'}
            color="yellow"
          />
        </div>

        {/* Recent Assessments */}
        <Card>
          <h2 className="text-lg font-bold mb-4">Assessment Terbaru</h2>
          <div className="space-y-3">
            {recentAssessments.length > 0 ? (
              recentAssessments.map((assessment) => (
                <div key={assessment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{assessment.user?.nama_lengkap}</p>
                    <p className="text-sm text-gray-600">{assessment.kpi?.nama_kpi}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(assessment.tanggal_pengisian)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        {assessment.total_score?.toFixed(1)}
                      </p>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getGradeColor(calculateGrade(assessment.total_score))}`}>
                        {calculateGrade(assessment.total_score)}
                      </span>
                    </div>
                    <Badge variant={getStatusVariant(assessment.status)}>
                      {assessment.status}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">Belum ada assessment terbaru</p>
            )}
          </div>
        </Card>
      </div>
    );
  }

  // Karyawan Dashboard
  const kpis = kpiData?.data?.data || [];
  const history = historyData?.data?.data || [];
  const pendingKpis = kpis.filter(k => k.status_pengisian === 'pending' || k.status_pengisian === 'draft');
  const avgScore = history.length > 0 
    ? history.reduce((sum, h) => sum + h.total_score, 0) / history.length 
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Selamat datang, {user?.nama_lengkap}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={ClipboardList}
          label="Total KPI"
          value={kpis.length}
          color="blue"
        />
        <StatCard
          icon={CheckCircle}
          label="Pending Assessment"
          value={pendingKpis.length}
          color="yellow"
        />
        <StatCard
          icon={TrendingUp}
          label="Avg Score"
          value={avgScore.toFixed(1)}
          color="green"
        />
      </div>

      {/* Recent History */}
      <Card>
        <h2 className="text-lg font-bold mb-4">Riwayat Penilaian Terbaru</h2>
        <div className="space-y-3">
          {history.length > 0 ? (
            history.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">{item.kpi?.nama_kpi}</p>
                  <p className="text-sm text-gray-600">{formatDate(item.tanggal_pengisian)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xl font-bold text-blue-600">{item.total_score?.toFixed(1)}</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getGradeColor(calculateGrade(item.total_score))}`}>
                      {calculateGrade(item.total_score)}
                    </span>
                  </div>
                  <Badge variant={getStatusVariant(item.status)}>
                    {item.status}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">Belum ada riwayat penilaian</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
