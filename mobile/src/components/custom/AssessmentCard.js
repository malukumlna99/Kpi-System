import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import Card from '../common/Card';
import Badge from '../common/Badge';

const AssessmentCard = ({ assessment, onPress }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'draft':
        return <Badge label="Draft" variant="warning" />;
      case 'submitted':
        return <Badge label="Submitted" variant="primary" />;
      case 'reviewed':
        return <Badge label="Reviewed" variant="success" />;
      default:
        return null;
    }
  };

  const getGradeBadge = (score) => {
    if (score >= 95) return <Badge label="A+" variant="success" />;
    if (score >= 90) return <Badge label="A" variant="success" />;
    if (score >= 85) return <Badge label="B+" variant="primary" />;
    if (score >= 80) return <Badge label="B" variant="primary" />;
    if (score >= 75) return <Badge label="C+" variant="warning" />;
    if (score >= 70) return <Badge label="C" variant="warning" />;
    return <Badge label="D" variant="danger" />;
  };

  return (
    <Card onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.kpiName} numberOfLines={1}>
          {assessment.kpi?.nama_kpi}
        </Text>
        {getStatusBadge(assessment.status)}
      </View>

      <View style={styles.info}>
        <Text style={styles.date}>
          {format(new Date(assessment.tanggal_pengisian), 'dd MMMM yyyy', { locale: id })}
        </Text>
      </View>

      {assessment.total_score !== null && (
        <View style={styles.scoreContainer}>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>Score</Text>
            <Text style={styles.scoreValue}>{assessment.total_score.toFixed(1)}</Text>
          </View>
          <View style={styles.gradeBox}>
            {getGradeBadge(assessment.total_score)}
          </View>
        </View>
      )}

      {assessment.catatan_manager && (
        <View style={styles.feedback}>
          <Text style={styles.feedbackLabel}>Feedback Manager:</Text>
          <Text style={styles.feedbackText} numberOfLines={2}>
            {assessment.catatan_manager}
          </Text>
        </View>
      )}
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
  kpiName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  info: {
    marginBottom: 12,
  },
  date: {
    fontSize: 12,
    color: '#6b7280',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  scoreBox: {
    flex: 1,
  },
  scoreLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2563eb',
  },
  gradeBox: {
    alignItems: 'flex-end',
  },
  feedback: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  feedbackLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  feedbackText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
});

export default AssessmentCard;

