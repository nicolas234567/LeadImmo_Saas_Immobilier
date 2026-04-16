// constants/theme.ts

export const colors = {
  navy:    '#1A2B4A',
  blue:    '#2563EB',
  white:   '#FFFFFF',
  gray50:  '#F8FAFC',
  gray200: '#E2E8F0',
  gray600: '#475569',
  gray800: '#1E293B',
  green:   '#059669',
  amber:   '#D97706',
  red:     '#DC2626',
}

export const typography = {
  title:    { fontSize: 22, fontWeight: '700' as const, color: colors.white },
  subtitle: { fontSize: 16, fontWeight: '500' as const, color: colors.gray800 },
  body:     { fontSize: 14, fontWeight: '400' as const, color: colors.gray800 },
  label:    { fontSize: 12, fontWeight: '400' as const, color: colors.white },
}

export const spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
}

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
}