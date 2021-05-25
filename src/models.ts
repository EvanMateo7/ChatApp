
export interface Message {
    roomID: string
    userID: string,
    userName: string,
    message: string,
    timestamp: number
}

export interface RoomJoin {
    roomID: string,
    userID: string
}

export interface User {
  id: string,
  name: string,
  photoURL: string
}

export interface UserLogout {
  user: User | null,
  logout: Function | null
}
