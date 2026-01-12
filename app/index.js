// app/index.js
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDrops } from '../context/DropsContext';

const BG = '#050509';
const ACCENT = '#f97316';
const API_BASE_URL = 'https://unheard-api.onrender.com';

export default function HomeScreen() {
  const router = useRouter();
  const { myDrops } = useDrops();

  // 최근 3개만 표시
  const recentDrops = myDrops.slice(0, 3);

  // 최근 드롭에 대한 트랙 메타를 서버에서 가져오기
  const [recentTracks, setRecentTracks] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const [recentError, setRecentError] = useState(null);

  useEffect(() => {
    const fetchRecentTracks = async () => {
      if (recentDrops.length === 0) {
        setRecentTracks([]);
        return;
      }

      try {
        setLoadingRecent(true);
        setRecentError(null);

        const results = [];

        for (const drop of recentDrops) {
          if (!drop.trackCode) continue;
          try {
            const res = await fetch(`${API_BASE_URL}/tracks/${encodeURIComponent(drop.trackCode)}`);
            if (!res.ok) {
              throw new Error(`status ${res.status}`);
            }
            const data = await res.json();
            results.push({
              dropId: drop.id,
              trackCode: drop.trackCode,
              track: data,
            });
          } catch (e) {
            console.log('[Home] 개별 트랙 로드 실패:', drop.trackCode, e);
          }
        }

        setRecentTracks(results);
      } catch (e) {
        console.log('[Home] 최근 세션 트랙 로딩 전체 에러:', e);
        setRecentError('최근 세션 정보를 불러오는 중 문제가 발생했어요.');
      } finally {
        setLoadingRecent(false);
      }
    };

    fetchRecentTracks();
  }, [myDrops]);

  return (
    <View style={styles.container}>
      {/* 상단 바: 로고 라인 + 프로필 버튼 */}
      <View>
        <View className="topBar" style={styles.topBar}>
          <View style={styles.topBarLeft}>
            <Text style={styles.badge}>UNHEARD ACCESS ONLY</Text>
            <Text style={styles.logo}>UNHEARD</Text>
          </View>

          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push('/profile')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.profileButtonText}>MY PROFILE</Text>
          </TouchableOpacity>
        </View>

        {/* 로고 아래 슬로건 */}
        <View style={styles.header}>
          <Text style={styles.slogan}>WEAR THE RYTHM</Text>
          <Text style={styles.slogan}>UNLOCK THE EXCLUSIVE UNHEARD</Text>
        </View>

        {/* 최근 스캔한 세션 */}
        {recentDrops.length > 0 && (
          <View style={styles.recentSection}>
            <View style={styles.recentHeader}>
              <Text style={styles.recentTitle}>RECENT SESSIONS</Text>
              <TouchableOpacity onPress={() => router.push('/my-drops')}>
                <Text style={styles.viewAllText}>전체 보기 →</Text>
              </TouchableOpacity>
            </View>

            {loadingRecent && (
              <Text style={{ fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>
                최근 세션 불러오는 중...
              </Text>
            )}

            {recentError && (
              <Text style={{ fontSize: 11, color: '#fca5a5', marginBottom: 4 }}>
                {recentError}
              </Text>
            )}

            {recentTracks.map((item) => {
              const track = item.track;
              if (!track) return null;

              return (
                <TouchableOpacity
                  key={item.dropId}
                  style={[styles.recentItem, { borderLeftColor: track.coverColor || ACCENT }]}
                  onPress={() =>
                    router.push(`/player?trackCode=${encodeURIComponent(item.trackCode)}`)
                  }
                >
                  <View>
                    <Text style={styles.recentTrackTitle}>{track.title}</Text>
                    <Text style={styles.recentTrackArtist}>{track.artist}</Text>
                  </View>
                  <Text style={styles.recentTrackCode}>{track.code}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      {/* 중앙: DROP 포스터 느낌 블록 */}
      <View style={styles.poster}>
        <View style={styles.posterTopRow}>
          <Text style={styles.posterLabel}>SECRET SESSIONS</Text>
          <Text style={styles.posterDrop}>NO PLAYLIST · NO SHAZAM</Text>
        </View>

        <View style={styles.posterMiddle}>
          <Text style={styles.posterTitle}>TAG-LOCKED AUDIO</Text>
          <Text style={styles.posterSub}>
            스트리트에서 떠도는 옷, 모자, 굿즈에만 박혀 있는 UNHEARD PIECE.
            {'\n'}
            SCAN하는 순간, 언리릴리즈 SESSION이 잠깐 열렸다가 다시 닫힌다.
          </Text>
        </View>

        <View style={styles.posterBottomRow}>
          <View>
            <Text style={styles.posterMetaLabel}>ENTRY</Text>
            <Text style={styles.posterMetaValue}>TAG ONLY</Text>
          </View>
          <View>
            <Text style={styles.posterMetaLabel}>TERRITORY</Text>
            <Text style={styles.posterMetaValue}>SEOUL · TOKYO</Text>
          </View>
        </View>
      </View>

      {/* 하단: 메인 액션 + 씬 맵/로그 */}
      <View style={styles.footer}>
        {/* 1. 스캔 */}
        <TouchableOpacity style={styles.scanButton} onPress={() => router.push('/scan')}>
          <Text style={styles.scanButtonText}>SCAN TAG</Text>
        </TouchableOpacity>

        {/* 2. 내가 연 세션들 */}
        <TouchableOpacity style={styles.libraryButton} onPress={() => router.push('/my-drops')}>
          <Text style={styles.libraryButtonText}>MY DROPS / SESSION LOG</Text>
        </TouchableOpacity>

        {/* 3. 전체 드롭 씬 맵 */}
        <TouchableOpacity style={styles.dropsButton} onPress={() => router.push('/drops')}>
          <Text style={styles.dropsButtonText}>DROPS OVERVIEW</Text>
        </TouchableOpacity>

        {/* 서브 링크들 */}
        <TouchableOpacity onPress={() => router.push('/about')}>
          <Text style={styles.linkText}>ABOUT UNHEARD</Text>
        </TouchableOpacity>

        <Text style={styles.footerHint}>
          TAG가 없다면, 아직 이 SESSION의 손님이 아니라는 뜻.
          {'\n'}
          스트리트에서 UNHEARD 마크가 박힌 피스를 찾아봐.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },

  /* 상단 바 */
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topBarLeft: {
    gap: 2,
  },
  badge: {
    fontSize: 10,
    color: '#a1a1aa',
    letterSpacing: 3,
  },
  logo: {
    marginTop: 2,
    fontSize: 26,
    letterSpacing: 8,
    color: '#f9fafb',
  },

  header: {
    marginTop: 8,
    gap: 2,
  },
  slogan: {
    fontSize: 11,
    letterSpacing: 3,
    color: '#9ca3af',
    textTransform: 'uppercase',
  },

  /* Recent Sessions */
  recentSection: {
    width: '100%',
    marginBottom: 16,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recentTitle: {
    fontSize: 12,
    letterSpacing: 3,
    color: '#9ca3af',
  },
  viewAllText: {
    fontSize: 11,
    color: ACCENT,
    letterSpacing: 1,
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
  },
  recentTrackTitle: {
    fontSize: 14,
    color: '#f9fafb',
    marginBottom: 2,
  },
  recentTrackArtist: {
    fontSize: 11,
    color: '#9ca3af',
  },
  recentTrackCode: {
    fontSize: 10,
    color: '#6b7280',
    letterSpacing: 1,
  },

  /* 프로필 버튼 */
  profileButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#4b5563',
    backgroundColor: 'rgba(15,23,42,0.8)',
  },
  profileButtonText: {
    fontSize: 11,
    letterSpacing: 2,
    color: '#e5e7eb',
  },

  poster: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#27272a',
    backgroundColor: '#020617',
    paddingVertical: 18,
    paddingHorizontal: 18,
    justifyContent: 'space-between',
    gap: 16,
  },
  posterTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  posterLabel: {
    fontSize: 11,
    letterSpacing: 3,
    color: ACCENT,
  },
  posterDrop: {
    fontSize: 10,
    color: '#e5e5e5',
    letterSpacing: 2,
  },
  posterMiddle: {
    marginTop: 4,
  },
  posterTitle: {
    fontSize: 18,
    color: '#f9fafb',
    letterSpacing: 3,
  },
  posterSub: {
    marginTop: 8,
    fontSize: 11,
    lineHeight: 18,
    color: '#d4d4d8',
  },
  posterBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  posterMetaLabel: {
    fontSize: 9,
    color: '#6b7280',
    letterSpacing: 2,
  },
  posterMetaValue: {
    marginTop: 2,
    fontSize: 11,
    color: '#e5e5e5',
  },

  footer: {
    alignItems: 'center',
    gap: 6,
  },
  scanButton: {
    width: '100%',
    maxWidth: 420,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: ACCENT,
    alignItems: 'center',
  },
  scanButtonText: {
    fontSize: 14,
    letterSpacing: 4,
    color: BG,
  },
  libraryButton: {
    width: '100%',
    maxWidth: 420,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    alignItems: 'center',
  },
  libraryButtonText: {
    fontSize: 11,
    letterSpacing: 3,
    color: '#e5e5e5',
  },
  dropsButton: {
    width: '100%',
    maxWidth: 420,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#4b5563',
    alignItems: 'center',
  },
  dropsButtonText: {
    fontSize: 11,
    letterSpacing: 3,
    color: '#9ca3af',
  },
  linkText: {
    marginTop: 2,
    fontSize: 10,
    color: '#9ca3af',
    letterSpacing: 2,
  },
  footerHint: {
    marginTop: 4,
    fontSize: 11,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 16,
  },
});
