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

// 방장이 아닌 유저
const DefaultEmptySlot = () => {
  return (
    <EmptySlotWrapper>
      <ErrorOutlineIcon />
      <EmptySlotTypo>모집 중</EmptySlotTypo>
    </EmptySlotWrapper>
  );
};

// 방장
const EmptySlotForAuthor = ({ platform }: any) => {
  const { currentCard } = useSelector((state: RootState) => state.card);
  // 추가하기 버튼과 닉네임 입력창을 전환할 state
  const [isEntering, setIsEntering] = useState(false);

  // 추가할 사용자의 nickname, 핸들러 함수
  const [name, setName] = useState('');

  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  // 닉네임 인증 요청시 인증중(loading) 상태를 관리하는 state
  const [isLoading, setIsLoading] = useState(false);

  // 추가할 멤버의 닉네임 입력 후 추가하기 버튼 클릭시 호출할 함수
  const addPartyMember = async () => {
    setIsLoading(true);

    const handleErrorInAdding = () => {
      alert(
        '파티원을 추가하는 과정에서 문제가 발생하였습니다.\n다시 시도해주시기 바랍니다.',
      );
      setName('');
      setIsEntering(false);
      setIsLoading(false);
    };

    await defaultAxios
      // 닉네임 인증 여부 검증
      .get(`/api/pubg/user/exist/${name}/${platform}`)
      .then(async (response) => {
        if (response.status === 200) {
          const certifyedNickname = response.data;
          await defaultAxios
            // 배그 계정 정보 최신화 및 DB 저장
            .get(`/api/pubg/user/${certifyedNickname}`)
            .then(async (response) => {
              if (response.status === 200) {
                await authAxios
                  // 채팅방 입장
                  .post(`/api/pubg/user/${certifyedNickname}`)
                  .then((response) => {
                    if (response.status === 200) {
                      // 최종 성속
                      setIsLoading(false);
                      setIsEntering(false);
                      setName('');
                      window.location.reload();
                    }
                  });
              } else {
                handleErrorInAdding();
              }
            });
        } else {
          handleErrorInAdding();
        }
      })
      .catch((error) => {
        console.log(error);
        handleErrorInAdding();
      });
  };

  return (
    <EmptySlotWrapper>
      {isEntering ? (
        <OutlinedInput
          placeholder="플레이어 이름을 입력해주세요."
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
          sx={{ width: '100%', height: '100%' }}
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
  const isAuthor = oauth2Id === currentCard.oauth2ID;

  return isAuthor ? <EmptySlotForAuthor /> : <DefaultEmptySlot />;
};

export default EmptySlot;

const EmptySlotWrapper = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 80,
  width: 520,
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
