export { Room } from './Room';

const BASE_ROUTE = '/room';
export const ROOM_ROUTE = `${BASE_ROUTE}/:roomId`;
export const getRoomRoute = (id: string) => `${BASE_ROUTE}/${id}`;
