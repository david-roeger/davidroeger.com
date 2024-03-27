import supabase from '$utils/Db/supabase';
import type {
	RealtimePresenceJoinPayload,
	RealtimePresenceLeavePayload,
	RealtimePresenceState
} from '@supabase/supabase-js';

export const REALTIME_COOKIE_NAME = 'realtime_id';
export const REALTIME_CHANNEL_NAME = 'cursor';

export type CursorType = {
	type: 'mount' | 'cursor';
	id: string;
	path: string;
	color: string;
	x: number;
	y: number;
};
const subscribe = ({
	onSync,
	onJoin,
	onLeave,
	onSubscribe,
	initalState
}: {
	onSync?: (payload: RealtimePresenceState<CursorType>) => void;
	onJoin?: (
		payload: RealtimePresenceJoinPayload<CursorType>,
		newState: RealtimePresenceState<CursorType>
	) => void;
	onLeave?: (
		payload: RealtimePresenceLeavePayload<CursorType>,
		newState: RealtimePresenceState<CursorType>
	) => void;
	onSubscribe?: () => void;
	initalState: CursorType;
}) => {
	const room = supabase.channel(REALTIME_CHANNEL_NAME, {
		config: {
			presence: { key: initalState.id }
		}
	});
	room.on('presence', { event: 'sync' }, () => {
		const newState = room.presenceState<CursorType>();
		if (onSync) onSync(newState);
	})
		// .on<RealtimePresence>('presence', { event: 'join' }, (payload) => {
		// 	const newState = room.presenceState<RealtimePresence>();
		// 	if (onJoin) onJoin(payload, newState);
		// })
		// .on<RealtimePresence>('presence', { event: 'leave' }, (payload) => {
		// 	const newState = room.presenceState<RealtimePresence>();
		// 	if (onLeave) onLeave(payload, newState);
		// })
		.subscribe(async (status) => {
			if (status !== 'SUBSCRIBED') {
				return;
			}

			if (onSubscribe) onSubscribe();
		});

	const trackCursor = async (cursor: CursorType) => {
		await room.track(cursor, {});
	};

	const unsubscribe = () => {
		room.untrack();
	};

	trackCursor(initalState);

	return { trackCursor, unsubscribe };
};

export { subscribe };
