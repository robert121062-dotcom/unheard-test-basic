// app/about.js
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BG = '#050505';
const ACCENT = '#f97316';

export default function AboutScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.badge}>ABOUT UNHEARD</Text>
          <Text style={styles.title}>THIS IS NOT A STREAMING APP</Text>
          <Text style={styles.sub}>
            UNHEARD는 TAG를 가진 사람만 ENTER할 수 있는 DROP 플랫폼입니다.
            일반 스트리밍에서 검색되지 않는 SESSION만 다룹니다.
          </Text>
        </View>

        {/* 블록 1: WHAT IS A DROP */}
        <View style={styles.block}>
          <Text style={styles.blockLabel}>WHAT IS A DROP</Text>
          <Text style={styles.blockBody}>
            DROP은 옷, 모자, 굿즈에 숨겨진 TAG를 통해서만 열리는 SESSION입니다.
            플레이리스트에 쌓이지 않고, 알고리즘에 추천되지 않습니다.
          </Text>
          <Text style={styles.blockBody}>
            스트리트에서 피스를 소유한 사람만, 잠깐 동안 이 SESSION에 ENTER할 수 있습니다.
          </Text>
        </View>

        {/* 블록 2: HOUSE RULES */}
        <View style={styles.block}>
          <Text style={styles.blockLabel}>HOUSE RULES</Text>
          <Text style={styles.rule}>NO PLAYLIST</Text>
          <Text style={styles.rule}>NO SHAZAM</Text>
          <Text style={styles.rule}>NO REQUESTS</Text>
          <Text style={styles.rule}>ONE TAG · ONE SESSION · NO REPLAY</Text>
          <Text style={[styles.blockBody, { marginTop: 10 }]}>
            UNHEARD는 “언제든 다시 들을 수 있는 음악”이 아니라,
            {'\n'}
            “이 순간에만 열리는 DROP”을 기록합니다.
          </Text>
        </View>

        {/* 블록 3: TERRITORY */}
        <View style={styles.block}>
          <Text style={styles.blockLabel}>TERRITORY</Text>
          <Text style={styles.blockBody}>
            첫 DROP들은 SEOUL과 TOKYO를 오가며 풀립니다.
            골목, 클럽, 팝업, 브랜드 쇼룸 위에 TAG가 숨겨집니다.
          </Text>
          <Text style={styles.blockBody}>
            지도 대신, 씬과 사람들을 통해서만 TAG 위치를 알 수 있습니다.
          </Text>
        </View>

        {/* 블록 4: HOW TO ENTER */}
        <View style={styles.block}>
          <Text style={styles.blockLabel}>HOW TO ENTER</Text>
          <Text style={styles.blockBody}>
            1. UNHEARD 마크가 박힌 옷/굿즈를 찾습니다.
            {'\n'}
            2. TAG SURFACE를 느낀 뒤, 기기를 SCAN에 가져갑니다.
            {'\n'}
            3. DROP 인트로를 확인하고, ENTER SESSION을 눌러 SESSION에 들어갑니다.
          </Text>
        </View>

        {/* 하단 버튼들 */}
        <View style={styles.bottomButtons}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/scan')}
          >
            <Text style={styles.primaryButtonText}>SCAN TAG</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/my-drops')}
          >
            <Text style={styles.secondaryButtonText}>VIEW MY DROPS</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← back to home</Text>
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
    marginBottom: 20,
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
    marginTop: 8,
    fontSize: 11,
    color: '#d4d4d8',
    lineHeight: 18,
  },
  block: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#27272a',
    backgroundColor: '#020617',
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 14,
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
  rule: {
    fontSize: 12,
    color: '#f9fafb',
    letterSpacing: 2,
    marginTop: 4,
  },
  bottomButtons: {
    marginTop: 8,
    gap: 8,
  },
  primaryButton: {
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
  secondaryButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 12,
    letterSpacing: 3,
    color: '#e5e5e5',
  },
  backButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
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
