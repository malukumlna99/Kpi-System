// ==================== mobile/src/screens/KPIDetailScreen.js ====================
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import QuestionInput from '../components/custom/QuestionInput';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const KPIDetailScreen = ({ route, navigation }) => {
  const { kpi } = route.params;
  const { API_BASE_URL, token } = useAuth();
  
  const [answers, setAnswers] = useState({});
  const [catatan, setCatatan] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleAnswerChange = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value,
    });
    // Clear error for this question
    if (errors[questionId]) {
      setErrors({ ...errors, [questionId]: null });
    }
  };

  const validateAnswers = () => {
    const newErrors = {};
    
    kpi.questions.forEach((question) => {
      if (question.is_mandatory && !answers[question.id]) {
        newErrors[question.id] = 'Pertanyaan wajib dijawab';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateAnswers()) {
      Alert.alert('Validasi Gagal', 'Harap jawab semua pertanyaan wajib');
      return;
    }

    setLoading(true);

    try {
      const formattedAnswers = Object.keys(answers).map((questionId) => ({
        question_id: parseInt(questionId),
        nilai_jawaban: typeof answers[questionId] === 'number' 
          ? answers[questionId] 
          : null,
        jawaban_text: typeof answers[questionId] === 'string' 
          ? answers[questionId] 
          : null,
      }));

      const response = await axios.post(
        `${API_BASE_URL}/assessments/submit`,
        {
          kpi_id: kpi.id,
          answers: formattedAnswers,
          catatan_karyawan: catatan,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert(
        'Berhasil',
        `Assessment berhasil disubmit!\nScore: ${response.data.data.total_score.toFixed(1)}`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert(
        'Gagal',
        error.response?.data?.message || 'Terjadi kesalahan saat submit assessment'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setLoading(true);

    try {
      const formattedAnswers = Object.keys(answers).map((questionId) => ({
        question_id: parseInt(questionId),
        nilai_jawaban: typeof answers[questionId] === 'number' 
          ? answers[questionId] 
          : null,
        jawaban_text: typeof answers[questionId] === 'string' 
          ? answers[questionId] 
          : null,
      }));

      await axios.post(
        `${API_BASE_URL}/assessments/draft`,
        {
          kpi_id: kpi.id,
          answers: formattedAnswers,
          catatan_karyawan: catatan,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert('Berhasil', 'Draft berhasil disimpan', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Save draft error:', error);
      Alert.alert('Gagal', 'Terjadi kesalahan saat menyimpan draft');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{kpi.nama_kpi}</Text>
          {kpi.deskripsi && (
            <Text style={styles.description}>{kpi.deskripsi}</Text>
          )}
        </View>

        <View style={styles.questions}>
          {kpi.questions?.map((question) => (
            <QuestionInput
              key={question.id}
              question={question}
              value={answers[question.id]}
              onChange={(value) => handleAnswerChange(question.id, value)}
              error={errors[question.id]}
            />
          ))}
        </View>

        <View style={styles.notesSection}>
          <Input
            label="Catatan Tambahan (Opsional)"
            placeholder="Tulis catatan atau penjelasan tambahan..."
            value={catatan}
            onChangeText={setCatatan}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.actions}>
          <Button
            title="Simpan sebagai Draft"
            onPress={handleSaveDraft}
            variant="secondary"
            loading={loading}
            style={styles.draftButton}
          />
          <Button
            title="Submit Assessment"
            onPress={handleSubmit}
            variant="primary"
            loading={loading}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  questions: {
    padding: 16,
  },
  notesSection: {
    padding: 16,
    paddingTop: 0,
  },
  actions: {
    padding: 16,
    gap: 12,
  },
  draftButton: {
    marginBottom: 8,
  },
  submitButton: {
    marginBottom: 24,
  },
});

export default KPIDetailScreen;
