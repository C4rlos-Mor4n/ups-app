import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuth } from '../../context/auth';
import { colors, spacing, radii } from '../../theme';
import { User, Mail, Shield, LogOut, Info } from 'lucide-react-native';
import { AppScreen, AppText, AppCard, AppButton } from '../../components/ui';

// Traductor de roles
const translateRole = (role: string | undefined) => {
  if (!role) return 'Usuario';
  const map: Record<string, string> = {
    STUDENT: 'Estudiante',
    TEACHER: 'Docente',
    ADMIN: 'Administrador',
    SUPER_ADMIN: 'Superadministrador',
  };
  return map[role.toUpperCase()] || role;
};

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      '¿Cerrar sesión?',
      'Tendrás que volver a ingresar con tu correo institucional.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: logout,
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <AppScreen safeAreaEdges={['top', 'left', 'right']} backgroundColor={colors.backgroundMain}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <AppText variant="headingL" weight="bold" color="primary">
            Perfil
          </AppText>
        </View>

        <AppCard style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <User size={48} color={colors.surface} />
            </View>
            <AppText variant="headingM" weight="bold" color="primary" style={styles.nameText}>
              {user?.name || 'Usuario UPS'}
            </AppText>
            <AppText variant="bodyS" color="brandPrimary" weight="medium" style={styles.roleBadge}>
              {translateRole(user?.role)}
            </AppText>
          </View>
        </AppCard>

        <AppText variant="label" weight="bold" color="secondary" style={styles.sectionTitle}>
          INFORMACIÓN DE LA CUENTA
        </AppText>
        
        <AppCard style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Mail color={colors.textSecondary} size={20} />
            <View style={styles.infoTextContainer}>
              <AppText variant="caption" color="secondary">Correo Institucional</AppText>
              <AppText variant="bodyM" weight="medium" color="primary">{user?.email}</AppText>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Shield color={colors.textSecondary} size={20} />
            <View style={styles.infoTextContainer}>
              <AppText variant="caption" color="secondary">Estado de Cuenta</AppText>
              <AppText 
                variant="bodyM" 
                weight="medium" 
                color={user?.isActive ? 'success' : 'error'}
              >
                {user?.isActive ? 'Activo' : 'Inactivo'}
              </AppText>
            </View>
          </View>
        </AppCard>

        <AppText variant="label" weight="bold" color="secondary" style={styles.sectionTitle}>
          SISTEMA
        </AppText>

        <AppCard style={styles.infoCard}>
          <View style={[styles.infoRow, styles.infoRowNoBorder]}>
            <Info color={colors.textSecondary} size={20} />
            <View style={styles.infoTextContainer}>
              <AppText variant="caption" color="secondary">Versión de la aplicación</AppText>
              <AppText variant="bodyM" weight="medium" color="primary">1.0.0</AppText>
            </View>
          </View>
        </AppCard>

        <View style={styles.logoutContainer}>
          <AppButton 
            label="Cerrar sesión" 
            variant="outline" 
            onPress={handleLogout}
            leftIcon={<LogOut color={colors.error} size={20} />}
            style={styles.logoutButton}
          />
        </View>

      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.massive,
  },
  header: {
    marginBottom: spacing.xl,
  },
  profileCard: {
    marginBottom: spacing.xxl,
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.brandPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  nameText: {
    marginBottom: spacing.xs,
  },
  roleBadge: {
    backgroundColor: colors.infoBackground,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.sm,
    overflow: 'hidden',
  },
  sectionTitle: {
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
    letterSpacing: 1,
  },
  infoCard: {
    padding: 0,
    marginBottom: spacing.xxl,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  infoRowNoBorder: {
    borderBottomWidth: 0,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginLeft: spacing.xxxl + spacing.lg,
  },
  infoTextContainer: {
    marginLeft: spacing.md,
  },
  logoutContainer: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  logoutButton: {
    borderColor: colors.error,
    borderWidth: 1,
    minWidth: 200,
  }
});
