import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://172.16.30.167:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default instance;