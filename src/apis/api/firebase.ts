import { useDispatch, useSelector } from 'react-redux';
import {
  ref,
  child,
  get,
  getDatabase,
  update,
  set,
  push,
  DatabaseReference,
} from 'firebase/database';
import { notificationActions } from 'store/notification-slice';
import { useEffect, useState } from 'react';
import { promiseWrapper } from 'apis/utils/promiseWrapper';
import { RootState } from '../../store';

import { chatroomActions } from '../../store/chatroom-slice';

type Member = {
  nickname: string;
  oauth2Id: string;
  notiToken: string;
  isReviewed: boolean;
};
/** ------------------------------------------------------------
 * 채팅방 차단 여부 확인
 * @param {string} chatRoomId - 채팅방 아이디
 * @param {string} oauth2Id - 사용자 oauth2Id
 * @return {boolean} - 해당 채팅방의 요청자 차단 여부
 *
 * 해당 채팅방의 차단 목록을 조회하고, 요청자가 차단되어있는지 확인한다.
 * 차단되어있다면 true, 아니면 false를 반환한다.
 */

export const isBanned = async (chatRoomId: string, oauth2Id: string) => {
  const chatRoomRef = ref(getDatabase(), 'chatRooms');

  let banned = false;

  await get(child(chatRoomRef, chatRoomId)).then((datasnapshot) => {
    const bannedList = datasnapshot.val().bannedList
      ? datasnapshot.val().bannedList
      : [];
    const bannedOauth2IdList = bannedList.map(
      (member: Member) => member.oauth2Id,
    );
    if (bannedOauth2IdList.includes(oauth2Id)) {
      banned = true;
    }
  });
  return banned;
};

/**
 * firebaseDB 내 멤버 추가
 * @param newMember 새로운 멤버 객체
 * @param chatRoomId 채팅방 아이디
 * @param dispatch - redux dispatch
 * @returns null
 *
 * 채팅방에 새로운 멤버를 추가한다.
 * 채팅방의 멤버 목록에 새로운 멤버를 추가하고,
 * 채팅방에 참가했다는 시스템 메시지를 전송한다.
 */

export const addMemberToFirebaseDB = async (
  newMember: Member,
  chatRoomId: string,
  dispatch: ReturnType<typeof useDispatch>,
) => {
  const chatRoomsRef = ref(getDatabase(), 'chatRooms');
  const messagesRef = ref(getDatabase(), 'messages');

  const dataSnapshot = await get(child(chatRoomsRef, chatRoomId));

  const prevMemberList = [];
  prevMemberList.push(...dataSnapshot.val().memberList);
  const joinedMemberList = [...prevMemberList, newMember];

  // update memberList in firebase DB - chatRooms
  await update(ref(getDatabase(), `chatRooms/${chatRoomId}`), {
    memberList: joinedMemberList,
  });

  const lastReadRef = ref(getDatabase(), 'lastRead');

  await set(
    child(lastReadRef, `${newMember.oauth2Id}/${chatRoomId}`),
    Date.now(),
  );

  await set(push(child(messagesRef, chatRoomId)), {
    type: 'system',
    timestamp: Date.now(),
    user: {
      nickname: 'system',
      oauth2Id: '',
      notitoken: '',
    },
    content: `${newMember.nickname} 님이 참가하였습니다.`,
  });

  dispatch(chatroomActions.ADD_JOINED_CHATROOMS_ID(chatRoomId));

  return null;
};

/**
 * firebaseDB 내 멤버 삭제
 * @param targetMember
 * @param chatRoomId
 * @param chatRoomsRef
 * @param messagesRef
 * @param {ReturnType<typeof useDispatch>}dispatch
 * @returns null
 *
 * 채팅방에서 멤버를 삭제한다.
 * 채팅방의 멤버 목록에서 타겟 멤버를 삭제하고,
 * 채팅방에 퇴장했다는 시스템 메시지를 전송한다.
 */

export const removeMemberFromFirebaseDB = async (
  targetMember: Member,
  chatRoomId: string,
  chatRoomsRef: DatabaseReference,
  messagesRef: DatabaseReference,
  dispatch: ReturnType<typeof useDispatch>,
) => {
  const dataSnapshot = await get(
    child(chatRoomsRef, `${chatRoomId}/memberList`),
  );

  const prevMemberList = [...dataSnapshot.val()];
  const newMemberList = prevMemberList.filter((member: Member) => {
    return member.oauth2Id !== targetMember.oauth2Id;
  });

  await update(ref(getDatabase(), `chatRooms/${chatRoomId}`), {
    memberList: newMemberList,
  });

  await set(push(child(messagesRef, chatRoomId)), {
    type: 'system',
    timestamp: Date.now(),
    user: {
      nickname: 'system',
      oauth2Id: '',
      notiToken: '',
    },
    content: `${targetMember.nickname} 님이 퇴장하였습니다.`,
  });

  dispatch(chatroomActions.LEAVE_JOINED_CHATROOMS_ID(chatRoomId));

  return null;
};

/**
 * 채팅방 삭제 여부 확인
 * @param chatRoomId 채팅방 아이디
 * @param chatRoomsRef 채팅방 레퍼런스
 * @returns 'false' | 'true' string - 채팅방 삭제 여부
 *
 * 채팅방의 isDeleted를 조회하여 삭제 여부를 확인한다.
 */

export const getIsDeleted = async (
  chatRoomId: string,
  chatRoomsRef: DatabaseReference,
) => {
  const dataSnapshot = await get(child(chatRoomsRef, chatRoomId));

  return dataSnapshot.val().isDeleted;
};

/**
 * 사용자의 해당 채팅방 마지막 읽은 시간 업데이트
 * @param oauth2Id 사용자 oauth2Id
 * @param chatRoomId 채팅방 아이디
 * @param timeStamp 타임스탬프
 * @returns null
 *
 * 사용자의 해당 채팅방 마지막 읽은 시간을 업데이트한다.
 */

export const updateALastRead = async (
  oauth2Id: string,
  chatRoomId: string,
  timeStamp: number,
) => {
  const lastReadRef = ref(getDatabase(), 'lastRead');

  await set(child(lastReadRef, `${oauth2Id}/${chatRoomId}`), timeStamp);
  return null;
};

/**
 * 사용자의 모든 채팅방 마지막 읽은 시간 업데이트
 * @param oauth2Id 사용자 oauth2Id
 * @param joinedChatRoomsId 사용자가 참여한 채팅방 아이디 목록
 * @returns null
 *
 * 사용자의 모든 채팅방 마지막 읽은 시간을 업데이트한다.
 */

export const updateLastReads = async (
  oauth2Id: string,
  joinedChatRoomsId: string[],
) => {
  const lastReadRef = ref(getDatabase(), 'lastRead');

  joinedChatRoomsId.forEach(async (chatRoomId) => {
    await set(child(lastReadRef, `${oauth2Id}/${chatRoomId}`), Date.now());
  });

  return null;
};

/**
 * 채팅방 정보 가져오기
 * @param chatRoomId 채팅방 아이디
 * @param chatRoomsRef 채팅방 레퍼런스
 * @returns 채팅방 정보
 *
 * 채팅방 정보를 가져온다.
 */

export const getAChatRoomInfo = async (
  chatRoomId: string,
  chatRoomsRef: DatabaseReference,
) => {
  const dataSnapshot = await get(child(chatRoomsRef, chatRoomId));

  return dataSnapshot.val();
};

export const getAllLastReads = async (
  oauth2Id: string,
  chatRoomList: string[],
  dispatch: ReturnType<typeof useDispatch>,
) => {
  const lastReadRef = ref(getDatabase(), 'lastRead');

  chatRoomList.map(async (chatRoomId) => {
    const dataSnapshot = await get(
      child(lastReadRef, `${oauth2Id}/${chatRoomId}`),
    );

    dispatch(
      notificationActions.SET_TIMESTAMPS({
        chatRoomId,
        timestamp: dataSnapshot.val(),
      }),
    );
  });

  return null;
};

// 추가됨
export const getIsReviewed = (oauth2Id: string, chatRoomId: string) => {
  const chatRoomsRef = ref(getDatabase(), 'chatRooms');

  const [resource, setResource] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const promise = get(child(chatRoomsRef, chatRoomId)).then(
        (dataSnapshot) => {
          return dataSnapshot.val().memberList.find((member: Member) => {
            return member.oauth2Id === oauth2Id;
          }).isReviewed;
        },
      );

      setResource(promiseWrapper(promise));
    };

    getData();
  }, []);

  return resource;
};

export const asyncGetIsReviewed = async (
  oauth2Id: string,
  chatRoomId: string,
) => {
  const chatRoomsRef = ref(getDatabase(), 'chatRooms');

  const isReviewed = await get(child(chatRoomsRef, chatRoomId)).then(
    (dataSnapshot) => {
      return dataSnapshot
        .val()
        .memberList.find((member: Member) => member.oauth2Id === oauth2Id)
        .isReviewed;
    },
  );

  return isReviewed;
};

/**
 * 파이어베이스의 isReviewed 핸들링 함수
 * @param oauth2Id 사용자의 oauth2id
 * @param chatRoomId 해당 파티의 채팅방 Id
 */
export const doReview = async (oauth2Id: string, chatRoomId: string) => {
  const chatRoomsRef = ref(getDatabase(), 'chatRooms');

  const dataSnapshot = await get(
    child(chatRoomsRef, `${chatRoomId}/memberList`),
  );

  const prevMemberList = [...dataSnapshot.val()];
  const newMemberList = prevMemberList.map((member: Member) => {
    if (member.oauth2Id === oauth2Id) {
      const temp = member;
      temp.isReviewed = true;
      return temp;
    }
    return member;
  });

  await update(ref(getDatabase(), `chatRooms/${chatRoomId}`), {
    memberList: newMemberList,
  });
};

/**
 * 리뷰에 필요한 필터링된 멤버리스트 반환 함수
 * @param chatRoomId 해당 파티의 채팅방 id
 * @param oauth2Id 사용자의 oauth2Id
 * @returns 필터링된 멤버의 닉네임을 담고있는 배열
 */
export const getFilteredMemberListForReview = async (
  chatRoomId: string,
  oauth2Id: string,
) => {
  const chatRoomRef = ref(getDatabase(), 'chatRooms');

  const data = await get(child(chatRoomRef, `${chatRoomId}/memberList`));

  const prevMemberList = [...data.val()];
  const filteredMemberList = prevMemberList.filter(
    (member) => member.oauth2Id.length > 0 && member.oauth2Id !== oauth2Id,
  );

  const result = filteredMemberList.map((member) => member.nickname);
  return result;
};
