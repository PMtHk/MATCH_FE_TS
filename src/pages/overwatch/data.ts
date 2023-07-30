export const queueTypeList = [
  { value: 'ALL', label: '모든 큐', maxMember: 5 },
  { value: 'NORMAL', label: '일반전', maxMember: 5 },
  { value: 'RANKED', label: '경쟁전', maxMember: 5 },
  { value: 'ARCADE', label: '아케이드', maxMember: 5 },
];

export const tierList = [
  {
    value: 'ALL',
    label: '모든 티어',
    color: '#000000',
    acronym: 'ALL',
    imageUrl:
      'https://d18ghgbbpc0qi2.cloudfront.net/overwatch/ranked_emblems/unranked.png',
  },
  {
    value: 'GRANDMASTER',
    label: '그랜드마스터',
    color: '#BBDEC9',
    acronym: 'GM',
    imageUrl:
      'https://d18ghgbbpc0qi2.cloudfront.net/overwatch/ranked_emblems/grandmaster.png',
  },
  {
    value: 'MASTER',
    label: '마스터',
    color: '#EBD973',
    acronym: 'M',
    imageUrl:
      'https://d18ghgbbpc0qi2.cloudfront.net/overwatch/ranked_emblems/master.png',
  },
  {
    value: 'DIAMOND',
    label: '다이아몬드',
    color: '#AAC3DE',
    acronym: 'D',
    imageUrl:
      'https://d18ghgbbpc0qi2.cloudfront.net/overwatch/ranked_emblems/diamond.png',
  },
  {
    value: 'PLATINUM',
    label: '플래티넘',
    color: '#B4D2BE',
    acronym: 'P',
    imageUrl:
      'https://d18ghgbbpc0qi2.cloudfront.net/overwatch/ranked_emblems/platinum.png',
  },
  {
    value: 'GOLD',
    label: '골드',
    color: '#E7C352',
    acronym: 'G',
    imageUrl:
      'https://d18ghgbbpc0qi2.cloudfront.net/overwatch/ranked_emblems/gold.png',
  },
  {
    value: 'SILVER',
    label: '실버',
    color: '#B3B5BB',
    acronym: 'S',
    imageUrl:
      'https://d18ghgbbpc0qi2.cloudfront.net/overwatch/ranked_emblems/silver.png',
  },
  {
    value: 'BRONZE',
    label: '브론즈',
    color: '#B05A3C',
    acronym: 'B',
    imageUrl:
      'https://d18ghgbbpc0qi2.cloudfront.net/overwatch/ranked_emblems/bronze.png',
  },
  {
    value: 'NONE',
    label: '언랭',
    color: '#000000',
    acronym: 'ㅡ',
    imageUrl:
      'https://d18ghgbbpc0qi2.cloudfront.net/overwatch/ranked_emblems/unranked.png',
  },
];

export type positionValue = 'ALL' | 'TANK' | 'DAMAGE' | 'SUPPORT';

export type Position = {
  value: positionValue;
  label: string;
  imageUrl: string;
};

export const positionList: Position[] = [
  {
    value: 'ALL',
    label: '전체',
    imageUrl: 'https://d18ghgbbpc0qi2.cloudfront.net/lol/lane_icons/ALL.png',
  },
  {
    value: 'TANK',
    label: '돌격',
    imageUrl:
      'https://d18ghgbbpc0qi2.cloudfront.net/overwatch/roles/Tank_icon.png',
  },
  {
    value: 'DAMAGE',
    label: '공격',
    imageUrl:
      'https://d18ghgbbpc0qi2.cloudfront.net/overwatch/roles/Damage_icon.png',
  },
  {
    value: 'SUPPORT',
    label: '지원',
    imageUrl:
      'https://d18ghgbbpc0qi2.cloudfront.net/overwatch/roles/Support_icon.png',
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
