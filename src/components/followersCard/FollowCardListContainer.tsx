import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';

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

  const { oauth2Id } = useSelector((state: RootState) => state.user);

  const { followCards } = useSelector((state: RootState) => state.card);

  let cardLength = 0;

  if (followCards) {
    cardLength = followCards.length;
  }

  const arrayForDummies = new Array(3 - cardLength)
    .fill(0)
    .map((value, i) => `dummies_${i}`);

  return (
    <>
      {followCards && (
        <Header>
          <Title>팔로우한 사용자들의 새 게시글</Title>
        </Header>
      )}
      <CardsWrapper>
        {followCards &&
          followCards.map((aCard: any) => {
            return (
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
                  margin: '0 8px 8px 0',
                }}
              >
                <Card
                  game={currentGame}
                  item={aCard}
                  key={aCard.id}
                  expired={aCard.expired === 'true'}
                />
              </Link>
            );
          })}
        {arrayForDummies.map((item) => (
          <DummyCard key={item} />
        ))}
      </CardsWrapper>
    </>
  );
};

export default FollowCardListContainer;

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
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  padding: '0 0 10px 0',
})) as typeof MuiBox;

const DummyCard = styled(MuiBox)(() => ({
  width: '368px',
})) as typeof MuiBox;
