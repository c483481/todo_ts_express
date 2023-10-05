import cron from "node-cron";
import { pubSub } from "./pubsub.module";

interface CronModuleInterface {
    deleteLoginHistory: symbol;
}

export const pubsubCron: CronModuleInterface = {
    deleteLoginHistory: Symbol("deleteLoginHistory"),
};

class CronModule {
    init() {
        this.trigger24cron();
    }

    private trigger24cron = () => {
        cron.schedule("55 23 * * *", () => {
            pubSub.publish(pubsubCron.deleteLoginHistory, {}, { maxRetry: 5 });
        });
    };
}

export const cronModule = new CronModule();
