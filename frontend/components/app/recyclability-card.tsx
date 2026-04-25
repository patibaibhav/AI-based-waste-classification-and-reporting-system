import { AppTheme } from '@/constants/app-theme';
import type { ClassificationResult } from '@/types/app';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { SectionCard } from './section-card';

interface RecyclabilityCardProps {
  result: ClassificationResult;
}

export function RecyclabilityCard({ result }: RecyclabilityCardProps) {
  const { isRecyclable, reasoning } = result;

  // Don't render if Gemini data is not available
  if (isRecyclable == null) {
    return (
      <SectionCard subtitle="Gemini API recyclability check" title="Recyclability">
        <View style={styles.row}>
          <View style={[styles.iconWrap, { backgroundColor: AppTheme.colors.warningSoft }]}>
            <Ionicons color={AppTheme.colors.warning} name="help-outline" size={22} />
          </View>
          <View style={styles.textBlock}>
            <Text style={styles.statusText}>Unavailable</Text>
            <Text style={styles.reasoningText}>
              Gemini API key is not configured. Add GEMINI_API_KEY to your backend .env file to enable recyclability analysis.
            </Text>
          </View>
        </View>
      </SectionCard>
    );
  }

  const recyclable = isRecyclable === 'yes';
  const accentColor = recyclable ? AppTheme.colors.success : AppTheme.colors.danger;
  const softColor = recyclable ? AppTheme.colors.successSoft : AppTheme.colors.dangerSoft;
  const iconName = recyclable ? 'checkmark-circle-outline' : 'close-circle-outline';
  const label = recyclable ? 'Recyclable' : 'Not Recyclable';

  return (
    <SectionCard subtitle="Powered by Gemini AI" title="Recyclability">
      <View style={styles.row}>
        <View style={[styles.iconWrap, { backgroundColor: softColor }]}>
          <Ionicons color={accentColor} name={iconName} size={28} />
        </View>
        <View style={styles.textBlock}>
          <View style={styles.labelRow}>
            <Text style={[styles.statusText, { color: accentColor }]}>{label}</Text>
            <View style={[styles.badge, { backgroundColor: softColor }]}>
              <Text style={[styles.badgeText, { color: accentColor }]}>
                {recyclable ? '♻️ YES' : '🚫 NO'}
              </Text>
            </View>
          </View>
          {reasoning ? (
            <Text style={styles.reasoningText}>{reasoning}</Text>
          ) : null}
        </View>
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: 18,
    height: 54,
    justifyContent: 'center',
    width: 54,
  },
  textBlock: {
    flex: 1,
    gap: 6,
  },
  labelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  statusText: {
    fontSize: 20,
    fontWeight: '800',
    color: AppTheme.colors.text,
  },
  badge: {
    borderRadius: AppTheme.radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  reasoningText: {
    color: AppTheme.colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
});
