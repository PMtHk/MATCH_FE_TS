export type GAME_ID = 'lol' | 'pubg' | 'overwatch';

export type GAME = {
  id: GAME_ID;
  name: string;
  name_kor: string;
  image_url: string;
  labelText: string;
  helperText: string;
  available: boolean;
};

// lol
export type LOL_POSITIONS_ID =
  | 'ALL'
  | 'TOP'
  | 'JUNGLE'
  | 'MIDDLE'
  | 'BOTTOM'
  | 'UTILITY';

export type LOL_POSITION = {
  value: LOL_POSITIONS_ID;
  label: string;
  imageUrl: string;
};

// pubg
export type PUBG_PLATFORMS_ID = 'ALL' | 'KAKAO' | 'STEAM';

export type PUBG_PLATFORM = {
  value: PUBG_PLATFORMS_ID;
  label: string;
  imageUrl: string;
};

// overwatch
export type OVERWATCH_POSITIONS_ID = 'ALL' | 'TANK' | 'DAMAGE' | 'SUPPORT';

export type OVERWATCH_POSITION = {
  value: OVERWATCH_POSITIONS_ID;
  label: string;
  imageUrl: string;
};
