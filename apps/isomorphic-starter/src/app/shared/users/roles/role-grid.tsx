import RoleCard from './role-card';

interface User {
  uuid: string;
  firstName: string;
  lastName?: string | null;
  email: string;
  isActive: boolean;
  isVerified: boolean;
}

interface Role {
  uuid: string;
  name: string;
  countUser: number;
  users: User[];
  permissions: Permission[];
}

interface Permission {
  uuid: string;
  write: boolean;
  edit: boolean;
  read: boolean;
  delete: boolean;
  functionList: Model;
}

interface Model {
  uuid: string;
  name: string;
}

export default function RoleList({
  roles,
  fetchRoles,
  fetchUsers,
}: {
  roles: any[];
  fetchRoles: any;
  fetchUsers: any;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {roles &&
        roles.length &&
        roles.map((role: any) => (
          <div key={role.uuid} className="px-5">
            <RoleCard
              fetchRoles={fetchRoles}
              uuid={role.uuid}
              name={role.name}
              users={role.users}
              countUser={role.countUser}
              permissions={role.permissions}
              fetchUsers={fetchUsers}
            />
          </div>
        ))}
    </div>
  );
}
