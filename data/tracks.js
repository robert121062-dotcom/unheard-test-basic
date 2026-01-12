// data/tracks.js

/**
 * 트랙 데이터베이스 (가짜 DB)
 * 실제 앱에서는 API나 Firebase 등에서 가져올 데이터
 */
export const tracksByCode = {
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

/**
 * trackCode로 트랙 정보를 가져오는 함수
 * @param {string|string[]|undefined} trackCode - 트랙 코드
 * @returns {Object|null} - 트랙 객체 또는 null
 */
export function getTrackByCode(trackCode) {
  // undefined, null, 빈 문자열 체크
  if (!trackCode) {
    console.log('[tracks.js] trackCode가 없습니다:', trackCode);
    return null;
  }

  // 배열로 들어온 경우 첫 번째 요소 사용
  let normalizedCode = trackCode;
  if (Array.isArray(trackCode)) {
    console.log('[tracks.js] trackCode가 배열입니다:', trackCode);
    normalizedCode = trackCode[0];
  }

  // 문자열로 변환
  const key = String(normalizedCode).trim();
  console.log('[tracks.js] 검색할 key:', key);

  // tracksByCode에서 찾기
  const track = tracksByCode[key] ?? null;
  
  if (track) {
    console.log('[tracks.js] 트랙을 찾았습니다:', track.title);
  } else {
    console.log('[tracks.js] 트랙을 찾지 못했습니다. 사용 가능한 키:', Object.keys(tracksByCode));
  }

  return track;
}
