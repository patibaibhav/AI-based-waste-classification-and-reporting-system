import { AppTheme } from '@/constants/app-theme';
import { routes } from '@/constants/routes';
import { ScreenLayout } from '@/components/app/screen-layout';
import { PrimaryButton } from '@/components/app/primary-button';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Alert, ActivityIndicator, Pressable } from 'react-native';

import { useAuth } from '@/providers/auth-provider';

const roleCards: {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}[] = [
  {
    title: 'Field User',
    subtitle: 'Classify waste, report issues, and track personal submissions.',
    icon: 'person-outline',
    color: AppTheme.colors.secondary,
  },
  {
    title: 'Admin',
    subtitle: 'Review reports, update issue status, and watch analytics.',
    icon: 'shield-checkmark-outline',
    color: AppTheme.colors.primary,
  },
];

export default function LoginScreen() {
  const { login, isLoading, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'user' | 'admin' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const canContinue = email.trim().length > 0 && password.trim().length > 0;

  async function handleContinue() {
    if (!canContinue) return;

    setErrorMessage('');
    setIsSubmitting(true);
    try {
      const authenticatedUser = await login({ email, password });
      router.replace(authenticatedUser.role === 'admin' ? routes.admin : routes.tabs);
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Invalid email or password. Please try again.';
      setErrorMessage(message);
      Alert.alert('Login Failed', message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <ScreenLayout>
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={AppTheme.colors.primary} />
          <Text style={styles.loadingText}>Checking your session...</Text>
        </View>
      </ScreenLayout>
    );
  }

  if (user) {
    return <Redirect href={user.role === 'admin' ? routes.admin : routes.tabs} />;
  }

  return (
    <ScreenLayout>
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Ionicons color={AppTheme.colors.white} name="leaf-outline" size={28} />
        </View>
        <Text style={styles.heroTitle}>AI Waste Response System</Text>
        <Text style={styles.heroSubtitle}>
          A mobile workspace for AI waste classification, complaint reporting, and civic response.
        </Text>
      </View>

      <View style={styles.roleGrid}>
        {roleCards.map((card) => (
          <Pressable 
            key={card.title} 
            onPress={() => setSelectedRole(card.title === 'Field User' ? 'user' : 'admin')}
            style={[
              styles.roleCard,
              (selectedRole === 'user' && card.title === 'Field User' || selectedRole === 'admin' && card.title === 'Admin') && styles.roleCardSelected
            ]}
          >
            <View style={[
              styles.roleIcon, 
              { 
                backgroundColor: (selectedRole === 'user' && card.title === 'Field User' || selectedRole === 'admin' && card.title === 'Admin') 
                  ? card.color 
                  : `${card.color}18` 
              }
            ]}>
              <Ionicons 
                color={(selectedRole === 'user' && card.title === 'Field User' || selectedRole === 'admin' && card.title === 'Admin') ? AppTheme.colors.white : card.color} 
                name={card.icon} 
                size={24} 
              />
            </View>
            <Text style={[
              styles.roleTitle,
              (selectedRole === 'user' && card.title === 'Field User' || selectedRole === 'admin' && card.title === 'Admin') && styles.roleTitleSelected
            ]}>
              {card.title}
            </Text>
            <Text style={[
              styles.roleSubtitle,
              (selectedRole === 'user' && card.title === 'Field User' || selectedRole === 'admin' && card.title === 'Admin') && styles.roleSubtitleSelected
            ]}>
              {card.subtitle}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Sign in to continue</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="name@example.com"
            placeholderTextColor={AppTheme.colors.textMuted}
            style={styles.input}
            value={email}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            secureTextEntry
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor={AppTheme.colors.textMuted}
            style={styles.input}
            value={password}
          />
        </View>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        {isSubmitting ? (
          <ActivityIndicator size="large" color={AppTheme.colors.primary} style={{ marginTop: 10 }} />
        ) : (
          <PrimaryButton
            disabled={!canContinue}
            icon={<Ionicons color={AppTheme.colors.white} name="arrow-forward-outline" size={18} />}
            onPress={handleContinue}>
            Enter Dashboard
          </PrimaryButton>
        )}

        <Text onPress={() => router.push(routes.signup)} style={styles.helperText}>
          New here? Create a field user account
        </Text>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    backgroundColor: '#123828',
    borderRadius: AppTheme.radius.lg,
    gap: 10,
    paddingHorizontal: 22,
    paddingVertical: 28,
  },
  heroBadge: {
    alignItems: 'center',
    backgroundColor: AppTheme.colors.primary,
    borderRadius: 999,
    height: 58,
    justifyContent: 'center',
    width: 58,
  },
  heroTitle: {
    color: AppTheme.colors.white,
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.76)',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  roleGrid: {
    gap: 14,
  },
  roleCard: {
    backgroundColor: AppTheme.colors.surface,
    borderColor: AppTheme.colors.border,
    borderRadius: AppTheme.radius.lg,
    borderWidth: 1.5,
    gap: 10,
    padding: 18,
  },
  roleCardSelected: {
    backgroundColor: `${AppTheme.colors.primary}10`,
    borderColor: AppTheme.colors.primary,
    borderWidth: 2,
  },
  roleIcon: {
    alignItems: 'center',
    borderRadius: 16,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  roleTitle: {
    color: AppTheme.colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  roleTitleSelected: {
    color: AppTheme.colors.primary,
  },
  roleSubtitle: {
    color: AppTheme.colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
  roleSubtitleSelected: {
    color: AppTheme.colors.primary,
  },
  formCard: {
    backgroundColor: AppTheme.colors.surface,
    borderColor: AppTheme.colors.border,
    borderRadius: AppTheme.radius.lg,
    borderWidth: 1,
    gap: 16,
    padding: 18,
  },
  formTitle: {
    color: AppTheme.colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    color: AppTheme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    backgroundColor: AppTheme.colors.surfaceMuted,
    borderRadius: AppTheme.radius.md,
    color: AppTheme.colors.text,
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  errorText: {
    color: AppTheme.colors.danger,
    fontSize: 13,
    lineHeight: 18,
  },
  helperText: {
    color: AppTheme.colors.primary,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  loadingState: {
    alignItems: 'center',
    gap: 12,
    justifyContent: 'center',
    minHeight: 240,
  },
  loadingText: {
    color: AppTheme.colors.textMuted,
    fontSize: 15,
  },
});
