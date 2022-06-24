import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'development' ? 'http//localhost:8080' : '';
const instance = axios.create({
    baseURL: `${baseURL}`
});

export default instance;