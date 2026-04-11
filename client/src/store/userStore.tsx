import { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';

interface State {
  currentUser: User | null;
  isGuest: boolean;
  initializing: boolean;
}

type Action =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_GUEST' }
  | { type: 'CLEAR_USER' }
  | { type: 'SET_INITIALIZED' };

const initialState: State = {
  currentUser: null,
  isGuest: false,
  initializing: true,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload, isGuest: false };
    case 'SET_GUEST':
      return { ...state, currentUser: null, isGuest: true };
    case 'CLEAR_USER':
      return { ...state, currentUser: null, isGuest: false };
    case 'SET_INITIALIZED':
      return { ...state, initializing: false };
    default:
      return state;
  }
}

interface UserContextValue {
  state: State;
  dispatch: React.Dispatch<Action>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserStore() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserStore must be used within a UserProvider');
  }
  return context;
}
