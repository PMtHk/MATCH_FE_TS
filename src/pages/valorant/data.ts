import { VALORANT_POSITION } from 'types/games';

export const queueTypeList = [
  {
    value: 'ALL',
    label: '모든 큐',
    maxMember: 5,
    imageUrl: '',
  },
  {
    value: 'STANDARD',
    label: '일반전',
    maxMember: 5,
    imageUrl:
      'https://cdn.match-gg.kr/valorant/game_modes/STANDARD.png?w=36&h=36',
  },
  {
    value: 'COMPETITIVE',
    label: '경쟁전',
    maxMember: 5,
    imageUrl:
      'https://cdn.match-gg.kr/valorant/game_modes/COMPETITIVE.png?w=36&h=36',
  },
  {
    value: 'SPIKE_RUSH',
    label: '스파이크 돌격',
    maxMember: 5,
    imageUrl:
      'https://cdn.match-gg.kr/valorant/game_modes/SPIKE_RUSH.png?w=36&h=36',
  },
  {
    value: 'SWIFTPLAY',
    label: '신속 플레이',
    maxMember: 5,
    imageUrl:
      'https://cdn.match-gg.kr/valorant/game_modes/SWIFTPLAY.png?w=36&h=36',
  },
  {
    value: 'TEAM_DEATHMATCH',
    label: '팀 데스메치',
    maxMember: 5,
    imageUrl:
      'https://cdn.match-gg.kr/valorant/game_modes/TEAM_DEATHMATCH.png?w=36&h=36',
  },
];

export const tierFilterList = [
  {
    value: 0,
    label: '모든 티어',
  },
  {
    value: 25,
    label: '레디언트',
  },
  {
    value: 22,
    label: '불멸',
  },
  {
    value: 19,
    label: '초월자',
  },
  {
    value: 16,
    label: '다이아몬드',
  },
  {
    value: 13,
    label: '플래티넘',
  },
  {
    value: 10,
    label: '골드',
  },
  {
    value: 7,
    label: '실버',
  },
  {
    value: 4,
    label: '브론즈',
  },
  {
    value: 1,
    label: '아이언',
  },
];

export const tierList = [
  {
    value: 'UNRANKED',
    label: '언랭크드',
    color: '#000000',
    acronym: 'U',
    imageUrl:
      'https://cdn.match-gg.kr/valorant/rank_emblems/Unranked.png?w=36&h=36',
  },
  {
    value: 'IRON_1',
    label: '아이언 1',
    color: '#51484A',
    acronym: 'I',
    imageUrl:
      'https://cdn.match-gg.kr/valorant/rank_emblems/Iron_1.png?w=36&h=36',
  },
  {
    value: 'IRON_2',
    label: '아이언 2',
    color: '#51484A',
    acronym: 'I',
    imageUrl:
      'https://cdn.match-gg.kr/valorant/rank_emblems/Iron_2.png?w=36&h=36',
  },
  {
    value: 'IRON_3',
    label: '아이언 3',
    color: '#51484A',
    acronym: 'I',
    imageUrl:
      'https://cdn.match-gg.kr/valorant/rank_emblems/Iron_3.png?w=36&h=36',
  },
  {
    value: 'BRONZE_1',
    label: '브론즈 1',
    color: '#8C513A',
    acronym: 'B1',
    imageUrl:
      'https://cdn.match-gg.kr/valorant/rank_emblems/Bronze_1.png?w=36&h=36',
  },
  {
    value: 'BRONZE_2',
    label: '브론즈 2',
    color: '#8C513A',
    acronym: 'B2',
    imageUrl:
      'https://cdn.match-gg.kr/valorant/rank_emblems/Bronze_2.png?w=36&h=36',
  },
  {
    value: 'BRONZE_3',
    label: '브론즈 3',
    color: '#8C513A',
    acronym: 'B3',
    imageUrl:
      'https://cdn.match-gg.kr/valorant/rank_emblems/Bronze_3.png?w=36&h=36',
  },
  {
    value: 'SILVER_1',
    label: '실버 1',
    color: '#80989D',
    acronym: 'S1',
    imageUrl:
      'https://cdn.match-gg.kr/valorant/rank_emblems/Silver_1.png?w=36&h=36',
  },
  {
    value: 'SILVER_2',
    label: '실버 2',
    color: '#80989D',
    acronym: 'S2',
    imageUrl:
      'https://cdn.match-gg.kr/valorant/rank_emblems/Silver_2.png?w=36&h=36',
  },
  {
    value: 'SILVER_3',
    label: '실버 3',
    color: '#80989D',
    acronym: 'S3',
    imageUrl:
      'https://cdn.match-gg.kr/valorant/rank_emblems/Silver_3.png?w=36&h=36',
  },
  {
    value: 'GOLD_1',
    label: '골드 1',
    color: '#CD8837',
    acronym: 'G1',
    imageUrl:
      'https://cdn.match-gg.kr/valorant/rank_emblems/Gold_1.png?w=36&h=36',
  },
  {
    value: 'GOLD_2',
    label: '골드 2',
    color: '#CD8837',
    acronym: 'G2',
    imageUrl:
      'https://cdn.match-gg.kr/valorant/rank_emblems/Gold_2.png?w=36&h=36',
  },
  {
    value: 'GOLD_3',
    label: '골드 3',
    color: '#CD8837',
    acronym: 'G3',
    imageUrl:
      'https://cdn.match-gg.kr/valorant/rank_emblems/Gold_3.png?w=36&h=36',
  },
  {
    value: 'PLATINUM_1',
    label: '플래티넘 1',
    color: '#35a3ac',
    acronym: 'P1',
    imageUrl:
      'https://cdn.match-gg.kr/valorant/rank_emblems/Platinum_1.png?w=36&h=36',
  },
  {
    value: 'PLATINUM_2',
    label: '플래티넘 2',
    color: '#35a3ac',
    acronym: 'P2',
    imageUrl:
      'https://cdn.match-gg.kr/valorant/rank_emblems/Platinum_2.png?w=36&h=36',
  },
  {
    value: 'PLATINUM_3',
    label: '플래티넘 3',
    color: '#35a3ac',
    acronym: 'P3',
    imageUrl:
      'https://cdn.match-gg.kr/valorant/rank_emblems/Platinum_2.png?w=36&h=36',
  },
  {
    value: 'DIAMOND_1',
    label: '다이아몬드 1',
    color: '#8864b0',
    acronym: 'D1',
    imageUrl:
      'https://cdn.match-gg.kr/valorant/rank_emblems/Diamond_1.png?w=36&h=36',
  },
  {
    value: 'DIAMOND_2',
    label: '다이아몬드 2',
    color: '#8864b0',
    acronym: 'D2',
    imageUrl:
      'https://cdn.match-gg.kr/valorant/rank_emblems/Diamond_2.png?w=36&h=36',
  },
  {
    value: 'DIAMOND_3',
    label: '다이아몬드 3',
    color: '#8864b0',
    acronym: 'D3',
    imageUrl:
      'https://cdn.match-gg.kr/valorant/rank_emblems/Diamond_3.png?w=36&h=36',
  },
  {
    value: 'ASCENDANT_1',
    label: '초월자 1',
    color: '#21864f',
    acronym: 'AS1',
    imageUrl:
      'https://cdn.match-gg.kr/valorant/rank_emblems/Ascendant_1.png?w=36&h=36',
  },
  {
    value: 'ASCENDANT_2',
    label: '초월자 2',
    color: '#21864f',
    acronym: 'AS2',
    imageUrl:
      'https://cdn.match-gg.kr/valorant/rank_emblems/Ascendant_2.png?w=36&h=36',
  },
  {
    value: 'ASCENDANT_3',
    label: '초월자 3',
    color: '#21864f',
    acronym: 'AS3',
    imageUrl:
      'https://cdn.match-gg.kr/valorant/rank_emblems/Ascendant_3.png?w=36&h=36',
  },
  {
    value: 'IMMORTAL_1',
    label: '불멸 1',
    color: '#7e254b',
    acronym: 'IM1',
    imageUrl:
      'https://cdn.match-gg.kr/valorant/rank_emblems/Immortal_1.png?w=36&h=36',
  },
  {
    value: 'IMMORTAL_2',
    label: '불멸 2',
    color: '#7e254b',
    acronym: 'IM2',
    imageUrl:
      'https://cdn.match-gg.kr/valorant/rank_emblems/Immortal_2.png?w=36&h=36',
  },
  {
    value: 'IMMORTAL_3',
    label: '불멸 3',
    color: '#7e254b',
    acronym: 'IM3',
    imageUrl:
      'https://cdn.match-gg.kr/valorant/rank_emblems/Immortal_3.png?w=36&h=36',
  },
  {
    value: 'RADIANT',
    label: '레디언트',
    color: '#F4C875',
    acronym: 'RD',
    imageUrl:
      'https://cdn.match-gg.kr/valorant/rank_emblems/Radiant.png?w=36&h=36',
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
    imageUrl: 'https://cdn.match-gg.kr/valorant/position/Duelist.png',
  },
  {
    value: 'INITIATOR',
    label: '척후대',
    imageUrl: 'https://cdn.match-gg.kr/valorant/position/Initiator.png',
  },
  {
    value: 'SENTINEL',
    label: '감시자',
    imageUrl: 'https://cdn.match-gg.kr/valorant/position/Sentinel.png',
  },
  {
    value: 'CONTROLLER',
    label: '전략가',
    imageUrl: 'https://cdn.match-gg.kr/valorant/position/Controller.png',
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
