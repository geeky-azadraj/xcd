import { Injectable } from "@nestjs/common";
import { SSOUser } from "api/auth/interfaces/sso-user.interface";
import { UserDBRepository } from "./user-db.repository";
import { CreateUserDto } from "../../api/user/dto/create-user.dto";
import { UpdateUserDto } from "../../api/user/dto/update-user.dto";


@Injectable()
export class UserDBService {

    constructor(private readonly userDBRepository: UserDBRepository) {}

    /**
     * Create a new user (SSO)
     */
    async createUser(ssoUser: SSOUser) {
        return await this.userDBRepository.createUser(ssoUser);
    }

    /**
     * Create a new user (regular)
     */
    async createRegularUser(userData: CreateUserDto) {
        return await this.userDBRepository.createRegularUser(userData);
    }

    /**
     * Find a user by email
     */
    async findUserByEmail(email: string) {
        return await this.userDBRepository.findUserByEmail(email);
    }

    /**
     * Update a user (SSO)
     */ 
    async updateUser(id: string, ssoUser: SSOUser) {
        return await this.userDBRepository.updateUser(id, ssoUser);
    }

    /**
     * Update a user (regular)
     */
    async updateRegularUser(id: string, updateData: UpdateUserDto) {
        return await this.userDBRepository.updateRegularUser(id, updateData);
    }

    /**
     * Find a user by id
     */
    async findUserById(id: string) {
        return await this.userDBRepository.findUserById(id);
    }

    /**
     * Delete a user
     */
    async deleteUser(id: string) {
        return await this.userDBRepository.deleteUser(id);
    }
}