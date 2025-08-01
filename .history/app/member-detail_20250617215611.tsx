import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MemberDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const memberName = params.memberName as string;
  const memberEmail = params.memberEmail as string;
  const memberId = params.memberId as string;

  const handleExerciseManagement = () => {
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
    router.push({
      pathname: '/diet-management',
      params: { 
        memberId,
        memberName,
        memberEmail
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>{memberName}</Text>
            <Text style={styles.memberEmail}>{memberEmail}</Text>
          </View>

          <View style={styles.managementSection}>
            <Text style={styles.sectionTitle}>Program Yönetimi</Text>
            
            <TouchableOpacity 
              style={styles.managementCard}
              onPress={handleExerciseManagement}
            >
              <View style={styles.cardIcon}>
                <Text style={styles.cardEmoji}>🏋️‍♀️</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Spor Programı</Text>
                <Text style={styles.cardDescription}>
                  Egzersiz planları ve antrenman programlarını yönet
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.managementCard}
              onPress={handleDietManagement}
            >
              <View style={styles.cardIcon}>
                <Text style={styles.cardEmoji}>🥗</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Diyet Programı</Text>
                <Text style={styles.cardDescription}>
                  Beslenme planları ve diyet programlarını yönet
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Geri Dön</Text>
          </TouchableOpacity>
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
  managementSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 20,
  },
  managementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E6ED',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    marginRight: 16,
  },
  cardEmoji: {
    fontSize: 40,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
  },
  backButton: {
    backgroundColor: '#74B9FF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 