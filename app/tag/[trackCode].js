// app/tag/[trackCode].js
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const UNHEARD_ACCENT = '#f97316';

// 태그 메타 (가짜 DB)
const TAG_META_DB = {
  UNHD_DEMO_001: {
    dropName: 'SEOUL DROP 001',
    artist: 'UNHEARD ARTIST A',
    blurb:
      '을지로 지하에서 녹음된 덤프. 공식 릴리즈 전, 태그 가진 사람만 접근 가능.',
    cityTags: ['SEOUL', 'UNDERGROUND'],
  },
  UNHD_DEMO_002: {
    dropName: 'TOKYO DROP 002',
    artist: 'UNHEARD ARTIST B',
    blurb:
      '신주쿠 뒷골목에서 튄 루프. 정규에 들어가지 않는 사이드 B 트랙.',
    cityTags: ['TOKYO', 'SIDE B'],
  },
};

function getTagMeta(trackCode) {
  if (!trackCode) return null;
  const normalized = String(trackCode).replace(/-/g, '_');
  return TAG_META_DB[normalized] || null;
}

export default function TagIntroScreen() {
  const router = useRouter();
  const { trackCode } = useLocalSearchParams();

  const meta = getTagMeta(trackCode);

  const handleEnterSession = () => {
    router.push(`/player?trackCode=${encodeURIComponent(trackCode || '')}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={[styles.label, { color: UNHEARD_ACCENT }]}>TAG BOUND</Text>

        <Text style={styles.dropName}>
          {meta?.dropName || 'UNHEARD DROP'}
        </Text>

        <Text style={styles.tagLine}>
          이 태그는 {meta?.artist || 'UNKNOWN ARTIST'} ·{' '}
          {meta?.dropName || 'UNHEARD DROP'} 전용 키입니다.
        </Text>

        <Text style={styles.blurb}>
          {meta?.blurb ||
            '정식으로 풀리기 전, 태그를 가진 사람들만 이 세션을 열 수 있어.'}
        </Text>

        <View style={styles.chipRow}>
          {(meta?.cityTags || ['UNHEARD']).map((c) => (
            <View key={c} style={styles.chip}>
              <Text style={styles.chipText}>{c}</Text>
            </View>
          ))}
        </View>

        <View style={styles.codeBlock}>
          <Text style={styles.codeLabel}>TRACK CODE</Text>
          <Text style={styles.codeValue}>{trackCode || 'NO-CODE'}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.enterButton} onPress={handleEnterSession}>
        <Text style={styles.enterText}>ENTER SESSION</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>← back to scan</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  card: {
    width: '100%',
    maxWidth: 460,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#27272a',
    backgroundColor: '#0b0f19',
    padding: 20,
  },
  label: {
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  dropName: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '700',
    color: '#fafafa',
  },
  tagLine: {
    marginTop: 6,
    fontSize: 12,
    color: '#e4e4e7',
  },
  blurb: {
    marginTop: 10,
    fontSize: 11,
    lineHeight: 16,
    color: '#a1a1aa',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#3f3f46',
  },
  chipText: {
    fontSize: 10,
    color: '#e5e5e5',
    letterSpacing: 1,
  },
  codeBlock: {
    marginTop: 16,
  },
  codeLabel: {
    fontSize: 10,
    color: '#71717a',
    letterSpacing: 2,
  },
  codeValue: {
    marginTop: 4,
    fontSize: 13,
    color: '#e5e5e5',
  },
  enterButton: {
    width: '100%',
    maxWidth: 420,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: UNHEARD_ACCENT,
    alignItems: 'center',
  },
  enterText: {
    fontSize: 14,
    letterSpacing: 3,
    color: '#050505',
    textTransform: 'uppercase',
  },
  backButton: {
    paddingVertical: 6,
  },
  backButtonText: {
    fontSize: 12,
    color: '#71717a',
  },
});
