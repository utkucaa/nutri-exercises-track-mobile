import { FitLifeColors } from '@/constants/Colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface DropdownItem {
  label: string;
  value: string;
}

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
  const [dropdownVisible, setDropdownVisible] = useState('');

  const mealOptions: DropdownItem[] = [
    { label: 'Kahvaltı', value: 'Kahvaltı' },
    { label: 'Ara Öğün', value: 'Ara Öğün' },
    { label: 'Öğle Yemeği', value: 'Öğle Yemeği' },
    { label: 'İkindi', value: 'İkindi' },
    { label: 'Akşam Yemeği', value: 'Akşam Yemeği' },
    { label: 'Gece Atıştırması', value: 'Gece Atıştırması' }
  ];
  
  const planTypeOptions: DropdownItem[] = [
    { label: 'Günlük Plan', value: 'DAILY' },
    { label: 'Haftalık Plan', value: 'WEEKLY' }
  ];
  
  const dayOptions: DropdownItem[] = [
    { label: 'Pazartesi', value: 'Pazartesi' },
    { label: 'Salı', value: 'Salı' },
    { label: 'Çarşamba', value: 'Çarşamba' },
    { label: 'Perşembe', value: 'Perşembe' },
    { label: 'Cuma', value: 'Cuma' },
    { label: 'Cumartesi', value: 'Cumartesi' },
    { label: 'Pazar', value: 'Pazar' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDropdownSelect = (field: string, value: string) => {
    handleInputChange(field, value);
    setDropdownVisible('');
  };

  const renderDropdownItem = ({ item, field }: { item: DropdownItem; field: string }) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => handleDropdownSelect(field, item.value)}
    >
      <Text style={styles.dropdownItemText}>{item.label}</Text>
    </TouchableOpacity>
  );

  const renderDropdown = (field: string, options: DropdownItem[], currentValue: string) => {
    const currentLabel = options.find(option => option.value === currentValue)?.label || currentValue;
    
    return (
      <>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setDropdownVisible(field)}
        >
          <Text style={styles.dropdownButtonText}>{currentLabel}</Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>
        
        <Modal
          visible={dropdownVisible === field}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setDropdownVisible('')}
        >
          <TouchableOpacity
            style={styles.dropdownOverlay}
            onPress={() => setDropdownVisible('')}
          >
            <View style={styles.dropdownMenu}>
              <FlatList
                data={options}
                renderItem={({ item }) => renderDropdownItem({ item, field })}
                keyExtractor={(item) => item.value}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </>
    );
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
              {renderDropdown('mealName', mealOptions, formData.mealName)}
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
              {renderDropdown('planType', planTypeOptions, formData.planType)}
            </View>

            {/* Haftanın Günü (Sadece haftalık plan seçildiyse) */}
            {formData.planType === 'WEEKLY' && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Haftanın Günü</Text>
                {renderDropdown('dayOfWeek', dayOptions, formData.dayOfWeek)}
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
    backgroundColor: FitLifeColors.background,
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
  dropdownButton: {
    backgroundColor: FitLifeColors.white,
    borderWidth: 1,
    borderColor: FitLifeColors.gray,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: FitLifeColors.textPrimary,
  },
  dropdownArrow: {
    fontSize: 12,
    color: FitLifeColors.textSecondary,
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownMenu: {
    backgroundColor: FitLifeColors.white,
    borderRadius: 8,
    width: '80%',
    maxHeight: 300,
    borderWidth: 1,
    borderColor: FitLifeColors.gray,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: FitLifeColors.lightGray,
  },
  dropdownItemText: {
    fontSize: 16,
    color: FitLifeColors.textPrimary,
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