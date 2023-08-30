import { defaultAxios } from 'apis/utils';

/**
 * (발로란트) 요원 이름 존재 확인
 *
 * @param {string} nickname 사용자가 입력한 소환사명
 * @returns {string} 닉네임의 정확한 표기 (존재하지 않으면 Error 404)
 *
 * @example
 */

export const verifyNickname = async (nickname: string) => {
  const exactNickname = await defaultAxios
    .get(`/api/valorant/user/exist/${nickname}`)
    .then((res) => res.data);

  return exactNickname;
};

/**
 * (발로란트) 요원명으로 전적 갱신
 *
 * @param {string} agentName 정확한 소환사명
 * @returns null
 *
 * @example
 */

export const loadHistory = async (agentName: string) => {
  await defaultAxios.get(`/api/valorant/user/${agentName}`);

  return null;
};

/**
 * (발로란트) 멤버의 전적 가져오기
 *
 * @param {string} agentName 정확한 요원명
 * @param {string} type 전적 종류 (NORMAL | RANKED | SPIKE | SWIFT | DEATH | TEAM_DEATH)
 * @returns {any} 해당 멤버의 전적
 *
 * @example
 */

export const fetchMemberHistory = async (agentName: string, type: string) => {
  const fetchedHistory = await defaultAxios
    .get(`/api/valorant/agent/${agentName}/${type}`)
    .then((res) => res.data);

  return fetchedHistory;
};
