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
 * @param {string} agentNameWithRiotTag 정확한 요원명 + Riot Tag
 * @param {string} type 전적 종류 (STANDARD | COMPETITIVE | SPIKE_RUSH | SWIFTPLAY | TEAM_DEATHMATCH)
 * @returns {any} 해당 멤버의 전적
 *
 * @example
 */

export const fetchMemberHistory = async (
  agentNameWithRiotTag: string,
  type: string,
) => {
  const fetchedHistory = await defaultAxios
    .get(
      `/api/valorant/agent/${agentNameWithRiotTag.replace('#', '%23')}/${type}`,
    )
    .then((res) => res.data);

  return fetchedHistory;
};

// RSO MATCHGG 등록

export const connectRSO = async (rsoAccessCode: string) => {
  const response = await defaultAxios.post('/api/valorant/user/sign', {
    code: rsoAccessCode,
  });

  const { gameName, tagLine } = response.data;

  return { gameName, tagLine };
};
