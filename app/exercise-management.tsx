import { FitLifeColors } from '@/constants/Colors';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Linking, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

  const loadExercises = useCallback(async () => {
    setIsLoading(true);
    try {
      // Curl örneklerine göre: GET /api/v1/users/{userId}/exercises
      const response = await fetch(`http://localhost:8082/api/v1/users/${memberId}/exercises`);
      if (response.ok) {
        const data = await response.json();
        setExercises(data || []);
        console.log(`${memberName} için egzersizler yüklendi:`, data?.length || 0, 'egzersiz');
      } else {
        console.error('API Response:', response.status, response.statusText);
        Alert.alert('Hata', 'Egzersizler yüklenemedi!');
      }
    } catch (error) {
      console.error('Error loading exercises:', error);
      Alert.alert('Hata', 'Bağlantı hatası! Sunucunun çalıştığından emin olun.');
    } finally {
      setIsLoading(false);
    }
  }, [memberId, memberName]);

  // Sayfa ilk açıldığında yükle
  useEffect(() => {
    loadExercises();
  }, [loadExercises]);

  // Sayfa her focus olduğunda yeniden yükle (egzersiz ekledikten sonra)
  useFocusEffect(
    useCallback(() => {
      loadExercises();
    }, [loadExercises])
  );

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

  const handleVideoPress = async (videoUrl: string) => {
    try {
      const supported = await Linking.canOpenURL(videoUrl);
      if (supported) {
        await Linking.openURL(videoUrl);
      } else {
        Alert.alert('Hata', 'Video linki açılamıyor!');
      }
    } catch (error) {
      console.error('Error opening video:', error);
      Alert.alert('Hata', 'Video açılırken hata oluştu!');
    }
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
        <TouchableOpacity 
          style={styles.videoButton}
          onPress={() => handleVideoPress(item.videoUrl!)}
        >
          <Text style={styles.videoLink}>📹 Video İzle (YouTube)</Text>
        </TouchableOpacity>
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
  memberInfo: {
    backgroundColor: FitLifeColors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: FitLifeColors.gray,
    alignItems: 'center',
  },
  memberName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: FitLifeColors.textPrimary,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    color: FitLifeColors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  exerciseCount: {
    fontSize: 14,
    color: FitLifeColors.textLight,
  },
  addButton: {
    backgroundColor: FitLifeColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: FitLifeColors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    backgroundColor: FitLifeColors.white,
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: FitLifeColors.gray,
  },
  loadingText: {
    fontSize: 16,
    color: FitLifeColors.textSecondary,
  },
  exerciseList: {
    marginBottom: 30,
  },
  exerciseItem: {
    backgroundColor: FitLifeColors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: FitLifeColors.gray,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    color: FitLifeColors.textPrimary,
    marginBottom: 8,
  },
  exerciseDescription: {
    fontSize: 14,
    color: FitLifeColors.textSecondary,
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
    color: FitLifeColors.textPrimary,
    fontWeight: '500',
  },
  videoButton: {
    backgroundColor: FitLifeColors.accent,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  videoLink: {
    fontSize: 12,
    color: FitLifeColors.white,
    fontWeight: '600',
  },
  emptyState: {
    backgroundColor: FitLifeColors.white,
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: FitLifeColors.gray,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: FitLifeColors.textPrimary,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: FitLifeColors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  backButton: {
    backgroundColor: FitLifeColors.secondary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  backButtonText: {
    color: FitLifeColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
}); 