/* eslint-disable no-alert */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiButton from '@mui/material/Button';
import MuiIconButton from '@mui/material/IconButton';
import MuiTypography from '@mui/material/Typography';
import MuiDivider from '@mui/material/Divider';
import MuiOutlinedInput from '@mui/material/OutlinedInput';
import MuiCircularProgress from '@mui/material/CircularProgress';
import MuiToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import MuiToggleButton from '@mui/material/ToggleButton';
import MuiFormControl from '@mui/material/FormControl';
import MuiFormControlLabel from '@mui/material/FormControlLabel';
import MuiCheckbox from '@mui/material/Checkbox';
import MuiSelect, { SelectChangeEvent } from '@mui/material/Select';
import MuiMenuItem from '@mui/material/MenuItem';
import MuiTextField from '@mui/material/TextField';
import Close from '@mui/icons-material/Close';
import Mic from '@mui/icons-material/Mic';
import MicOff from '@mui/icons-material/MicOff';
import HelpOutline from '@mui/icons-material/HelpOutline';
import BackSpace from '@mui/icons-material/Backspace';
import Edit from '@mui/icons-material/Edit';

import { verifyNickname, loadHistory } from 'apis/api/valorant';
import { createCard } from 'apis/api/common';
import { RootState } from 'store';
import { chatroomActions } from 'store/chatroom-slice';
import { snackbarActions } from 'store/snackbar-slice';
import { refreshActions } from 'store/refresh-slice';
import Modal from 'components/Modal';
import { CustomSwitch } from 'components/Swtich';
import { getCurrentGame } from 'functions/commons';
import { GAME_ID } from 'types/games';
import {
  queueTypeList,
  tierFilterList,
  positionList,
  expiredTimeList,
} from './data';

const CreateCard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentGame: GAME_ID = getCurrentGame();

  const { valorant: registeredNickname } = useSelector(
    (state: RootState) => state.user.games,
  );

  const { games } = useSelector((state: RootState) => state.register);
  const { oauth2Id } = useSelector((state: RootState) => state.user);
  const { notiToken } = useSelector((state: RootState) => state.notification);

  const vlrtNickname = games.valorant;

  const [checked, setChecked] = React.useState(false);

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked((prev) => !prev);
  };
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
    gameMode: 'STANDARD',
    tier: 1,
    position: 'DUELIST',
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
    setUserInput({ ...userInput, gameMode: newValue });
    setIsChanged(true);
  };

  const handleTier = (
    event: React.MouseEvent<HTMLElement>,
    newValue: number,
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

      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message: '요원 정보를 확인하는 중입니다. 잠시만 기다려 주세요.',
          severity: 'info',
        }),
      );

      const exactSummonerName = await verifyNickname(userInput.name);
      await loadHistory(exactSummonerName);

      setIsLoading(false);
      setUserInput({ ...userInput, name: exactSummonerName });
      setIsNewNicknameCertified(true);
    } catch (error: any) {
      if (error.response.status === 404) {
        dispatch(
          snackbarActions.OPEN_SNACKBAR({
            message: '입력하신 정보와 일치하는 요원을 찾을 수 없습니다.',
            severity: 'error',
          }),
        );
      }
    } finally {
      setIsChanged(true);
    }
  };

  const closeModal = () => {
    setUserInput({
      name: registeredNickname || '',
      gameMode: 'STANDARD',
      tier: 1,
      position: 'DUELIST',
      expire: 'FIFTEEN_M',
      voice: 'n',
      content: '',
    });
    setIsChanged(false);
    setUseRegisteredNickname(!!registeredNickname);
    navigate('/valorant', { replace: true });
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
      const { key, boardId, firstRead } = await createCard(
        currentGame,
        userInput,
        oauth2Id,
        5,
        notiToken,
      );

      dispatch(
        chatroomActions.ADD_JOINED_CHATROOMS_ID({
          chatRoomId: key as string,
          game: currentGame as GAME_ID,
          id: boardId,
          firstRead,
        }),
      );
      navigate(`/valorant/${boardId}`, { replace: true });
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
            등록된 요원명: {registeredNickname || '등록된 요원명 없음'}
          </RegisteredNicknameTypo>
        </SelectRegisteredNickname>
        {/* TODO : 발로란트 닉네임이 없을 때 라이엇 로그인하게 하는 버튼 */}
        {!useRegisteredNickname && (
          <RiotAuthSection>
            <RiotAuthTitleAndHelp>
              <SectionTitle>라이엇 인증하기</SectionTitle>
              <HelpTypo>
                <HelpOutline
                  sx={{ fontSize: '16px', color: '#4d4d4d', mr: 1 }}
                />
                발로란트 게시글 작성은 라이엇 계정 연동이 필요합니다.
              </HelpTypo>
            </RiotAuthTitleAndHelp>
            <ButtonWrapper>
              <Button
                disabled={!checked || Boolean(vlrtNickname)}
                href={`https://auth.riotgames.com/authorize?client_id=${process.env.REACT_APP_RIOT_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_RIOT_REDIRECT_URI_MYPAGE}&response_type=code&scope=openid+offline_access`}
              >
                <img
                  src="https://cdn.match-gg.kr/assets/riot_games_icon.png"
                  alt="riot_games_symbol"
                  width="24px"
                  height="24px"
                />
                <span>라이엇 로그인</span>
              </Button>
              {!vlrtNickname && (
                <FormControlLabel
                  control={
                    <CustomCheckbox checked={checked} onChange={handleCheck} />
                  }
                  label="MatchGG 에 나의 발로란트 프로필이 공개되는 것을 동의합니다."
                />
              )}
              {vlrtNickname && (
                <LinkedNickname>연결완료 - {vlrtNickname}</LinkedNickname>
              )}
            </ButtonWrapper>
          </RiotAuthSection>
        )}
        <QueueTypeSection>
          <SectionTitle>플레이할 큐 타입</SectionTitle>
          <QueueTypeToggleWrapper>
            <ToggleButtonGroup
              exclusive
              disabled={isPosting}
              value={userInput.gameMode}
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
          </QueueTypeToggleWrapper>
        </QueueTypeSection>
        <TierSection>
          <SectionTitle>원하는 파티원의 티어</SectionTitle>
          <TierToggleWrapper>
            <ToggleButtonGroup
              exclusive
              disabled={isPosting}
              value={userInput.tier}
              onChange={handleTier}
            >
              {tierFilterList.map((item) => {
                return (
                  <ToggleButton
                    key={item.value}
                    value={item.value}
                    disabled={isPosting}
                  >
                    {item.label}
                  </ToggleButton>
                );
              })}
            </ToggleButtonGroup>
          </TierToggleWrapper>
        </TierSection>
        <PositionSection>
          <SectionTitle>원하는 파티원의 포지션</SectionTitle>
          <ToggleButtonGroup
            exclusive
            disabled={isPosting || userInput.gameMode === 'TEAM_DEATHMATCH'}
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

const RiotAuthSection = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
})) as typeof MuiBox;

const FormControlLabel = styled(MuiFormControlLabel)(() => ({
  padding: '0 0 0 10px',
  '& > span': {
    fontSize: '12px',
    fontWeight: 700,
    color: '#D64E5Bb5',
  },
})) as typeof MuiFormControlLabel;

const CustomCheckbox = styled(MuiCheckbox)(() => ({
  color: '#D64E5Bb5',
  '&.Mui-checked': {
    color: '#D64E5Bb5',
  },
})) as typeof MuiCheckbox;

const LinkedNickname = styled(MuiTypography)(() => ({
  fontSize: '14px',
  fontWeight: 700,
  color: '#D64E5Bb5',
  margin: '0 0 0 20px',
})) as typeof MuiTypography;

const RiotAuthTitleAndHelp = styled(MuiBox)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
})) as typeof MuiBox;

const ButtonWrapper = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
  margin: '8px 0 0px',
})) as typeof MuiBox;

const Button = styled(MuiButton)(() => ({
  width: '100%',
  maxWidth: '320px',
  height: '48px',
  backgroundColor: '#E84057',
  color: '#f4f4f4',
  fontSize: '16px',
  fontWeight: 700,
  gap: '8px',
  '& > img': {
    filter: 'brightness(0) invert(1)',
  },
  '&:hover': {
    color: '#E84057',
    border: '1px solid #E84057',
    '& > img': {
      filter:
        'invert(45%) sepia(43%) saturate(7074%) hue-rotate(330deg) brightness(95%) contrast(91%)',
    },
  },
  '&.Mui-disabled': {
    backgroundColor: '#D2D4DA',
  },
})) as typeof MuiButton;

const QueueTypeSection = styled(MuiBox)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})) as typeof MuiBox;

const QueueTypeToggleWrapper = styled(MuiBox)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  margin: '8px 0 0px',
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
