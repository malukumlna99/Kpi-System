// ==================== mobile/src/components/common/Badge.js ====================
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Badge = ({ label, variant = 'default', size = 'medium' }) => {
  return (
    <View style={[styles.badge, styles[variant], styles[size]]}>
      <Text style={[styles.text, styles[`${variant}Text`], styles[`${size}Text`]]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  default: {
    backgroundColor: '#f3f4f6',
  },
  primary: {
    backgroundColor: '#dbeafe',
  },
  success: {
    backgroundColor: '#d1fae5',
  },
  warning: {
    backgroundColor: '#fef3c7',
  },
  danger: {
    backgroundColor: '#fee2e2',
  },
  small: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  medium: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  large: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
  defaultText: {
    color: '#374151',
  },
  primaryText: {
    color: '#1e40af',
  },
  successText: {
    color: '#065f46',
  },
  warningText: {
    color: '#92400e',
  },
  dangerText: {
    color: '#991b1b',
  },
  smallText: {
    fontSize: 10,
  },
  mediumText: {
    fontSize: 12,
  },
  largeText: {
    fontSize: 14,
  },
});

export default Badge;
