import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import MuiIconButton from '@mui/material/IconButton';

import Close from '@mui/icons-material/Close';

import { RootState } from 'store';
import Modal from 'components/Modal';

const CardDetail = () => {
  const navigate = useNavigate();
  const { currentCard } = useSelector((state: RootState) => state.card);

  return (
    <Modal>
      <ModalHeader>
        <Title>{currentCard?.name} 님의 파티</Title>
        <MuiIconButton
          size="small"
          onClick={() => navigate(-1)}
          sx={{ p: 0, m: 0 }}
        >
          <Close />
        </MuiIconButton>
      </ModalHeader>
    </Modal>
  );
};

export default CardDetail;

const ModalHeader = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 0 8px 0',
})) as typeof MuiBox;

const Title = styled(MuiTypography)(() => ({
  fontSize: '24px',
  fontWeight: '700',
})) as typeof MuiTypography;
