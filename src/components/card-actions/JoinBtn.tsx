import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

// mui
import styled from '@emotion/styled';
import MuiButton from '@mui/material/Button';

import { joinParty } from 'apis/api/user';
import { isBanned } from 'apis/api/firebase';
import { checkPUBGUserPlatform } from 'apis/api/pubg';
import { RootState } from 'store';
import { snackbarActions } from 'store/snackbar-slice';
import { refreshActions } from 'store/refresh-slice';
import { getCurrentGame } from 'functions/commons';
import { GAME_ID } from 'types/games';

const JoinBtn = () => {
  const dispatch = useDispatch();

  const currentGame: GAME_ID = getCurrentGame();

  const { currentCard } = useSelector((state: RootState) => state.card);
  const { notiToken } = useSelector((state: RootState) => state.notification);
  const nickname = useSelector(
    (state: RootState) =>
      state.user.games[`${currentGame as 'overwatch' | 'pubg' | 'lol'}`],
  );
  const { oauth2Id, isLogin } = useSelector((state: RootState) => state.user);
  const { chatRoomId, id } = useSelector(
    (state: RootState) => state.card.currentCard,
  );

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  type Member = {
    nickname: string;
    oauth2Id: string;
    notiToken: string;
    isReviewed: boolean;
  };

  // 채팅방에 참여할 사용자 객체
  const newMember: Member = {
    nickname,
    oauth2Id,
    notiToken: notiToken || '',
    isReviewed: false,
  };

  type JoinBtnInfo = {
    disabled: boolean;
    text: string;
  };

  const calcJoinBtn = (): JoinBtnInfo => {
    // disabled 계산
    let disabled = false;
    if (!isLogin) {
      disabled = true;
    } else if (currentCard.expired === 'true') {
      disabled = true;
    } else if (nickname === '' || nickname === null) {
      disabled = true;
    } else {
      disabled = false;
    }

    // 텍스트 계산
    let text = '파티 참가';
    if (!isLogin) {
      text = '로그인 후 참가하실 수 있습니다.';
    } else if (nickname === '' || nickname === null) {
      text = '게임에 대한 정보가 없어 참가할 수 없습니다.';
      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message: '마이페이지에서 해당 게임에 대한 닉네임을 입력해주세요.',
          severity: 'info',
        }),
      );
    } else if (currentCard.expired === 'true') {
      text = '파티가 마감되었습니다.';
    } else {
      text = '파티 참가';
    }
    return {
      disabled,
      text,
    };
  };

  const JoinBtnHandler = async () => {
    setIsLoading(true);
    // 파티가 마감된 경우
    if (currentCard.expired === 'true') {
      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message: '파티가 마감되어 참가가 불가합니다.',
          severity: 'warning',
        }),
      );

      return;
    }
    // 배틀그라운드의 경우 파티 참가 요청 시 파티의 플랫폼과 사용자(참가자) 계정의 플랫폼 비교
    if (currentGame === 'pubg') {
      const { platform: myPlatform } = await checkPUBGUserPlatform(nickname);
      if (myPlatform !== currentCard?.platform) {
        dispatch(
          snackbarActions.OPEN_SNACKBAR({
            message:
              '해당 파티와의 플랫폼 정보가 일치하지 않습니다. 플랫폼 확인 후 다시 시도하여 주시기 바랍니다.',
            severity: 'error',
          }),
        );
        return;
      }
    }

    const banned = await isBanned(chatRoomId, oauth2Id);
    if (!banned) {
      try {
        await joinParty(currentGame, id, chatRoomId, newMember, dispatch);
        dispatch(refreshActions.REFRESH_CARD());
      } catch (error) {
        dispatch(
          snackbarActions.OPEN_SNACKBAR({
            message: '파티 참가에 실패했습니다. 잠시 후 다시 시도해주세요.',
            severity: 'error',
          }),
        );
      }
    } else {
      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message: '차단된 사용자입니다.',
          severity: 'warning',
        }),
      );
    }

    setIsLoading(false);
  };

  return (
    <Button
      variant="outlined"
      size="small"
      onClick={JoinBtnHandler}
      disabled={calcJoinBtn().disabled || isLoading}
    >
      {/* {!isLogin ? '로그인 후 참가하실 수 있습니다.' : '파티 참가'} */}
      {isLoading ? '파티에 참가하는 중입니다.' : calcJoinBtn().text}
    </Button>
  );
};

export default JoinBtn;

const Button = styled(MuiButton)(() => ({
  p: 1,
  mt: 1,
  height: 40,
  borderColor: '#CCCCCC',
  color: '#5C5C5C',
  fontWeight: 700,
  ':hover': {
    borderColor: '#dddddd',
    backgroundColor: '#f3f3f3',
  },
})) as typeof MuiButton;
