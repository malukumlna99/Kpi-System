// ==================== mobile/src/screens/HomeScreen.js ====================
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import Badge from '../components/common/Badge';

const HomeScreen = ({ navigation }) => {
  const { user, API_BASE_URL, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total_kpi: 0,
    pending_assessment: 0,
    completed_this_month: 0,
    avg_score: 0,
  });
  const [recentAssessments, setRecentAssessments] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [kpiResponse, historyResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/kpi/my-kpis`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE_URL}/assessments/my-history?limit=3`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const kpis = kpiResponse.data.data || [];
      const history = historyResponse.data.data || [];

      // Calculate stats
      const pending = kpis.filter(
        (k) => k.status_pengisian === 'pending' || k.status_pengisian === 'draft'
      ).length;
      const completed = history.filter((h) => h.status === 'reviewed').length;
      const avgScore =
        history.length > 0
          ? history.reduce((sum, h) => sum + h.total_score, 0) / history.length
          : 0;

      setStats({
        total_kpi: kpis.length,
        pending_assessment: pending,
        completed_this_month: completed,
        avg_score: avgScore,
      });

      setRecentAssessments(history);
    } catch (error) {
      console.error('Load data error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Halo, {user?.nama_lengkap}!</Text>
          <Text style={styles.role}>{user?.role === 'manager' ? 'Manager' : 'Karyawan'}</Text>
        </View>
        <View style={styles.devisiCard}>
          <Text style={styles.devisiLabel}>Devisi</Text>
          <Text style={styles.devisiName}>{user?.devisi?.nama_devisi}</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          icon="chart-line"
          label="Total KPI"
          value={stats.total_kpi}
          color="#2563eb"
        />
        <StatCard
          icon="clock-outline"
          label="Pending"
          value={stats.pending_assessment}
          color="#f59e0b"
        />
        <StatCard
          icon="check-circle"
          label="Completed"
          value={stats.completed_this_month}
          color="#10b981"
        />
        <StatCard
          icon="star"
          label="Avg Score"
          value={stats.avg_score.toFixed(1)}
          color="#8b5cf6"
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Penilaian Terbaru</Text>
          <TouchableOpacity onPress={() => navigation.navigate('History')}>
            <Text style={styles.seeAll}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>

        {recentAssessments.length > 0 ? (
          recentAssessments.map((assessment) => (
            <Card key={assessment.id} style={styles.assessmentCard}>
              <View style={styles.assessmentHeader}>
                <Text style={styles.assessmentTitle} numberOfLines={1}>
                  {assessment.kpi?.nama_kpi}
                </Text>
                <Badge
                  label={assessment.status === 'reviewed' ? 'Reviewed' : 'Submitted'}
                  variant={assessment.status === 'reviewed' ? 'success' : 'primary'}
                />
              </View>
              <View style={styles.assessmentInfo}>
                <Text style={styles.assessmentDate}>
                  {new Date(assessment.tanggal_pengisian).toLocaleDateString('id-ID')}
                </Text>
                <Text style={styles.assessmentScore}>
                  Score: {assessment.total_score.toFixed(1)}
                </Text>
              </View>
            </Card>
          ))
        ) : (
          <Card>
            <Text style={styles.emptyText}>Belum ada penilaian</Text>
          </Card>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('KPI')}
        >
          <Icon name="chart-line" size={24} color="#2563eb" />
          <Text style={styles.actionText}>Isi Penilaian KPI</Text>
          <Icon name="chevron-right" size={24} color="#9ca3af" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('History')}
        >
          <Icon name="history" size={24} color="#2563eb" />
          <Text style={styles.actionText}>Lihat Riwayat</Text>
          <Icon name="chevron-right" size={24} color="#9ca3af" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <View style={[styles.statCard, { borderLeftColor: color }]}>
    <Icon name={icon} size={28} color={color} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  role: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  devisiCard: {
    backgroundColor: '#eff6ff',
    padding: 12,
    borderRadius: 8,
  },
  devisiLabel: {
    fontSize: 10,
    color: '#1e40af',
    fontWeight: '600',
  },
  devisiName: {
    fontSize: 12,
    color: '#1e3a8a',
    fontWeight: '700',
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    margin: '1%',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  seeAll: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
  },
  assessmentCard: {
    marginBottom: 8,
  },
  assessmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  assessmentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  assessmentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  assessmentDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  assessmentScore: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563eb',
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 12,
  },
});

export default HomeScreen;
