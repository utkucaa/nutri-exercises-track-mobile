import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8082/api/admin/members');
      if (response.ok) {
        const data = await response.json();
        setMembers(data || []);
      } else {
        Alert.alert('Hata', 'Üyeler yüklenemedi!');
      }
    } catch (error) {
      console.error('Error loading members:', error);
      Alert.alert('Hata', 'Bağlantı hatası! Sunucunun çalıştığından emin olun.');
    } finally {
      setIsLoading(false);
    }
  };

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
        <Text style={styles.title}>Üye Yönetimi</Text>
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
              style={styles.memberList}
              showsVerticalScrollIndicator={false}
              refreshing={isLoading}
              onRefresh={loadMembers}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyIcon}>👥</Text>
                  <Text style={styles.emptyTitle}>Henüz üye yok</Text>
                  <Text style={styles.emptyDescription}>
                    İlk üyeyi eklemek için "Yeni Üye" butonuna tıklayın
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
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  addButton: {
    backgroundColor: '#74B9FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  memberCount: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 16,
  },
  memberList: {
    flex: 1,
  },
  memberItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E6ED',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  memberEmail: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 2,
  },
  memberDate: {
    fontSize: 12,
    color: '#95A5A6',
  },
  arrow: {
    fontSize: 20,
    color: '#BDC3C7',
    marginLeft: 10,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E6ED',
    marginTop: 40,
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
}); 