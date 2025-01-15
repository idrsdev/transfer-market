import userModel from '@/resources/user/user.model';
import token from '@/utils/token';
import { IUser } from '@/resources/user/user.interface';

class UserService {
    private user = userModel;

    /**
     * Register or login a new user
     */
    public async loginOrSignup(
        email: string,
        password: string
    ): Promise<{ token: string; user: IUser }> {
        try {
            let user = await this.user.findOne({ email });

            if (user) {
                // Login flow
                if (!(await user.isValidPassword(password))) {
                    throw new Error('Wrong credentials provided');
                }
            } else {
                // Register flow
                user = await this.user.create({
                    email,
                    password,
                });
            }

            const accessToken = token.createToken(user);

            const userResponse = user.toObject();

            delete userResponse.password;
            return { token: accessToken, user: userResponse };
        } catch (error) {
            throw new Error(
                (error as Error).message || 'Unable to create user'
            );
        }
    }
}

export default UserService;
