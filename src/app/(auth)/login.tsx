import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { apiClient } from '../../api/client';
import { colors } from '../../theme/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRequestCode = async () => {
    if (!email) return;
    setLoading(true);
    setError('');
    try {
      await apiClient.post('/auth/request-code', { email });
      router.push({ pathname: '/(auth)/verify', params: { email } });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error al solicitar el código');
      } else {
        setError('Error al solicitar el código');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require('../../../assets/images/icon.png')} 
          style={styles.logo} 
          contentFit="contain" 
        />
        <Text style={styles.title}>Expresos UPS</Text>
        <Text style={styles.subtitle}>Ingresa tu correo institucional para comenzar</Text>
        
        <TextInput
          style={styles.input}
          placeholder="estudiante@est.ups.edu.ec"
          placeholderTextColor={colors.textLight}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleRequestCode}
          disabled={loading || !email}
        >
          {loading ? (
            <ActivityIndicator color={colors.surfaceLight} />
          ) : (
            <Text style={styles.buttonText}>Solicitar Código</Text>
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
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 24,
    borderRadius: 24,
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
  },
  input: {
    backgroundColor: colors.surfaceLight,
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
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
