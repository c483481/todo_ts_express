import { AppRepositoryMap } from "../../contract/repository.contract";

export abstract class BaseService {
    abstract init(repository: AppRepositoryMap): void;
}
