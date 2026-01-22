import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

const ProfileScreen = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Apakah Anda yakin ingin keluar?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const ProfileItem = ({ icon, label, value, onPress }) => (
    <TouchableOpacity 
      style={styles.profileItem} 
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.profileItemLeft}>
        <Icon name={icon} size={24} color="#6b7280" />
        <View style={styles.profileItemText}>
          <Text style={styles.profileItemLabel}>{label}</Text>
          <Text style={styles.profileItemValue}>{value}</Text>
        </View>
      </View>
      {onPress && (
        <Icon name="chevron-right" size={24} color="#9ca3af" />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Icon name="account" size={48} color="#ffffff" />
        </View>
        <Text style={styles.name}>{user?.nama_lengkap}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.roleBadge}>
          <Badge 
            label={user?.role === 'manager' ? 'Manager' : 'Karyawan'} 
            variant="primary" 
            size="medium"
          />
        </View>
      </View>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Informasi Akun</Text>
        <ProfileItem
          icon="badge-account"
          label="Nama Lengkap"
          value={user?.nama_lengkap}
        />
        <ProfileItem
          icon="email"
          label="Email"
          value={user?.email}
        />
        <ProfileItem
          icon="office-building"
          label="Devisi"
          value={user?.devisi?.nama_devisi}
        />
        <ProfileItem
          icon="shield-account"
          label="Role"
          value={user?.role === 'manager' ? 'Manager' : 'Karyawan'}
        />
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Pengaturan</Text>
        <ProfileItem
          icon="lock-reset"
          label="Ubah Password"
          value="Klik untuk mengubah"
          onPress={() => console.log('Change password')}
        />
        <ProfileItem
          icon="bell"
          label="Notifikasi"
          value="Aktif"
          onPress={() => console.log('Notification settings')}
        />
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Tentang Aplikasi</Text>
        <ProfileItem
          icon="information"
          label="Versi Aplikasi"
          value="1.0.0"
        />
        <ProfileItem
          icon="book-open-variant"
          label="Panduan Penggunaan"
          value="Lihat panduan"
          onPress={() => console.log('User guide')}
        />
        <ProfileItem
          icon="help-circle"
          label="Bantuan & Dukungan"
          value="Hubungi kami"
          onPress={() => console.log('Help')}
        />
      </Card>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={20} color="#dc2626" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 Soerbaja 45 Printing</Text>
        <Text style={styles.footerSubtext}>KPI Management System v1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  roleBadge: {
    marginTop: 8,
  },
  section: {
    margin: 16,
    padding: 0,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    padding: 16,
    paddingBottom: 8,
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  profileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileItemText: {
    marginLeft: 16,
    flex: 1,
  },
  profileItemLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  profileItemValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc2626',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    padding: 24,
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  footerSubtext: {
    fontSize: 10,
    color: '#d1d5db',
    marginTop: 4,
  },
});

export default ProfileScreen;

