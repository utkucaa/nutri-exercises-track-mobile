import { FitLifeColors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AdminPanel() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.welcomeText}>Hoş geldin!</Text>
            <Text style={styles.titleText}>Admin Panel</Text>
            <Text style={styles.subtitleText}>FitLife Yönetim Merkezi</Text>
          </View>

          <View style={styles.menuContainer}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push('/member-management')}
            >
              <View style={styles.menuIcon}>
                <Text style={styles.menuEmoji}>👥</Text>
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>Üye Yönetimi</Text>
                <Text style={styles.menuDescription}>
                  Üyeleri görüntüle, yeni üye ekle ve üye bilgilerini düzenle
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push('/exercise-management')}
            >
              <View style={styles.menuIcon}>
                <Text style={styles.menuEmoji}>🏋️‍♀️</Text>
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>Egzersiz Yönetimi</Text>
                <Text style={styles.menuDescription}>
                  Egzersiz programları oluştur ve antrenman planları düzenle
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => alert('Raporlar yakında eklenecek!')}
            >
              <View style={styles.menuIcon}>
                <Text style={styles.menuEmoji}>📊</Text>
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>Raporlar</Text>
                <Text style={styles.menuDescription}>
                  Üye istatistikleri ve performans raporları görüntüle
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => alert('Ayarlar yakında eklenecek!')}
            >
              <View style={styles.menuIcon}>
                <Text style={styles.menuEmoji}>⚙️</Text>
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>Ayarlar</Text>
                <Text style={styles.menuDescription}>
                  Uygulama ayarları ve sistem yapılandırması
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
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
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: FitLifeColors.white,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: FitLifeColors.gray,
  },
  welcomeText: {
    fontSize: 16,
    color: FitLifeColors.textSecondary,
    marginBottom: 8,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: FitLifeColors.textPrimary,
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 14,
    color: FitLifeColors.textLight,
    textAlign: 'center',
  },
  menuContainer: {
    marginBottom: 30,
  },
  menuItem: {
    backgroundColor: FitLifeColors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: FitLifeColors.gray,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: FitLifeColors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuIcon: {
    marginRight: 16,
    backgroundColor: FitLifeColors.accentLight,
    borderRadius: 12,
    padding: 12,
  },
  menuEmoji: {
    fontSize: 32,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: FitLifeColors.textPrimary,
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 14,
    color: FitLifeColors.textSecondary,
    lineHeight: 20,
  },
  logoutButton: {
    backgroundColor: FitLifeColors.error,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: FitLifeColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
}); 