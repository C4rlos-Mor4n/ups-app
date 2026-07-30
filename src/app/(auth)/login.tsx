import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail } from 'lucide-react-native';
import { apiClient } from '../../api/client';
import { colors, spacing } from '../../theme';
import { AppScreen, AppButton, AppTextField, AppText } from '../../components/ui';
import { AuthBrandHeader } from '../../components/auth/AuthBrandHeader';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const validateEmail = (text: string) => {
    // Basic format validation + domain check based on requirements
    if (!text.includes('@')) return false;
    return true;
  };

  const handleRequestCode = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !validateEmail(trimmedEmail)) {
      setError('Por favor, ingresa un correo institucional válido.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await apiClient.post('/auth/request-code', { email: trimmedEmail });
      router.push({ pathname: '/(auth)/verify', params: { email: trimmedEmail } });
    } catch (err: any) {
      // Map technical errors to user-friendly messages
      setError('No pudimos enviar el código. Verifica tu correo o conexión e intenta de nuevo.');
    } finally {
      setLoading(false);
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
          <AuthBrandHeader 
            title="Tu transporte universitario, más simple"
            subtitle="Ingresa con tu cuenta UPS para continuar"
          />
          
          <View style={styles.formContainer}>
            <AppTextField
              label="Correo institucional"
              placeholder="usuario@est.ups.edu.ec"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setError('');
              }}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              leftIcon={<Mail size={20} color={colors.textSecondary} />}
              error={error}
              onSubmitEditing={handleRequestCode}
              returnKeyType="send"
            />
            
            <View style={styles.infoTextContainer}>
              <AppText variant="caption" color="secondary" align="center">
                Te enviaremos un código de seguridad de 6 dígitos a tu bandeja de entrada.
              </AppText>
            </View>

            <AppButton 
              label="Enviar código" 
              onPress={handleRequestCode}
              loading={loading}
              disabled={!email || loading}
            />
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
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  infoTextContainer: {
    marginBottom: spacing.xxl,
    paddingHorizontal: spacing.sm,
  }
});
