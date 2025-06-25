import { FitLifeColors } from '@/constants/Colors';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Member {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export default function MemberManagement() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadMembers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8082/api/admin/members');
      if (response.ok) {
        const data = await response.json();
        setMembers(data || []);
        console.log('Üyeler yüklendi:', data?.length || 0, 'üye');
      } else {
        Alert.alert('Hata', 'Üyeler yüklenemedi!');
      }
    } catch (error) {
      console.error('Error loading members:', error);
      Alert.alert('Hata', 'Bağlantı hatası! Sunucunun çalıştığından emin olun.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sayfa ilk açıldığında yükle
  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  // Sayfa her focus olduğunda yeniden yükle (üye ekledikten sonra)
  useFocusEffect(
    useCallback(() => {
      loadMembers();
    }, [loadMembers])
  );

  const handleMemberPress = (member: Member) => {
    router.push({
      pathname: '/member-detail',
      params: { 
        memberId: member.id,
        memberName: member.name,
        memberEmail: member.email
      }
    });
  };

  const renderMember = ({ item }: { item: Member }) => (
    <TouchableOpacity 
      style={styles.memberItem}
      onPress={() => handleMemberPress(item)}
    >
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={styles.memberEmail}>{item.email}</Text>
        {item.createdAt && (
          <Text style={styles.memberDate}>Kayıt: {item.createdAt}</Text>
        )}
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>Üye Yönetimi</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/add-member')}
        >
          <Text style={styles.addButtonText}>+ Yeni Üye</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Üyeler yükleniyor...</Text>
          </View>
        ) : (
          <>
            <Text style={styles.memberCount}>Toplam {members.length} üye</Text>
            
            <FlatList
              data={members}
              renderItem={renderMember}
              keyExtractor={(item) => item.id}
              style={styles.membersList}
              showsVerticalScrollIndicator={false}
              refreshing={isLoading}
              onRefresh={loadMembers}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyIcon}>👥</Text>
                  <Text style={styles.emptyTitle}>Henüz üye yok</Text>
                  <Text style={styles.emptyDescription}>
                    İlk üyeyi eklemek için Yeni Üye butonuna tıklayın
                  </Text>
                </View>
              }
            />
          </>
        )}
      </View>
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
  header: {
    backgroundColor: FitLifeColors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: FitLifeColors.gray,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: FitLifeColors.textPrimary,
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: FitLifeColors.textSecondary,
  },
  actionSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  memberCount: {
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
  membersList: {
    marginBottom: 30,
  },
  memberItem: {
    backgroundColor: FitLifeColors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: FitLifeColors.gray,
    shadowColor: FitLifeColors.primary,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontWeight: '600',
    color: FitLifeColors.textPrimary,
    marginBottom: 4,
  },
  memberEmail: {
    fontSize: 14,
    color: FitLifeColors.textSecondary,
    marginBottom: 8,
  },
  memberDate: {
    fontSize: 12,
    color: FitLifeColors.textSecondary,
  },
  arrow: {
    fontSize: 20,
    color: FitLifeColors.textSecondary,
    marginLeft: 10,
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