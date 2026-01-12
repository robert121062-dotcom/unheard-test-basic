// app/drop/[trackCode]/notes.js
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BG = '#050505';
const ACCENT = '#f97316';

// 간단한 노트 더미 데이터 (나중에 서버/DB로 이동)
const DROP_NOTES_DB = {
  'UNHD-DEMO-001': {
    title: 'SEOUL DUMP TAPE',
    artist: 'UNHEARD ARTIST A',
    recordingNote:
      '을지로 지하 2층, 새벽 2시~4시 사이에 한 번에 찍힌 테이프입니다. 라이브 드럼이 아니라, 지하 배관 소리를 샘플링해서 만든 킥이 들어가 있습니다.',
    gear: 'SP-404 · Tascam Porta · SM58 · 골목 필드 레코딩',
    context:
      '정식 릴리즈에서는 다듬어진 버전만 올라가고, 이 DROP에는 러프한 데모 버전이 담깁니다. 셔츠를 가진 사람만 이 버전의 질감을 기억하게 됩니다.',
  },
  'UNHD-DEMO-002': {
    title: 'TOKYO SIDE B',
    artist: 'UNHEARD ARTIST B',
    recordingNote:
      '신주쿠 뒷골목, 마지막 전차 이후의 소음을 베이스로 쓴 트랙입니다. 지하 클럽의 벽 울림을 그대로 프리셋처럼 썼습니다.',
    gear: 'MPC2000XL · 카세트 레코더 · 보행자 신호음 샘플',
    context:
      'A-side에서는 절대 쓰지 않을, 너무 날것이라서 숨겨둔 루프입니다. 팝업에서 TAG를 집어든 사람만 이 버전을 잠깐 ENTER할 수 있습니다.',
  },
};

export default function DropNotesScreen() {
  const router = useRouter();
  const { trackCode } = useLocalSearchParams();

  const code = typeof trackCode === 'string' ? trackCode : String(trackCode || '');
  const note = code ? DROP_NOTES_DB[code] : null;

  if (!note) {
    return (
      <View style={styles.container}>
        <Text style={styles.badge}>DROP NOTES</Text>
        <Text style={styles.title}>NO NOTES FOR THIS DROP</Text>
        <Text style={styles.sub}>
          이 DROP에 대한 노트가 아직 등록되지 않았습니다.
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← back to session</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.badge}>DROP NOTES</Text>
          <Text style={styles.title}>{note.title}</Text>
          <Text style={styles.sub}>{note.artist}</Text>
          <Text style={styles.code}>TRACK CODE · {code}</Text>
        </View>

        {/* RECORDING NOTE */}
        <View style={styles.block}>
          <Text style={styles.blockLabel}>RECORDING NOTE</Text>
          <Text style={styles.blockBody}>{note.recordingNote}</Text>
        </View>

        {/* GEAR */}
        <View style={styles.block}>
          <Text style={styles.blockLabel}>GEAR</Text>
          <Text style={styles.blockBody}>{note.gear}</Text>
        </View>

        {/* CONTEXT */}
        <View style={styles.block}>
          <Text style={styles.blockLabel}>CONTEXT</Text>
          <Text style={styles.blockBody}>{note.context}</Text>
        </View>

        {/* 버튼 */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push(`/player?trackCode=${code}`)}
        >
          <Text style={styles.primaryButtonText}>BACK TO SESSION</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← back</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          WEAR THE RYTHM · UNLOCK THE EXCLUSIVE UNHEARD
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    marginBottom: 18,
  },
  badge: {
    fontSize: 10,
    color: '#a1a1aa',
    letterSpacing: 3,
  },
  title: {
    marginTop: 6,
    fontSize: 18,
    color: '#f9fafb',
    letterSpacing: 2,
  },
  sub: {
    marginTop: 2,
    fontSize: 11,
    color: '#d4d4d8',
  },
  code: {
    marginTop: 4,
    fontSize: 10,
    color: '#6b7280',
  },
  block: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#27272a',
    backgroundColor: '#020617',
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  blockLabel: {
    fontSize: 11,
    color: ACCENT,
    letterSpacing: 3,
    marginBottom: 6,
  },
  blockBody: {
    fontSize: 11,
    color: '#e5e5e5',
    lineHeight: 18,
  },
  primaryButton: {
    marginTop: 8,
    width: '100%',
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: ACCENT,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 13,
    letterSpacing: 3,
    color: BG,
  },
  backButton: {
    marginTop: 8,
  },
  backButtonText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  footerText: {
    marginTop: 10,
    fontSize: 9,
    color: '#6b7280',
    letterSpacing: 3,
    textAlign: 'center',
  },
});
