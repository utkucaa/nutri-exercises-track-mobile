import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MemberDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const memberName = params.memberName as string;
  const memberEmail = params.memberEmail as string;
  const memberId = params.memberId as string;

  const handleSportsManagement = () => {
    router.push({
      pathname: '/exercise-management',
      params: { 
        memberId,
        memberName,
        memberEmail
      }
    });
  };

  const handleDietManagement = () => {
    // Diyet yönetimi sayfası henüz yok
    alert('Diyet yönetimi yakında eklenecek!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{memberName}</Text>
          <Text style={styles.memberEmail}>{memberEmail}</Text>
        </View>

        <Text style={styles.sectionTitle}>Yönetim Seçenekleri</Text>

        <View style={styles.optionsContainer}>
          <TouchableOpacity 
            style={styles.optionItem}
            onPress={handleSportsManagement}
          >
            <Text style={styles.optionIcon}>🏋️‍♀️</Text>
            <Text style={styles.optionTitle}>Spor Yönetimi</Text>
            <Text style={styles.optionDescription}>
              Egzersiz programları oluştur ve yönet
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.optionItem, styles.disabledOption]}
            onPress={handleDietManagement}
          >
            <Text style={styles.optionIcon}>🥗</Text>
            <Text style={styles.optionTitle}>Diyet Yönetimi</Text>
            <Text style={styles.optionDescription}>
              Beslenme programları ve kalori takibi
            </Text>
            <Text style={styles.comingSoon}>Yakında</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  memberInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#E0E6ED',
    alignItems: 'center',
  },
  memberName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  memberEmail: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 20,
  },
  optionsContainer: {
    flex: 1,
  },
  optionItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E6ED',
    position: 'relative',
  },
  disabledOption: {
    opacity: 0.6,
  },
  optionIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
  },
  comingSoon: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#F39C12',
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  backButton: {
    backgroundColor: '#74B9FF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 