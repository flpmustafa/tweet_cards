import axios from 'axios';

const BASE_URL = 'https://64455138914c816083cbedba.mockapi.io/api/export_users';

async function getUsers() {    
    try {
        const resp = await axios.get(`${BASE_URL}`);
        const data = resp.data;
        return data.map((item, index) => ({
            ...item,
            id: index + 1,
        }));
    } catch (error) {
        console.log('ERROR: ' + error);
    }
}

export { getUsers };