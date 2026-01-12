// server/index.js
const express = require('express');
const cors = require('cors');

const app = express();
// 로컬에서는 3000, Render 같은 호스팅에서는 환경변수 PORT 사용
const PORT = process.env.PORT || 3000;

// CORS / JSON 설정
app.use(cors());
app.use(express.json());

// ---- UNHEARD tracks 마스터 리스트 ----
const tracksByCode = {
  'UNHD-DEMO-001': {
    code: 'UNHD-DEMO-001',
    title: 'ROOFTOP CYPHER (DEMO)',
    artist: 'UNHEARD CREW',
    coverColor: '#f97316',
    audioUrl: 'https://actions.google.com/sounds/v1/alarms/bugle_tune.ogg',
  },
  'UNHD-DEMO-002': {
    code: 'UNHD-DEMO-002',
    title: 'SUBWAY REVERB TAPE',
    artist: 'MIDNIGHT LINE',
    coverColor: '#22c55e',
    audioUrl: 'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg',
  },
  'UNHD-DEMO-003': {
    code: 'UNHD-DEMO-003',
    title: 'MIDNIGHT FREESTYLE',
    artist: 'SHADOW MC',
    coverColor: '#8b5cf6',
    audioUrl: 'https://actions.google.com/sounds/v1/cartoon/slide_whistle.ogg',
  },
  'UNHD-DEMO-004': {
    code: 'UNHD-DEMO-004',
    title: 'STREET VIBES',
    artist: 'URBAN COLLECTIVE',
    coverColor: '#ec4899',
    audioUrl: 'https://actions.google.com/sounds/v1/foley/swoosh.ogg',
  },
  'UNHD-DEMO-005': {
    code: 'UNHD-DEMO-005',
    title: 'UNDERGROUND ANTHEM',
    artist: 'THE BASEMENT',
    coverColor: '#06b6d4',
    audioUrl: 'https://actions.google.com/sounds/v1/cartoon/pop.ogg',
  },
};

// 코드로 하나 찾는 헬퍼
function getTrackByCode(code) {
  if (!code) return null;
  const key = String(code).trim();
  return tracksByCode[key] ?? null;
}

// 1) 전체 트랙 리스트
app.get('/tracks', (req, res) => {
  const tracks = Object.values(tracksByCode);
  res.json(tracks);
});

// 2) 특정 코드로 트랙 하나 조회 (GET /tracks/UNHD-DEMO-001)
app.get('/tracks/:code', (req, res) => {
  const { code } = req.params;
  const track = getTrackByCode(code);

  if (!track) {
    return res.status(404).json({ error: 'Track not found', code });
  }

  res.json(track);
});

// 3) 쿼리로 조회 (GET /track?code=UNHD-DEMO-001)
app.get('/track', (req, res) => {
  const { code } = req.query;
  const track = getTrackByCode(code);

  if (!track) {
    return res.status(404).json({ error: 'Track not found', code });
  }

  res.json(track);
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`UNHEARD API 서버 실행 중: http://localhost:${PORT}`);
});
