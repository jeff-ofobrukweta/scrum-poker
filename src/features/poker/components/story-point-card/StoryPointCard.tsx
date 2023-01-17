import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import React from 'react';
import { useParams } from 'react-router';
import { setUserPoints } from '../../../../api/realtime-db';
import { useMe } from '../../../users/stores/me';
import { Roles } from '../../../users/types/user';

interface Props {
  number: number,
  name?: string,
  show: boolean;
  disabled?: boolean;
  isSelected?: boolean;
  onSelectPoint?: (number: number) => void;
}

export const StoryPointCard: React.FC<Props> = ({
  number,
  name,
  show = true,
  disabled = false,
  isSelected = false,
  onSelectPoint,
}) => {
  const [me] = useMe();
  const { roomId } = useParams<{ roomId: string }>();

  const handleClick = (
    value: number
  ): React.MouseEventHandler<HTMLButtonElement> => () => {
    if (me?.role === Roles.PARTICIPANT) {
      setUserPoints(roomId, String(me?.name), value);

      if (onSelectPoint) {
        onSelectPoint(value);
      }
    }
  };

  const numberLabel = show ? (number === -1 ? '??' : number) : '?';
  const voteColor = !show && !!number ? 'success' : 'primary';
  const color = isSelected ? 'success' : voteColor;

  return (
    <div style={{ marginBottom: '15px' }}>
      <Card sx={{ maxWidth: 345, minWidth: 100 }}>
        <Button
          variant="contained"
          onClick={handleClick(number)}
          sx={{ height: 100, width: '100%', marginRight: 4, fontSize: 32 }}
          disabled={disabled}
          color={color}
        >
          {numberLabel}
        </Button>
        {name && (
          <CardContent>
            <Typography gutterBottom variant="h6" component="div" style={{ width: '70px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
              {name}
            </Typography>
          </CardContent>
        )}
      </Card>
    </div>
  );
};