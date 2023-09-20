import { GAME } from 'types/games';

export const gameList: GAME[] = [
  {
    id: 'lol',
    name: 'League of Legends',
    name_kor: '리그오브레전드',
    image_url:
      'https://cdn.match-gg.kr/game_icons/leagueoflegends.png?h=100&f=webp',
    labelText: '리그오브레전드 소환사명을 입력하세요.',
    helperText: '등록되지 않은 소환사 입니다.',
    available: true,
  },
  {
    id: 'pubg',
    name: 'Battlegrounds',
    name_kor: '배틀그라운드',
    image_url:
      'https://cdn.match-gg.kr/game_icons/battlegrounds.png?h=100&f=webp',
    labelText: '배틀그라운드 닉네임을 입력하세요.',
    helperText: '등록되지 않은 닉네임 입니다.',
    available: true,
  },
  {
    id: 'overwatch',
    name: 'Overwatch',
    name_kor: '오버워치',
    image_url: 'https://cdn.match-gg.kr/game_icons/overwatch.png?h=100&f=webp',
    labelText: '오버워치 닉네임#배틀태그를 입력하세요.',
    helperText: '등록되지 않은 닉네임 입니다.',
    available: true,
  },
  {
    id: 'valorant',
    name: 'Valorant',
    name_kor: '발로란트',
    image_url: 'https://cdn.match-gg.kr/game_icons/valorant.png?h=100&f=webp',
    labelText: '발로란트 닉네임을 입력하세요.',
    helperText: '등록되지 않은 닉네임 입니다.',
    available: true,
  },
];
