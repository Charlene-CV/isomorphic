import axios from 'axios';
import { baseUrl } from '@/config/url';
// @ts-ignore
import Cookies from 'js-cookie';
import { EquipTypeFormInput } from '@/validators/equipmenttype-schema';
import { EquipSubTypeFormInput } from '@/validators/equipmentsubtype-schema';
import { UserFormInput } from '@/validators/create-user.schema';
import { RoleFormInput } from '@/validators/create-role.schema';

export const getTypes = async (): Promise<EquipTypeFormInput[] | null> => {
    try {
        const user: any = JSON.parse(Cookies.get('user'));
        const token = user.token;
        const response = await axios.get(`${baseUrl}/api/v1/equipment-types/all`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        if (response.status === 200) {
            const types = response.data.data;
            return types;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error getting equipment types:', error);
        return null;
    }
};

export const getSubtypes = async (): Promise<EquipSubTypeFormInput[] | null> => {
    try {
        const user: any = JSON.parse(Cookies.get('user'));
        const token = user.token;
        const response = await axios.get(`${baseUrl}/api/v1/equipment-subtypes/all`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        if (response.status === 200) {
            const subtypes = response.data.data;
            return subtypes;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error getting equipment subtypes:', error);
        return null;
    }
};

export const getTypeId = async (name: string): Promise<string | undefined> => {
    try {
        const types: EquipTypeFormInput[] | null = await getTypes();
        const foundType = types?.find(type => type.name === name);
        return foundType?.uuid;
    } catch (error) {
        console.error('Error getting equipment type id:', error);
    }
};

export const getSubtypeId = async (name: string): Promise<string | undefined> => {
    try {
        const subtypes: EquipSubTypeFormInput[] | null = await getSubtypes();
        const foundSubType = subtypes?.find(subtype => subtype.name === name);
        return foundSubType?.uuid;
    } catch (error) {
        console.error('Error getting equipment subtype id:', error);
    }
};

export const getRoles = async (): Promise<RoleFormInput[] | null> => {
    try {
        const user: any = JSON.parse(Cookies.get('user'));
        const token = user.token;
        const response = await axios.get(`${baseUrl}/api/v1/roles/all`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        if (response.status === 200) {
            const roles = response.data.data;
            return roles;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error getting roles:', error);
        return null;
    }
};

export const getRoleId = async (name: string): Promise<string> => {
    try {
        const roles: RoleFormInput[] | null = await getRoles();
        const foundRole = roles?.find(role => role.name === name);
        if (foundRole?.uuid) {
            return foundRole?.uuid;
        }
        console.log("Role id not found.")
        return "";
    } catch (error) {
        console.error('Error getting role id:', error);
        return "";
    }
};

export const getUsers = async (role: string): Promise<UserFormInput[] | undefined> => {
    try {
        const user: any = JSON.parse(Cookies.get('user'));
        const token = user.token;
        const response = await axios.get(`${baseUrl}/api/v1/users/all`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        if (response.status === 200) {
            const roleid: string = await getRoleId(role);
            const users = response.data.data;
            if (roleid !== "") {
                const wantedusers = users.filter((user: { uuid: string }) => user.uuid.includes(roleid));
                return wantedusers;
            } else {
                console.log("Users of this role not found.");
            }
        }
    } catch (error) {
        console.error('Error getting users:', error);
        return [];
    }
};