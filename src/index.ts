import express from "express";
import helmet from "helmet";
import cors from "cors";
import { AppDataSource, datasource } from "./module/datasource.module";
import { Repository } from "./server/repository";
import { Service } from "./server/service";
import { Controller } from "./server/controller";
import { handleApiStatus, handleError, handleNotFound, handleRequest } from "./handler/default.handler";
import { config } from "./config";
import { manifest } from "./manifest";
import { initErrorResponse } from "./response";
import compression from "compression";
import { AppRepositoryMap } from "./contract/repository.contract";
import { AppServiceMap } from "./contract/service.contract";

start();

function initRepository(dataSource: AppDataSource): AppRepositoryMap {
    const repository = new Repository();
    repository.init(dataSource);
    return repository;
}

function initService(repository: AppRepositoryMap): AppServiceMap {
    const services = new Service();
    services.init(repository);
    return services;
}

async function start(): Promise<void> {
    const source = await datasource.init(config);
    initErrorResponse();

    const repository = initRepository(source);
    const service = initService(repository);

    const app = init(service);
    app.listen(config.port, () => {
        console.log(`Running on ${config.baseUrl}`);
    });
}

function init(service: AppServiceMap): express.Application {
    const app = express();

    app.use(
        helmet({
            frameguard: {
                action: "deny",
            },
            dnsPrefetchControl: false,
        })
    );

    app.use(
        cors({
            origin: config.cors,
            methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
        })
    );

    app.use(
        compression({
            level: 6,
            threshold: 10 * 1000,
        })
    );

    app.use(express.urlencoded({ extended: false, limit: "50kb" }));
    app.use(express.json({ limit: "50kb" }));

    const controller = new Controller();

    if (!config.isProduction) {
        app.use(handleRequest);
    }

    app.get("/", handleApiStatus(manifest));

    app.use(controller.init(service));

    app.use(handleNotFound);

    app.use(handleError);

    return app;
}
