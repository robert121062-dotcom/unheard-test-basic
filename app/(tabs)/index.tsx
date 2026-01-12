import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>UNHEARD</Text>
      <Text style={styles.subtitle}>
        아래 버튼을 눌러서 NFC 스캔 화면으로 이동해봐.
      </Text>

      <Link href="/scan" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>📡 스캔 화면으로 가기</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#aaaaaa',
    marginBottom: 32,
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
});
