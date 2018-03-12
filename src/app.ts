import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as yargs from 'yargs';
import { AuthenticationMiddleware } from './middleware/authentication';
import { BaseRepository } from './repositories/sequelize/base';
import { TeamRouter } from './routes/team';
import { UserRouter } from './routes/user';

const argv = yargs.argv;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());

app.route('/api/team')
.get(AuthenticationMiddleware.shouldBeAuthenticated, TeamRouter.get)
.post(AuthenticationMiddleware.shouldBeAuthenticated, TeamRouter.post);

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
