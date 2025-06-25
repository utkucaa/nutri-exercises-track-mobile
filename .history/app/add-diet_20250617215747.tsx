import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AddDiet() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const memberName = params.memberName as string;
  const memberEmail = params.memberEmail as string;
  const memberId = params.memberId as string;

  const [formData, setFormData] = useState({
    mealName: 'Kahvaltı',
    mealTime: '',
    foodName: '',
    calories: '',
    description: '',
    planType: 'DAILY',
    dayOfWeek: 'Pazartesi'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const mealOptions = ['Kahvaltı', 'Ara Öğün', 'Öğle Yemeği', 'İkindi', 'Akşam Yemeği', 'Gece Atıştırması'];
  const dayOptions = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    // Form validasyon
    if (!formData.foodName.trim()) {
      Alert.alert('Hata', 'Lütfen yemek adı girin!');
      return;
    }

    if (!formData.mealTime.trim()) {
      Alert.alert('Hata', 'Lütfen öğün saati girin! (Örn: 08:00)');
      return;
    }

    if (!formData.calories.trim()) {
      Alert.alert('Hata', 'Lütfen kalori miktarı girin!');
      return;
    }

    const calorieNumber = parseInt(formData.calories);
    if (isNaN(calorieNumber) || calorieNumber <= 0) {
      Alert.alert('Hata', 'Lütfen geçerli bir kalori sayısı girin!');
      return;
    }

    setIsSubmitting(true);

    try {
      // Curl örneklerine göre: POST /api/admin/users/{userId}/diets
      const requestBody: any = {
        mealName: formData.mealName,
        mealTime: formData.mealTime.trim(),
        foodName: formData.foodName.trim(),
        calories: calorieNumber,
        planType: formData.planType
      };

      // Açıklama varsa ekle
      if (formData.description.trim()) {
        requestBody.description = formData.description.trim();
      }

      // Haftalık plan seçildiyse gün ekle
      if (formData.planType === 'WEEKLY') {
        requestBody.dayOfWeek = formData.dayOfWeek;
      }

      console.log('Diyet ekleme isteği:', requestBody);

      const response = await fetch(`http://localhost:8082/api/admin/users/${memberId}/diets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('API Response Status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Diyet başarıyla eklendi:', result);
        Alert.alert('Başarılı', 'Diyet planı başarıyla eklendi!', [
          {
            text: 'Tamam',
            onPress: () => router.back()
          }
        ]);
      } else {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        Alert.alert('Hata', 'Diyet eklenirken hata oluştu!');
      }
    } catch (error) {
      console.error('Error adding diet:', error);
      Alert.alert('Hata', 'Bağlantı hatası! Sunucunun çalıştığından emin olun.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.headerSection}>
            <Text style={styles.memberName}>{memberName}</Text>
            <Text style={styles.pageTitle}>Yeni Diyet Planı Ekle</Text>
          </View>

          <View style={styles.formSection}>
            {/* Öğün Adı */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Öğün Adı</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={formData.mealName}
                  onValueChange={(value) => handleInputChange('mealName', value)}
                  style={styles.picker}
                >
                  {mealOptions.map((meal) => (
                    <Picker.Item key={meal} label={meal} value={meal} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Öğün Saati */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Öğün Saati</Text>
              <TextInput
                style={styles.input}
                value={formData.mealTime}
                onChangeText={(value) => handleInputChange('mealTime', value)}
                placeholder="Örn: 08:00, 12:30, 19:00"
                placeholderTextColor="#999"
                editable={!isSubmitting}
              />
            </View>

            {/* Yemek Adı */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Yemek/Besin Adı</Text>
              <TextInput
                style={styles.input}
                value={formData.foodName}
                onChangeText={(value) => handleInputChange('foodName', value)}
                placeholder="Örn: Yulaf Ezmesi + Muz + Badem"
                placeholderTextColor="#999"
                editable={!isSubmitting}
                multiline
              />
            </View>

            {/* Kalori */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Kalori (kcal)</Text>
              <TextInput
                style={styles.input}
                value={formData.calories}
                onChangeText={(value) => handleInputChange('calories', value)}
                placeholder="Örn: 350"
                placeholderTextColor="#999"
                keyboardType="numeric"
                editable={!isSubmitting}
              />
            </View>

            {/* Açıklama */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Açıklama (İsteğe bağlı)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(value) => handleInputChange('description', value)}
                placeholder="Beslenme notları, hazırlama talimatları..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
                editable={!isSubmitting}
              />
            </View>

            {/* Plan Tipi */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Plan Tipi</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={formData.planType}
                  onValueChange={(value) => handleInputChange('planType', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Günlük Plan" value="DAILY" />
                  <Picker.Item label="Haftalık Plan" value="WEEKLY" />
                </Picker>
              </View>
            </View>

            {/* Haftanın Günü (Sadece haftalık plan seçildiyse) */}
            {formData.planType === 'WEEKLY' && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Haftanın Günü</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={formData.dayOfWeek}
                    onValueChange={(value) => handleInputChange('dayOfWeek', value)}
                    style={styles.picker}
                  >
                    {dayOptions.map((day) => (
                      <Picker.Item key={day} label={day} value={day} />
                    ))}
                  </Picker>
                </View>
              </View>
            )}
          </View>

          <View style={styles.buttonSection}>
            <TouchableOpacity 
              style={[styles.submitButton, isSubmitting && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Ekleniyor...' : 'Diyet Planını Ekle'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => router.back()}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelButtonText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E6ED',
    alignItems: 'center',
  },
  memberName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  pageTitle: {
    fontSize: 16,
    color: '#7F8C8D',
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
    color: '#2C3E50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E6ED',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#2C3E50',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  pickerWrapper: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E6ED',
    borderRadius: 8,
  },
  picker: {
    height: 50,
  },
  buttonSection: {
    gap: 12,
  },
  submitButton: {
    backgroundColor: '#27AE60',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#E74C3C',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 