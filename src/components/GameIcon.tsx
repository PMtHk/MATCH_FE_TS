import React from 'react';

import { GAME_ID } from 'assets/Games.data';

interface GameIconProps {
  item: string;
  size: {
    width: string;
    height: string;
  };
  id: GAME_ID;
}

const GameIcon = ({ item, size, id }: GameIconProps) => {
  return (
    <img
      id={id}
      src={`https://d18ghgbbpc0qi2.cloudfront.net/game_icons/${item}.png`}
      alt={`${item}_icon`}
      width={size.width}
      height={size.height}
      loading="lazy"
    />
  );
};

export default GameIcon;
