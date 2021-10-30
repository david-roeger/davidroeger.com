import React from 'react';
import { status, asyncState } from 'src/types';

interface optionalAsyncState {
    status?: status;
    data?: any;
    error?: any;
}

interface asyncStateReducer extends asyncState {
    run: (promise: any) => void;
}

interface actionType extends optionalAsyncState {
    type: status;
}

const asyncReducer = (state: asyncState, action: actionType) => {
    console.log(state);
    console.log(action);
    switch (action.type) {
        case status.pending: {
            return {
                status: status.pending,
                data: undefined,
                error: undefined,
            };
        }
        case status.resolved: {
            return {
                status: status.resolved,
                data: action.data,
                error: undefined,
            };
        }
        case status.rejected: {
            return {
                status: status.rejected,
                data: undefined,
                error: action.error,
            };
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
};

export const useAsync = (
    initialValue?: optionalAsyncState,
): asyncStateReducer => {
    const initialState = {
        status: status.idle,
        data: undefined,
        error: undefined,
        ...initialValue,
    };
    const [state, dispatch] = React.useReducer(asyncReducer, initialState);

    const run = React.useCallback((promise) => {
        dispatch({ type: status.pending });
        promise.then(
            (data: any) => {
                console.log(data);
                dispatch({ type: status.resolved, data });
            },
            (error: any) => {
                dispatch({ type: status.rejected, error });
            },
        );
    }, []);

    return { ...state, run } as asyncStateReducer;
};
