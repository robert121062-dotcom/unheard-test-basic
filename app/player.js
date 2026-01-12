// app/player.js
import NetInfo from '@react-native-community/netinfo';
import { Audio } from 'expo-av';
import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const API_BASE_URL = 'http://localhost:3000';

// 시간 포맷 함수 (밀리초 → MM:SS)
function formatTime(millis) {
  const totalSeconds = Math.floor(millis / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function PlayerScreen() {
  // 1) 쿼리 파라미터에서 trackCode 가져오기
  const params = useLocalSearchParams();
  console.log('[player.js] params:', JSON.stringify(params));

  // 2) trackCode 안전하게 추출
  let trackCode = params.trackCode;
  if (Array.isArray(trackCode)) {
    console.log('[player.js] trackCode는 배열입니다:', trackCode);
    trackCode = trackCode[0];
  }
  if (!trackCode) {
    console.log('[player.js] trackCode가 없습니다!');
  } else {
    console.log('[player.js] 최종 trackCode:', trackCode);
  }

  // 3) 트랙 정보 상태 (이제 서버에서 가져옴)
  const [track, setTrack] = useState(null);
  const [isLoadingTrack, setIsLoadingTrack] = useState(true);
  const [trackError, setTrackError] = useState(null);

  useEffect(() => {
    const fetchTrack = async () => {
      if (!trackCode) {
        setTrackError('trackCode가 전달되지 않았어요.');
        setIsLoadingTrack(false);
        return;
      }

      try {
        setIsLoadingTrack(true);
        setTrackError(null);

        console.log('[player.js] 서버에서 트랙 요청:', `${API_BASE_URL}/tracks/${trackCode}`);
        const res = await fetch(`${API_BASE_URL}/tracks/${trackCode}`);
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        const data = await res.json();
        console.log('[player.js] 서버에서 트랙 로드됨:', data);
        setTrack(data);
      } catch (err) {
        console.log('[player.js] 트랙을 서버에서 가져오지 못함:', err);
        setTrackError('트랙 정보를 불러오는 중 문제가 발생했어요.');
      } finally {
        setIsLoadingTrack(false);
      }
    };

    fetchTrack();
  }, [trackCode]);

  const [sound, setSound] = useState(null);
  const [isLoadingSound, setIsLoadingSound] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isOnline, setIsOnline] = useState(true);

  // 네트워크 상태 모니터링
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected);
      console.log('[player.js] 네트워크 상태:', state.isConnected ? '온라인' : '오프라인');
    });

    return () => unsubscribe();
  }, []);

  // 컴포넌트 언마운트 시 사운드 정리 + 자동 정지
  useEffect(() => {
    return () => {
      if (sound) {
        console.log('[player.js] 컴포넌트 언마운트 - 사운드 정지 및 정리');
        sound.stopAsync().then(() => sound.unloadAsync());
      }
    };
  }, [sound]);

  // 재생 상태 업데이트 (0.5초마다)
  useEffect(() => {
    let interval;
    if (sound && isPlaying) {
      interval = setInterval(async () => {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          setPosition(status.positionMillis);
          setDuration(status.durationMillis || 0);

          if (status.didJustFinish) {
            setIsPlaying(false);
          }
        }
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sound, isPlaying]);

  const handlePlayPause = async () => {
    if (!track || !track.audioUrl) {
      console.log('[player.js] 트랙이나 오디오 URL이 없습니다:', {
        track,
        audioUrl: track?.audioUrl,
      });
      return;
    }

    // 네트워크 체크 (새로운 사운드 로드 시에만)
    if (!sound && !isOnline) {
      Alert.alert(
        '네트워크 오류',
        '인터넷 연결이 없습니다. 오디오를 스트리밍하려면 네트워크 연결이 필요합니다.',
        [{ text: '확인' }]
      );
      return;
    }

    console.log('[player.js] 재생/일시정지 시도 - audioUrl:', track.audioUrl);

    try {
      if (!sound) {
        console.log('[player.js] 새로운 사운드 객체 생성 중...');
        setIsLoadingSound(true);

        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
        });

        console.log('[player.js] 오디오 파일 로딩 중...');
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: track.audioUrl },
          { shouldPlay: true },
          (status) => {
            if (status.isLoaded) {
              console.log('[player.js] 재생 상태:', {
                isPlaying: status.isPlaying,
                positionMillis: status.positionMillis,
                durationMillis: status.durationMillis,
              });
            }
          }
        );

        console.log('[player.js] 사운드 객체 생성 완료, 재생 시작');
        setSound(newSound);
        setIsPlaying(true);
        setIsLoadingSound(false);
      } else {
        const status = await sound.getStatusAsync();
        console.log('[player.js] 현재 재생 상태:', status.isPlaying);

        if (status.isPlaying) {
          console.log('[player.js] 일시정지');
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          console.log('[player.js] 재생 시작');
          await sound.playAsync();
          setIsPlaying(true);
        }
      }
    } catch (e) {
      console.error('[player.js] 오디오 재생 에러:', e);
      setError(e.message || '오디오 재생 실패');
      setIsLoadingSound(false);
      setIsPlaying(false);
    }
  };

  // 트랙 로딩 중 또는 에러일 때 UI
  if (isLoadingTrack) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.badge}>LOADING</Text>
          <Text style={styles.headerTitle}>UNHEARD SESSION</Text>
        </View>
        <ActivityIndicator color="#f9fafb" />
        <Text style={[styles.hintText, { marginTop: 12 }]}>트랙 정보를 불러오는 중...</Text>
      </View>
    );
  }

  if (trackError || !track) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.badge}>ERROR</Text>
          <Text style={styles.headerTitle}>TRACK NOT FOUND</Text>
        </View>

        <View style={[styles.albumArt, { borderColor: '#ef4444' }]}>
          <View style={styles.albumArtInner}>
            <Text style={styles.albumArtIcon}>⚠️</Text>
            <Text style={styles.albumArtText}>UNKNOWN</Text>
          </View>
        </View>

        <View style={styles.trackInfoBox}>
          <Text style={styles.errorLabel}>INVALID TRACK CODE</Text>
          <Text style={styles.errorCode}>{trackCode ?? 'N/A'}</Text>
        </View>

        <Text style={styles.hintText}>
          유효하지 않은 TRACK CODE입니다.{'\n'}
          /scan에서 다시 시도해주세요.
        </Text>

        <Link href="/drops" asChild>
          <TouchableOpacity style={{ marginTop: 16 }}>
            <Text style={styles.hintText}>← DROPS로 돌아가기</Text>
          </TouchableOpacity>
        </Link>
      </View>
    );
  }

  // 정상 UI
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.badge}>NOW PLAYING</Text>
        <Text style={styles.headerTitle}>UNHEARD SESSION</Text>
      </View>

      {/* 앨범 아트 스타일 박스 */}
      <View style={[styles.albumArt, { borderColor: track.coverColor }]}>
        <View style={[styles.albumArtInner, { backgroundColor: `${track.coverColor}20` }]}>
          <View style={[styles.colorDot, { backgroundColor: track.coverColor }]} />
          <Text style={styles.albumArtText}>UNHEARD</Text>
          <Text style={styles.albumArtSubtext}>EXCLUSIVE SESSION</Text>
        </View>
      </View>

      {/* 트랙 정보 */}
      <View style={styles.trackInfoBox}>
        <Text style={styles.trackTitle}>{track.title}</Text>
        <Text style={styles.trackArtist}>{track.artist}</Text>
        <View style={styles.codeTag}>
          <Text style={styles.codeTagText}>{track.code}</Text>
        </View>

        {/* 네트워크 상태 */}
        {!isOnline && (
          <View style={styles.offlineWarning}>
            <Text style={styles.offlineText}>⚠️ OFFLINE MODE</Text>
          </View>
        )}
      </View>

      {/* 프로그레스 바 */}
      {duration > 0 && (
        <View style={styles.progressContainer}>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(position / duration) * 100}%`, backgroundColor: track.coverColor },
              ]}
            />
            <View
              style={[
                styles.progressHandle,
                { left: `${(position / duration) * 100}%`, backgroundColor: track.coverColor },
              ]}
            />
          </View>
        </View>
      )}

      {/* 재생 컨트롤 */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.playButton, { backgroundColor: track.coverColor }]}
          onPress={handlePlayPause}
          disabled={isLoadingSound}
        >
          {isLoadingSound ? (
            <ActivityIndicator color="#0f172a" size="large" />
          ) : (
            <>
              <Text style={styles.playButtonIcon}>{isPlaying ? '⏸' : '▶'}</Text>
              <Text style={styles.playButtonText}>{isPlaying ? 'PAUSE' : 'PLAY'}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* 에러 표시 */}
      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>PLAYBACK ERROR</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <Text style={styles.errorHint}>Check browser console (F12) for details</Text>
        </View>
      )}

      {/* 힌트 텍스트 */}
      <Text style={styles.hintText}>스트리밍 세션은 일시적입니다 · 다운로드 불가</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050509',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  badge: {
    fontSize: 10,
    color: '#6b7280',
    letterSpacing: 3,
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 20,
    letterSpacing: 6,
    color: '#f9fafb',
  },

  // 앨범 아트 스타일
  albumArt: {
    width: 280,
    height: 280,
    borderRadius: 20,
    borderWidth: 3,
    padding: 4,
    marginBottom: 32,
  },
  albumArtInner: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  colorDot: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 8,
  },
  albumArtIcon: {
    fontSize: 64,
    marginBottom: 8,
  },
  albumArtText: {
    fontSize: 24,
    letterSpacing: 8,
    color: '#f9fafb',
    fontWeight: 'bold',
  },
  albumArtSubtext: {
    fontSize: 10,
    letterSpacing: 3,
    color: '#9ca3af',
  },

  // 트랙 정보
  trackInfoBox: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
  },
  trackTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f9fafb',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1,
  },
  trackArtist: {
    fontSize: 16,
    color: '#d4d4d8',
    textAlign: 'center',
    marginBottom: 12,
  },
  codeTag: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 8,
  },
  codeTagText: {
    fontSize: 11,
    color: '#9ca3af',
    letterSpacing: 2,
  },

  // 프로그레스
  progressContainer: {
    width: '100%',
    marginBottom: 32,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timeText: {
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: '600',
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#1f2937',
    borderRadius: 3,
    overflow: 'visible',
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressHandle: {
    position: 'absolute',
    top: -3,
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: -6,
  },

  // 컨트롤
  controlsContainer: {
    width: '100%',
    marginBottom: 24,
  },
  playButton: {
    width: '100%',
    borderRadius: 999,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  playButtonIcon: {
    fontSize: 24,
    color: '#0f172a',
  },
  playButtonText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 3,
  },

  // 네트워크 상태
  offlineWarning: {
    backgroundColor: '#7f1d1d',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 8,
  },
  offlineText: {
    color: '#fca5a5',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  // 에러 표시
  errorBox: {
    backgroundColor: '#7f1d1d',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: '#991b1b',
  },
  errorTitle: {
    color: '#fca5a5',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 6,
  },
  errorMessage: {
    color: '#fca5a5',
    fontSize: 13,
    marginBottom: 4,
  },
  errorHint: {
    color: '#dc2626',
    fontSize: 10,
    marginTop: 4,
  },
  errorLabel: {
    color: '#dc2626',
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 8,
  },
  errorCode: {
    color: '#fca5a5',
    fontSize: 18,
    letterSpacing: 3,
  },

  // 힌트
  hintText: {
    color: '#6b7280',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    letterSpacing: 0.5,
  },
});
