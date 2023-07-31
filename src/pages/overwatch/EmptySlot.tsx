import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { authAxios, defaultAxios } from 'apis/utils';
import { RootState } from 'store';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import { Button, OutlinedInput, CircularProgress } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// 방장이 아닌 사용자의 경우
const DefaultEmptySlot = () => {
  return (
    <EmptySlotWrapper>
      <ErrorOutlineIcon />
      <EmptySlotTypo>모집 중</EmptySlotTypo>
    </EmptySlotWrapper>
  );
};

// 방장의 경우
const EmptySlotForAuthor = () => {
  const { currentCard } = useSelector((state: RootState) => state.card);
  // 추가하기 버튼과 닉네임 입력창을 전환할 state
  const [isEntering, setIsEntering] = useState(false);

  // 추가할 사용자의 nickname, 핸들러 함수
  const [name, setName] = useState('');

  const handleName = (e: any) => {
    setName(e.target.value);
  };

  // 닉네임 인증 요청시 인증중(loading) 상태를 관리하는 state
  const [isLoading, setIsLoading] = useState(false);

  // 추가할 멤버의 닉네임 입력 후 추가하기 버튼 클릭시 호출할 함수
  const addPartyMember = async () => {
    setIsLoading(true);

    const nickAndTag = name.trim().split('#');

    await defaultAxios
      // 오버워치 계정 존재 여부 전송
      .get(`/api/overwatch/user/exist/${nickAndTag[0]}%23${nickAndTag[1]}`)
      .then(async (response) => {
        if (response.status === 200) {
          await defaultAxios
            // 오버워치계정 정보 최신화 및 DB 저장
            .get(`/api/overwatch/user/${nickAndTag[0]}%23${nickAndTag[1]}`)
            .then(async (response) => {
              if (response.status === 200) {
                await authAxios
                  // 채팅방? 파티? 입장 요청
                  .post(
                    `/api/chat/overwatch/${currentCard?.id}/${nickAndTag[0]}%23${nickAndTag[1]}`,
                  )
                  .then((response) => {
                    if (response.status === 200) {
                      // 최종 성공
                      setIsLoading(false);
                      setIsEntering(false);
                      setName('');
                      // eslint-disable-next-line no-restricted-globals
                      location.reload();
                    }
                  });
              }
            });
        }
      })
      .catch((error: any) => {
        // eslint-disable-next-line no-alert
        alert(
          '파티원을 추가하는 과정에서 문제가 발생하였습니다. \n 잠시 후 다시 시도해주시기 바랍니다.',
        );
        setName('');
        setIsEntering(false);
        setIsLoading(false);
      });
  };

  return (
    <EmptySlotWrapper>
      {isEntering ? (
        <OutlinedInput
          placeholder="소환사 명을 입력하세요"
          autoFocus
          sx={{
            width: '100%',
            height: '100%',
          }}
          value={name}
          onChange={handleName}
          disabled={!!isLoading}
          endAdornment={
            isLoading ? (
              <CircularProgress size={24} />
            ) : (
              <Button size="small" onClick={addPartyMember}>
                추가하기
              </Button>
            )
          }
        />
      ) : (
        <Button
          sx={{
            width: '100%',
            height: '100%',
          }}
          onClick={() => setIsEntering(true)}
        >
          파티원 추가하기
        </Button>
      )}
    </EmptySlotWrapper>
  );
};

const EmptySlot = () => {
  const { oauth2Id } = useSelector((state: RootState) => state.user);
  const { currentCard } = useSelector((state: RootState) => state.card);
  const isAuthor = oauth2Id === currentCard.oauth2Id;

  return isAuthor ? <EmptySlotForAuthor /> : <DefaultEmptySlot />;
};

export default EmptySlot;

const EmptySlotWrapper = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 90,
  width: 600,
  backgroundColor: '#d8d8d8c8',
  color: '#5C5C5C',
  border: '1px solid #CCCCCC',
  borderRadius: '8px',
  padding: '16px',
  margin: '0 0 4px 0',
})) as typeof MuiBox;

const EmptySlotTypo = styled(MuiTypography)(() => ({
  fontSize: 16,
  fontWeight: 600,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  margin: '0 0 0 8px',
})) as typeof MuiTypography;
