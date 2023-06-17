import React from 'react';

// mui
import { styled } from '@mui/system';
import Layout from 'components/Layout';
import { SelectChangeEvent } from '@mui/material/Select';
import CardFilter from './CardFilter';

const Main = () => {
  const [boards, setBoards] = React.useState([]);

  const [queueType, setQueueType] = React.useState('ALL');
  const [tier, setTier] = React.useState('ALL');
  const [lane, setLane] = React.useState('ALL');

  const handleQueueType = (event: SelectChangeEvent) => {
    if (event.target.value === 'ARAM') {
      setTier('ALL');
      setLane('ALL');
    }

    if (event.target.value === 'DUO_RANK') {
      setTier('DIAMOND');
    }

    setQueueType(event.target.value);
  };

  const handleTier = (event: SelectChangeEvent) => {
    setTier(event.target.value);
  };

  const handleLane = (
    event: React.MouseEvent<HTMLElement>,
    newLane: string,
  ) => {
    setLane(newLane);
  };

  const filterProps = {
    queueType,
    handleQueueType,
    tier,
    handleTier,
    lane,
    handleLane,
  };

  return (
    <Layout currentGame="lol">
      <CardFilter filterProps={filterProps} />
      <div>main</div>
    </Layout>
  );
};

export default Main;
