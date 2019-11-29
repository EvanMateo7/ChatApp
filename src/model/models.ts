
export interface Message {
    roomID?: string
    sender: string,
    message: string
}

export interface RoomJoin {
    roomID: string,
    name: string
}