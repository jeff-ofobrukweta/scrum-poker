import {  useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import { joinRoom } from '../../../api/realtime-db';
import { useMe } from '../../users/stores/me';
import { Roles } from '../../users/types/user';
import { HostRoom } from './HostRoom';
import { ParticipantRoom } from './ParticipantRoom';

export enum VotingStatus {
  READY = 'ready',
  VOTING = 'in-progress',
  DONE = 'done'
}

export const Room = () => {
  const history = useHistory();
  const { roomId } = useParams<{roomId: string}>();
  const [me] = useMe();
  const [votingStatus, setVotingStatus] = useState(VotingStatus.READY);

  if(!me || !me.name) {
    history.push(`/?roomId=${roomId}`);
  }

  const role = me?.role || Roles.PARTICIPANT;

  useEffect(() => {
    const fn = async () => {
      if (role === Roles.PARTICIPANT) {
        await joinRoom({ name: me?.name || "", role }, roomId);
      }
    }

    fn();
  });

  const handleNextStatus = () => {
    switch (votingStatus) {
      case VotingStatus.READY: return setVotingStatus(VotingStatus.VOTING);
      case VotingStatus.VOTING: return setVotingStatus(VotingStatus.DONE);
      case VotingStatus.DONE: return setVotingStatus(VotingStatus.READY);
    }
  };

  return (
    <>
      {role === Roles.HOST && (
        <HostRoom status={votingStatus} onNext={handleNextStatus} />
      )}
      {role === Roles.PARTICIPANT && (
        <ParticipantRoom status={votingStatus} />
      )}
    </>
  );
};
