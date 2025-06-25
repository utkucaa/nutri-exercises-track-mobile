import { FitLifeColors } from '@/constants/Colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Linking, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Exercise {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  sets?: number;
  reps?: number;
}

interface Diet {
  id: string;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealName: string;
  dayOfWeek: string;
}

export default function MemberDashboard() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const userId = params.userId as string;
  const userName = params.userName as string;

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [diets, setDiets] = useState<Diet[]>([]);
  const [activeTab, setActiveTab] = useState<'exercises' | 'diets'>('exercises');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      console.log(`${userName} (ID: ${userId}) için veriler yükleniyor...`);
      
      // Egzersizleri yükle - Curl örneklerine göre: GET /api/v1/users/{userId}/exercises
      const exerciseResponse = await fetch(`http://localhost:8082/api/v1/users/${userId}/exercises`);
      console.log('Egzersiz API Response Status:', exerciseResponse.status);
      
      if (exerciseResponse.ok) {
        const exerciseData = await exerciseResponse.json();
        console.log('Egzersiz verisi:', exerciseData);
        setExercises(exerciseData || []);
      } else {
        console.error('Egzersiz yükleme hatası:', exerciseResponse.status, exerciseResponse.statusText);
      }

      // Diyetleri yükle - Curl örneklerine göre: GET /api/v1/users/{userId}/diets
      const dietResponse = await fetch(`http://localhost:8082/api/v1/users/${userId}/diets`);
      console.log('Diyet API Response Status:', dietResponse.status);
      
      if (dietResponse.ok) {
        const dietData = await dietResponse.json();
        console.log('Diyet verisi:', dietData);
        setDiets(dietData || []);
      } else {
        console.error('Diyet yükleme hatası:', dietResponse.status, dietResponse.statusText);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Hata', 'Veriler yüklenirken hata oluştu!');
    } finally {
      setIsLoading(false);
    }
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
    <View style={styles.itemCard}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
      {item.sets && item.reps && (
        <View style={styles.exerciseDetails}>
          <Text style={styles.detailText}>Set: {item.sets}</Text>
          <Text style={styles.detailText}>Tekrar: {item.reps}</Text>
        </View>
      )}
      {item.videoUrl && (
        <TouchableOpacity 
          style={styles.videoButton}
          onPress={() => handleVideoPress(item.videoUrl)}
        >
          <Text style={styles.videoLink}>📹 Video İzle (YouTube)</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderDiet = ({ item }: { item: Diet }) => (
    <View style={styles.itemCard}>
      <View style={styles.dietHeader}>
        <Text style={styles.itemTitle}>{item.foodName}</Text>
        <Text style={styles.dayBadge}>{item.dayOfWeek}</Text>
      </View>
      <Text style={styles.mealName}>{item.mealName}</Text>
      <View style={styles.nutritionInfo}>
        <Text style={styles.nutritionText}>🔥 {item.calories} kcal</Text>
        <Text style={styles.nutritionText}>🥩 {item.protein}g protein</Text>
        <Text style={styles.nutritionText}>🍞 {item.carbs}g karb</Text>
        <Text style={styles.nutritionText}>🧈 {item.fat}g yağ</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Hoş geldin!</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.logoutText}>Çıkış</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'exercises' && styles.activeTab]}
          onPress={() => setActiveTab('exercises')}
        >
          <Text style={[styles.tabText, activeTab === 'exercises' && styles.activeTabText]}>
            🏋️‍♀️ Spor Programım
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'diets' && styles.activeTab]}
          onPress={() => setActiveTab('diets')}
        >
          <Text style={[styles.tabText, activeTab === 'diets' && styles.activeTabText]}>
            🥗 Diyet Programım
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Yükleniyor...</Text>
          </View>
        ) : (
          <>
            {activeTab === 'exercises' ? (
              <View style={styles.tabContent}>
                <Text style={styles.sectionTitle}>
                  {exercises.length > 0 ? `${exercises.length} egzersiz programın` : 'Henüz egzersiz programın yok'}
                </Text>
                {exercises.length > 0 ? (
                  <FlatList
                    data={exercises}
                    renderItem={renderExercise}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                  />
                ) : (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>🏋️‍♀️</Text>
                    <Text style={styles.emptyTitle}>Henüz egzersiz programın yok</Text>
                    <Text style={styles.emptyDescription}>
                      Antrenörün sana özel bir program hazırladığında burada görünecek
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.tabContent}>
                <Text style={styles.sectionTitle}>
                  {diets.length > 0 ? `${diets.length} beslenme önerisi` : 'Henüz diyet programın yok'}
                </Text>
                {diets.length > 0 ? (
                  <FlatList
                    data={diets}
                    renderItem={renderDiet}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                  />
                ) : (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>🥗</Text>
                    <Text style={styles.emptyTitle}>Henüz diyet programın yok</Text>
                    <Text style={styles.emptyDescription}>
                      Beslenme uzmanın sana özel bir program hazırladığında burada görünecek
                    </Text>
                  </View>
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FitLifeColors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: FitLifeColors.white,
    borderBottomWidth: 1,
    borderBottomColor: FitLifeColors.gray,
  },
  welcomeText: {
    fontSize: 16,
    color: FitLifeColors.textSecondary,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: FitLifeColors.textPrimary,
  },
  logoutButton: {
    backgroundColor: FitLifeColors.error,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: FitLifeColors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: FitLifeColors.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: FitLifeColors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: FitLifeColors.textSecondary,
  },
  activeTabText: {
    color: FitLifeColors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    fontSize: 16,
    color: FitLifeColors.textSecondary,
  },
  tabContent: {
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    color: FitLifeColors.textPrimary,
    fontWeight: '600',
    marginBottom: 16,
  },
  itemCard: {
    backgroundColor: FitLifeColors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: FitLifeColors.gray,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: FitLifeColors.textPrimary,
    marginBottom: 8,
  },
  itemDescription: {
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
  dietHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayBadge: {
    backgroundColor: FitLifeColors.secondary,
    color: FitLifeColors.white,
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mealName: {
    fontSize: 14,
    color: FitLifeColors.textSecondary,
    marginBottom: 12,
  },
  nutritionInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  nutritionText: {
    fontSize: 12,
    color: FitLifeColors.textPrimary,
    fontWeight: '500',
  },
  emptyState: {
    backgroundColor: FitLifeColors.white,
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: FitLifeColors.gray,
    marginTop: 20,
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
}); 