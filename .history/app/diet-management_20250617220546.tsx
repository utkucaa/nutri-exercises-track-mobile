import { FitLifeColors } from '@/constants/Colors';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Diet {
  id: string;
  mealName: string;
  mealTime: string;
  foodName: string;
  calories: number;
  description?: string;
  planType: string;
  dayOfWeek?: string;
}

export default function DietManagement() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const memberName = params.memberName as string;
  const memberEmail = params.memberEmail as string;
  const memberId = params.memberId as string;

  const [diets, setDiets] = useState<Diet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDiets = useCallback(async () => {
    setIsLoading(true);
    try {
      // Curl örneklerine göre: GET /api/v1/users/{userId}/diets
      const response = await fetch(`http://localhost:8082/api/v1/users/${memberId}/diets`);
      if (response.ok) {
        const data = await response.json();
        setDiets(data || []);
        console.log(`${memberName} için diyetler yüklendi:`, data?.length || 0, 'diyet');
      } else {
        console.error('API Response:', response.status, response.statusText);
        Alert.alert('Hata', 'Diyetler yüklenemedi!');
      }
    } catch (error) {
      console.error('Error loading diets:', error);
      Alert.alert('Hata', 'Bağlantı hatası! Sunucunun çalıştığından emin olun.');
    } finally {
      setIsLoading(false);
    }
  }, [memberId, memberName]);

  // Sayfa ilk açıldığında yükle
  useEffect(() => {
    loadDiets();
  }, [loadDiets]);

  // Sayfa her focus olduğunda yeniden yükle (diyet ekledikten sonra)
  useFocusEffect(
    useCallback(() => {
      loadDiets();
    }, [loadDiets])
  );

  const handleAddDiet = () => {
    router.push({
      pathname: '/add-diet',
      params: { 
        memberId,
        memberName,
        memberEmail
      }
    });
  };

  const renderDiet = ({ item }: { item: Diet }) => (
    <View style={styles.dietItem}>
      <View style={styles.dietHeader}>
        <Text style={styles.mealName}>{item.mealName}</Text>
        <Text style={styles.mealTime}>⏰ {item.mealTime}</Text>
      </View>
      <Text style={styles.foodName}>{item.foodName}</Text>
      {item.description && (
        <Text style={styles.dietDescription}>{item.description}</Text>
      )}
      <View style={styles.dietDetails}>
        <Text style={styles.calorieText}>🔥 {item.calories} kcal</Text>
        <Text style={styles.planType}>{item.planType === 'DAILY' ? 'Günlük' : 'Haftalık'}</Text>
        {item.dayOfWeek && (
          <Text style={styles.dayOfWeek}>{item.dayOfWeek}</Text>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>{memberName}</Text>
            <Text style={styles.sectionTitle}>Diyet Programı</Text>
          </View>

          <View style={styles.header}>
            <Text style={styles.dietCount}>
              {isLoading ? 'Yükleniyor...' : `${diets.length} diyet planı mevcut`}
            </Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddDiet}
            >
              <Text style={styles.addButtonText}>+ Diyet Ekle</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dietList}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Diyetler yükleniyor...</Text>
              </View>
            ) : diets.length > 0 ? (
              <FlatList
                data={diets}
                renderItem={renderDiet}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                refreshing={isLoading}
                onRefresh={loadDiets}
              />
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🥗</Text>
                <Text style={styles.emptyTitle}>Henüz diyet planı eklenmemiş</Text>
                <Text style={styles.emptyDescription}>
                  Yukarıdaki Diyet Ekle butonuna tıklayarak başlayın
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
  dietCount: {
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
  dietList: {
    marginBottom: 30,
  },
  dietItem: {
    backgroundColor: FitLifeColors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: FitLifeColors.gray,
  },
  dietHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealName: {
    fontSize: 18,
    fontWeight: '600',
    color: FitLifeColors.textPrimary,
  },
  mealTime: {
    fontSize: 14,
    color: FitLifeColors.accent,
    fontWeight: '500',
  },
  foodName: {
    fontSize: 16,
    color: FitLifeColors.textPrimary,
    marginBottom: 8,
    fontWeight: '500',
  },
  dietDescription: {
    fontSize: 14,
    color: FitLifeColors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  dietDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    alignItems: 'center',
  },
  calorieText: {
    fontSize: 14,
    color: FitLifeColors.accentDark,
    fontWeight: '600',
  },
  planType: {
    fontSize: 12,
    color: FitLifeColors.primary,
    fontWeight: '500',
    backgroundColor: FitLifeColors.accentLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dayOfWeek: {
    fontSize: 12,
    color: FitLifeColors.secondary,
    fontWeight: '500',
    backgroundColor: FitLifeColors.secondaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
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