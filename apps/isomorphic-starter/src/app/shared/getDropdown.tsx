import axios from 'axios';
import { baseUrl } from '@/config/url';
// @ts-ignore
import Cookies from 'js-cookie';

export const getDropData = async (urlCont: string) => {
    try {
        const user: any = JSON.parse(Cookies.get('user'));
        const token = user.token;
        const response = await axios.get(`${baseUrl}/${urlCont}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        if (response.status === 200) {
            const data = response.data.data;
            return data;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error getting dropdown data:', error);
        return null;
    }
};