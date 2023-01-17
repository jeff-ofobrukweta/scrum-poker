import { Container, Grid, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import { getRoomState, leaveRoom } from '../../../api/realtime-db';
import { useMe } from '../../users/stores/me';
import { StoryPointCard } from '../components/story-point-card';
import { STORY_POINTS } from '../utils/constants';
import { VotingStatus } from './Room';

interface ParticipantRoomProps {
  status: VotingStatus;
}

export const ParticipantRoom: React.FC<ParticipantRoomProps> = ({ status }) => {
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null)
  const history = useHistory();
  const { roomId } = useParams<{ roomId: string }>();
  const [roomState, setRoomState] = useState<VotingStatus>(VotingStatus.READY);
  const [me] = useMe();

  useEffect(() => {
    getRoomState(roomId, (data: VotingStatus) => {
      setRoomState(data)
    });
  }, []);

  useEffect(() => {
    setSelectedPoint(null);
  }, [roomState]);

  const hadleChangeName = async () => {
    if (me) {
      await leaveRoom(me.name, roomId);
    }
    history.push(`/?roomId=${roomId}`);
  };

  const handleSelectedPoint = (point: number) => setSelectedPoint(point);

  return (
    <Container sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <h2>Name: <b>{me?.name}</b> <a href="#" onClick={hadleChangeName} style={{ fontSize: "0.5em" }}>change</a></h2>
      <Grid container spacing={2} sx={{ marginTop: 50 }}>
        {STORY_POINTS.map((points => (
          <Grid item xs={3}>
            <StoryPointCard
              key={points}
              number={points}
              show
              disabled={roomState !== VotingStatus.VOTING}
              isSelected={selectedPoint === points}
              onSelectPoint={handleSelectedPoint}
            />
          </Grid>
        )))}
      </Grid>
    </Container>
  );
};
