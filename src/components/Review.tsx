import React, { useEffect, useState, useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// mui
import DislikeIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import LikeIcon from '@mui/icons-material/SentimentVerySatisfied';
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import MuiButton from '@mui/material/Button';
import MuiDivider from '@mui/material/Divider';
import MuiIconButton from '@mui/material/IconButton';
import MuiClose from '@mui/icons-material/Close';
import MuiThumbUpIcon from '@mui/icons-material/ThumbUp';
import MuiThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import MuiThumbDownIcon from '@mui/icons-material/ThumbDown';
import MuiThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import { fetchCardDetail } from 'apis/api/leagueoflegends';
import HelpOutline from '@mui/icons-material/HelpOutline';

import { snackbarActions } from 'store/snackbar-slice';
import {
  asyncGetIsReviewed,
  doReview,
  getFilteredMemberListForReview,
  getIsReviewed,
} from 'apis/api/firebase';
import { authAxios, defaultAxios } from 'apis/utils';
import { cardActions } from 'store/card-slice';
import { RootState } from '../store';
import Modal from './Modal';

const Review = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentGame = window.location.pathname.split('/')[1];
  const roomId: string = window.location.pathname.split('/')[2];

  const { currentCard } = useSelector((state: RootState) => state.card);
  const { oauth2Id } = useSelector((state: RootState) => state.user);
  const { games } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const getRoomInfo = async () => {
      // 서버에서 해당 파티의 정보를 가져옴
      const response = await defaultAxios.get(
        `/api/${currentGame}/boards/${roomId}`,
      );
      // 파이어베이스에서 isReviewed를 가져옴
      const isReviewed = await asyncGetIsReviewed(
        oauth2Id,
        response.data.chatRoomId,
      );
      // isReviewed가 true이면 카드 상세보기 모달로 이동
      if (isReviewed === true) {
        dispatch(
          snackbarActions.OPEN_SNACKBAR({
            message:
              '리뷰가 완료된 게시글이기 때문에 상세보기 페이지로 이동합니다.',
            severity: 'info',
          }),
        );
        navigate(`/${currentGame}/${response.data.id}`);
      } else {
        dispatch(cardActions.SET_CURRENT_CARD(response.data));
      }
    };
    getRoomInfo();
  }, []);

  const [reviewMap, setReviewMap] = React.useState(new Map());
  const [hasReview, setHasReview] = React.useState<boolean>(false);

  const modifyReview = (member: string, review: 'like' | 'dislike') => {
    setReviewMap((prevState) => new Map(prevState).set(member, review));
    setHasReview(true);
  };

  const handleSkip = async () => {
    await doReview(oauth2Id, currentCard.chatRoomId);
    navigate(`/${currentGame}`);
  };

  const handleReview = async () => {
    // Map 객체 분해
    const reviewedMember: string[] = [];
    const reviewContent: string[] = [];
    reviewMap.forEach((value, key) => {
      reviewedMember.push(key);
      reviewContent.push(value);
    });

    // 서버에 전송
    const temp = await Promise.all(
      reviewedMember.map(async (member, idx) => {
        const data: any = { game: currentGame, nickname: member };
        if (reviewContent[idx] === 'like') {
          const res: any = await authAxios.post('/api/user/like', data);
          return res;
        }
        const res = await authAxios.post('/api/user/dislike', data);
        return res;
      }),
    );

    await handleSkip();

    dispatch(
      snackbarActions.OPEN_SNACKBAR({
        message: '평가가 완료되어 상세보기 페이지로 이동합니다.',
        severity: 'info',
      }),
    );

    navigate(`/${currentGame}/${roomId}`);
  };
  const [filteredMemberList, setFilteredMemberList] = useState<string[] | null>(
    null,
  );

  if (currentCard) {
    const getFilteredMemberList = async () => {
      const result = await getFilteredMemberListForReview(
        currentCard.chatRoomId,
        oauth2Id,
      );
      setFilteredMemberList(result);
    };
    getFilteredMemberList();
    return (
      <Modal>
        <ReviewModalContainer>
          <ModalHeader>
            <Title>
              <Nickname component="span">{currentCard?.name}</Nickname>님의
              파티는 어떠셨나요?
            </Title>
            <SubTitle>평가내용은 상대방이 알 수 없어요.</SubTitle>
          </ModalHeader>
          <ModalContent>
            {filteredMemberList &&
              filteredMemberList.map((member: string) => {
                return (
                  <MemberWrapper key={member}>
                    <MemberName>{member}</MemberName>
                    <ButtonListWrapper>
                      <ButtonWrapper>
                        <MuiButton
                          onClick={() => {
                            modifyReview(member, 'like');
                          }}
                          sx={{
                            padding: '8px',
                            display: 'flex',
                            flexDirection: 'column',
                            marginRight: '40px',
                            border: '1px solid transparent',
                            backgroundColor:
                              reviewMap.get(member) === 'like'
                                ? '#4CAF50'
                                : 'none',
                            color:
                              reviewMap.get(member) === 'like'
                                ? 'white'
                                : 'black',
                            '&:hover': {
                              border: '1px solid green',
                              color: 'black',
                            },
                          }}
                        >
                          <LikeIcon
                            sx={{
                              fontSize: '32px',
                              color:
                                reviewMap.get(member) === 'like'
                                  ? 'white'
                                  : '#4CAF50',
                            }}
                          />
                          최고에요
                        </MuiButton>
                        <MuiButton
                          onClick={() => {
                            modifyReview(member, 'dislike');
                          }}
                          sx={{
                            padding: '8px',
                            boxSizing: 'border-box',
                            display: 'flex',
                            flexDirection: 'column',
                            border: '1px solid transparent',
                            backgroundColor:
                              reviewMap.get(member) === 'dislike'
                                ? 'orange'
                                : 'none',
                            color:
                              reviewMap.get(member) === 'dislike'
                                ? 'white'
                                : 'black',
                            '&:hover': {
                              border: '1px solid orange',
                              color: 'black',
                            },
                          }}
                        >
                          <DislikeIcon
                            sx={{
                              fontSize: '32px',
                              color:
                                reviewMap.get(member) === 'dislike'
                                  ? 'white'
                                  : '#FF9F1C',
                            }}
                          />
                          별로예요
                        </MuiButton>
                      </ButtonWrapper>
                    </ButtonListWrapper>
                  </MemberWrapper>
                );
              })}
            <HelpTypoSection>
              <HelpTypo>
                <HelpOutline
                  sx={{ fontSize: '16px', color: '#4d4d4d', mr: 1 }}
                />
                평가를 원하지 않으시면 건너뛰기를 눌러주세요.
              </HelpTypo>
            </HelpTypoSection>
          </ModalContent>
          <ControlPanel>
            <ControlButton onClick={handleSkip}>건너뛰기</ControlButton>
            <ReviewButton onClick={handleReview}>리뷰하기</ReviewButton>
          </ControlPanel>
        </ReviewModalContainer>
      </Modal>
    );
  }
  return <div />;
};

export default Review;

const ButtonWrapper = styled(MuiBox)(() => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
}));

const HelpTypoSection = styled(MuiBox)(() => ({
  marginTop: '20px',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}));

const HelpTypo = styled(MuiTypography)(() => ({
  padding: '4px 0 0 0',
  display: 'flex',
  fontSize: '12px',
  fontWeight: 400,
  color: '#4d4d4d',
  justifyContent: 'center',
})) as typeof MuiTypography;

const ControlButton = styled(MuiButton)(() => ({
  border: '1px solid lightgray',
  width: '120px',
  fontSize: '16px',
  marginRight: '4px',
}));

const ReviewButton = styled(MuiButton)(({ theme }) => ({
  width: '120px',
  fontSize: '16px',
  backgroundColor: theme.palette.primary.light,
  color: 'white',
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

const ReviewModalContainer = styled(MuiBox)(() => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minWidth: '600px',
}));

const ModalContent = styled(MuiBox)(() => ({
  height: '100%',
  minHeight: '100px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '60px',
  paddingTop: '20px',
})) as typeof MuiBox;

const MemberNameWrapper = styled(MuiBox)(() => ({
  border: '1px solid red',
  width: '100px',
  height: '100px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

const ButtonListWrapper = styled(MuiBox)(() => ({
  minWidth: '100px',
}));

const ControlPanel = styled(MuiBox)(() => ({
  position: 'absolute',
  bottom: '8px',
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-end',
}));

const MemberName = styled(MuiTypography)(() => ({
  display: 'flex',
  minWidth: '200px',
  maxWidth: '200px',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  fontSize: '18px',
})) as typeof MuiTypography;

const MemberWrapper = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  margin: '8px',
}));

const ModalHeader = styled(MuiBox)(() => ({
  width: '100%',
  textAlign: 'center',
  margin: '12px 0',
})) as typeof MuiBox;

const Title = styled(MuiTypography)(() => ({
  fontSize: '18px',
  fontWeight: '500',
})) as typeof MuiTypography;

const SubTitle = styled(MuiTypography)(() => ({
  fontSize: '12px',
  fontWeight: '500',
  color: 'gray',
})) as typeof MuiTypography;

const Nickname = styled(MuiTypography)(() => ({
  fontSize: '18px',
  fontWeight: '700',
})) as typeof MuiTypography;
