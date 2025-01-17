import playerModel from '@/resources/player/player.model';
import { IPlayer } from '@/resources/player/player.interface';
import HttpException from '@/utils/exceptions/http.exception';
import transferModel from '../transfer/transfer.model';
import { ITransfer } from '../transfer/transfer.interface';
import userModel from '../user/user.model';
import { ITeam } from '../team/team.interface';

class PlayerService {
    private player = playerModel;
    private user = userModel;
    private transfer = transferModel;

    public async getPlayers(
        page = 1,
        pageSize = 8,
        search?: string,
        team?: string,
        min_price?: number,
        max_price?: number,
        position?: string,
        is_listed = true
    ): Promise<{ players: IPlayer[]; totalPages: number }> {
        try {
            const query: Record<string, unknown> = { is_listed };

            if (search) {
                query.name = { $regex: search, $options: 'i' };
            }
            if (team) {
                query.team_id = team;
            }
            if (min_price) {
                query.base_price = { $gte: min_price };
            }
            if (max_price) {
                query.base_price = { $lte: max_price };
            }
            if (position) {
                query.position = position;
            }

            const total = await this.player.countDocuments(query);
            const totalPages = Math.ceil(total / pageSize);
            const players = await this.player
                .find(query)
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .populate('team_id');

            return {
                players: players.map((player) => {
                    return {
                        ...player.toObject(),
                        team: player.team_id as unknown as ITeam,
                        team_id: undefined,
                    };
                }),
                totalPages,
            };
        } catch (error) {
            throw new HttpException(400, 'Unable to get players');
        }
    }

    public async listPlayer(
        id: string,
        listing_price: number
    ): Promise<IPlayer> {
        try {
            const player = await this.player.findByIdAndUpdate(
                id,
                { is_listed: true, listing_price },
                { new: true }
            );

            if (!player) {
                throw new HttpException(404, 'Player not found');
            }

            return player;
        } catch (error) {
            throw new HttpException(400, 'Unable to list player');
        }
    }

    public async unlistPlayer(id: string): Promise<IPlayer> {
        try {
            const player = await this.player.findByIdAndUpdate(
                id,
                { is_listed: false, listing_price: null },
                { new: true }
            );
            console.log({ player });

            if (!player) {
                throw new HttpException(404, 'Player not found');
            }

            return player;
        } catch (error) {
            throw new HttpException(400, 'Unable to unlist player');
        }
    }

    public async buyPlayer(
        id: string,
        userId: string
    ): Promise<{ player: IPlayer; transfer: ITransfer; new_balance: number }> {
        try {
            const player = await this.player.findById(id);
            if (!player || !player.is_listed || !player.listing_price) {
                throw new HttpException(404, 'Player not found or not listed');
            }

            const buyer = await this.user.findById(userId);

            if (!buyer || !buyer.team_id) {
                throw new HttpException(404, 'Buyer not found');
            }

            if ((buyer.team_id as any)?.equals(player.team_id)) {
                throw new HttpException(400, 'Already Bought/ Team Member');
            }

            const requiredBalance = player.listing_price * 0.95; // 95% of listing price

            if (buyer.balance < requiredBalance) {
                throw new HttpException(400, 'Insufficient balance');
            }

            // Update buyer's balance
            buyer.balance -= requiredBalance;
            await buyer.save();

            // Create transfer record (assuming you have a Transfer model)
            const transfer = await this.transfer.create({
                player_id: player._id,
                from_team_id: player.team_id,
                to_team_id: buyer.team_id,
                price: player.listing_price,
                created_at: new Date(),
            });

            // Update player status
            player.is_listed = false;
            player.team_id = buyer.team_id;
            player.base_price = player.listing_price;
            player.listing_price = null;
            await player.save();

            return { player, transfer, new_balance: buyer.balance };
        } catch (error) {
            throw new HttpException(
                400,
                (error as Error).message || 'Unable to buy player'
            );
        }
    }
}

export default PlayerService;
