import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../../context/auth';
import { colors } from '../../theme/colors';
import { LogOut, User, Mail, Shield } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <User size={48} color={colors.surfaceLight} />
        </View>
        <Text style={styles.name}>{user?.name || 'Estudiante UPS'}</Text>
        <Text style={styles.role}>{user?.role === 'STUDENT' ? 'Estudiante' : user?.role}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información de la cuenta</Text>
        
        <View style={styles.infoRow}>
          <Mail color={colors.textLight} size={20} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Correo Electrónico</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Shield color={colors.textLight} size={20} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Estado</Text>
            <Text style={[styles.infoValue, { color: user?.isActive ? colors.success : colors.error }]}>
              {user?.isActive ? 'Activo' : 'Inactivo'}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <LogOut color={colors.error} size={20} />
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: colors.surfaceLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: colors.secondary,
    fontWeight: '600',
  },
  section: {
    backgroundColor: colors.surfaceLight,
    marginTop: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textLight,
    textTransform: 'uppercase',
    paddingHorizontal: 24,
    marginBottom: 16,
    letterSpacing: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  infoTextContainer: {
    marginLeft: 16,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceLight,
    marginTop: 32,
    padding: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  logoutText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
