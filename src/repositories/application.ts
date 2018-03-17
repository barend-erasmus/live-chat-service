import { Application } from '../entities/application';

export interface IApplicationRepository {
    create(application: Application): Promise<Application>;
    find(applicationId: number): Promise<Application>;
    list(teamId: number): Promise<Application[]>;
    update(application: Application): Promise<Application>;
}
