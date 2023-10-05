interface PubsubEvent {
    loginHistoryInsert: symbol;
}

export const pubsubEvent: PubsubEvent = {
    loginHistoryInsert: Symbol("loginHistoryInsert"),
};
