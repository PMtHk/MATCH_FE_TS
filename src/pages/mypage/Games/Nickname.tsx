import {
  Box,
  Button,
  CircularProgress,
  Divider,
  OutlinedInput,
  Typography,
} from '@mui/material';
import { styled } from '@mui/system';
import {
  loadSummonerInfoIntoDB,
  verifyLOLNickname,
} from 'apis/api/leagueoflegends';
import React, { useState } from 'react';
import { changeNickname } from 'apis/api/common';
import { useDispatch } from 'react-redux';
import { snackbarActions } from 'store/snackbar-slice';
import { checkPUBGUserPlatform, loadPubgPlayerInfoIntoDB } from 'apis/api/pubg';
import { loadOWPlayerInfoInDB, verifyOWNickname } from 'apis/api/overwatch';
import { userActions } from 'store/user-slice';

const Nickname = ({ name, game, isNew }: any) => {
  const dispatch = useDispatch();

  const [nickname, setNickname] = useState<string>(name);
  const handleNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const [isPosting, setIsPosting] = useState<boolean>(false);

  const [isEdit, setIsEdit] = useState<boolean>(false);

  const toggleEdit = () => {
    setIsEdit(!isEdit);
  };

  const getTypo = () => {
    if (game === 'lol') return '소환사 명';
    return '플레이어 명';
  };

  const getButtonText = () => {
    if (isNew) return '불러오기';
    if (isEdit) return '취소하기';
    return '변경하기';
  };

  const certifyNickname = async () => {
    let isCertified = false;
    try {
      if (game === 'lol') {
        const existNickname = await verifyLOLNickname(nickname);
        if (existNickname) {
          setNickname(existNickname);
          isCertified = true;
          // DB쌓기
          await loadSummonerInfoIntoDB(existNickname);
        }
      }
      if (game === 'pubg') {
        const { nickname: existNickname, platform } =
          await checkPUBGUserPlatform(nickname);
        if (platform) {
          isCertified = true;
          // DB쌓기
          await loadPubgPlayerInfoIntoDB(existNickname, platform);
        }
      }
      if (game === 'overwatch') {
        const [name, battleTag] = nickname.split('#');
        const response = await verifyOWNickname(name, battleTag);
        if (response) {
          isCertified = true;
          // DB쌓기
          await loadOWPlayerInfoInDB(name, battleTag);
        }
      }
    } catch (error) {
      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message: `입력하신 정보와 일치하는 ${getTypo}를 찾을 수 없습니다.`,
          severity: 'warning',
        }),
      );
      setIsEdit(false);
      setIsPosting(false);
      setNickname(name);
    }

    return isCertified;
  };

  const requestChangeNickname = async () => {
    // 닉네임 존재 인증 이후 닉네임 변경
    setIsPosting(true);
    // 닉네임 존재 여부 인증받기
    const isCertified = await certifyNickname();
    // 닉네임 인증에 성공한 경우
    if (isCertified) {
      const response = await changeNickname(game, nickname);
      // 닉네임 변경에 성공한 경우
      if (response) {
        dispatch(userActions.SET_GAMES_WITH_ID({ id: game, value: nickname }));
        dispatch(
          snackbarActions.OPEN_SNACKBAR({
            message: '변경이 완료되었습니다.',
            severity: 'success',
          }),
        );
        setIsEdit(false);
      }
      // 닉네임 변경에 실패한 경우
      else {
        dispatch(
          snackbarActions.OPEN_SNACKBAR({
            message: '변경중에 오류가 발생하였습니다.',
            severity: 'error',
          }),
        );
      }
    }
    // 닉네임 인증에 실패한 경우
    else {
      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message: '유효하지 않은 닉네임 입니다.',
          severity: 'error',
        }),
      );
    }

    setIsPosting(false);
  };

  return (
    <>
      <Container>
        <SectionTypo>{getTypo()}</SectionTypo>
        <NicknameInput
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
                불러오기
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
