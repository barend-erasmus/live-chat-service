import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as yargs from 'yargs';
import { AuthenticationMiddleware } from './middleware/authentication';
import { BaseRepository } from './repositories/sequelize/base';
import { ApplicationRouter } from './routes/application';
import { TeamRouter } from './routes/team';
import { UserRouter } from './routes/user';

const argv = yargs.argv;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());

app.route('/api/application')
.get(AuthenticationMiddleware.shouldBeAuthenticated, ApplicationRouter.get)
.post(AuthenticationMiddleware.shouldBeAuthenticated, ApplicationRouter.post)
.put(AuthenticationMiddleware.shouldBeAuthenticated, ApplicationRouter.put);

app.route('/api/team')
.get(AuthenticationMiddleware.shouldBeAuthenticated, TeamRouter.get)
.post(AuthenticationMiddleware.shouldBeAuthenticated, TeamRouter.post)
.put(AuthenticationMiddleware.shouldBeAuthenticated, TeamRouter.put);

app.route('/api/team/accept')
.get(AuthenticationMiddleware.shouldBeAuthenticated, TeamRouter.accept);

app.route('/api/user')
.get(AuthenticationMiddleware.shouldBeAuthenticated, UserRouter.get);

app.route('/api/user/info').get(UserRouter.info);

app.listen(argv.port || 3000, () => {
    console.log(`listening on port ${argv.port || 3000}`);
});

new BaseRepository().sync();

export {
    app,
};
