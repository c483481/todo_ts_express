import EventEmitter from "events";
import * as util from "util";
import { randomUUID } from "crypto";

export interface PubSubOptions {
    maxRetry?: number;
}

export interface PubSubMetadata {
    id: string;
    retryNo: number;
    maxRetry: number;
}

export enum PubSubAck {
    ACK,
    NACK,
    Retry,
}

export type PubSubHandlerFn<T> = (payload: T) => PubSubAck | PromiseLike<PubSubAck>;

const delayPromise = util.promisify(setTimeout);

class PubSub {
    private readonly eventEmitter = new EventEmitter();
    private readonly maxRetry: number;

    constructor(options: PubSubOptions = {}) {
        this.maxRetry = options.maxRetry || 5;
    }

    publish<T>(topic: symbol, payload: T, options: { maxRetry?: number } = {}) {
        // Set metadata
        const metadata: PubSubMetadata = {
            id: this.newEventId(),
            retryNo: 1,
            maxRetry: this.maxRetry,
        };

        // Override metadata if set
        if (options.maxRetry) {
            metadata.maxRetry = options.maxRetry;
        }

        this.eventEmitter.emit(topic, payload, metadata);
        console.debug(
            `Published to topic "${topic.toString()}". Payload = ${JSON.stringify(payload)}, Id = ${metadata.id}`
        );
    }

    subscribe<T>(topic: symbol, handler: PubSubHandlerFn<T>) {
        this.eventEmitter.on(topic, (payload: T, metadata: PubSubMetadata) => {
            console.debug(`Call subscribe handler. Topic = ${topic.toString()}, Id = ${metadata.id}`);
            Promise.resolve(handler(payload))
                .then((ack: PubSubAck) => {
                    console.debug(`Received Acknowledgement: ${ack}. Topic = ${topic.toString()}, Id = ${metadata.id}`);

                    switch (ack) {
                        case PubSubAck.ACK: {
                            console.log(`Topic clear the proccess, Topic = ${topic.toString()}, Id = ${metadata.id}`);
                            break;
                        }
                        case PubSubAck.Retry: {
                            // If retry has reached limit, then stop retrying
                            if (metadata.retryNo >= metadata.maxRetry) {
                                console.debug(
                                    `Subscription retry has reached limit. Topic = ${topic.toString()}, RetryNo = ${
                                        metadata.retryNo
                                    }, MaxRetry = ${metadata.maxRetry}, Id = ${metadata.id}`
                                );
                                return;
                            }

                            // Delay retry in second exponentially
                            const delaySec = metadata.retryNo;
                            console.debug(
                                `Retrying in ${delaySec * delaySec} second. Topic = ${topic.toString()}, RetryNo = ${
                                    metadata.retryNo
                                }, Id = ${metadata.id}`
                            );
                            delayPromise(delaySec * delaySec * 1000).then(() => {
                                metadata.retryNo += 1;
                                metadata.id = this.newEventId();
                                this.eventEmitter.emit(topic, payload, metadata);
                                console.debug(
                                    `Topic published for retry. Topic = ${topic.toString()}, Id = ${metadata.id}`
                                );
                            });
                            break;
                        }
                        case PubSubAck.NACK: {
                            console.log(
                                `Topic is decline the proccess, Topic = ${topic.toString()}, Id = ${metadata.id}`
                            );
                            break;
                        }
                        default: {
                            console.log(`unkown event ${ack}`);
                            break;
                        }
                    }
                })
                .catch((err) => {
                    console.error(
                        `Error while call subscription handler. Topic = ${topic.toString()}, Error = ${err}, Id = ${
                            metadata.id
                        }`
                    );
                });
        });
        console.debug(`Subscribe to topic "${topic.toString()}"`);
    }

    private newEventId = (): string => {
        return randomUUID();
    };
}

export const pubSub = new PubSub();
