// mui
import { styled } from '@mui/system';
import { InfoOutlined } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

import Nickname from './Nickname';

const AddGame = ({ game }: any) => {
  const getGameLabel = () => {
    if (game === 'lol') return '소환사 명';
    return '플레이어 명';
  };

  return (
    <InfoSection>
      <InfoTitleSection>
        <InfoOutlined />
        <InfoTItle>연결되어있는 정보가 없습니다.</InfoTItle>
      </InfoTitleSection>
      <InfoSubTitle>{`정보를 가져오기 위해 상단에 ${getGameLabel()} 을 입력해 주세요.`}</InfoSubTitle>
    </InfoSection>
  );
};

export default AddGame;

const Container = styled(Box)(() => ({
  height: '100%',
  minHeight: '300px',
  maxHeight: '300px',
  display: 'flex',
  flexDirection: 'column',
})) as typeof Box;

const InfoTItle = styled(Typography)(() => ({
  fontSize: '18px',
  fontWeight: '700',
  color: 'gray',
})) as typeof Typography;

const InfoSubTitle = styled(Typography)(() => ({
  fontSize: '14px',
  color: 'gray',
})) as typeof Typography;

const InfoSection = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '72px',
})) as typeof Box;

const InfoTitleSection = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  height: '30px',
  marginBottom: '8px',
})) as typeof Box;
