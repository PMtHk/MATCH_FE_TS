import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// mui

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

import { snackbarActions } from 'store/snackbar-slice';
import { doReview } from 'apis/api/firebase';
import Modal from './Modal';

import { RootState } from '../store';

const Review = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentGame = window.location.pathname.split('/')[1];

  const { currentCard } = useSelector((state: RootState) => state.card);
  const { oauth2Id } = useSelector((state: RootState) => state.user);

  const [reviewMap, setReviewMap] = React.useState(new Map());
  const [hasReview, setHasReview] = React.useState<boolean>(false);

  const modifyReview = (member: string, review: 'like' | 'dislike') => {
    setReviewMap((prevState) => new Map(prevState).set(member, review));
    setHasReview(true);
  };

  const handleGoBackBtn = () => {
    navigate(`/${currentGame}`);
  };

  const handleSkip = async () => {
    await doReview(oauth2Id, currentCard.chatRoomId);
  };

  if (currentCard) {
    return (
      <Modal>
        <ModalHeader>
          <Title>
            <Nickname component="span">{currentCard?.name}</Nickname>님의 파티는
            어떠셨나요?
          </Title>
          <SubTitle>( 평가내용은 상대방이 알 수 없어요. )</SubTitle>
        </ModalHeader>
        <ModalContent>
          {currentCard.memberList.map((member: any) => {
            return (
              <div key={member}>
                <MemberWrapper>
                  <MemberName>{member}</MemberName>
                  <Divider orientation="vertical" />
                  <MuiButton
                    onClick={() => {
                      modifyReview(member, 'like');
                    }}
                  >
                    {reviewMap.get(`${member}`) === 'like' ? (
                      <Thumbup />
                    ) : (
                      <ThumbupOffAlt />
                    )}
                    좋아요
                  </MuiButton>
                  <MuiButton
                    onClick={() => {
                      modifyReview(member, 'dislike');
                    }}
                  >
                    {reviewMap.get(`${member}`) === 'dislike' ? (
                      <Thumbdown />
                    ) : (
                      <ThumbdownOffAlt />
                    )}
                    별로에요
                  </MuiButton>
                </MemberWrapper>
              </div>
            );
          })}
        </ModalContent>
        <ControlPanel>
          <MuiButton onClick={handleGoBackBtn}>뒤로가기</MuiButton>
          <MuiButton disabled={!hasReview}>리뷰하기</MuiButton>
          <MuiButton onClick={handleSkip}>건너뛰기</MuiButton>
        </ControlPanel>
      </Modal>
    );
  }
  dispatch(
    snackbarActions.OPEN_SNACKBAR({
      message: '비정상적인 접근입니다.',
      severity: 'error',
    }),
  );
  navigate(`/${currentGame}`);

  return <div />;
};

export default Review;

const ControlPanel = styled(MuiBox)(() => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const Divider = styled(MuiDivider)(() => ({
  margin: '0 8px 0 16px',
}));

const Thumbdown = styled(MuiThumbDownIcon)(() => ({
  margin: '0 8px 0 0',
}));

const ThumbdownOffAlt = styled(MuiThumbDownOffAltIcon)(() => ({
  margin: '0 8px 0 0',
}));

const Thumbup = styled(MuiThumbUpIcon)(() => ({
  margin: '0 8px 0 0',
}));

const ThumbupOffAlt = styled(MuiThumbUpOffAltIcon)(() => ({
  margin: '0 8px 0 0',
}));

const MemberName = styled(MuiTypography)(() => ({
  fontSize: '14px',
  fontWeight: '500',
})) as typeof MuiTypography;

const MemberWrapper = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '40px',
}));

const ModalHeader = styled(MuiBox)(() => ({
  width: '100%',
  minWidth: '300px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  padding: '0 0 8px 0',
})) as typeof MuiBox;

const Title = styled(MuiTypography)(() => ({
  fontSize: '14px',
  fontWeight: '500',
})) as typeof MuiTypography;

const SubTitle = styled(MuiTypography)(() => ({
  fontSize: '13px',
  fontWeight: '500',
})) as typeof MuiTypography;

const Nickname = styled(MuiTypography)(() => ({
  fontSize: '18px',
  fontWeight: '700',
})) as typeof MuiTypography;

const ModalContent = styled(MuiBox)(() => ({
  minHeight: '200px',
  display: 'flex',
  flexDirection: 'column',
})) as typeof MuiBox;
