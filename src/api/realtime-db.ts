import { VotingStatus } from './../features/poker/room/Room';
import './firebase';
import { child, get, getDatabase, onValue, ref, set, update, remove } from "firebase/database";
import { deleteField } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import { User } from '../features/users/types/user';

const database = getDatabase();

const roomRef = ref(database, 'room/');

export async function createRoom(user: User) {
  const id = uuidv4();
  await set(ref(database, `room/${id}`), {
    id,
    state: VotingStatus.READY,
  });
  return id;
}

export async function leaveRoom(userName: string, roomId: string) {
  const data = await get(ref(database, `room/${roomId}/votes`));
  const votes = data.val();

  await update(ref(database, `room/${roomId}/votes`), {
    [votes.name]: deleteField(),
  });

  const names = Object.keys(votes).filter(name => name !== userName);
  const newVotes = names.reduce((acc, name) => ({
    ...acc,
    [name]: votes[name],
  }), {});

  await set(ref(database, `room/${roomId}/votes`), newVotes);
}

export async function joinRoom(user: User, roomId: string) {
  await update(ref(database, `room/${roomId}/votes`), {
    [user.name]: 0
  });
}

export async function setUserPoints(roomId: string, user: string, point: number) {
  await update(ref(database, `room/${roomId}/votes`), {
    [user]: point
  });
}

export async function setRoomState(roomId: string, state: VotingStatus) {
  await update(ref(database, `room/${roomId}`), {
    state
  });
}

export function getRoomState(roomId: string, callback: Function) {
  const data = ref(database, `room/${roomId}`);

  return onValue(data, (snapshot) => {
    const data = snapshot.val();
    callback && callback(data.state);
  })
}

export function getRoomVotes(roomId: string, callback: Function) {
  const data = ref(database, `room/${roomId}/votes`);

  return onValue(data, (snapshot) => {
    const value = snapshot.val();
    callback && callback(value);
  })
}

export async function resetRoomVotes(roomId: string) {
  const data = await get(ref(database, `room/${roomId}/votes`));
  const votes = data.val() || {};
  const names = Object.keys(votes);
  const newVotes = names.reduce((acc, name) => {
    return {
      ...acc,
      [name]: 0
    };
  }, {});

  await set(ref(database, `room/${roomId}/votes`), newVotes);
}