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
export class TeamService {

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

        throw new Error('');
    }

    public async find(applicationId: number, userName: string): Promise<OperationResult<Application>> {
        throw new Error('');
    }

    public async list(teamId: number, userName: string): Promise<OperationResult<Application[]>> {
        throw new Error('');
    }

    public async update(application: Application, userName: string): Promise<OperationResult<Application>> {
        throw new Error('');
    }
}
