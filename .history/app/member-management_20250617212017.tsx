import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Member {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function MemberManagement() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([
    {
      id: '1',
      name: 'Ahmet Yılmaz',
      email: 'ahmet@example.com',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Ayşe Demir',
      email: 'ayse@example.com',
      createdAt: '2024-01-20'
    }
  ]);

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
        <Text style={styles.memberDate}>Kayıt: {item.createdAt}</Text>
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
        <Text style={styles.memberCount}>Toplam {members.length} üye</Text>
        
        <FlatList
          data={members}
          renderItem={renderMember}
          keyExtractor={(item) => item.id}
          style={styles.memberList}
          showsVerticalScrollIndicator={false}
        />
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
}); 