import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

// mui
import { styled } from '@mui/system';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  OutlinedInput,
  Typography,
} from '@mui/material';

import { changeNickname } from 'apis/api/user';
import {
  verifyNickname as verifyLOLNickname,
  loadHistory as loadLOLHistory,
} from 'apis/api/leagueoflegends';
import {
  getPlatform as checkPUBGPlatform,
  loadHistory as loadPUBGHistory,
} from 'apis/api/pubg';
import {
  verifyNickname as verifyOWNickname,
  loadHistory as loadOWHistory,
} from 'apis/api/overwatch';
import { userActions } from 'store/user-slice';
import { snackbarActions } from 'store/snackbar-slice';

const Nickname = ({ name, game, isNew }: any) => {
  const dispatch = useDispatch();

  const [nickname, setNickname] = useState<string>(name);
  const handleNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const [isPosting, setIsPosting] = useState<boolean>(false);

  const [isEdit, setIsEdit] = useState<boolean>(false);

  const [error, setError] = useState<boolean>(false);

  const toggleEdit = () => {
    setIsEdit(!isEdit);
    setNickname(name);
  };

  const getTypo = () => {
    if (game === 'lol') return '소환사 명';
    return '플레이어 명';
  };

  const getButtonText = () => {
    if (isNew) return '저장';
    if (isEdit) return '취소';
    return '변경';
  };

  const certifyNickname = async () => {
    let isCertified = false;
    let certifiedNickname = nickname;
    try {
      if (game === 'lol') {
        const existNickname = await verifyLOLNickname(nickname);
        if (existNickname) {
          setNickname(existNickname);
          certifiedNickname = existNickname;
          isCertified = true;
          // DB쌓기
          await loadLOLHistory(existNickname);
        }
      }
      if (game === 'pubg') {
        const platform = await checkPUBGPlatform(nickname);
        if (platform) {
          isCertified = true;
          // DB쌓기
          await loadPUBGHistory(nickname, platform);
        }
      }
      if (game === 'overwatch') {
        const response = await verifyOWNickname(nickname);
        if (response) {
          isCertified = true;
          // DB쌓기
          await loadOWHistory(nickname);
        }
      }
    } catch (error) {
      setError(true);
      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message: `입력하신 정보와 일치하는 ${getTypo()}을 찾을 수 없습니다.`,
          severity: 'warning',
        }),
      );
      // setIsEdit(false);
      setIsPosting(false);
      // setNickname(name);
    }

    return { isCertified, certifiedNickname };
  };

  const requestChangeNickname = async () => {
    // 닉네임 존재 인증 이후 닉네임 변경
    setIsPosting(true);
    // 닉네임 존재 여부 인증받기
    const { isCertified, certifiedNickname } = await certifyNickname();
    // 닉네임 인증에 성공한 경우
    if (isCertified) {
      const response = await changeNickname(game, certifiedNickname);
      // 닉네임 변경에 성공한 경우
      if (response) {
        dispatch(
          userActions.SET_GAMES_WITH_ID({ id: game, value: certifiedNickname }),
        );
        dispatch(
          snackbarActions.OPEN_SNACKBAR({
            message: '변경이 완료되었습니다.',
            severity: 'success',
          }),
        );
        setIsEdit(false);
        setIsPosting(false);
        setError(false);
      }
      // 닉네임 변경에 실패한 경우
      else {
        setError(true);
        dispatch(
          snackbarActions.OPEN_SNACKBAR({
            message: '변경중에 오류가 발생하였습니다.',
            severity: 'error',
          }),
        );
        setNickname(name);
      }
    }
  };

  return (
    <>
      <Container>
        <SectionTypo>{getTypo()}</SectionTypo>
        <NicknameInput
          error={error}
          value={nickname}
          disabled={!isNew && !isEdit}
          placeholder={`${getTypo()}을 입력해 주세요.`}
          onChange={handleNickname}
          endAdornment={
            isEdit &&
            (isPosting ? (
              <CircularProgress size={14} />
            ) : (
              <ChangeButton onClick={requestChangeNickname}>
                인증하기
              </ChangeButton>
            ))
          }
        />
        <EditButton
          onClick={isNew ? requestChangeNickname : toggleEdit}
          sx={{}}
          disabled={isPosting}
        >
          {getButtonText()}
        </EditButton>
      </Container>
      <Divider sx={{ marginBottom: '12px' }} />
    </>
  );
};

export default Nickname;

const Container = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: '12px',
})) as typeof Box;

const SectionTypo = styled(Typography)(() => ({
  fontSize: '14px',
  fontWeight: '700',
  marginRight: '40px',
  width: '68px',
})) as typeof Typography;

const NicknameInput = styled(OutlinedInput)(() => ({
  fontSize: '14px',
  height: '32px',
  minWidth: '320px',
  maxWwidth: '360px',
}));

const ChangeButton = styled(Button)(() => ({
  whiteSpace: 'nowrap',
})) as typeof Button;

const EditButton = styled(Button)(() => ({
  marginLeft: '8px',
})) as typeof Button;
