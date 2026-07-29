import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../context/auth';
import { colors } from '../../theme/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VerifyScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleVerify = async () => {
    if (!code || !email) return;
    setLoading(true);
    setError('');
    try {
      await login(email, code);
      // Navigation is handled automatically by AuthProvider
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Código inválido');
      } else {
        setError('Código inválido');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Verificar Código</Text>
        <Text style={styles.subtitle}>
          Hemos enviado un código de 6 dígitos a{'\n'}
          <Text style={{ fontWeight: 'bold' }}>{email}</Text>
        </Text>
        
        <TextInput
          style={styles.input}
          placeholder="Código de verificación"
          placeholderTextColor={colors.textLight}
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={6}
          textAlign="center"
        />
        
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleVerify}
          disabled={loading || code.length < 6}
        >
          {loading ? (
            <ActivityIndicator color={colors.surfaceLight} />
          ) : (
            <Text style={styles.buttonText}>Confirmar</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 24,
    left: 24,
    zIndex: 1,
  },
  backText: {
    color: colors.primary,
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  input: {
    backgroundColor: colors.surfaceLight,
    padding: 16,
    borderRadius: 12,
    fontSize: 24,
    letterSpacing: 8,
    color: colors.text,
    marginBottom: 16,
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  button: {
    backgroundColor: colors.button,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: colors.surfaceLight,
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: colors.error,
    marginBottom: 16,
    textAlign: 'center',
  },
});
