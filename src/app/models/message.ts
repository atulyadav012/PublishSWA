export interface AddMessage {
    parentMessageId: number,
    appearanceId: number,
    fromId: Number,
    toId: number,
    message: string,
    fromIdRole: string
}