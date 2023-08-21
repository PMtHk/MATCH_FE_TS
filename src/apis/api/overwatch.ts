import { defaultAxios } from 'apis/utils';

/**
 * (오버워치) 플레이어 이름 존재 확인
 *
 * @param {string} playerWithBattleTag 닉네임#배틀태그
 * @returns 일치하는 닉네임이 있으면 true, 없으면 false
 *
 * @example
 * ```typescript
 * const isExist = await verifyNickname('학살#37704');
 * console.log(isExist); // true
 *
 * const isExist = await verifyNickname('학살#30000');
 * console.log(isExist); // false
 */

export const verifyNickname = async (playerWithBattleTag: string) => {
  const isExist = await defaultAxios
    .get(`/api/overwatch/user/exist/${playerWithBattleTag.replace('#', '%23')}`)
    .then((res) => res.data);

  return isExist;
};

/**
 * (오버워치) 플레이어명#배틀태그로 전적 갱신
 * @param {string} playerWithBattleTag 닉네임#배틀태그
 * @returns null
 *
 * @example
 * ```typescript
 * await loadHistory('학살#37704'); // history loaded
 * await loadHistory('학살#30000'); // history load failed
 * ```
 */

export const loadHistory = async (playerWithBattleTag: string) => {
  await defaultAxios.get(
    `/api/overwatch/user/${playerWithBattleTag.replace('#', '%23')}`,
  );

  return null;
};

/**
 * (오버워치) 멤버의 전적 가져오기
 *
 * @param {string} playerWithBattleTag 닉네임#배틀태그
 * @param {string} type 전적 종류 (NORMAL | RANKED)
 * @returns {any} 해당 멤버의 전적
 *
 * @example
 * ```typescript
 * const memberHistory = await fetchMemberHistory('학살#37704', 'RANKED');
 * console.log(memberHistory); // { "name": "학살#37704", "type": "NORMAL", "tank_tier": "none", ... }
 * ```
 */

export const fetchMemberHistory = async (
  playerWithBattleTag: string,
  type = 'RANKED',
) => {
  const fetchedHistory = await defaultAxios
    .get(
      `/api/overwatch/player/${playerWithBattleTag.replace(
        '#',
        '%23',
      )}/${type}`,
    )
    .then((res) => res.data);

  return fetchedHistory;
};
