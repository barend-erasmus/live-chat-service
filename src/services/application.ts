import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { Application } from '../entities/application';
import { Team } from '../entities/team';
import { User } from '../entities/user';
import { OperationResult } from '../models/operation-result';
import { IApplicationRepository } from '../repositories/application';
import { ITeamRepository } from '../repositories/team';
import { IUserRepository } from '../repositories/user';

@injectable()
export class ApplicationService {

    constructor(
        @inject('IApplicationRepository')
        private applicationRepository: IApplicationRepository,
        @inject('ITeamRepository')
        private teamRepository: ITeamRepository,
        @inject('IUserRepository')
        private userRepository: IUserRepository,
    ) {
    }

    public async create(application: Application, userName: string): Promise<OperationResult<Application>> {
        const result: OperationResult<Application> = OperationResult.create<Application>(null);

        const user: User = await this.userRepository.findByUserName(userName);

        const team: Team = await this.teamRepository.find(application.team.id);

        if (!team) {
            result.addMessage('not_found', null, 'Team does not exist.');
            return result;
        }

        if (team.owner.id !== user.id) {
            result.addMessage('unauthorized', null, 'You are not the owner of this team.');
            return result;
        }

        application = await this.applicationRepository.create(application);

        result.setResult(application);

        return result;
    }

    public async find(applicationId: number, userName: string): Promise<OperationResult<Application>> {
        const application: Application = await this.applicationRepository.find(applicationId);

        return OperationResult.create<Application>(application);
    }

    public async list(teamId: number, userName: string): Promise<OperationResult<Application[]>> {
        const applications: Application[] = await this.applicationRepository.list(teamId);

        return OperationResult.create<Application[]>(applications);
    }

    public async update(application: Application, userName: string): Promise<OperationResult<Application>> {
        const result: OperationResult<Application> = OperationResult.create<Application>(null);

        const exisitingApplication: Application = await this.applicationRepository.find(application.id);

        const user: User = await this.userRepository.findByUserName(userName);

        const team: Team = await this.teamRepository.find(exisitingApplication.team.id);

        if (!team) {
            result.addMessage('not_found', null, 'Team does not exist.');
            return result;
        }

        if (team.owner.id !== user.id) {
            result.addMessage('unauthorized', null, 'You are not the owner of this team.');
            return result;
        }

        exisitingApplication.name = application.name;

        application = await this.applicationRepository.update(exisitingApplication);

        return result;
    }
}
