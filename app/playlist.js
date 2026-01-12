// app/playlist.js
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PlaylistContext } from './_layout';

export default function PlaylistScreen() {
  const router = useRouter();
  const { playlist } = useContext(PlaylistContext);

  const handlePressTrack = (trackId) => {
    router.push({ pathname: '/player', params: { id: trackId } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>내 플레이리스트</Text>

      {playlist.length === 0 ? (
        <Text style={styles.emptyText}>
          아직 추가된 곡이 없습니다.{'\n'}
          홈 화면에서 태그 스캔 버튼을 눌러 테스트해 보세요.
        </Text>
      ) : (
        <FlatList
          data={playlist}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.trackItem}
              onPress={() => handlePressTrack(item.id)}
            >
              <Text style={styles.trackTitle}>{item.title}</Text>
              <Text style={styles.trackArtist}>{item.artist}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 64,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#aaa',
  },
  trackItem: {
    paddingVertical: 12,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  trackTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  trackArtist: {
    color: '#aaa',
  },
});
