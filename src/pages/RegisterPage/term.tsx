import React from 'react';

// mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CircleCheckedFilled from '@mui/icons-material/CheckCircle';
import CircleUnchecked from '@mui/icons-material/RadioButtonUnchecked';

// mui styled components
import { styled } from '@mui/material/styles';

// data
import { collectionAndUseOfPersonalInformation, termOfUse } from './terms';

const Wrapper = styled(Box)(() => ({
  width: '100%',
  padding: '50px 20px 20px 20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  overflowY: 'auto',
  height: '100%',
}));

const FormControlLabelTypo = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  fontWeight: 600,
  [theme.breakpoints.up('sm')]: {
    fontSize: '22px',
  },
}));

const InnerWrapper = styled(Box)(() => ({
  margin: '15px 15px 20px 0',
}));

const Description = styled(Typography)(({ theme }) => ({
  margin: '0  20px  0 20px',
  fontSize: '14px',
  fontWeight: 400,
  wordBreak: 'break-word',
  [theme.breakpoints.up('sm')]: {
    fontSize: '16px',
  },
}));

const Contents = styled(Box)(() => ({
  margin: '0  0  0 20px',
  width: '100%',
  height: '100%',
  maxHeight: '160px',
  padding: '10px 20px',
  overflowY: 'scroll',
  border: '1px solid #dddddd',
  borderRadius: '8px',
}));

const NextButton = styled(Button)(() => ({
  position: 'relative',
  bottom: '0',
  margin: '0 20px 0 20px',
  width: '95%',
  height: '60px',
  borderRadius: '4px',
  backgroundColor: '#494b4e',
  fontSize: '18px',
  color: '#ffffff',
  '&.Mui-disabled': {
    backgroundColor: '#d1d4db',
  },
}));

const Term = () => {
  const [firstTerm, setFirstTerm] = React.useState(false);
  const [secondTerm, setSecondTerm] = React.useState(false);

  const agreeAllHandler = () => {
    if (firstTerm && secondTerm) {
      setFirstTerm(false);
      setSecondTerm(false);
    } else {
      setFirstTerm(true);
      setSecondTerm(true);
    }
  };

  return (
    <>
      <Wrapper>
        <InnerWrapper>
          <FormControlLabel
            control={
              <Checkbox
                icon={<CircleUnchecked />}
                checkedIcon={<CircleCheckedFilled />}
                checked={firstTerm && secondTerm}
                onClick={agreeAllHandler}
              />
            }
            label={<FormControlLabelTypo>전체 동의하기</FormControlLabelTypo>}
          />
          <Description>
            매치지지 이용약관과 개인정보 수집 및 이용 동의를 포함합니다.
          </Description>
        </InnerWrapper>
        <InnerWrapper>
          <FormControlLabel
            control={
              <Checkbox
                icon={<CircleUnchecked />}
                checkedIcon={<CircleCheckedFilled />}
                checked={firstTerm}
                onClick={() => setFirstTerm(!firstTerm)}
              />
            }
            label={
              <FormControlLabelTypo>매치지지 이용약관</FormControlLabelTypo>
            }
          />
          <Contents>{termOfUse}</Contents>
        </InnerWrapper>
        <InnerWrapper>
          <FormControlLabel
            control={
              <Checkbox
                icon={<CircleUnchecked />}
                checkedIcon={<CircleCheckedFilled />}
                checked={secondTerm}
                onClick={() => setSecondTerm(!secondTerm)}
              />
            }
            label={
              <FormControlLabelTypo>개인정보 수집 및 이용</FormControlLabelTypo>
            }
          />
          <Contents>{collectionAndUseOfPersonalInformation}</Contents>
        </InnerWrapper>
      </Wrapper>
      <NextButton disabled={!firstTerm || !secondTerm}>다음</NextButton>
    </>
  );
};

export default Term;
