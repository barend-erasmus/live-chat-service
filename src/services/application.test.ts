import { expect } from 'chai';
import 'mocha';
import * as sinon from 'sinon';

import { Application } from '../entities/application';
import { Team } from '../entities/team';
import { User } from '../entities/user';
import { TeamView } from '../entity-views/team';
import { TeamOwnerView } from '../entity-views/team-owner';
import { OperationResult } from '../models/operation-result';
import { IApplicationRepository } from '../repositories/application';
import { ITeamRepository } from '../repositories/team';
import { IUserRepository } from '../repositories/user';
import { ApplicationService } from './application';

describe('ApplicationService', () => {

    let applicationRepository: IApplicationRepository = null;
    let teamRepository: ITeamRepository = null;
    let userRepository: IUserRepository = null;

    let applicationService: ApplicationService = null;

    beforeEach(async () => {
        applicationRepository = {
            create: async (application: Application) => {
                return application;
            },
            find: async (applicationId: number) => {
                return null;
            },
            update: async (application: Application) => {
                return application;
            },
        } as IApplicationRepository;

        teamRepository = {
            create: async (team: Team) => {
                return team;
            },
            find: async (teamId: number) => {
                return null;
            },
            update: async (team: Team) => {
                return team;
            },
        } as ITeamRepository;

        userRepository = {
            findByUserName: async (userName: string) => {
                return new User('email-address', 'display-name', 1);
            },
        } as IUserRepository;

        applicationService = new ApplicationService(applicationRepository, teamRepository, userRepository);
    });

    describe('create', () => {

        it('should return application', async () => {
            sinon.stub(teamRepository, 'find').returns(new Team(null, null, new TeamOwnerView(null, null, 1), []));

            const result: OperationResult<Application> = await applicationService.create(new Application(null, null, new TeamView(null, null, null)), 'email-address');

            expect(result.result).to.be.not.null;
        });

    });

});
