import React from 'react';

type GameIconProps = {
  item: string;
  size: {
    width: string;
    height: string;
  };
};

const GameIcon = ({ item, size }: GameIconProps) => {
  return (
    <img
      src={`https://d18ghgbbpc0qi2.cloudfront.net/game_icons/${item}.png`}
      alt={`${item}_icon`}
      width={size.width}
      height={size.height}
      loading="lazy"
    />
  );
};

export default GameIcon;
