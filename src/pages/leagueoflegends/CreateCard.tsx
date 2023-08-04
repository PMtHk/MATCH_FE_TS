/* eslint-disable no-alert */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { child, getDatabase, push, ref, set, update } from 'firebase/database';

import { RootState } from 'store';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiButton from '@mui/material/Button';
import MuiIconButton from '@mui/material/IconButton';
import MuiTypography from '@mui/material/Typography';
import MuiDivider from '@mui/material/Divider';
import MuiSwitch, { SwitchProps } from '@mui/material/Switch';
import MuiOutlinedInput from '@mui/material/OutlinedInput';
import MuiCircularProgress from '@mui/material/CircularProgress';
import MuiToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import MuiToggleButton from '@mui/material/ToggleButton';
import MuiFormControl from '@mui/material/FormControl';
import MuiSelect, { SelectChangeEvent } from '@mui/material/Select';
import MuiMenuItem from '@mui/material/MenuItem';
import MuiTextField from '@mui/material/TextField';
import Close from '@mui/icons-material/Close';
import Mic from '@mui/icons-material/Mic';
import MicOff from '@mui/icons-material/MicOff';
import HelpOutline from '@mui/icons-material/HelpOutline';
import BackSpace from '@mui/icons-material/Backspace';
import Edit from '@mui/icons-material/Edit';

import Modal from 'components/Modal';

import { authAxios } from 'apis/utils';
import { CustomSwitch } from 'components/Swtich';
import {
  verifyLOLNickname,
  loadSummonerInfoIntoDB,
} from 'apis/api/leagueoflegends';
import { chatroomActions } from 'store/chatroom-slice';
import { createCard, deleteCard } from 'apis/api/common';
import { snackbarActions } from 'store/snackbar-slice';
import { refreshActions } from 'store/refresh-slice';
import { queueTypeList, tierList, positionList, expiredTimeList } from './data';

const CreateCard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentGame = window.location.pathname.split('/')[1];

  const { lol: registeredNickname } = useSelector(
    (state: RootState) => state.user.games,
  );

  const { oauth2Id } = useSelector((state: RootState) => state.user);
  const { notiToken } = useSelector((state: RootState) => state.notification);

  // 기존 등록된 registeredNickname 사용 여부 state
  const [useRegisteredNickname, setUseRegisteredNickname] =
    React.useState<boolean>(!!registeredNickname);

  // 새 게시글 생성 모달 내부 변동사항 여부 state => 모달 닫기 전 확인하는데 쓰임.
  const [isChanged, setIsChanged] = React.useState<boolean>(false);

  // 새로운 닉네임 인증 여부 state
  const [isNewNicknameCertified, setIsNewNicknameCertified] =
    React.useState<boolean>(false);
  // 닉네임 조회 loading state
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  // 사용자의 input state
  const [userInput, setUserInput] = React.useState({
    name: registeredNickname || '',
    type: 'DUO_RANK',
    tier: 'IRON',
    position: 'TOP',
    expire: 'FIFTEEN_M',
    voice: 'n',
    content: '',
  });

  // 게시글 생성 요청 상태
  const [isPosting, setIsPosting] = React.useState<boolean>(false);

  // user input 조작부
  const handleNickname = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput({ ...userInput, name: event.target.value });
    setIsChanged(true);
    setIsNewNicknameCertified(false);
  };

  const handleType = (
    event: React.MouseEvent<HTMLElement>,
    newValue: string,
  ) => {
    if (newValue === null) {
      return;
    }
    if (newValue === 'ARAM') {
      setUserInput({
        ...userInput,
        type: newValue,
        tier: 'ALL',
        position: 'ALL',
      });
    } else if (userInput.type === 'ARAM' && newValue !== 'ARAM') {
      setUserInput({
        ...userInput,
        type: newValue,
        tier: 'IRON',
        position: 'TOP',
      });
    } else if (newValue === 'DUO_RANK') {
      setUserInput({
        ...userInput,
        type: newValue,
        tier: 'IRON',
        position: 'TOP',
      });
    } else {
      setUserInput({ ...userInput, type: newValue });
    }
    setIsChanged(true);
  };

  const handleTier = (
    event: React.MouseEvent<HTMLElement>,
    newValue: string,
  ) => {
    if (newValue === null) return;
    setUserInput({ ...userInput, tier: newValue });
    setIsChanged(true);
  };

  const handlePosition = (
    event: React.MouseEvent<HTMLElement>,
    newValue: string,
  ) => {
    if (newValue === null) return;
    setUserInput({ ...userInput, position: newValue });
    setIsChanged(true);
  };

  const handleExpire = (event: SelectChangeEvent) => {
    setUserInput({ ...userInput, expire: event.target.value });
    setIsChanged(true);
  };

  const handleVoice = (
    event: React.MouseEvent<HTMLElement>,
    newValue: string,
  ) => {
    if (newValue === null) return;
    setUserInput({ ...userInput, voice: newValue });
    setIsChanged(true);
  };

  const handleContent = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput({ ...userInput, content: event.target.value });
    setIsChanged(true);
  };

  const handleSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setUseRegisteredNickname(true);
      setUserInput({ ...userInput, name: registeredNickname });
    } else {
      setUseRegisteredNickname(false);
      setUserInput({ ...userInput, name: '' });
    }
    setIsChanged(true);
  };

  // 사용자가 새로 입력한 닉네임 유효성 검증
  const certifyNewNickname = async () => {
    try {
      setIsLoading(true);

      const exactSummonerName = await verifyLOLNickname(userInput.name);

      if (exactSummonerName) {
        setUserInput({ ...userInput, name: exactSummonerName });
      }

      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message: '소환사 정보를 불러오는 중입니다. 잠시만 기다려 주세요.',
          severity: 'info',
        }),
      );

      await loadSummonerInfoIntoDB(exactSummonerName);

      setIsNewNicknameCertified(true);
    } catch (error: any) {
      if (
        error.response.status === 404 &&
        error.response.data.message ===
          '아직 랭크정보를 보유하고 있지 않습니다.'
      ) {
        setIsNewNicknameCertified(true);
      } else {
        setIsNewNicknameCertified(false);
        dispatch(
          snackbarActions.OPEN_SNACKBAR({
            message: '입력하신 정보와 일치하는 소환사를 찾을 수 없습니다.',
            severity: 'error',
          }),
        );
      }
    } finally {
      setIsLoading(false);
      setIsChanged(true);
    }
  };

  const closeModal = () => {
    setUserInput({
      name: registeredNickname || '',
      type: 'DUO_RANK',
      tier: 'IRON',
      position: 'TOP',
      expire: 'FIFTEEN_M',
      voice: 'n',
      content: '',
    });
    setIsChanged(false);
    setUseRegisteredNickname(!!registeredNickname);
    navigate('/lol', { replace: true });
  };

  const confirmBeforeClosingModal = () => {
    if (isChanged) {
      const confirmed = window.confirm(
        '현재 창을 나가면 입력한 정보가 사라지게 됩니다.\n 정말 나가시껬습니까?',
      );
      if (confirmed) {
        return closeModal();
      }
      return null;
    }
    return closeModal();
  };

  const createCardBtnHandler = async () => {
    setIsPosting(true);
    try {
      const { key, boardId } = await createCard(
        currentGame,
        userInput,
        oauth2Id,
        userInput.type === 'DUO_RANK' ? 2 : 5,
        notiToken,
      );

      dispatch(chatroomActions.ADD_JOINED_CHATROOMS_ID(key));
      navigate(`/lol/${boardId}`, { replace: true });
      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message: '게시글 작성에 성공했습니다.',
          severity: 'success',
        }),
      );
      dispatch(refreshActions.REFRESH_CARD());
      dispatch(refreshActions.FORCE_REFRESH());
    } catch (error: any) {
      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message: '게시글 작성에 실패했습니다.',
          severity: 'error',
        }),
      );
    }
  };

  return (
    <Modal>
      <Container>
        <HeaderWrapper>
          <HeaderTitle>새 게시글 작성</HeaderTitle>
          <MuiIconButton
            size="small"
            onClick={() => {
              confirmBeforeClosingModal();
            }}
            sx={{ p: 0, m: 0 }}
          >
            <Close />
          </MuiIconButton>
        </HeaderWrapper>
        <MuiDivider />
        <SelectRegisteredNickname>
          <CustomSwitch
            checked={useRegisteredNickname}
            onChange={handleSwitch}
            disabled={isPosting ? true : !registeredNickname}
            size="small"
            sx={{ ml: 1 }}
          />
          <RegisteredNicknameTypo
            sx={{
              color: useRegisteredNickname ? 'black' : '#5e5e5e',
            }}
          >
            등록된 소환사명: {registeredNickname || '등록된 소환사명 없음'}
          </RegisteredNicknameTypo>
        </SelectRegisteredNickname>
        <NicknameSection>
          <SectionTitle>플레이할 소환사 명</SectionTitle>
          <NicknameInput
            value={userInput.name}
            placeholder="소환사 명을 입력하세요."
            disabled={isPosting ? true : useRegisteredNickname}
            onChange={handleNickname}
            error={!isNewNicknameCertified}
            endAdornment={
              isLoading ? (
                <MuiCircularProgress size={14} />
              ) : (
                <MuiButton
                  sx={{ whiteSpace: 'nowrap' }}
                  onClick={certifyNewNickname}
                  disabled={
                    (isPosting ? true : useRegisteredNickname) ||
                    userInput.name.length < 2
                  }
                >
                  {isNewNicknameCertified ? '인증완료' : '인증하기'}
                </MuiButton>
              )
            }
          />
        </NicknameSection>
        <QueueTypeSection>
          <SectionTitle>플레이할 큐 타입</SectionTitle>
          <ToggleButtonGroup
            exclusive
            disabled={isPosting}
            value={userInput.type}
            onChange={handleType}
          >
            {queueTypeList.map((item) => {
              if (item.value !== 'ALL') {
                return (
                  <ToggleButton key={item.value} value={item.value}>
                    {item.label}
                  </ToggleButton>
                );
              }
              return null;
            })}
          </ToggleButtonGroup>
        </QueueTypeSection>
        <TierSection>
          <SectionTitle>원하는 파티원의 티어</SectionTitle>
          <TierToggleWrapper>
            <ToggleButtonGroup
              exclusive
              disabled={isPosting || userInput.type === 'ARAM'}
              value={userInput.tier}
              onChange={handleTier}
            >
              {tierList.map((item) => {
                if (
                  !(
                    item.value === 'UNRANKED' ||
                    item.value === 'CHALLENGER' ||
                    item.value === 'GRANDMASTER'
                  )
                ) {
                  return (
                    <ToggleButton
                      key={item.value}
                      value={item.value}
                      disabled={
                        isPosting
                          ? true
                          : !!(
                              (item.value === 'MASTER' ||
                                item.value === 'ALL') &&
                              userInput.type === 'DUO_RANK'
                            )
                      }
                    >
                      {item.label}
                    </ToggleButton>
                  );
                }
                return null;
              })}
            </ToggleButtonGroup>
          </TierToggleWrapper>
        </TierSection>
        <PositionSection>
          <SectionTitle>원하는 파티원의 포지션</SectionTitle>
          <ToggleButtonGroup
            exclusive
            disabled={isPosting || userInput.type === 'ARAM'}
            value={userInput.position}
            onChange={handlePosition}
          >
            {positionList.map((item) => {
              return (
                <ToggleButton key={item.value} value={item.value}>
                  {item.value === 'ALL' ? '상관없음' : item.label}
                </ToggleButton>
              );
            })}
          </ToggleButtonGroup>
        </PositionSection>
        <DurationSection>
          <SectionTitle>파티 게시글 지속시간</SectionTitle>
          <FormControl disabled={isPosting}>
            <MuiSelect
              value={userInput.expire}
              onChange={handleExpire}
              sx={{ height: '36px' }}
            >
              {expiredTimeList.map((item) => {
                return (
                  <MuiMenuItem
                    key={item.value}
                    value={item.value}
                    sx={{ color: '#4d4d4d' }}
                  >
                    {item.label}
                  </MuiMenuItem>
                );
              })}
            </MuiSelect>
          </FormControl>
        </DurationSection>
        <VoiceSection>
          <SectionTitle>인게임 보이스 or 음성채팅 사용 여부</SectionTitle>
          <ToggleButtonGroup
            exclusive
            disabled={isPosting}
            value={userInput.voice}
            onChange={handleVoice}
          >
            <ToggleButton value="y">
              <Mic sx={{ mr: 1, fontSize: '18px' }} />
              사용
            </ToggleButton>
            <ToggleButton value="n">
              {' '}
              <MicOff sx={{ mr: 1, fontSize: '18px' }} />
              사용안함
            </ToggleButton>
          </ToggleButtonGroup>
        </VoiceSection>
        <ContentSection>
          <MuiTextField
            value={userInput.content}
            sx={{ backgroundColor: '#ffffff' }}
            onChange={handleContent}
            fullWidth
            multiline
            disabled={isPosting}
            minRows={4}
            maxRows={4}
            placeholder="원하는 파티원에 대한 설명이나, 자신에 대해 소개해 보세요."
            inputProps={{
              maxLength: 140,
              minLength: 20,
            }}
          />
          <HelpTypo>
            <HelpOutline sx={{ fontSize: '16px', color: '#4d4d4d', mr: 1 }} />
            최소 20자 이상 작성해야 하며, 최대 140자를 넘길 수 없습니다.
          </HelpTypo>
        </ContentSection>
        <MuiDivider />
        <ControlButtonWrapper>
          <CancelButton
            onClick={confirmBeforeClosingModal}
            disabled={isPosting}
            variant="contained"
            startIcon={<BackSpace />}
          >
            뒤로가기
          </CancelButton>
          <PostButton
            onClick={createCardBtnHandler}
            disabled={
              isPosting ||
              userInput.content.length < 20 ||
              (!useRegisteredNickname && isNewNicknameCertified === false)
            }
            variant="contained"
            startIcon={<Edit />}
          >
            작성하기
          </PostButton>
        </ControlButtonWrapper>
      </Container>
    </Modal>
  );
};

export default CreateCard;

const Container = styled(MuiBox)(() => ({
  width: '100%',
  minWidth: '480px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
})) as typeof MuiBox;

const HeaderWrapper = styled(MuiBox)(() => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})) as typeof MuiBox;

const HeaderTitle = styled(MuiTypography)(() => ({
  fontSize: '18px',
  fontWeight: 500,
})) as typeof MuiTypography;

const SelectRegisteredNickname = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'row-reverse',
  alignItems: 'center',
  justifyContent: 'flex-start',
})) as typeof MuiBox;

const RegisteredNicknameTypo = styled(MuiTypography)(() => ({
  fontSize: '14px',
  fontWeight: 400,
  color: '#5e5e5e',
})) as typeof MuiTypography;

const SectionTitle = styled(MuiTypography)(() => ({
  fontSize: '16px',
  fontWeight: 400,
  color: '#4d4d4d',
})) as typeof MuiTypography;

const NicknameSection = styled(MuiBox)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})) as typeof MuiBox;

const NicknameInput = styled(MuiOutlinedInput)(() => ({
  width: '280px',
  height: '32px',
  fontSize: '14px',
}));

const QueueTypeSection = styled(MuiBox)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})) as typeof MuiBox;

const ToggleButtonGroup = styled(MuiToggleButtonGroup)(() => ({}));

const ToggleButton = styled(MuiToggleButton)(({ theme }) => ({
  height: '36px',
  padding: '0 8px 0',
  fontSize: '14px',
  '&.MuiToggleButton-root.Mui-selected': {
    color: theme.palette.secondary.contrastText,
    backgroundColor: theme.palette.secondary.main,
  },
  '&.MuiToggleButton-root:hover': {
    color: theme.palette.secondary.contrastText,
    backgroundColor: theme.palette.secondary.main,
  },
})) as typeof MuiToggleButton;

const TierSection = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
})) as typeof MuiBox;

const TierToggleWrapper = styled(MuiBox)(() => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  margin: '8px 0 0px',
})) as typeof MuiBox;

const PositionSection = styled(MuiBox)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})) as typeof MuiBox;

const DurationSection = styled(MuiBox)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})) as typeof MuiBox;

const FormControl = styled(MuiFormControl)(() => ({
  color: '#4d4d4d',
  width: '160px',
  '& > *': {
    fontSize: '14px',
  },
})) as typeof MuiFormControl;

const VoiceSection = styled(MuiBox)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})) as typeof MuiBox;

const ContentSection = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
})) as typeof MuiBox;

const HelpTypo = styled(MuiTypography)(() => ({
  padding: '4px 0 0 0',
  display: 'flex',
  fontSize: '12px',
  fontWeight: 400,
  color: '#4d4d4d',
  justifyContent: 'center',
})) as typeof MuiTypography;

const ControlButtonWrapper = styled(MuiBox)(() => ({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
})) as typeof MuiBox;

const CancelButton = styled(MuiButton)(() => ({
  backgroundColor: '#808080',
  margin: '0 8px 0 0',
  width: '160px',
  hegith: '36px',
  '&:hover': {
    backgroundColor: '#a0a0a0',
  },
})) as typeof MuiButton;

const PostButton = styled(MuiButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  margin: '0 8px 0 0',
  width: '160px',
  hegith: '36px',
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
})) as typeof MuiButton;
