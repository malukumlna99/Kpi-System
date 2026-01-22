import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import KPICard from '../components/custom/KPICard';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';

const KPIScreen = ({ navigation }) => {
  const { API_BASE_URL, token } = useAuth();
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadKPIs();
  }, []);

  const loadKPIs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/kpi/my-kpis`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setKpis(response.data.data || []);
    } catch (error) {
      console.error('Load KPIs error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadKPIs();
  };

  const handleKPIPress = (kpi) => {
    navigation.navigate('KPIDetail', { kpi });
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  if (kpis.length === 0) {
    return (
      <EmptyState
        icon="chart-line"
        title="Tidak Ada KPI"
        message="Belum ada KPI yang tersedia untuk devisi Anda"
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={kpis}
        renderItem={({ item }) => (
          <KPICard kpi={item} onPress={() => handleKPIPress(item)} />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  list: {
    padding: 16,
  },
});

export default KPIScreen;

