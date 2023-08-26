import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiButton from '@mui/material/Button';
import MuiTypography from '@mui/material/Typography';
import MuiContainer from '@mui/material/Container';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import MuiDivider from '@mui/material/Divider';

import { RootState } from 'store';
import { getCurrentGame, isInParty } from 'functions/commons';
import { GAME_ID } from 'types/games';
import LolCard from '../../pages/leagueoflegends/Card';
import PubgCard from '../../pages/battlegrounds/Card';
import OverwatchCard from '../../pages/overwatch/Card';

const Card = ({
  game,
  item,
  expired,
}: {
  game: GAME_ID;
  item: any;
  expired: boolean;
}) => {
  if (game === 'lol') {
    return <LolCard item={item} expired={expired} />;
  }
  if (game === 'pubg') {
    return <PubgCard item={item} expired={expired} />;
  }
  if (game === 'overwatch') {
    return <OverwatchCard item={item} expired={expired} />;
  }
  return null;
};

const FollowCardListContainer = () => {
  const currentGame: GAME_ID = getCurrentGame();

  const { followCards } = useSelector((state: RootState) => state.card);
  const { oauth2Id } = useSelector((state: RootState) => state.user);

  const listRef: React.MutableRefObject<any> = useRef();
  const rightBtnRef: React.MutableRefObject<any> = useRef();
  const leftBtnRef: React.MutableRefObject<any> = useRef();

  const [position, setPosition] = useState<number>(0);
  const [isBtnDisabled, setIsBtnDisabled] = useState<boolean>(true);

  const handleClick = (direction: string) => {
    const leftBtnleft = leftBtnRef.current.getBoundingClientRect().left;
    const rightBtnRight = rightBtnRef.current.getBoundingClientRect().right;
    const listWidth = listRef.current.getBoundingClientRect().width;
    const slideDistance = rightBtnRight - leftBtnleft;

    if (direction === 'left') {
      setPosition((prev) => {
        if (prev - slideDistance <= 0) {
          return 0;
        }
        return prev - slideDistance;
      });
    } else if (direction === 'right') {
      setPosition((prev) => {
        if (prev + slideDistance >= listWidth - slideDistance) {
          return listWidth - slideDistance;
        }
        return prev + slideDistance;
      });
    }
  };

  useEffect(() => {
    const listWidth = listRef.current.getBoundingClientRect().width;
    const slideDistance =
      rightBtnRef.current.getBoundingClientRect().right -
      leftBtnRef.current.getBoundingClientRect().left;

    if (listWidth <= slideDistance) {
      setIsBtnDisabled(false);
    } else {
      setIsBtnDisabled(true);
    }
  }, []);

  useEffect(() => {
    listRef.current.style.transform = `translateX(-${position}px)`;
  }, [position]);

  const cardList = followCards[currentGame];

  let NumOfCards = 0;

  if (cardList) {
    NumOfCards = cardList?.length;
  }

  return (
    <Container maxWidth="lg">
      <CardCarousel className="movie-row">
        {cardList && (
          <Header>
            <Title>팔로우한 사용자들의 새 게시글</Title>
          </Header>
        )}
        <MuiBox sx={{ position: 'relative' }}>
          <CarouselBtn
            sx={{ left: 0, p: 0, m: 0 }}
            onClick={() => handleClick('left')}
            ref={leftBtnRef}
            disabled={isBtnDisabled}
          >
            <NavigateBeforeIcon sx={{ fontSize: 30 }} />
          </CarouselBtn>
          <CarouselBtn
            sx={{ right: 0 }}
            onClick={() => handleClick('right')}
            disabled={isBtnDisabled}
            ref={rightBtnRef}
          >
            <NavigateNextIcon sx={{ fontSize: 30 }} />
          </CarouselBtn>

          <CardsWrapper ref={listRef}>
            {NumOfCards > 0 &&
              cardList.map((aCard: any, index) => (
                <Link
                  key={aCard.id}
                  to={
                    aCard.finished === 'true' &&
                    isInParty(aCard.memberList, oauth2Id)
                      ? `${aCard.id}/review`
                      : `${aCard.id}`
                  }
                  state={{ background: `/${currentGame}` }}
                  style={{
                    textDecoration: 'none',
                    background: 'fixed',
                    margin: '0 8px 0 0',
                  }}
                >
                  <Card
                    game={currentGame}
                    item={aCard}
                    key={aCard.id}
                    expired={aCard.expired === 'true'}
                  />
                </Link>
              ))}
          </CardsWrapper>
        </MuiBox>
        {cardList && <MuiDivider sx={{ mt: '10px' }} />}
      </CardCarousel>
    </Container>
  );
};

export default FollowCardListContainer;

const Container = styled(MuiContainer)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '0 0 10px 0',
  justifyContent: 'center',
})) as typeof MuiContainer;

const CardCarousel = styled(MuiBox)(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    width: '368px',
  },
  [theme.breakpoints.up('md')]: {
    width: '736px',
  },
  [theme.breakpoints.up('lg')]: {
    width: '1104px',
  },
  [theme.breakpoints.up('xl')]: {
    width: '1104px',
  },
  overflow: 'hidden',
})) as typeof MuiBox;

const Header = styled(MuiBox)(() => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  padding: '10px',
})) as typeof MuiBox;

const Title = styled(MuiTypography)(() => ({
  fontSize: '16px',
  fontWeight: 600,
})) as typeof MuiTypography;

const CardsWrapper = styled(MuiBox)(() => ({
  display: 'flex',
  width: 'max-content',
  transform: 'translateX()',
  transition: 'all ease 1s',
})) as typeof MuiBox;

const DummyCard = styled(MuiBox)(() => ({
  width: '368px',
})) as typeof MuiBox;

const CarouselBtn = styled(MuiButton)(() => ({
  '&:disabled': {
    opacity: '0',
  },
  height: '100%',
  color: '#000000',
  '&:hover': {
    backgroundColor: '#3d393915',
  },
  position: 'absolute',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1100,
  cursor: 'pointer',
  overflow: 'hidden',
})) as typeof MuiButton;
