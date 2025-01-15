import 'dotenv/config';
import 'module-alias/register';
import App from './app';
import validateEnv from '@/utils/validateEnv';

import UserController from '@/resources/user/user.controller';
import TeamController from '@/resources/team/team.controller';
import PlayerController from '@/resources/player/player.controller';

validateEnv();

const app = new App(
    [new PlayerController(), new TeamController(), new UserController()],
    Number(process.env.PORT)
);

app.listen();
