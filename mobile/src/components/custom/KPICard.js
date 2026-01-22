import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Card from '../common/Card';
import Badge from '../common/Badge';

const KPICard = ({ kpi, onPress }) => {
  const getStatusBadge = () => {
    if (!kpi.latest_assessment) {
      return <Badge label="Belum Dinilai" variant="default" />;
    }
    
    switch (kpi.latest_assessment.status) {
      case 'draft':
        return <Badge label="Draft" variant="warning" />;
      case 'submitted':
        return <Badge label="Menunggu Review" variant="primary" />;
      case 'reviewed':
        return <Badge label="Selesai" variant="success" />;
      default:
        return null;
    }
  };

  const getPeriodeBadge = (periode) => {
    const labels = {
      monthly: 'Bulanan',
      quarterly: 'Per Kuartal',
      yearly: 'Tahunan'
    };
    return labels[periode] || periode;
  };

  return (
    <Card onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="chart-line" size={24} color="#2563eb" />
          <View style={styles.headerText}>
            <Text style={styles.title} numberOfLines={1}>
              {kpi.nama_kpi}
            </Text>
            <Text style={styles.subtitle}>
              {getPeriodeBadge(kpi.periode)} • {kpi.questions?.length || 0} pertanyaan
            </Text>
          </View>
        </View>
      </View>

      {kpi.deskripsi && (
        <Text style={styles.description} numberOfLines={2}>
          {kpi.deskripsi}
        </Text>
      )}

      <View style={styles.footer}>
        {getStatusBadge()}
        {kpi.latest_assessment?.total_score !== undefined && (
          <View style={styles.score}>
            <Text style={styles.scoreLabel}>Score:</Text>
            <Text style={styles.scoreValue}>
              {kpi.latest_assessment.total_score.toFixed(1)}
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  description: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  score: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginRight: 4,
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563eb',
  },
});

export default KPICard;

