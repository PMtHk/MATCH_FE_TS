import { VALORANT_POSITION } from 'types/games';

export const queueTypeList = [
  { value: 'ALL', label: '모든 큐', maxMember: 5 },
  { value: 'STANDARD', label: '일반전', maxMember: 5 },
  { value: 'COMPETITIVE', label: '경쟁전', maxMember: 5 },
  { value: 'SPIKE_RUSH', label: '스파이크 돌격', maxMember: 5 },
  { value: 'SWIFTPLAY', label: '신속 플레이', maxMember: 5 },
  { value: 'TEAM_DEATHMATCH', label: '팀 데스메치', maxMember: 12 },
];

export const tierList = [
  {
    value: 'ALL',
    label: '모든 티어',
    color: '#000000',
    acronym: 'ALL',
    imageUrl: 'https://cdn.match-gg.kr/valorant/ranked_emblems/unranked.png',
  },
  {
    value: 'RADIANT',
    label: '레디언트',
    color: '#F4C875',
    acronym: 'RD',
    imageUrl: 'https://cdn.match-gg.kr/valorant/ranked_emblems/radiant.png',
  },
  {
    value: 'IMMORTAL',
    label: '불굴',
    color: '#CD4545',
    acronym: 'IM',
    imageUrl: 'https://cdn.match-gg.kr/valorant/ranked_emblems/immortal.png',
  },
  {
    value: 'ASCENDANT',
    label: '초월자',
    color: '#9A4E80',
    acronym: 'AS',
    imageUrl: 'https://cdn.match-gg.kr/valorant/ranked_emblems/ascendant.png',
  },
  {
    value: 'DIAMOND',
    label: '다이아몬드',
    color: '#576BCE',
    acronym: 'D',
    imageUrl: 'https://cdn.match-gg.kr/valorant/ranked_emblems/diamond.png',
  },
  {
    value: 'PLATINUM',
    label: '플래티넘',
    color: '#4E9996',
    acronym: 'P',
    imageUrl: 'https://cdn.match-gg.kr/valorant/ranked_emblems/platinum.png',
  },
  {
    value: 'GOLD',
    label: '골드',
    color: '#CD8837',
    acronym: 'G',
    imageUrl: 'https://cdn.match-gg.kr/valorant/ranked_emblems/gold.png',
  },
  {
    value: 'SILVER',
    label: '실버',
    color: '#80989D',
    acronym: 'S',
    imageUrl: 'https://cdn.match-gg.kr/valorant/ranked_emblems/silver.png',
  },
  {
    value: 'BRONZE',
    label: '브론즈',
    color: '#8C513A',
    acronym: 'B',
    imageUrl: 'https://cdn.match-gg.kr/valorant/ranked_emblems/bronze.png',
  },
  {
    value: 'IRON',
    label: '아이언',
    color: '#51484A',
    acronym: 'I',
    imageUrl: 'https://cdn.match-gg.kr/valorant/ranked_emblems/iron.png',
  },
  {
    value: 'UNRANKED',
    label: '언랭크드',
    color: '#000000',
    acronym: 'U',
    imageUrl: 'https://cdn.match-gg.kr/valorant/ranked_emblems/unranked.png',
  },
];

export const positionList: VALORANT_POSITION[] = [
  {
    value: 'ALL',
    label: '전체',
    imageUrl: 'https://cdn.match-gg.kr/valorant/position/ALL.png',
  },
  {
    value: 'DUELIST',
    label: '타격대',
    imageUrl: 'https://cdn.match-gg.kr/valorant/position/duelist.png',
  },
  {
    value: 'INITIATOR',
    label: '척후대',
    imageUrl: 'https://cdn.match-gg.kr/valorant/position/initiator.png',
  },
  {
    value: 'SENTINEL',
    label: '감시자',
    imageUrl: 'https://cdn.match-gg.kr/valorant/position/sentinel.png',
  },
  {
    value: 'CONTROLLER',
    label: '전략가',
    imageUrl: 'https://cdn.match-gg.kr/valorant/position/controller.png',
  },
];

export const expiredTimeList = [
  { value: 'FIFTEEN_M', label: '15분', time: 15 * 60 * 1000 },
  { value: 'THIRTY_M', label: '30분', time: 30 * 60 * 1000 },
  { value: 'ONE_H', label: '1시간', time: 60 * 60 * 1000 },
  { value: 'TWO_H', label: '2시간', time: 2 * 60 * 60 * 1000 },
  { value: 'THREE_H', label: '3시간', time: 3 * 60 * 60 * 1000 },
  { value: 'SIX_H', label: '6시간', time: 6 * 60 * 60 * 1000 },
  { value: 'TWELVE_H', label: '12시간', time: 12 * 60 * 60 * 1000 },
  { value: 'TWENTY_FOUR_H', label: '24시간', time: 24 * 60 * 60 * 1000 },
];
