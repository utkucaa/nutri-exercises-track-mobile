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
  dietCount: {
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
  dietList: {
    marginBottom: 30,
  },
  dietItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E6ED',
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
    color: '#2C3E50',
  },
  mealTime: {
    fontSize: 14,
    color: '#74B9FF',
    fontWeight: '500',
  },
  foodName: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 8,
    fontWeight: '500',
  },
  dietDescription: {
    fontSize: 14,
    color: '#7F8C8D',
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
    color: '#E74C3C',
    fontWeight: '600',
  },
  planType: {
    fontSize: 12,
    color: '#27AE60',
    fontWeight: '500',
    backgroundColor: '#D5EFDF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dayOfWeek: {
    fontSize: 12,
    color: '#74B9FF',
    fontWeight: '500',
    backgroundColor: '#EBF3FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
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