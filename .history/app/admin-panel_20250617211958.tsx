import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AdminPanel() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Admin Panel</Text>
        <Text style={styles.subtitle}>FitLife Yönetim Sistemi</Text>
        
        <View style={styles.menuContainer}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/member-management')}
          >
            <Text style={styles.menuIcon}>👥</Text>
            <Text style={styles.menuText}>Üye Yönetimi</Text>
            <Text style={styles.menuDescription}>Üyeleri görüntüle ve yönet</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, styles.disabledItem]}
            disabled
          >
            <Text style={styles.menuIcon}>📊</Text>
            <Text style={[styles.menuText, styles.disabledText]}>Raporlar</Text>
            <Text style={[styles.menuDescription, styles.disabledText]}>Yakında...</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, styles.disabledItem]}
            disabled
          >
            <Text style={styles.menuIcon}>⚙️</Text>
            <Text style={[styles.menuText, styles.disabledText]}>Ayarlar</Text>
            <Text style={[styles.menuDescription, styles.disabledText]}>Yakında...</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.logoutText}>Çıkış Yap</Text>
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
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 40,
  },
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E6ED',
  },
  disabledItem: {
    opacity: 0.5,
  },
  menuIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  menuText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  disabledText: {
    color: '#95A5A6',
  },
  menuDescription: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  logoutButton: {
    backgroundColor: '#E74C3C',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 