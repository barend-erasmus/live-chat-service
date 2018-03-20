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
            list: async (teamId: number) => {
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
            list: (userName: string) => {
                return null;
            },
            update: async (team: Team) => {
                return team;
            },
        } as ITeamRepository;

        userRepository = {
            findById: async (userId: number) => {
                return new User('email-address', 'display-name', 1);
            },
            findByUserName: async (userName: string) => {
                return new User('email-address', 'display-name', 1);
            },
        } as IUserRepository;

        applicationService = new ApplicationService(applicationRepository, teamRepository, userRepository);
    });

    describe('create', () => {

        it('should return application', async () => {
            sinon.stub(teamRepository, 'find').returns(new Team(null, null, new TeamOwnerView(null, null, 1), []));

            const result: OperationResult<Application> = await applicationService.create(new Application(null, 'name', new TeamView(null, null, null)), 'email-address');

            expect(result.result).to.be.not.null;
        });

        it('should with validation message given empty team', async () => {
            const result: OperationResult<Application> = await applicationService.create(new Application(null, null, null), 'email-address');

            expect(result.messages[0].message).to.be.eq('Application requires a team.');
        });

        it('should with validation message given non-existing team', async () => {
            const result: OperationResult<Application> = await applicationService.create(new Application(null, null, new TeamView(null, null, null)), 'email-address');

            expect(result.messages[0].message).to.be.eq('Team does not exist.');
        });

        it('should with validation message given empty name', async () => {
            const result: OperationResult<Application> = await applicationService.create(new Application(null, null, new TeamView(null, null, null)), 'email-address');

            expect(result.messages[0].message).to.be.eq('Team does not exist.');
        });

        it('should with validation message given incorrect owner', async () => {
            sinon.stub(teamRepository, 'find').returns(new Team(null, null, new TeamOwnerView(null, null, 2), []));

            const result: OperationResult<Application> = await applicationService.create(new Application(null, 'name', new TeamView(null, null, null)), 'email-address');

            expect(result.messages[0].message).to.be.eq('You are not the owner of this team.');
        });

    });

    describe('update', () => {

        it('should return application', async () => {
            sinon.stub(applicationRepository, 'find').returns(new Application(null, null, new TeamView(null, null, null)));
            sinon.stub(teamRepository, 'find').returns(new Team(null, null, new TeamOwnerView(null, null, 1), []));

            const result: OperationResult<Application> = await applicationService.update(new Application(null, 'name', new TeamView(null, null, null)), 'email-address');

            expect(result.result).to.be.not.null;
        });

        it('should with validation message given empty team', async () => {
            const result: OperationResult<Application> = await applicationService.update(new Application(null, null, null), 'email-address');

            expect(result.messages[0].message).to.be.eq('Application requires a team.');
        });

        it('should with validation message given non-existing team', async () => {
            const result: OperationResult<Application> = await applicationService.update(new Application(null, null, new TeamView(null, null, null)), 'email-address');

            expect(result.messages[0].message).to.be.eq('Team does not exist.');
        });

        it('should with validation message given empty name', async () => {
            const result: OperationResult<Application> = await applicationService.update(new Application(null, null, new TeamView(null, null, null)), 'email-address');

            expect(result.messages[0].message).to.be.eq('Team does not exist.');
        });

        it('should with validation message given non-existing application', async () => {
            sinon.stub(teamRepository, 'find').returns(new Team(null, null, new TeamOwnerView(null, null, 2), []));

            const result: OperationResult<Application> = await applicationService.update(new Application(null, 'name', new TeamView(null, null, null)), 'email-address');

            expect(result.messages[0].message).to.be.eq('Application does not exist.');
        });

        it('should with validation message given incorrect owner', async () => {
            sinon.stub(applicationRepository, 'find').returns(new Application(null, null, new TeamView(null, null, null)));
            sinon.stub(teamRepository, 'find').returns(new Team(null, null, new TeamOwnerView(null, null, 2), []));

            const result: OperationResult<Application> = await applicationService.update(new Application(null, 'name', new TeamView(null, null, null)), 'email-address');

            expect(result.messages[0].message).to.be.eq('You are not the owner of this team.');
        });

    });

});
