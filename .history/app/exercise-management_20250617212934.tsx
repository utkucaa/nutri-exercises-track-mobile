import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Exercise {
  id: string;
  title: string;
  description: string;
  sets?: number;
  reps?: number;
  videoUrl?: string;
}

export default function ExerciseManagement() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const memberName = params.memberName as string;
  const memberEmail = params.memberEmail as string;
  const memberId = params.memberId as string;

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExercises();
  }, [memberId]);

  const loadExercises = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8082/api/v1/users/${memberId}/exercises`);
      if (response.ok) {
        const data = await response.json();
        setExercises(data || []);
      } else {
        Alert.alert('Hata', 'Egzersizler yüklenemedi!');
      }
    } catch (error) {
      console.error('Error loading exercises:', error);
      Alert.alert('Hata', 'Bağlantı hatası! Sunucunun çalıştığından emin olun.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddExercise = () => {
    router.push({
      pathname: '/add-exercise',
      params: { 
        memberId,
        memberName,
        memberEmail
      }
    });
  };

  const renderExercise = ({ item }: { item: Exercise }) => (
    <View style={styles.exerciseItem}>
      <Text style={styles.exerciseName}>{item.title}</Text>
      <Text style={styles.exerciseDescription}>{item.description}</Text>
      {(item.sets || item.reps) && (
        <View style={styles.exerciseDetails}>
          {item.sets && <Text style={styles.detailText}>Set: {item.sets}</Text>}
          {item.reps && <Text style={styles.detailText}>Tekrar: {item.reps}</Text>}
        </View>
      )}
      {item.videoUrl && (
        <Text style={styles.videoLink}>📹 Video mevcut</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>{memberName}</Text>
            <Text style={styles.sectionTitle}>Spor Programı</Text>
          </View>

          <View style={styles.header}>
            <Text style={styles.exerciseCount}>
              {isLoading ? 'Yükleniyor...' : `${exercises.length} egzersiz mevcut`}
            </Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddExercise}
            >
              <Text style={styles.addButtonText}>+ Egzersiz Ekle</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.exerciseList}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Egzersizler yükleniyor...</Text>
              </View>
            ) : exercises.length > 0 ? (
              <FlatList
                data={exercises}
                renderItem={renderExercise}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                refreshing={isLoading}
                onRefresh={loadExercises}
              />
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🏋️‍♀️</Text>
                <Text style={styles.emptyTitle}>Henüz egzersiz eklenmemiş</Text>
                <Text style={styles.emptyDescription}>
                  Yukarıdaki Egzersiz Ekle butonuna tıklayarak başlayın
                </Text>
              </View>
            )}
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
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E6ED',
    alignItems: 'center',
  },
  memberName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  exerciseCount: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  addButton: {
    backgroundColor: '#27AE60',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E6ED',
  },
  loadingText: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  exerciseList: {
    marginBottom: 30,
  },
  exerciseItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E6ED',
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 12,
    lineHeight: 20,
  },
  exerciseDetails: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '500',
  },
  videoLink: {
    fontSize: 12,
    color: '#74B9FF',
    fontWeight: '500',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E6ED',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
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