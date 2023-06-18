import React from 'react';
import CountDown from 'react-countdown';

// mui
import MuiTypography from '@mui/material/Typography';

const expiredTime = {
  FIFTEEN_M: 15 * 60 * 1000,
  THIRTY_M: 30 * 60 * 1000,
  ONE_H: 60 * 60 * 1000,
  TWO_H: 2 * 60 * 60 * 1000,
  THREE_H: 3 * 60 * 60 * 1000,
  SIX_H: 6 * 60 * 60 * 1000,
  TWELVE_H: 12 * 60 * 60 * 1000,
  TWENTY_FOUR_H: 24 * 60 * 60 * 1000,
};

export type EXPIRE_TYPE =
  | 'FIFTEEN_M'
  | 'THIRTY_M'
  | 'ONE_H'
  | 'TWO_H'
  | 'THREE_H'
  | 'SIX_H'
  | 'TWELVE_H'
  | 'TWENTY_FOUR_H';

interface TimerProps {
  created: string;
  expire: EXPIRE_TYPE;
}

const Timer = ({ created, expire }: TimerProps) => {
  const year = parseInt(created.substring(0, 4), 10);
  const month = parseInt(created.substring(5, 7), 10);
  const day = parseInt(created.substring(8, 10), 10);
  const hour = parseInt(created.substring(11, 13), 10);
  const minute = parseInt(created.substring(14, 16), 10);
  const second = parseInt(created.substring(17, 19), 10);

  const createdDate = new Date(year, month - 1, day, hour, minute, second);

  const remainingTime =
    createdDate.getTime() + expiredTime[expire] - Date.now();
  const renderer = ({ hours, minutes, seconds, completed }: any) => {
    return (
      <MuiTypography sx={{ fontSize: '14px', fontWeight: '700' }}>
        {completed && '만료됨'}
        {!completed && hours && `${hours}시간 남음`}
        {!completed && !hours && minutes && `${minutes}분 남음`}
        {!completed && !hours && !minutes && seconds && `${seconds}초 남음`}
      </MuiTypography>
    );
  };

  return <CountDown date={Date.now() + remainingTime} renderer={renderer} />;
};

export default Timer;
