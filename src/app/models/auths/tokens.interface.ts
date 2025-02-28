import { IModule } from "src/app/models/modules/module.interface";
import { ITypeUser } from "src/app/models/users/typeUser.interface";
import { IUser } from "src/app/models/users/user.interface";

export interface IToken {
    jwtToken: string;
    refreshToken: string;
    // code: string;
    // sessionHistoryHash: string;
    // limit: number;
    // modules: IModule;
    userAzone: IUser;
    // typeUsers: ITypeUser;
    message: string;
}
