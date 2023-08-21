import { Admin, UserRole } from '@prisma/client';
import { Exclude } from "class-transformer";
export class AdminEntity implements Admin {
  id: number;
  role: UserRole;
  username: string;
  email: string;

  @Exclude()
  password: string;

  createBySuperAdminId: number;
  createdAt: Date;
  constructor(partial: Partial<AdminEntity>) {
    Object.assign(this, partial);
  }
}