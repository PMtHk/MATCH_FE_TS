/* eslint-disable no-alert */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getDatabase, ref, update } from 'firebase/database';

import { RootState } from 'store';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiButton from '@mui/material/Button';
import MuiIconButton from '@mui/material/IconButton';
import MuiTypography from '@mui/material/Typography';
import MuiDivider from '@mui/material/Divider';
import MuiOutlinedInput from '@mui/material/OutlinedInput';
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

import { updateCard } from 'apis/api/common';
import { snackbarActions } from 'store/snackbar-slice';
import Modal from 'components/Modal';
import { getCurrentGame } from 'functions/commons';
import { GAME_ID } from 'types/games';
import { typeList, tierList, platformList, expiredTimeList } from './data';

const EditCard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const { id: cardId } = params;

  const { pubg: registeredNickname } = useSelector(
    (state: RootState) => state.user.games,
  );

  const { oauth2Id } = useSelector((state: RootState) => state.user);
  const { currentCard } = useSelector((state: RootState) => state.card);

  const currentGame: GAME_ID = getCurrentGame();

  // 파티가 마감된 경우 뒤로가기
  useEffect(() => {
    if (currentCard.expired === 'true') {
      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message: '파티가 마감되어 수정이 불가능합니다.',
          severity: 'warning',
        }),
      );
      navigate(-1);
    }
  }, []);

  // 새 게시글 생성 모달 내부 변동사항 여부 state => 모달 닫기 전 확인하는데 쓰임.
  const [isChanged, setIsChanged] = React.useState<boolean>(false);

  // 사용자의 input state
  const [userInput, setUserInput] = React.useState({
    name: currentCard?.name,
    platform: currentCard?.platform,
    type: currentCard?.type,
    tier: currentCard?.tier,
    expire: currentCard?.expire,
    voice: currentCard?.voice.toLowerCase(),
    content: currentCard?.content,
  });

  // 게시글 생성 요청 상태
  const [isPosting, setIsPosting] = React.useState<boolean>(false);

  // user input 조작부
  const handleType = (
    event: React.MouseEvent<HTMLElement>,
    newValue: string,
  ) => {
    if (newValue === null) return;
    if (newValue === 'RANKED_SQUAD') {
      setUserInput({
        ...userInput,
        tier: 'BRONZE',
        type: newValue,
      });
    } else
      setUserInput({
        ...userInput,
        tier: 'ALL',
        type: newValue,
      });
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

  const closeModal = () => {
    setUserInput({
      name: registeredNickname || '',
      platform: 'STEAM',
      type: 'DUO',
      tier: 'BRONZE',
      expire: 'FIFTEEN_M',
      voice: 'n',
      content: '',
    });
    setIsChanged(false);
    navigate('/pubg', { replace: true });
  };

  const confirmBeforeClosingModal = () => {
    if (isChanged) {
      const confirmed = window.confirm(
        '현재 창을 나가면 수정한 정보가 사라지게 됩니다.\n 정말 나가시껬습니까?',
      );
      if (confirmed) {
        return closeModal();
      }
      return null;
    }
    return closeModal();
  };

  const backToDetailPage = () => {
    if (isChanged) {
      if (
        window.confirm(
          '게시글에 수정한 내역이 있습니다.\n수정을 취소하시겠습니까?',
        )
      ) {
        navigate(`/pubg/${cardId}`, { replace: true });
      }
    } else {
      navigate(`/pubg/${cardId}`, { replace: true });
    }
  };

  const updateHandler = async () => {
    try {
      setIsPosting(true);

      await updateCard(
        currentGame,
        currentCard.id,
        currentCard.chatRoomId,
        userInput,
        userInput.type === 'DUO' ? 2 : 4,
      );

      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message: '게시글 수정이 완료되었습니다.',
          severity: 'success',
        }),
      );

      navigate(`/pubg/${currentCard.id}`, { replace: true });
    } catch (error) {
      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message: '게시글 수정 중 문제가 발생하였습니다.',
          severity: 'error',
        }),
      );
    } finally {
      setIsPosting(false);
    }
  };

  if (oauth2Id !== currentCard?.oauth2Id) {
    return (
      <Modal>
        <ErrorFallback>
          <ErrorTitle>비정상적인 접근입니다.</ErrorTitle>
          <ErrorContent>해당 게시글에 대한 권한이 없습니다. </ErrorContent>
          <MuiButton onClick={() => navigate(`/pubg/${cardId}`)}>
            돌아가기
          </MuiButton>
        </ErrorFallback>
      </Modal>
    );
  }

  return (
    <Modal>
      <Container>
        <HeaderWrapper>
          <HeaderTitle>게시글 수정</HeaderTitle>
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
        {/* 닉네임 영역 */}
        <NicknameSection>
          <SectionTitle>플레이할 닉네임</SectionTitle>
          <NicknameInput
            value={userInput.name}
            disabled
            onChange={() => null}
          />
        </NicknameSection>
        {/* 플랫폼 선택 영역 */}
        <PlatformSection>
          <SectionTitle>플레이할 플랫폼</SectionTitle>
          <ToggleButtonGroup
            exclusive
            disabled
            value={userInput.platform}
            onChange={() => null}
          >
            {platformList.map((item) => {
              if (item.value !== 'ALL') {
                return (
                  <PlatformToggleButton key={item.value} value={item.value}>
                    {item.label}
                  </PlatformToggleButton>
                );
              }
              return null;
            })}
          </ToggleButtonGroup>
        </PlatformSection>
        {/* 게임 타입 선택 영역 */}
        <TypeSection>
          <SectionTitle>플레이할 게임 타입</SectionTitle>
          <ToggleButtonGroup
            exclusive
            disabled={isPosting || userInput.type === 'ARAM'}
            value={userInput.type}
            onChange={handleType}
          >
            {typeList.map((item) => {
              if (item.value === 'ALL') return null;
              return (
                <ToggleButton
                  key={item.value}
                  value={item.value}
                  disabled={item.maxMember < currentCard.memberList.length}
                >
                  {item.label}
                </ToggleButton>
              );
            })}
          </ToggleButtonGroup>
        </TypeSection>
        {/* 티어 선택 영역 */}
        <TierSection>
          <SectionTitle>원하는 파티원의 티어</SectionTitle>
          <TierToggleWrapper>
            <ToggleButtonGroup
              exclusive
              disabled={isPosting || userInput.type !== 'RANKED_SQUAD'}
              value={userInput.tier}
              onChange={handleTier}
            >
              {tierList.map((item) => {
                if (!(item.value === 'UNRANKED')) {
                  return (
                    <ToggleButton
                      key={item.value}
                      value={item.value}
                      disabled={
                        isPosting ||
                        (userInput.type === 'RANKED_SQUAD' &&
                          item.value === 'ALL')
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

        {/* 파티 마감까지 지속시간 */}
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
          <HelpTypo>
            <HelpOutline sx={{ fontSize: '16px', color: '#4d4d4d', mr: 1 }} />
            게시글 작성시 등록한 닉네임 및 플랫폼은 변경할 수 없습니다.
          </HelpTypo>
        </ContentSection>
        <MuiDivider />
        <ControlButtonWrapper>
          <CancelButton
            onClick={backToDetailPage}
            disabled={isPosting}
            variant="contained"
            startIcon={<BackSpace />}
          >
            뒤로가기
          </CancelButton>
          <PostButton
            onClick={updateHandler}
            disabled={isPosting || userInput.content.length < 20}
            variant="contained"
            startIcon={<Edit />}
          >
            수정하기
          </PostButton>
        </ControlButtonWrapper>
      </Container>
    </Modal>
  );
};

export default EditCard;

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

const PlatformSection = styled(MuiBox)(() => ({
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

const PlatformToggleButton = styled(MuiToggleButton)(({ theme }) => ({
  minWidth: '100px',
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

const TypeSection = styled(MuiBox)(() => ({
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

const ErrorFallback = styled(MuiBox)(() => ({
  width: '100%',
  height: '268px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  alignItems: 'center',
  justifyContent: 'center',
})) as typeof MuiBox;

const ErrorTitle = styled(MuiTypography)(() => ({
  fontSize: '18px',
  fontWeight: 500,
})) as typeof MuiTypography;

const ErrorContent = styled(MuiTypography)(() => ({
  fontSize: '14px',
  fontWeight: 400,
  color: '#4d4d4d',
})) as typeof MuiTypography;
