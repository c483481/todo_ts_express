import { AppDataSource } from "../../module/datasource.module";

export abstract class BaseRepository {
    abstract init(datasource: AppDataSource): void;
}
