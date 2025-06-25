import { FitLifeColors } from '@/constants/Colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AddExercise() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const memberName = params.memberName as string;
  const memberEmail = params.memberEmail as string;
  const memberId = params.memberId as string;

  const [exerciseName, setExerciseName] = useState('');
  const [description, setDescription] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!exerciseName.trim() || !description.trim()) {
      Alert.alert('Hata', 'Egzersiz adı ve açıklama zorunludur!');
      return;
    }

    if (sets.trim() && isNaN(Number(sets))) {
      Alert.alert('Hata', 'Set sayısı geçerli bir rakam olmalıdır!');
      return;
    }

    if (reps.trim() && isNaN(Number(reps))) {
      Alert.alert('Hata', 'Tekrar sayısı geçerli bir rakam olmalıdır!');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Egzersiz ekleniyor:', {
        memberId,
        title: exerciseName.trim(),
        description: description.trim(),
        sets: sets.trim() ? Number(sets) : undefined,
        reps: reps.trim() ? Number(reps) : undefined,
        videoUrl: videoUrl.trim() || undefined
      });

      const response = await fetch(`http://localhost:8082/api/admin/users/${memberId}/exercises`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: exerciseName.trim(),
          description: description.trim(),
          sets: sets.trim() ? Number(sets) : undefined,
          reps: reps.trim() ? Number(reps) : undefined,
          videoUrl: videoUrl.trim() || undefined
        })
      });

      console.log('API Response Status:', response.status);

      if (response.ok) {
        const newExercise = await response.json();
        console.log('Yeni egzersiz eklendi:', newExercise);
        
        Alert.alert(
          'Başarılı', 
          `${exerciseName} egzersizi ${memberName} için eklendi!`,
          [
            {
              text: 'Tamam',
              onPress: () => router.back()
            }
          ]
        );
      } else {
        const errorData = await response.text();
        console.error('API Error:', errorData);
        Alert.alert('Hata', errorData || 'Egzersiz eklenirken hata oluştu!');
      }
    } catch (error) {
      console.error('Error adding exercise:', error);
      Alert.alert('Hata', 'Bağlantı hatası! Sunucunun çalıştığından emin olun.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.headerSection}>
              <Text style={styles.memberName}>{memberName}</Text>
              <Text style={styles.pageTitle}>Egzersiz Ekle</Text>
            </View>

            <View style={styles.formSection}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Egzersiz Adı *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Örn: Squat, Push-up, Plank"
                  placeholderTextColor="#999"
                  value={exerciseName}
                  onChangeText={setExerciseName}
                  autoCapitalize="words"
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Açıklama *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Egzersizin nasıl yapılacağını açıklayın..."
                  placeholderTextColor="#999"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  editable={!isLoading}
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.inputLabel}>Set Sayısı</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="3"
                    placeholderTextColor="#999"
                    value={sets}
                    onChangeText={setSets}
                    keyboardType="numeric"
                    editable={!isLoading}
                  />
                </View>

                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.inputLabel}>Tekrar Sayısı</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="10"
                    placeholderTextColor="#999"
                    value={reps}
                    onChangeText={setReps}
                    keyboardType="numeric"
                    editable={!isLoading}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>YouTube Video Bağlantısı</Text>
                <TextInput
                  style={styles.input}
                  placeholder="https://youtube.com/watch?v=..."
                  placeholderTextColor="#999"
                  value={videoUrl}
                  onChangeText={setVideoUrl}
                  autoCapitalize="none"
                  keyboardType="url"
                  editable={!isLoading}
                />
                <Text style={styles.helperText}>Opsiyonel: Egzersizi gösteren video linki</Text>
              </View>

              <View style={styles.buttonSection}>
                <TouchableOpacity 
                  style={[styles.submitButton, isLoading && styles.disabledButton]} 
                  onPress={handleSave}
                  disabled={isLoading}
                >
                  <Text style={styles.submitButtonText}>
                    {isLoading ? 'Ekleniyor...' : 'Egzersiz Ekle'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => router.back()}
                  disabled={isLoading}
                >
                  <Text style={styles.cancelButtonText}>İptal</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FitLifeColors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  headerSection: {
    backgroundColor: FitLifeColors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: FitLifeColors.gray,
    alignItems: 'center',
  },
  memberName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: FitLifeColors.textPrimary,
    marginBottom: 8,
  },
  pageTitle: {
    fontSize: 16,
    color: FitLifeColors.textSecondary,
  },
  formSection: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: FitLifeColors.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: FitLifeColors.white,
    borderWidth: 1,
    borderColor: FitLifeColors.gray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: FitLifeColors.textPrimary,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  helperText: {
    fontSize: 12,
    color: '#95A5A6',
    marginTop: 4,
  },
  buttonSection: {
    gap: 12,
  },
  submitButton: {
    backgroundColor: FitLifeColors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: FitLifeColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: FitLifeColors.error,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: FitLifeColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
}); 