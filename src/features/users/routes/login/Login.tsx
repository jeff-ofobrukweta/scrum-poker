import React, { useState } from 'react';
import { Button, Card, CardActions, CardContent, CardMedia, Container, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { useLocation } from 'react-router';
import { useHistory } from 'react-router-dom';
import { getRoomRoute } from '../../../poker/room';
import logoUrl from '../../../../assets/images/mt-logo.png';
import { createRoom, joinRoom } from '../../../../api/realtime-db';
import { Roles, User } from '../../types/user';
import { MeActions, useMe } from '../../stores/me';

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export const Login = () => {
  const params = useQuery();
  const [state, dispatch] = useMe()
  const history = useHistory();
  const [roomId, setRoomId] = useState<string>(params.get('roomId') || '');
  const [user, setUser] = useState<User>({
    name: state?.name || "",
    role: state?.role || Roles.PARTICIPANT,
  });

  const handleOnRoomIdChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setRoomId(e.target.value);
  };

  const handleUserChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleRoleChange = (event: SelectChangeEvent) => {
    const { value } = event.target;
    const valueAsRole = value as Roles;
    setUser({ ...user, role: valueAsRole });
  };

  const handleCreateRoom = async () => {
    const newRoomId = await createRoom(user);
    dispatch({ type: MeActions.LOGIN, payload: user })
    history.push(getRoomRoute(newRoomId));
  };

  const handleJoinRoom = async () => {
    if (user.role === Roles.PARTICIPANT) {
      await joinRoom(user, roomId);
    }
    dispatch({ type: MeActions.LOGIN, payload: user })
    history.push(getRoomRoute(roomId));
  };

  return (
    <Container sx={{ minHeight: '100vh' }} maxWidth='xs'>
      <Card sx={{ marginTop: 20 }}>
        <CardMedia sx={{ objectFit: 'contain' }} component='img' height='240' image={logoUrl} />
        <CardContent>
          <TextField sx={{ marginBottom: 1 }} fullWidth name='name' label="Name" value={user.name} onChange={handleUserChange} />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Role</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={user.role}
              label="Age"
              onChange={handleRoleChange}
            >
              <MenuItem value={Roles.HOST}>Host</MenuItem>
              <MenuItem value={Roles.PARTICIPANT}>Participant</MenuItem>
            </Select>
          </FormControl>
        </CardContent>
        <CardActions>
          <Button onClick={handleCreateRoom}>Create</Button>
          <Button onClick={handleJoinRoom}>Join</Button>
          <TextField label="Room" value={roomId} onChange={handleOnRoomIdChange} />
        </CardActions>
      </Card>
    </Container>
  );
};
