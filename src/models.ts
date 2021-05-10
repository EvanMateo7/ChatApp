
export interface Message {
    roomID: string
    userID: string,
    userName: string,
    message: string
}

export interface RoomJoin {
    roomID: string,
    name: string
}