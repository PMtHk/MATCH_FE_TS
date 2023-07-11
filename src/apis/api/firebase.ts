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

export const isBanned = async (
  chatRoomId: string,
  oauth2Id: string,
  chatRoomRef: DatabaseReference,
) => {
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
  oauth2Id: string,
  nickname: string,
  chatRoomsRef: DatabaseReference,
  messagesRef: DatabaseReference,
  dispatch: ReturnType<typeof useDispatch>,
) => {
  const dataSnapshot = await get(child(chatRoomsRef, chatRoomId));

  const prevMemberList = [];
  prevMemberList.push(...dataSnapshot.val().memberList);
  const joinedMemberList = [...prevMemberList, newMember];

  // update memberList in firebase DB - chatRooms
  await update(ref(getDatabase(), `chatRooms/${chatRoomId}`), {
    memberList: joinedMemberList,
  });

  const lastReadRef = ref(getDatabase(), 'lastRead');

  await set(child(lastReadRef, `${oauth2Id}/${chatRoomId}`), Date.now());
  await set(push(child(messagesRef, chatRoomId)), {
    type: 'system',
    timestamp: Date.now(),
    user: {
      nickname,
      oauth2Id,
    },
    content: `${nickname} 님이 참가하였습니다.`,
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
  const newMemberList = prevMemberList.filter((member) => {
    return member.oAuth2Id !== targetMember.oauth2Id;
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
