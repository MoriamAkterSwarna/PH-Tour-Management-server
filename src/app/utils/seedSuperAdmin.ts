import { envVars } from "../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import  bcryptjs  from 'bcryptjs';

export const seedSuperAdmin = async () => {
  
    try {
        const isSuperAdminExist = await User.findOne({ email: envVars.SUPER_ADMIN_EMAIL });
        console.log(isSuperAdminExist);

        if(isSuperAdminExist){
            console.log("Super Admin already exists");
            return;
        }

        console.log("Super Admin does not exist, creating...");

        const hashedPassword = await bcryptjs.hash(envVars.SUPER_ADMIN_PASSWORD,Number( envVars.BCRYPT_SALT_ROUNDS));

        const authProvider : IAuthProvider = {
            provider: "credentials",
            providerId: envVars.SUPER_ADMIN_EMAIL,

        }

        const payload : IUser= {
            name : "Super Admin",
            email: envVars.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            role: Role.SUPERADMIN,
            auths: [authProvider],
            isVerified: true,

        }
        const superAdmin = await User.create(payload);
        console.log("Super Admin seeded successfully:", superAdmin.email);
        console.log(superAdmin)
    }
    catch (error) {
        console.error("Error seeding super admin:", error);
    }



};
