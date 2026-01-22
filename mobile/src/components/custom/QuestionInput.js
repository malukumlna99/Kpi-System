// ==================== mobile/src/components/custom/QuestionInput.js ====================
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import Slider from '@react-native-community/slider';

const QuestionInput = ({ question, value, onChange, error }) => {
  const renderInput = () => {
    switch (question.tipe_jawaban) {
      case 'numeric_1_5':
        return (
          <View>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={5}
              step={1}
              value={value || 3}
              onValueChange={onChange}
              minimumTrackTintColor="#2563eb"
              maximumTrackTintColor="#d1d5db"
              thumbTintColor="#2563eb"
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>1 (Sangat Kurang)</Text>
              <Text style={styles.sliderValue}>{value || 3}</Text>
              <Text style={styles.sliderLabel}>5 (Sangat Baik)</Text>
            </View>
          </View>
        );

      case 'numeric_0_100':
        return (
          <TextInput
            mode="outlined"
            keyboardType="numeric"
            value={value?.toString() || ''}
            onChangeText={(text) => {
              const numValue = parseInt(text) || 0;
              if (numValue >= 0 && numValue <= 100) {
                onChange(numValue);
              }
            }}
            placeholder="0-100"
            error={!!error}
            style={styles.textInput}
          />
        );

      case 'text':
        return (
          <TextInput
            mode="outlined"
            multiline
            numberOfLines={4}
            value={value || ''}
            onChangeText={onChange}
            placeholder="Tulis jawaban Anda..."
            error={!!error}
            style={styles.textInput}
          />
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.questionHeader}>
        <Text style={styles.questionText}>{question.pertanyaan}</Text>
        {question.is_mandatory && (
          <Text style={styles.required}>*</Text>
        )}
      </View>
      
      <Text style={styles.questionInfo}>
        Bobot: {question.bobot_soal}%
      </Text>

      {renderInput()}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  questionHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    lineHeight: 20,
  },
  required: {
    color: '#dc2626',
    fontSize: 16,
    marginLeft: 4,
  },
  questionInfo: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 12,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  sliderLabel: {
    fontSize: 11,
    color: '#6b7280',
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563eb',
  },
  textInput: {
    backgroundColor: '#ffffff',
  },
  errorText: {
    fontSize: 12,
    color: '#dc2626',
    marginTop: 4,
  },
});

export default QuestionInput;
