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
import { RootState } from '../../store';

import { chatroomActions } from '../../store/chatroom-slice';

type Member = {
  nickname: string;
  oauth2Id: string;
  notiToken: string;
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
    user: newMember,
    content: `${newMember.nickname} 님이 참가하였습니다.`,
  });

  dispatch(chatroomActions.ADD_JOINED_CHATROOMS_ID(chatRoomId));
};

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
      nickname: targetMember.nickname,
      oauth2Id: targetMember.oauth2Id,
    },
    content: `${targetMember.nickname} 님이 퇴장하였습니다.`,
  });

  dispatch(chatroomActions.LEAVE_JOINED_CHATROOMS_ID(chatRoomId));
};

export const getIsDeleted = async (
  chatRoomId: string,
  chatRoomsRef: DatabaseReference,
) => {
  const dataSnapshot = await get(child(chatRoomsRef, chatRoomId));

  return dataSnapshot.val().isDeleted;
};

export const updateALastRead = async (
  oauth2Id: string,
  chatRoomId: string,
  timeStamp: number,
) => {
  const lastReadRef = ref(getDatabase(), 'lastRead');

  await set(child(lastReadRef, `${oauth2Id}/${chatRoomId}`), timeStamp);
  return null;
};

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
