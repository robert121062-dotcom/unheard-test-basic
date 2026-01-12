// context/DropsContext.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { getTrackByCode } from '../data/tracks';

const DropsContext = createContext(null);
const STORAGE_KEY = '@unheard_drops';

export function DropsProvider({ children }) {
  const [myDrops, setMyDrops] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 앱 시작 시 저장된 데이터 불러오기
  useEffect(() => {
    loadDrops();
  }, []);

  // 데이터 로드
  const loadDrops = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        const loaded = JSON.parse(jsonValue);
        console.log('[DropsContext] 저장된 데이터 로드:', loaded.length, '개');
        setMyDrops(loaded);
      }
    } catch (error) {
      console.error('[DropsContext] 데이터 로드 실패:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  // 데이터 저장
  const saveDrops = async (drops) => {
    try {
      const jsonValue = JSON.stringify(drops);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
      console.log('[DropsContext] 데이터 저장 완료:', drops.length, '개');
    } catch (error) {
      console.error('[DropsContext] 데이터 저장 실패:', error);
    }
  };

  // 드롭 추가 (메타 정보 포함)
  const addDrop = (trackCode) => {
    console.log('[DropsContext] ========== addDrop 호출 ==========');
    console.log('[DropsContext] trackCode:', trackCode);

    // track 메타 정보 가져오기
    const track = getTrackByCode(trackCode);
    
    console.log('[DropsContext] ✅ 새로운 drop 추가 (메타 포함)');
    const newDrop = {
      id: Date.now().toString(),
      trackCode,
      scannedAt: new Date().toISOString(),
      // 트랙 메타 정보 스냅샷
      title: track?.title || 'UNKNOWN TRACK',
      artist: track?.artist || 'UNKNOWN ARTIST',
      coverColor: track?.coverColor || '#9ca3af',
    };

    setMyDrops((prev) => {
      const updated = [newDrop, ...prev];
      console.log('[DropsContext] 추가 후 myDrops 순서:', updated.map((d) => d.trackCode));
      console.log('[DropsContext] ========================================');
      saveDrops(updated); // 자동 저장
      return updated;
    });

    // 항상 success: true를 반환
    return { success: true };
  };

  // 드롭 삭제
  const removeDrop = (id) => {
    console.log('[DropsContext] 삭제 요청:', id);
    setMyDrops((prev) => {
      const updated = prev.filter((drop) => drop.id !== id);
      console.log('[DropsContext] 삭제 후 개수:', updated.length);
      saveDrops(updated); // 자동 저장
      return updated;
    });
  };

  // 전체 삭제
  const clearAllDrops = async () => {
    console.log('[DropsContext] 전체 삭제');
    setMyDrops([]);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  const value = {
    myDrops,
    addDrop,
    removeDrop,
    clearAllDrops,
    isLoaded,
  };

  return <DropsContext.Provider value={value}>{children}</DropsContext.Provider>;
}

export function useDrops() {
  const ctx = useContext(DropsContext);
  if (!ctx) {
    throw new Error('useDrops는 DropsProvider 안에서만 사용할 수 있습니다.');
  }
  return ctx;
}
