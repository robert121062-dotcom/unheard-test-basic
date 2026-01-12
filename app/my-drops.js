// app/my-drops.js
import { useRouter } from 'expo-router';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDrops } from '../context/DropsContext';

export default function MyDropsScreen() {
  const router = useRouter();
  const { myDrops, removeDrop, clearAllDrops } = useDrops();

  console.log('[my-drops.js] ========== MY DROPS 화면 렌더링 ==========');
  console.log('[my-drops.js] myDrops 개수:', myDrops.length);
  console.log('[my-drops.js] myDrops 순서:', myDrops.map((d, idx) => `${idx}: ${d.trackCode}`));
  console.log('[my-drops.js] ===========================================');

  const renderItem = ({ item, index }) => {
    const date = new Date(item.scannedAt);
    const timeLabel = `${date.getMonth() + 1}/${date.getDate()} ${date
      .getHours()
      .toString()
      .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

    // 메타 정보 가져오기 (스냅샷이 없으면 기본값)
    const title = item.title || 'UNKNOWN TRACK';
    const artist = item.artist || 'UNKNOWN ARTIST';
    const coverColor = item.coverColor || '#9ca3af';

    const handleDelete = () => {
      Alert.alert('삭제 확인', `"${title}"를 삭제하시겠습니까?`, [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => removeDrop(item.id),
        },
      ]);
    };

    return (
      <View style={styles.dropItemContainer}>
        <TouchableOpacity
          style={[styles.dropItem, { borderLeftColor: coverColor, borderLeftWidth: 4 }]}
          onPress={() => router.push(`/player?trackCode=${encodeURIComponent(item.trackCode)}`)}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.trackTitle}>{title}</Text>
            <Text style={styles.trackArtist}>{artist}</Text>
            <Text style={styles.trackCode}>{item.trackCode}</Text>
            <Text style={styles.meta}>SCANNED · {timeLabel}</Text>
          </View>
          <View style={{ backgroundColor: '#1f2937', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 }}>
            <Text style={{ color: '#9ca3af', fontSize: 12, fontWeight: 'bold' }}>#{index + 1}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleClearAll = () => {
    Alert.alert('전체 삭제', '모든 드롭을 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '전체 삭제',
        style: 'destructive',
        onPress: clearAllDrops,
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MY DROPS</Text>
        {myDrops.length > 0 && (
          <TouchableOpacity onPress={handleClearAll} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>전체 삭제</Text>
          </TouchableOpacity>
        )}
      </View>

      {myDrops.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>아직 스캔한 세션이 없어요.</Text>
          <Text style={styles.emptyTextSub}>/scan에서 NFC를 스캔하거나 DEV 버튼을 눌러보세요.</Text>
        </View>
      ) : (
        <FlatList
          data={myDrops}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    color: '#e5e7eb',
    letterSpacing: 4,
  },
  clearButton: {
    backgroundColor: '#7f1d1d',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  clearButtonText: {
    color: '#fca5a5',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyBox: {
    marginTop: 40,
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  emptyText: {
    color: '#9ca3af',
    marginBottom: 4,
  },
  emptyTextSub: {
    color: '#6b7280',
  },
  dropItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  dropItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  trackTitle: {
    color: '#f9fafb',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  trackArtist: {
    color: '#d4d4d8',
    fontSize: 14,
    marginBottom: 6,
  },
  trackCode: {
    color: '#6b7280',
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 4,
  },
  meta: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 4,
  },
  deleteButton: {
    width: 44,
    height: 44,
    backgroundColor: '#7f1d1d',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    fontSize: 20,
  },
});
