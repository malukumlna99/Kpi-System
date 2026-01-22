import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import AssessmentCard from '../components/custom/AssessmentCard';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';

const HistoryScreen = ({ navigation }) => {
  const { API_BASE_URL, token } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async (page = 1) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/assessments/my-history?page=${page}&limit=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { data, pagination: paginationData } = response.data;

      if (page === 1) {
        setAssessments(data || []);
      } else {
        setAssessments([...assessments, ...(data || [])]);
      }

      setPagination(paginationData);
    } catch (error) {
      console.error('Load history error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadHistory(1);
  };

  const handleLoadMore = () => {
    if (pagination.page < Math.ceil(pagination.total / pagination.limit)) {
      loadHistory(pagination.page + 1);
    }
  };

  const handleAssessmentPress = async (assessment) => {
    // Navigate to detail view (not implemented in this version)
    console.log('View assessment:', assessment.id);
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  if (assessments.length === 0) {
    return (
      <EmptyState
        icon="history"
        title="Tidak Ada Riwayat"
        message="Anda belum pernah mengisi assessment"
        actionLabel="Isi Assessment"
        onAction={() => navigation.navigate('KPI')}
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={assessments}
        renderItem={({ item }) => (
          <AssessmentCard
            assessment={item}
            onPress={() => handleAssessmentPress(item)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
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

export default HistoryScreen;

