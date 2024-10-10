import axios from 'axios';

const api = axios.create({
    // baseURL: 'https://localhost:3333'
    baseURL: 'http://10.0.3.228:3333'
})

export {api};