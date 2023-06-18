import React from 'react';
import { useSelector } from 'react-redux';

import { RootState } from 'store';

// mui
import { styled } from '@mui/system';
import MuiGrid from '@mui/material/Grid';
import MuiFormControl from '@mui/material/FormControl';
import MuiSelect, { SelectChangeEvent } from '@mui/material/Select';
import MuiMenuItem from '@mui/material/MenuItem';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';

import { positionList, queueTypeList, tierList } from './data';

interface CardFilterProps {
  filterProps: {
    queueType: string;
    handleQueueType: (event: SelectChangeEvent) => void;
    tier: string;
    handleTier: (event: SelectChangeEvent) => void;
    lane: string;
    handleLane: (event: React.MouseEvent<HTMLElement>, newLane: string) => void;
  };
}

const CardFilter = ({ filterProps }: CardFilterProps) => {
  const { isLogin } = useSelector((state: RootState) => state.user);

  const { queueType, handleQueueType, tier, handleTier, lane, handleLane } =
    filterProps;

  return (
    <GridContainer container spacing={1}>
      <GridItem item xs={6} sm={6} md={2} lg={1.5}>
        <FormControl size="small">
          <MuiSelect
            id="queue-type-select"
            value={queueType}
            onChange={handleQueueType}
          >
            {queueTypeList.map((item, _) => {
              return (
                <MuiMenuItem key={item.value} value={item.value}>
                  {item.label}
                </MuiMenuItem>
              );
            })}
          </MuiSelect>
        </FormControl>
      </GridItem>
      <GridItem item xs={6} sm={6} md={2} lg={1.5}>
        <FormControl size="small" disabled={queueType === 'ARAM'}>
          <MuiSelect id="tier-type-select" value={tier} onChange={handleTier}>
            {tierList.map((item, index) => {
              if (queueType === 'DUO_RANK') {
                if (index > 3 || index === 0) {
                  return (
                    <MuiMenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MuiMenuItem>
                  );
                }
                return null;
              }
              return (
                <MuiMenuItem key={item.value} value={item.value}>
                  {item.label}
                </MuiMenuItem>
              );
            })}
          </MuiSelect>
        </FormControl>
      </GridItem>
      <GridItem item xs={12} sm={12} md={6} lg={5}>
        <ToggleButtonGroup
          fullWidth
          value={lane}
          onChange={handleLane}
          disabled={queueType === 'ARAM'}
          exclusive
        >
          {positionList.map((item, _) => {
            return (
              <ToggleButton
                key={item.value}
                value={item.value}
                sx={{ height: '40px' }}
              >
                {item.label}
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
      </GridItem>
    </GridContainer>
  );
};

export default CardFilter;

// styled components
const GridContainer = styled(MuiGrid)(({ theme }) => ({
  margin: '0',
  padding: '0  8px 8px 0',
  backgroundColor: '#ffffff',
  border: '1px solid #dddddd',
  borderRadius: '8px',
  width: '95%',
  alignItems: 'center',
  [theme.breakpoints.up('lg')]: {
    width: '1180px',
  },
})) as typeof MuiGrid;

const GridItem = styled(MuiGrid)(() => ({})) as typeof MuiGrid;

const FormControl = styled(MuiFormControl)(() => ({
  width: '100%',
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#ababab', // default
    },
    '&.Mui-focused fieldset': {
      border: '1.5px solid #3d3939', // focus
    },
  },
})) as typeof MuiFormControl;
