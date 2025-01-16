import teamModel from '@/resources/team/team.model';
import playerModel from '@/resources/player/player.model';
import { ITeam } from '@/resources/team/team.interface';
import userModel from '@/resources/user/user.model';
import { IPlayer } from '../player/player.interface';
import { IUser } from '../user/user.interface';
import HttpException from '@/utils/exceptions/http.exception';
import { ObjectId } from 'mongoose';

class TeamService {
    private team = teamModel;
    private user = userModel;

    public async create(
        name: string,
        players: IPlayer[],
        userId: string
    ): Promise<{ team: ITeam; user: IUser }> {
        try {
            const team = await this.team.create({ name });

            await playerModel.insertMany(
                players.map((player) => ({ ...player, team_id: team._id }))
            );

            const user = await this.user
                .findByIdAndUpdate(
                    userId,
                    {
                        team_id: team._id,
                        has_completed_setup: true,
                    },
                    { new: true }
                )
                .select('-password');

            if (!user) {
                throw new Error('User not found');
            }

            return { team, user };
        } catch (error) {
            // Write now, It throws duplicate error, If we want descriptive error.
            // We could use some Mongoos Error handling library here
            if (error && typeof error == 'object') {
                if ((error as Record<string, unknown>).code === 11000) {
                    const keyPattern = (
                        error as Record<string, Record<string, unknown>>
                    ).keyPattern;
                    const message = `${Object.keys(keyPattern).at(
                        0
                    )} must be unique`;
                    throw new Error(message);
                }
            }

            throw new Error('Unable to create team');
        }
    }

    public async getTeams(search?: string, limit = 10): Promise<ITeam[]> {
        try {
            const query = search
                ? { name: { $regex: search, $options: 'i' } }
                : {};

            return await this.team.find(query).limit(limit);
        } catch (error) {
            throw new Error('Unable to get teams');
        }
    }

    public async getPlayersByTeam(
        teamId: ObjectId
    ): Promise<{ [key: string]: IPlayer[] }> {
        try {
            const players = await playerModel.find({
                team_id: teamId,
            });

            const organizedPlayers: { [key: string]: IPlayer[] } = {
                Goalkeeper: [],
                Defender: [],
                Midfielder: [],
                Forward: [],
            };

            players.forEach((player) => {
                organizedPlayers[player.position].push(player);
            });

            return organizedPlayers;
        } catch (error) {
            throw new HttpException(400, "Unable to get Team's players");
        }
    }
}

export default TeamService;
