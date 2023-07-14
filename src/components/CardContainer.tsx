import React from 'react';

// mui
import styled from '@emotion/styled';
import MuiCard from '@mui/material/Card';
import MuiCardContent from '@mui/material/CardContent';
import MuiBox from '@mui/material/Box';
import MuiDevider from '@mui/material/Divider';

interface CardProps {
  children: React.ReactNode;
}

const CardContainer = ({ children }: CardProps) => {
  return (
    <CardLayout>
      <CardContent>{children}</CardContent>
    </CardLayout>
  );
};

export default CardContainer;

const CardLayout = styled(MuiCard)(() => ({
  width: '360px',
  borderRadius: '8px',
  boxShadow: 'none',
  border: '1px solid #dddddd',
  margin: '0 8px 8px 0',
  '&:hover': {
    boxShadow: '0 0 0 1px #dddddd',
    transform: 'translateY(-1px)',
    transition: 'all 0.1s ease-in-out',
  },
})) as typeof MuiCard;

const CardContent = styled(MuiCardContent)(() => ({
  width: '100%',
  height: '100%',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
})) as typeof MuiCardContent;
