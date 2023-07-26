import React from 'react';
import { useSelector } from 'react-redux';

import { RootState } from 'store';

// mui
import { styled } from '@mui/system';
import MuiGrid from '@mui/material/Grid';
import MuiFormControl from '@mui/material/FormControl';
import MuiSelect, { SelectChangeEvent } from '@mui/material/Select';
import MuiMenuItem from '@mui/material/MenuItem';
import MuiToggleButton from '@mui/material/ToggleButton';

import CreateCardButton from 'components/card-actions/CreateCardBtn';
import { platformList, typeList, tierList } from './data';

interface CardFilterProps {
  filterProps: {
    platform: string;
    handlePlatform: (event: SelectChangeEvent) => void;
    type: string;
    handleType: (event: SelectChangeEvent) => void;
    tier: string;
    handleTier: (event: SelectChangeEvent) => void;
  };
}

const CardFilter = ({ filterProps }: CardFilterProps) => {
  const { isLogin } = useSelector((state: RootState) => state.user);

  const { platform, handlePlatform, type, handleType, tier, handleTier } =
    filterProps;

  return (
    <GridContainer container spacing={1}>
      <GridItem item xs={6} sm={6} md={2} lg={1.5}>
        <FormControl size="small">
          <MuiSelect
            id="platform-select"
            value={platform}
            onChange={handlePlatform}
          >
            {platformList.map((item) => {
              return (
                <MuiMenuItem key={item.value} value={item.value}>
                  {item.label}
                </MuiMenuItem>
              );
            })}
          </MuiSelect>
        </FormControl>
      </GridItem>
      <GridItem item xs={6} sm={6} md={2} lg={1.5} sx={{ minWidth: 160 }}>
        <FormControl size="small">
          <MuiSelect id="type-select" value={type} onChange={handleType}>
            {typeList.map((item) => {
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
        <FormControl size="small">
          <MuiSelect id="tier-select" value={tier} onChange={handleTier}>
            {tierList.map((item) => {
              return (
                <MuiMenuItem key={item.value} value={item.value}>
                  {item.label}
                </MuiMenuItem>
              );
            })}
          </MuiSelect>
        </FormControl>
      </GridItem>
      <GridItem
        item
        xs={2}
        md={4.4}
        lg={5.8}
        sx={{
          display: { xs: 'none', md: 'flex' },
        }}
      />
      {isLogin && (
        <GridItem item xs={12} md={1.5} sx={{ right: '0px' }}>
          <CreateCardButton />
        </GridItem>
      )}
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

const ToggleButton = styled(MuiToggleButton)(({ theme }) => ({
  height: '40px',
  '&.MuiToggleButton-root': {
    fontSize: '12px',
    [theme.breakpoints.up('sm')]: {
      fontSize: '14px',
    },
  },
})) as typeof MuiToggleButton;
