import { pubgAxios, defaultAxios } from 'apis/utils';

/**
 * (배틀그라운드) 플랫폼 정보 가져오기
 *
 * @param {string} nickname 배틀그라운드 닉네임
 * @returns 'STEAM' | 'KAKAO' | Error
 *
 * @example
 * ```typescript
 * const platform = await getPlatform('Dsquad2');
 * console.log(platform); // STEAM
 *
 * const platform = await getPlatform('PMtHk__'); // Error (매치 히스토리 부족)
 * const platform = await getPlatform('PMtHk123'); // Error (존재하지 않는 플레이어)
 * ```
 *
 * @description
 * 닉네임의 존재 여부를 확인하고 있다면 플랫폼 정보를 반환한다.
 * 매치 히스토리가 없어 플랫폼을 구분할 수 없는 경우 에러를 반환한다.
 */
export const getPlatform = async (nickname: string) => {
  // steam, kakao response로 platform 계산
  const calcPlatform = (steamRes: any, kakaoRes: any) => {
    if (Object.values(steamRes).find((g: any) => g.wins > 0 || g.losses > 0)) {
      return 'STEAM';
    }
    if (Object.values(kakaoRes).find((g: any) => g.wins > 0 || g.losses > 0)) {
      return 'KAKAO';
    }
    return 0;
  };

  try {
    // accountId 가져오기
    const accountId: any = await pubgAxios
      .get(`shards/steam/players?filter[playerNames]=${nickname}`)
      .then((res) => res.data.data[0].id);
    console.log(`accountId : ${accountId}`);

    // 스팀 요청
    const steamResponse: any = await pubgAxios
      .get(`shards/steam/players/${accountId}/seasons/lifetime`)
      .then((res) => res.data.data.attributes.gameModeStats);

    // 카카오 요청
    const kakaoResponse: any = await pubgAxios
      .get(`shards/kakao/players/${accountId}/seasons/lifetime`)
      .then((res) => res.data.data.attributes.gameModeStats);

    const platform = calcPlatform(steamResponse, kakaoResponse);

    if (platform === 0) {
      throw new Error(
        '매치 히스토리가 부족해 플레이어 전적 및 플랫폼 정보를 가져올 수 없습니다.',
      );
    }

    return platform;
  } catch (error: any) {
    if (
      error.message ===
      '매치 히스토리가 부족해 플레이어 전적 및 플랫폼 정보를 가져올 수 없습니다.'
    ) {
      throw new Error(error.message);
    } else {
      throw new Error('존재하지 않는 플레이어 이름입니다.');
    }
  }
};

/**
 * (배틀그라운드) 닉네임 존재 확인
 *
 * @deprecated use {@link getPlatform} instead
 *
 * @param nickname 배틀그라운드 닉네임
 * @param platform 배틀그라운드 플랫폼 ('STEAM' | 'KAKAO')
 * @returns 인증 성공 여부 (true | false)
 *
 * @example
 * ```typescript
 * const isExist = await verifyNickname('Dsquad2', 'STEAM');
 * console.log(isExist); // true
 * ```
 */

export const verifyNickname = async (nickname: string, platform: string) => {
  const response = await defaultAxios.get(
    `/api/pubg/user/exist/${nickname}/${platform}`,
  );

  if (response.status === 200) {
    return true;
  }

  return false;
};

/**
 * (배틀그라운드) 닉네임과 플랫폼으로 전적 갱신
 *
 * @param name 배틀그라운드 닉네임
 * @param platform 배틀그라운드 플랫폼
 * @returns null
 *
 * @example
 * ```typescript
 * await loadHistory('Dsquad2', 'STEAM'); // history loaded
 */

export const loadHistory = async (name: string, platform: string) => {
  await defaultAxios.get(`/api/pubg/user/${name}/${platform}`);

  return null;
};

/**
 * (배틀그라운드) 멤버의 전적 가져오기
 *
 * @param name 배틀그라운드 닉네임
 * @param platform 배틀그라운드 플랫폼
 * @param type 전적 종류 (NORMAL | RANKED)
 * @returns 해당 멤버의 전적
 *
 * @example
 * ```typescript
 * const memberHistory = await fetchMemberHistory('Dsquad2', 'STEAM', 'NORMAL');
 * console.log(memberHistory); // { "name": "Dsquad2", "type": "NORMAL", "tier": "none", ... }
 * ```
 */

export const fetchMemberHistory = async (
  name: string,
  platform: string,
  type: string,
) => {
  const response = await defaultAxios.get(
    `/api/pubg/player/${name}/${platform}/${type}`,
  );
  return response.data;
};
