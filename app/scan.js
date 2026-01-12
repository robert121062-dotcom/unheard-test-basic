// app/scan.js
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import { useDrops } from '../context/DropsContext';

export default function ScanScreen() {
  const router = useRouter();
  const { addDrop } = useDrops();
  const [isScanning, setIsScanning] = useState(false);
  const [nfcSupported, setNfcSupported] = useState(null);

  // 컴포넌트 마운트 시 NFC 초기화
  useEffect(() => {
    let isMounted = true;

    async function initNfc() {
      try {
        const supported = await NfcManager.isSupported();
        if (isMounted) {
          setNfcSupported(supported);
          if (supported) {
            await NfcManager.start();
            console.log('[NFC] NFC Manager 시작됨');
          } else {
            console.log('[NFC] 이 기기는 NFC를 지원하지 않습니다');
          }
        }
      } catch (error) {
        console.error('[NFC] 초기화 에러:', error);
        if (isMounted) {
          setNfcSupported(false);
        }
      }
    }

    initNfc();

    // 컴포넌트 언마운트 시 스캔 정리
    return () => {
      isMounted = false;
      cleanupNfc();
    };
  }, []);

  // NFC 스캔 정리 함수
  const cleanupNfc = async () => {
    try {
      await NfcManager.cancelTechnologyRequest();
      console.log('[NFC] 스캔 취소됨');
    } catch (error) {
      // 스캔이 진행 중이 아니면 에러 발생 (무시 가능)
      console.log('[NFC] 정리 중 에러 (무시 가능):', error.message);
    }
  };

  // 실제 NFC 스캔 함수
  const startNfcScan = async () => {
    if (!nfcSupported) {
      Alert.alert('NFC 미지원', '이 기기는 NFC를 지원하지 않습니다.');
      return;
    }

    try {
      setIsScanning(true);
      console.log('[NFC] 스캔 시작...');

      // NFC 활성화 확인
      const isEnabled = await NfcManager.isEnabled();
      if (!isEnabled) {
        Alert.alert(
          'NFC 비활성화',
          'NFC가 꺼져 있습니다. 설정에서 NFC를 켜주세요.',
          [
            { text: '취소', style: 'cancel' },
            {
              text: '설정 열기',
              onPress: () => NfcManager.goToNfcSetting(),
            },
          ]
        );
        setIsScanning(false);
        return;
      }

      // NDEF 기술로 태그 요청
      await NfcManager.requestTechnology(NfcTech.Ndef);
      console.log('[NFC] 태그 대기 중...');

      // 태그 읽기
      const tag = await NfcManager.getTag();
      console.log('[NFC] 태그 감지됨:', tag);

      // NDEF 메시지에서 텍스트 추출
      let trackCode = null;

      if (tag.ndefMessage && tag.ndefMessage.length > 0) {
        for (const record of tag.ndefMessage) {
          // TNF (Type Name Format)이 1 (Well Known)이고 타입이 'T' (Text)인 레코드 찾기
          if (record.tnf === 1 && record.type) {
            const typeString = String.fromCharCode(...record.type);
            console.log('[NFC] 레코드 타입:', typeString);

            if (typeString === 'T') {
              // Text 레코드의 payload 파싱
              // 첫 바이트: 상태 바이트 (언어 코드 길이 포함)
              // 그 다음: 언어 코드 (예: "en")
              // 나머지: 실제 텍스트
              const payload = record.payload;
              const languageCodeLength = payload[0] & 0x3f; // 하위 6비트
              const textBytes = payload.slice(1 + languageCodeLength);
              trackCode = String.fromCharCode(...textBytes).trim();
              console.log('[NFC] 추출된 trackCode:', trackCode);
              break;
            }
          }
        }
      }

      // 스캔 정리
      await NfcManager.cancelTechnologyRequest();
      setIsScanning(false);

      // trackCode가 있으면 처리
      if (trackCode) {
        console.log('[NFC] 스캔 성공 - trackCode:', trackCode);
        
        // NFC 스캔 성공 햅틱
        try {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        } catch (e) {
          console.log('[NFC] Haptics 에러 무시:', e.message);
        }
        
        handleTagScanned(trackCode);
      } else {
        console.log('[NFC] 유효한 trackCode를 찾지 못했습니다');
        Alert.alert('스캔 실패', 'NFC 태그에서 유효한 데이터를 찾지 못했습니다.');
      }
    } catch (error) {
      console.error('[NFC] 스캔 에러:', error);
      await cleanupNfc();
      setIsScanning(false);

      if (error.message !== 'The operation was cancelled.') {
        Alert.alert('NFC 스캔 오류', error.message || '알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  const handleTagScanned = (trackCode) => {
    console.log('[scan.js] ========== handleTagScanned 시작 ==========');
    console.log('[scan.js] trackCode:', trackCode);

    try {
      // Context에 Drop 추가 (중복이어도 상관없음)
      addDrop(trackCode);
      console.log('[scan.js] ✅ Drop 추가 완료 - 플레이어로 이동');

      // Player 화면으로 라우팅 (항상 실행)
      const url = `/player?trackCode=${encodeURIComponent(trackCode)}`;
      console.log('[scan.js] 🚀 라우팅 실행:', url);

      router.push(url);
      console.log('[scan.js] ========== router.push 호출 완료 ==========');
    } catch (error) {
      console.error('[scan.js] ❌ handleTagScanned 에러:', error);
      Alert.alert('오류', '트랙 처리 중 오류가 발생했습니다: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>UNHEARD</Text>
      <Text style={styles.sloganTop}>WEAR THE RYTHM</Text>
      <Text style={styles.sloganBottom}>UNLOCK THE EXCLUSIVE UNHEARD</Text>

      <View style={styles.nfcRing}>
        <Text style={styles.nfcText}>
          {isScanning ? '📱 태그를 가까이 대세요...' : 'NFC SCAN AREA'}
        </Text>
      </View>

      {/* NFC 스캔 버튼 */}
      {nfcSupported !== false && (
        <TouchableOpacity
          style={[styles.scanButton, isScanning && styles.scanButtonActive]}
          onPress={startNfcScan}
          disabled={isScanning}
        >
          <Text style={styles.scanButtonText}>
            {isScanning ? '스캔 중...' : '🔍 NFC 스캔 시작'}
          </Text>
        </TouchableOpacity>
      )}

      {/* NFC 미지원 안내 */}
      {nfcSupported === false && (
        <View style={styles.notSupportedBox}>
          <Text style={styles.notSupportedText}>
            이 기기는 NFC를 지원하지 않습니다.
          </Text>
          <Text style={styles.notSupportedSubText}>
            아래 DEV 버튼으로 테스트하세요.
          </Text>
        </View>
      )}

      {/* DEV 버튼 (테스트용) */}
      <View style={styles.devButtons}>
        <Text style={styles.devTitle}>개발자 테스트</Text>
        
        {/* 테스트 버튼 */}
        <TouchableOpacity
          style={[styles.devButton, { backgroundColor: '#7c3aed' }]}
          onPress={() => {
            console.log('🔴 TEST BUTTON CLICKED!');
            Alert.alert('테스트', '버튼이 작동합니다!');
          }}
        >
          <Text style={styles.devButtonText}>🔴 테스트 버튼 (클릭해보세요)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.devButton}
          onPress={() => {
            console.log('🔥 버튼 클릭됨 - DEMO-001');
            handleTagScanned('UNHD-DEMO-001');
          }}
        >
          <Text style={styles.devButtonText}>🔥 ROOFTOP CYPHER</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.devButton}
          onPress={() => handleTagScanned('UNHD-DEMO-002')}
        >
          <Text style={styles.devButtonText}>🚇 SUBWAY REVERB</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.devButton}
          onPress={() => handleTagScanned('UNHD-DEMO-003')}
        >
          <Text style={styles.devButtonText}>🌙 MIDNIGHT FREESTYLE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.devButton}
          onPress={() => handleTagScanned('UNHD-DEMO-004')}
        >
          <Text style={styles.devButtonText}>🏙️ STREET VIBES</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.devButton}
          onPress={() => handleTagScanned('UNHD-DEMO-005')}
        >
          <Text style={styles.devButtonText}>🎵 UNDERGROUND ANTHEM</Text>
        </TouchableOpacity>
      </View>
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
  },
  logo: {
    fontSize: 24,
    letterSpacing: 6,
    color: '#ffffff',
    marginBottom: 8,
  },
  sloganTop: {
    fontSize: 12,
    color: '#888',
    letterSpacing: 2,
  },
  sloganBottom: {
    fontSize: 12,
    color: '#888',
    letterSpacing: 2,
    marginBottom: 32,
  },
  nfcRing: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
    borderColor: '#38bdf8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  nfcText: {
    color: '#38bdf8',
    letterSpacing: 3,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  scanButton: {
    backgroundColor: '#38bdf8',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 40,
    minWidth: 200,
    alignItems: 'center',
  },
  scanButtonActive: {
    backgroundColor: '#0ea5e9',
  },
  scanButtonText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  notSupportedBox: {
    backgroundColor: '#7f1d1d',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#991b1b',
  },
  notSupportedText: {
    color: '#fca5a5',
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
  },
  notSupportedSubText: {
    color: '#fca5a5',
    fontSize: 12,
    textAlign: 'center',
  },
  devButtons: {
    width: '100%',
    gap: 12,
  },
  devTitle: {
    color: '#6b7280',
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 8,
    textAlign: 'center',
  },
  devButton: {
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  devButtonText: {
    color: '#e5e7eb',
    textAlign: 'center',
    letterSpacing: 1,
  },
});
