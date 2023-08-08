export const platformList = [
  {
    value: 'ALL',
    label: '모든 플랫폼',
    imageUrl: '',
  },
  {
    value: 'STEAM',
    label: '스팀',
    imageUrl: 'https://d18ghgbbpc0qi2.cloudfront.net/pubg/platform/steam.png',
  },
  {
    value: 'KAKAO',
    label: '카카오',
    imageUrl: 'https://d18ghgbbpc0qi2.cloudfront.net/pubg/platform/kakao.png',
  },
];

export const typeList = [
  { value: 'ALL', label: '모든 타입', maxMember: 4 },
  { value: 'DUO', label: '일반(듀오)', maxMember: 2 },
  { value: 'SQUAD', label: '일반(스쿼드)', maxMember: 4 },
  { value: 'RANKED_SQUAD', label: '경쟁전(스쿼드)', maxMember: 4 },
];

export type typeValue = 'ALL' | 'DUO' | 'SQUAD' | 'RANKED_SQUAD';

export const tierList = [
  {
    value: 'ALL',
    label: '모든 티어',
    darkColor: '#000',
    lightColor: '#FFF',
    acronym: 'ALL',
    imageUrl: '',
  },
  {
    value: 'MASTER',
    label: '마스터',
    darkColor: '#C29D49',
    lightColor: '#E8D77C',
    acronym: 'M',
  },
  {
    value: 'DIAMOND',
    label: '다이아몬드',
    darkColor: '#454864',
    lightColor: '#647593',
    acronym: 'D',
  },
  {
    value: 'PLATINUM',
    label: '플래티넘',
    darkColor: '#678A9D',
    lightColor: '#BCCFD7',
    acronym: 'P',
  },
  {
    value: 'GOLD',
    label: '골드',
    darkColor: '#85673A',
    lightColor: '#C8B668',
    acronym: 'G',
  },
  {
    value: 'SILVER',
    label: '실버',
    darkColor: '#6D7277',
    lightColor: '#CDCFD3',
    acronym: 'S',
  },
  {
    value: 'BRONZE',
    label: '브론즈',
    darkColor: '#63432E',
    lightColor: '#A57559',
    acronym: 'B',
  },
  {
    value: 'UNRANKED',
    label: '언랭크드',
    darkColor: '#000',
    llightColor: '#FFF',
    acronym: 'U',
  },
];

export type tierValue =
  | 'UNRANKED'
  | 'ALL'
  | 'BRONZE'
  | 'SILVER'
  | 'GOLD'
  | 'PLATINUM'
  | 'DIAMOND'
  | 'MASTER';

export type rankImageType = {
  [key: string]: string;
};

export const rankImage: rankImageType = {
  MASTER: 'https://d18ghgbbpc0qi2.cloudfront.net/pubg/rank_emblem/master.png',
  DIAMOND1:
    'https://d18ghgbbpc0qi2.cloudfront.net/pubg/rank_emblem/diamond1.png',
  DIAMOND2:
    'https://d18ghgbbpc0qi2.cloudfront.net/pubg/rank_emblem/diamond2.png',
  DIAMOND3:
    'https://d18ghgbbpc0qi2.cloudfront.net/pubg/rank_emblem/diamond3.png',
  DIAMOND4:
    'https://d18ghgbbpc0qi2.cloudfront.net/pubg/rank_emblem/diamond4.png',
  DIAMOND5:
    'https://d18ghgbbpc0qi2.cloudfront.net/pubg/rank_emblem/diamond5.png',
  PLATINUM1:
    'https://d18ghgbbpc0qi2.cloudfront.net/pubg/rank_emblem/platinum1.png',
  PLATINUM2:
    'https://d18ghgbbpc0qi2.cloudfront.net/pubg/rank_emblem/platinum2.png',
  PLATINUM3:
    'https://d18ghgbbpc0qi2.cloudfront.net/pubg/rank_emblem/platinum3.png',
  PLATINUM4:
    'https://d18ghgbbpc0qi2.cloudfront.net/pubg/rank_emblem/platinum4.png',
  PLATINUM5:
    'https://d18ghgbbpc0qi2.cloudfront.net/pubg/rank_emblem/platinum5.png',
  GOLD1: 'https://d18ghgbbpc0qi2.cloudfront.net/pubg/rank_emblem/gold1.png',
  GOLD2: 'https://d18ghgbbpc0qi2.cloudfront.net/pubg/rank_emblem/gold2.png',
  GOLD3: 'https://d18ghgbbpc0qi2.cloudfront.net/pubg/rank_emblem/gold3.png',
  GOLD4: 'https://d18ghgbbpc0qi2.cloudfront.net/pubg/rank_emblem/gold4.png',
  GOLD5: 'https://d18ghgbbpc0qi2.cloudfront.net/pubg/rank_emblem/gold5.png',
  SILVER1: 'https://d18ghgbbpc0qi2.cloudfront.net/pubg/rank_emblem/silver1.png',
  SILVER2: 'https://d18ghgbbpc0qi2.cloudfront.net/pubg/rank_emblem/silver2.png',
  SILVER3: 'https://d18ghgbbpc0qi2.cloudfront.net/pubg/rank_emblem/silver3.png',
  SILVER4: 'https://d18ghgbbpc0qi2.cloudfront.net/pubg/rank_emblem/silver4.png',
  SILVER5: 'https://d18ghgbbpc0qi2.cloudfront.net/pubg/rank_emblem/silver5.png',
  BRONZE1: 'https://d18ghgbbpc0qi2.cloudfront.net/pubg/rank_emblem/bronze1.png',
  BRONZE2: 'https://d18ghgbbpc0qi2.cloudfront.net/pubg/rank_emblem/bronze2.png',
  BRONZE3: 'https://d18ghgbbpc0qi2.cloudfront.net/pubg/rank_emblem/bronze3.png',
  BRONZE4: 'https://d18ghgbbpc0qi2.cloudfront.net/pubg/rank_emblem/bronze4.png',
  BRONZE5: 'https://d18ghgbbpc0qi2.cloudfront.net/pubg/rank_emblem/bronze5.png',
};

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
