import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ref, getDatabase, get, update, child } from 'firebase/database';

import { authAxios, defaultAxios } from 'apis/utils';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import MuiIconButton from '@mui/material/IconButton';
import MuiImageList from '@mui/material/ImageList';

import Close from '@mui/icons-material/Close';

import { RootState } from 'store';

import Circular from 'components/loading/Circular';
import { platformList, tierList } from './data';

interface MemberSlotProps {
  name: string;
}

const MemberSlot = ({ name }: MemberSlotProps) => {
  const { oauth2Id } = useSelector((state: RootState) => state.user);
  const { currentCard } = useSelector((state: RootState) => state.card);

  const [memberInfo, setMemberInfo] = React.useState<any>({});
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  // author info
  const tier = tierList.find((aTier) => aTier.value === memberInfo?.tier);

  // const totalPlayed = memberInfo?.wins + memberInfo?.losses;
  // const winRate = Math.round((memberInfo.wins / totalPlayed) * 100);

  const isAuthor = oauth2Id === currentCard?.author?.oauth2Id;

  // const rankRomanToNum = (rank: string) => {
  //   switch (rank) {
  //     case 'I':
  //       return 1;
  //     case 'II':
  //       return 2;
  //     case 'III':
  //       return 3;
  //     case 'IV':
  //       return 4;
  //     default:
  //       return 4;
  //   }
  // };

  useEffect(() => {
    const fetchPubgPlayerInfo = async () => {
      await defaultAxios
        .get(
          `/api/pubg/player/${name}/${currentCard.platform}/${currentCard.type}`,
        )
        .then((res) => {
          setMemberInfo(res.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
    };

    fetchPubgPlayerInfo();
  }, []);

  const kickMember = async () => {
    await authAxios
      .delete(`/api/chat/pubg/${currentCard?.id}/${name}/ban`)
      .then(async (response) => {
        if (response.status === 200) {
          // Firebase RealtimeDB의 memberList에서 제거 및 banList에 추가
          const chatRoomRef = ref(getDatabase(), 'chatRooms');

          await get(child(chatRoomRef, currentCard?.chatRoomId)).then(
            async (dataSnapshot) => {
              const prevMemberList = [...dataSnapshot.val().memberList];
              const target = prevMemberList.find(
                (member) => member.nickname === name,
              );
              if (!target) {
                return window.location.reload();
              }
              const prevBannedList = dataSnapshot.val().bannedList
                ? [...dataSnapshot.val().bannedList]
                : [];
              const newMemberList = prevMemberList.filter(
                (member) => member.nickname !== name,
              );
              const newBannedList = [...prevBannedList, target];
              await update(
                ref(getDatabase(), `chatRooms/${currentCard?.chatRoomId}`),
                {
                  memberList: newMemberList,
                  bannedList: newBannedList,
                },
              ).then(() => {
                window.location.reload();
              });
              return null;
            },
          );
        }
      });
  };
  return (
    <>
      {isLoading && (
        <Member>
          <Circular text="" height="100%" />
        </Member>
      )}
      {!isLoading && (
        <Member>
          <SectionInMember>
            <SectionTitleInMember>닉네임</SectionTitleInMember>
            <Nickname>{memberInfo?.name}</Nickname>
          </SectionInMember>
          <SectionInMember>
            <SectionTitleInMember>RP</SectionTitleInMember>
            <MemberInfoTypo>
              {memberInfo.tier === 'None' ? '정보 없음' : '계산값'}
            </MemberInfoTypo>
          </SectionInMember>
          <SectionInMember>
            <SectionTitleInMember>K/D</SectionTitleInMember>
            <MemberInfoTypo>
              {memberInfo.kills === 0
                ? 0
                : (memberInfo.kills / memberInfo.deaths).toFixed(2)}
            </MemberInfoTypo>
          </SectionInMember>
          <SectionInMember>
            <SectionTitleInMember>평균 데미지</SectionTitleInMember>
            <MemberInfoTypo>{memberInfo.avgDmg}</MemberInfoTypo>
          </SectionInMember>
          <SectionInMember>
            <SectionTitleInMember>Top 1</SectionTitleInMember>
            <MemberInfoTypo>{memberInfo.wins}</MemberInfoTypo>
          </SectionInMember>
          <SectionInMember>
            <SectionTitleInMember>Top 10</SectionTitleInMember>
            <MemberInfoTypo>{memberInfo.top10}</MemberInfoTypo>
          </SectionInMember>
          <MemberControlPanel>
            {isAuthor && currentCard?.name !== name && (
              <MuiIconButton
                onClick={() => {
                  //
                }}
              >
                <Close />
              </MuiIconButton>
            )}
          </MemberControlPanel>
        </Member>
      )}
    </>
  );
};

export default MemberSlot;

const Member = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '520px',
  height: '80px',
  border: '1px solid #cccccc',
  borderRadius: '8px',
  padding: '8px',
  margin: '0 0 4px 0',
})) as typeof MuiBox;

const SectionInMember = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'column',
})) as typeof MuiBox;

const SectionTitleInMember = styled(MuiTypography)(() => ({
  color: '#878888',
  fontSize: '12px',
  fontWeight: '700',
})) as typeof MuiTypography;

const Nickname = styled(MuiTypography)(() => ({
  fontSize: '16px',
  fontWeight: '700',
  minWidth: '120px',
  textOverflow: 'ellipsis',
})) as typeof MuiTypography;

const FlexRow = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
})) as typeof MuiBox;

const MemberControlPanel = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '30px',
})) as typeof MuiBox;

const MemberInfoTypo = styled(MuiTypography)(() => ({
  fontSize: '14px',
  fontWeight: ' bold',
}));
