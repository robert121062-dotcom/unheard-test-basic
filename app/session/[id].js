// app/session/[id].js
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const BG = '#050509';
const ACCENT = '#f97316';

const SESSION_DB = {
  'UNHD-SEOUL-001': {
    id: 'UNHD-SEOUL-001',
    title: 'UNDERGROUND LINK #1',
    artist: 'SYNTH ALLEY',
    city: 'SEOUL',
    enteredAt: '2026-01-11 23:21',
    locationNote: 'EULJIRO BACK ALLEY / BASEMENT',
    tagName: 'UNHD-PIECE-SEOUL-01',
    playTime: '2:50',
    totalTime: '3:21',
    nightNote:
      '첫 번째 테스트 세션. 조명 거의 없는 골목에서, 폰 화면 빛만으로 트랙을 열었다.',
  },
  'UNHD-SEOUL-002': {
    id: 'UNHD-SEOUL-002',
    title: 'STATION ECHO',
    artist: 'LATE TRAIN',
    city: 'SEOUL',
    enteredAt: '2026-01-10 01:03',
    locationNote: 'SUBWAY PLATFORM / LAST TRAIN',
    tagName: 'UNHD-PIECE-SEOUL-02',
    playTime: '1:40',
    totalTime: '3:00',
    nightNote:
      '막차 끊기고 사람 빠진 플랫폼에서 이어폰 끼고 혼자 세션 열어봄.',
  },
  'UNHD-TOKYO-001': {
    id: 'UNHD-TOKYO-001',
    title: 'SHINJUKU FLOOR',
    artist: 'LOOP DISTRICT',
    city: 'TOKYO',
    enteredAt: '2026-01-05 22:11',
    locationNote: 'SHINJUKU SIDE STREET / 5F FLOOR',
    tagName: 'UNHD-PIECE-TOKYO-01',
    playTime: '3:21',
    totalTime: '3:21',
    nightNote:
      '작은 클럽 위층에서, 아래 베이스 진동 느끼면서 태그로 세션 언락.',
  },
  'UNHD-TOKYO-002': {
    id: 'UNHD-TOKYO-002',
    title: 'MIDNIGHT VAPOR',
    artist: 'ROOFTOP SCENE',
    city: 'TOKYO',
    enteredAt: '2026-01-02 02:34',
    locationNote: 'ROOFTOP / LIGHT SMOG',
    tagName: 'UNHD-PIECE-TOKYO-02',
    playTime: '0:45',
    totalTime: '2:58',
    nightNote:
      '아직 완전히 다 못 들은 세션. 바람 때문에 폰 잡은 손이 계속 흔들렸다.',
  },
};

export default function SessionDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const session = SESSION_DB[id];

  if (!session) {
    return (
      <View style={styles.container}>
        <Text style={styles.badge}>SESSION LOG</Text>
        <Text style={styles.title}>UNKNOWN SESSION</Text>
        <Text style={styles.sub}>
          이 ID에 해당하는 세션 로그를 찾을 수 없습니다.
          {'\n'}
          DROPS 화면에서 다시 선택해 주세요.
        </Text>
        <Text style={styles.link} onPress={() => router.push('/drops')}>
          ← back to DROPS
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.badge}>SESSION LOG / {session.city}</Text>
        <Text style={styles.title}>{session.title}</Text>
        <Text style={styles.artist}>{session.artist}</Text>
      </View>

      {/* 메타 정보 */}
      <View style={styles.block}>
        <Text style={styles.blockLabel}>ENTERED AT</Text>
        <Text style={styles.blockValue}>{session.enteredAt}</Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.blockLabel}>LOCATION</Text>
        <Text style={styles.blockValue}>{session.locationNote}</Text>
      </View>

      <View style={styles.blockRow}>
        <View style={styles.blockHalf}>
          <Text style={styles.blockLabel}>TAG / PIECE</Text>
          <Text style={styles.blockValue}>{session.tagName}</Text>
        </View>
        <View style={styles.blockHalf}>
          <Text style={styles.blockLabel}>PLAY TIME</Text>
          <Text style={styles.blockValue}>
            {session.playTime} / {session.totalTime}
          </Text>
        </View>
      </View>

      {/* 밤 메모 */}
      <View style={styles.block}>
        <Text style={styles.blockLabel}>NOTES FROM THIS NIGHT</Text>
        <Text style={styles.nightNote}>{session.nightNote}</Text>
      </View>

      {/* 뒤로가기 */}
      <Text style={styles.link} onPress={() => router.push('/drops')}>
        ← back to DROPS
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    marginBottom: 20,
    gap: 4,
  },
  badge: {
    fontSize: 10,
    color: '#a1a1aa',
    letterSpacing: 3,
  },
  title: {
    fontSize: 18,
    color: '#f9fafb',
    letterSpacing: 1,
  },
  artist: {
    fontSize: 12,
    color: '#d4d4d8',
  },
  block: {
    marginBottom: 14,
  },
  blockRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  blockHalf: {
    flex: 1,
  },
  blockLabel: {
    fontSize: 10,
    color: ACCENT,
    letterSpacing: 2,
    marginBottom: 2,
  },
  blockValue: {
    fontSize: 12,
    color: '#e5e7eb',
  },
  nightNote: {
    marginTop: 4,
    fontSize: 12,
    color: '#d4d4d8',
    lineHeight: 18,
  },
  link: {
    marginTop: 24,
    fontSize: 11,
    color: '#9ca3af',
  },
});
