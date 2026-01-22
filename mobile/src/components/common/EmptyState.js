// ==================== mobile/src/components/common/EmptyState.js ====================
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from './Button';

const EmptyState = ({ 
  icon = 'inbox', 
  title = 'No Data', 
  message = 'There is no data to display',
  actionLabel,
  onAction
}) => {
  return (
    <View style={styles.container}>
      <Icon name={icon} size={64} color="#d1d5db" />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction && (
        <Button 
          title={actionLabel} 
          onPress={onAction} 
          variant="primary"
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
  },
  message: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
  button: {
    marginTop: 24,
    minWidth: 150,
  },
});

export default EmptyState;
