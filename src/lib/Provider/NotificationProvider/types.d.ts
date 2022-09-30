import type { ColorClassesKey } from './constants';

type Base = {
	id: string;
	priority?: boolean;
};

type NotificationType = {
	variant: ColorClassesKey;
};

type Content =
	| { html: string; headline?: never; subline?: never }
	| { html?: never; headline: string; subline?: string };

type Progress =
	| {
			progress: true;
			duration?: number;
	  }
	| {
			progress?: false;
			duration?: never;
	  };

type Icon =
	| {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			startIcon?: any;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			endIcon?: any;
			closeIcon?: never;
	  }
	| {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			startIcon?: any;
			endIcon?: never;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			closeIcon?: boolean;
	  };

type Close =
	| { closeOnClick: true; draggable?: boolean }
	| { closeOnClick?: false; draggable?: never };

export type Notification = Base &
	NotificationType &
	Content &
	Progress &
	Icon &
	Close;

export interface NotificationContext {
	addNotification: (notification: Notification) => void;
	removeNotification: (id: string) => void;
	removeAllNotifications: () => void;
}
