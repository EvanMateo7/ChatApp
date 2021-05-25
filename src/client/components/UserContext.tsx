import React, { FunctionComponent } from 'react';
import { UserLogout } from '../../models';
import { useCurrentUser } from '../authService';

export const UserContext = React.createContext<UserLogout>({user: null, logout: null});

export const UserContextProvider: FunctionComponent = (props) => {
  const [user, logout] = useCurrentUser();

  const userLogout: UserLogout = {
    user,
    logout
  }

  return (
    <UserContext.Provider value={userLogout}>
      {props.children}
    </UserContext.Provider>
  );
}
