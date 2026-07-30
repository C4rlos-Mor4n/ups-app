import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { colors, spacing } from '../../theme';
import { AppScreen, AppButton, AppText, AppCard } from '../../components/ui';
import { OtpInput } from '../../components/auth/OtpInput';
import { useAuth } from '../../context/auth';
import { apiClient } from '../../api/client';

export default function VerifyScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(30);
  
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Auto-submit when code is 6 digits long
  useEffect(() => {
    if (code.length === 6 && !loading) {
      handleVerifyCode();
    }
  }, [code]);

  const handleVerifyCode = async () => {
    if (code.length !== 6) return;
    
    setLoading(true);
    setError('');
    
    try {
      await login(email, code);
      // AuthContext handles the redirect automatically
    } catch (err: any) {
      setError('Código inválido o expirado. Por favor intenta de nuevo.');
      setCode(''); // Reset code on error
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    
    setResending(true);
    try {
      await apiClient.post('/auth/request-code', { email });
      setCountdown(30);
      setError('');
    } catch (err: any) {
      setError('Error al reenviar el código. Intenta de nuevo más tarde.');
    } finally {
      setResending(false);
    }
  };

  return (
    <AppScreen backgroundColor={colors.backgroundMain}>
      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <AppButton 
              label=""
              variant="ghost" 
              size="sm"
              leftIcon={<ArrowLeft color={colors.actionPrimary} size={24} />}
              onPress={() => router.back()}
              style={styles.backButton}
            />
          </View>

          <View style={styles.content}>
            <AppText variant="headingL" weight="bold" color="primary" align="center" style={styles.title}>
              Revisa tu correo
            </AppText>
            
            <AppText variant="bodyM" color="secondary" align="center" style={styles.subtitle}>
              Enviamos un código de 6 dígitos a:{'\n'}
              <AppText variant="bodyM" weight="bold" color="primary">
                {email}
              </AppText>
            </AppText>

            <AppCard variant="flat" style={styles.card}>
              <OtpInput 
                value={code} 
                onChange={(newCode) => {
                  setCode(newCode);
                  if (error) setError('');
                }} 
                error={!!error}
              />
              
              {error ? (
                <AppText variant="caption" color="error" align="center" style={styles.errorText}>
                  {error}
                </AppText>
              ) : null}

              <AppButton 
                label="Confirmar" 
                onPress={handleVerifyCode}
                loading={loading}
                disabled={code.length !== 6 || loading}
                style={styles.verifyButton}
              />
            </AppCard>

            <View style={styles.resendContainer}>
              <AppText variant="bodyS" color="secondary">
                ¿No recibiste el código?
              </AppText>
              <AppButton 
                label={countdown > 0 ? `Reenviar en ${countdown}s` : 'Reenviar código'} 
                variant="ghost"
                size="sm"
                onPress={handleResend}
                disabled={countdown > 0 || resending}
                loading={resending}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.xxl,
  },
  header: {
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
  },
  backButton: {
    paddingHorizontal: 0,
    marginLeft: -spacing.sm,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    marginBottom: spacing.sm,
  },
  subtitle: {
    marginBottom: spacing.xxxl,
    lineHeight: 24,
  },
  card: {
    width: '100%',
    padding: spacing.xxl,
    marginBottom: spacing.xxxl,
  },
  errorText: {
    marginBottom: spacing.md,
  },
  verifyButton: {
    marginTop: spacing.md,
  },
  resendContainer: {
    alignItems: 'center',
    gap: spacing.xs,
  }
});
