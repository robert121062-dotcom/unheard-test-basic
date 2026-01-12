// app/drops.js
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDrops } from '../context/DropsContext';

const BG = '#050509';
const ACCENT = '#f97316';
const API_BASE_URL = 'http://localhost:3000';

export default function DropsOverviewScreen() {
  const router = useRouter();
  const { addDrop } = useDrops();

  const [allTracks, setAllTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/tracks`);
        const data = await res.json();
        setAllTracks(data);
      } catch (err) {
        console.error('트랙 로드 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTracks();
  }, []);

  const handleTrackPress = (trackCode) => {
    // 세션 추가하고 플레이어로 이동
    addDrop(trackCode);
    router.push(`/player?trackCode=${encodeURIComponent(trackCode)}`);
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[styles.card, { borderTopColor: item.coverColor }]}
        onPress={() => handleTrackPress(item.code)}
      >
        <View style={[styles.colorTag, { backgroundColor: item.coverColor }]}>
          <Text style={styles.colorTagText}>●</Text>
        </View>

        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardArtist}>{item.artist}</Text>
        <Text style={styles.cardCode}>{item.code}</Text>

        <View style={styles.cardFooter}>
          <Text style={styles.tapToPlay}>TAP TO PLAY →</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.badge}>ALL AVAILABLE</Text>
        <Text style={styles.title}>DROPS OVERVIEW</Text>
        <Text style={styles.subtitle}>
          모든 UNHEARD SESSION · 태그를 스캔하거나 여기서 바로 열 수 있습니다
        </Text>
      </View>

      {isLoading ? (
        <ActivityIndicator color={ACCENT} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={allTracks}
          keyExtractor={(item) => item.code}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 24,
  },
  badge: {
    fontSize: 10,
    color: '#6b7280',
    letterSpacing: 3,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    letterSpacing: 6,
    color: '#f9fafb',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: '#9ca3af',
    lineHeight: 18,
  },
  listContent: {
    paddingBottom: 40,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    flex: 1,
    maxWidth: '48%',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    borderTopWidth: 3,
    padding: 16,
    minHeight: 160,
    justifyContent: 'space-between',
  },
  colorTag: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  colorTagText: {
    color: '#fff',
    fontSize: 16,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f9fafb',
    marginBottom: 4,
    lineHeight: 18,
  },
  cardArtist: {
    fontSize: 12,
    color: '#d4d4d8',
    marginBottom: 8,
  },
  cardCode: {
    fontSize: 10,
    color: '#6b7280',
    letterSpacing: 1,
    marginBottom: 12,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
    paddingTop: 10,
  },
  tapToPlay: {
    fontSize: 10,
    color: ACCENT,
    letterSpacing: 2,
    fontWeight: 'bold',
  },
});
