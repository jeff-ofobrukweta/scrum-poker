import { Button, ButtonGroup, Container, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getRoomVotes, resetRoomVotes, setRoomState } from '../../../api/realtime-db';
import { StoryPointCard } from '../components/story-point-card';
import { Vote } from '../types/vote';
import { VotingStatus } from './Room';

interface HostRoomProps {
	status: VotingStatus;
	onNext: React.MouseEventHandler<HTMLButtonElement>;
}

export const HostRoom: React.FC<HostRoomProps> = () => {
	const { roomId } = useParams<{ roomId: string }>();

	const [votes, setVotes] = useState<Vote[]>([]);
	const [votingStatus, setVotingStatus] = useState<VotingStatus>(VotingStatus.READY);
	const voteLabel = votingStatus !== VotingStatus?.VOTING ? 'Vote' : 'Stop';

	const handleVote = () => {
		if (votingStatus === VotingStatus.DONE) {
			resetRoomVotes(roomId);
		}

		const votingState = votingStatus !== VotingStatus.VOTING ? VotingStatus.VOTING : VotingStatus.DONE;

		setVotingStatus(votingState);
		setRoomState(roomId, votingState);
	};

	useEffect(() => {
		setRoomState(roomId, VotingStatus.READY);
		resetRoomVotes(roomId);

		getRoomVotes(roomId, (data: any) => {
			if (!data) {
				setVotes([]);
				return;
			}

			const votes = Object.keys(data)
				.filter(key => key !== 'undefined')
				.map(vote => ({ user: vote, points: data[vote] }));

			setVotes(votes);
		});
	}, []);

	return (
		<Container sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
			<ButtonGroup disableElevation variant="contained">
				<Button onClick={handleVote}>{voteLabel}</Button>
			</ButtonGroup>

			{votingStatus === VotingStatus.READY && <p>Press button VOTE to start voting!</p>}
			{!votes.length && votingStatus === VotingStatus.VOTING && <p>Voting..</p>}

			<Stack spacing={2} direction="row" flexWrap="wrap" justifyContent="center" sx={{ marginTop: 20 }}>
				{votes.map(vote => (
					<StoryPointCard
						key={vote.user}
						number={vote.points}
						name={vote.user}
						show={votingStatus === VotingStatus.DONE}
						disabled={!vote.points}
					/>
				))}
			</Stack>
		</Container>
	);
};
