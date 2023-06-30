import { defaultAxios } from 'apis/utils';
import { useDispatch } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import { cardActions } from 'store/card-slice';

/**
 * 게시글 상세보기
 * @param { number } cardId 롤 게시글 넘버
 * @param { ReturnType<typeof useDispatch>} dispatch - react-redux의 useDisaptch
 */

export const fetchCardDetail = async (
  cardId: number,
  dispatch: ReturnType<typeof useDispatch>,
) => {
  // 기존 카드 정보 지우기
  dispatch(cardActions.DELETE_CURRENT_CARD());

  // 새 카드 정보 불러오기
  await defaultAxios.get(`/api/lol/boards/${cardId}`).then((response) => {
    dispatch(cardActions.SET_CURRENT_CARD(response.data));
  });

  return null;
};
