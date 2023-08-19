import { defaultAxios } from 'apis/utils';

/**
 * (리그오브레전드) 소환사 이름 존재 확인
 *
 * @param {string} nickname 사용자가 입력한 소환사명
 * @returns {string} 닉네임의 정확한 표기 (존재하지 않으면 Error 404)
 *
 * @example
 * ```typescript
 * const exactNickname = await verifyLOLNickname('완도수산새우도둑');
 * console.log(exactNickname); // 완도수산새우도둑
 *
 * const wrongNickname = await verifyLOLNickname('완도수산새둑우도');
 * console.log(wrongNickname); // { "status": 404, "message": "존재하지 않는 회원입니다." }
 * ```
 */

export const verifyNickname = async (nickname: string) => {
  const exactNickname = await defaultAxios
    .get(`/api/lol/user/exist/${nickname}`)
    .then((res) => res.data);

  return exactNickname;
};

/**
 * (리그오브레전드) 소환사명으로 전적 갱신
 *
 * @param {string} summonerName 정확한 소환사명
 * @returns null
 *
 * @example
 * ```typescript
 * await loadHistory('완도수산새우도둑'); // history loaded
 * await loadHistory('완도수산새둑우도'); // history load failed
 * ```
 */

export const loadHistory = async (summonerName: string) => {
  await defaultAxios.get(`/api/lol/user/${summonerName}`);

  return null;
};

/**
 * (리그오브레전드) 멤버의 전적 가져오기
 *
 * @param {string} summonerName 정확한 소환사명
 * @param {string} type 전적 종류 (DUO_RANK | FREE_RANK)
 * @returns {any} 해당 멤버의 전적
 *
 * @example
 * ```typescript
 * const memberHistory = await fetchMemberHistory('완도수산새우도둑', 'DUO_RANK');
 * console.log(memberHistory); // { "queueType": "RANKED_SOLO_5x5", "summonerName": "완도수산새우도둑", ... }
 * ```
 */

export const fetchMemberHistory = async (
  summonerName: string,
  type: string,
) => {
  const fetchedHistory = await defaultAxios
    .get(`/api/lol/summoner/${summonerName}/${type}`)
    .then((res) => res.data);

  return fetchedHistory;
};
