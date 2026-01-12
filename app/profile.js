// app/profile.js
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BG = '#050509';
const ACCENT = '#f97316';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* 상단: 타이틀 */}
      <View style={styles.header}>
        <Text style={styles.badge}>UNHEARD / PROFILE</Text>
        <Text style={styles.title}>MY PROFILE</Text>
        <Text style={styles.sub}>
          이 계정으로 열었던 SESSION과 DROPS가 여기에 쌓입니다.
          {'\n'}
          지금은 MY DROPS에서 네가 연 밤들을 먼저 확인할 수 있어요.
        </Text>
      </View>

      {/* 중앙: 안내 + 버튼 */}
      <View style={styles.centerBlock}>
        <Text style={styles.centerText}>
          프로필 기능은 아직 실험 중입니다.
          {'\n'}
          먼저, 지금까지 열었던 세션 로그부터 확인해 볼까요?
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/my-drops')}
        >
          <Text style={styles.primaryButtonText}>GO TO MY DROPS</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/')}>
          <Text style={styles.backText}>← back to HOME</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    paddingTop: 40,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  header: {
    gap: 6,
  },
  badge: {
    fontSize: 10,
    color: '#a1a1aa',
    letterSpacing: 3,
  },
  title: {
    fontSize: 20,
    color: '#f9fafb',
    letterSpacing: 3,
  },
  sub: {
    fontSize: 11,
    color: '#d4d4d8',
    lineHeight: 18,
  },
  centerBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  centerText: {
    fontSize: 12,
    color: '#e5e7eb',
    textAlign: 'center',
    lineHeight: 18,
  },
  primaryButton: {
    marginTop: 8,
    width: '100%',
    maxWidth: 420,
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
  backText: {
    marginTop: 8,
    fontSize: 11,
    color: '#9ca3af',
  },
});
