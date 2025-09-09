import { RoleType } from "@common/enums/role-type.enum";
import { DBService } from "@db/db.service";
import { Injectable } from "@nestjs/common";
import { SSOUser } from "api/auth/interfaces/sso-user.interface";
import { CreateUserDto } from "../../api/user/dto/create-user.dto";
import { UpdateUserDto } from "../../api/user/dto/update-user.dto";


@Injectable()
export class UserDBRepository {
    constructor(private readonly prisma: DBService) {}

    /**
     * Create a new user (SSO)
     */
    async createUser(ssoUser: SSOUser) {
        return await this.prisma.users.create({
            data: {
                email: ssoUser.email,
                full_name: ssoUser.full_name,
                user_type: RoleType.ADMIN,
                status: 'active',
                avatar_url: ssoUser.avatar,
                last_login_at: new Date(),
            },
        });
    }

    /**
     * Create a new user (regular)
     */
    async createRegularUser(userData: CreateUserDto) {
        return await this.prisma.users.create({
            data: {
                email: userData.email,
                full_name: userData.fullName,
                password_hash: userData.passwordHash,
                avatar_url: userData.avatarUrl,
                phone: userData.phone,
                user_type: userData.userType,
                status: userData.status || 'active'
            },
        });
    }

    /**
     * Find a user by email
     */
    async findUserByEmail(email: string) {
        return await this.prisma.users.findUnique({
            where: { email },
        });
    }

    /**
     * Update a user (SSO)
     */
    async updateUser(id: string, ssoUser: SSOUser) {
        return await this.prisma.users.update({
            where: { id: id },
            data: {
                last_login_at: new Date(),
                full_name: ssoUser.full_name,
                avatar_url: ssoUser.avatar,
            },
          });
    }

    /**
     * Update a user (regular)
     */
    async updateRegularUser(id: string, updateData: UpdateUserDto) {
        const updateFields: any = {};
        
        if (updateData.email !== undefined) updateFields.email = updateData.email;
        if (updateData.fullName !== undefined) updateFields.full_name = updateData.fullName;
        if (updateData.avatarUrl !== undefined) updateFields.avatar_url = updateData.avatarUrl;
        if (updateData.phone !== undefined) updateFields.phone = updateData.phone;
        if (updateData.userType !== undefined) updateFields.user_type = updateData.userType;
        if (updateData.status !== undefined) updateFields.status = updateData.status;
        
        updateFields.updated_at = new Date();

        return await this.prisma.users.update({
            where: { id },
            data: updateFields,
        });
    }

    /**
     * Find a user by id
     */
    async findUserById(id: string) {
        return await this.prisma.users.findUnique({
            where: { id: id },
        });
    }

    /**
     * Delete a user (soft delete)
     */
    async deleteUser(id: string) {
        return await this.prisma.users.update({
            where: { id },
            data: {
                status: 'deleted',
                updated_at: new Date(),
            },
        });
    }

}