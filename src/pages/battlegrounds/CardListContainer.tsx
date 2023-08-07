import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';

import { RootState } from 'store';
import { getCurrentGame } from 'functions/commons';
import { GAME_ID } from 'types/games';
import Card from './Card';

const CardListContainer = () => {
  const currentGame: GAME_ID = getCurrentGame();

  const { pubgCards } = useSelector((state: RootState) => state.card);
  const { pubg: registeredPubgNickname } = useSelector(
    (state: RootState) => state.user.games,
  );

  let cardLength = 0;
  if (pubgCards) {
    cardLength = pubgCards.length;
  }

  const arrayForDummies = new Array(12 - cardLength)
    .fill(0)
    .map((value, i) => `dummies_${i}`);

  return (
    <CardsWrapper>
      {pubgCards &&
        pubgCards.map((aCard: any) => {
          return (
            <Link
              key={aCard.id}
              to={
                aCard.finished === 'true' &&
                aCard.memberList.includes(registeredPubgNickname)
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
  );
};

export default CardListContainer;

const CardsWrapper = styled(MuiBox)(() => ({
  width: '100%',
  minHeight: 'calc(100vh - 386px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  padding: '60px 0 20px 0 ',
  overflowY: 'auto',
})) as typeof MuiBox;

const DummyCard = styled(MuiBox)(() => ({
  width: '368px',
  height: '243px',
})) as typeof MuiBox;
