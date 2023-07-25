import React from 'react';

import { GAME_ID, gameList, GAME } from 'assets/Games.data';

interface GameIconProps {
  item: string;
  size: {
    width: string;
    height: string;
  };
  id: GAME_ID;
}

const GameIcon = ({ item, size, id }: GameIconProps) => {
  const gameResult = gameList.find((game) => game.id === id);
  const gameInfo = gameResult as GAME;

  return (
    <img
      id={id}
      src={gameInfo.image_url}
      alt={gameInfo.name_kor}
      width={size.width}
      height={size.height}
      loading="lazy"
    />
  );
};

export default GameIcon;
