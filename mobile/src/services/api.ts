import axios from 'axios';

const api = axios.create({
    // baseURL: 'http://localhost:3333' - esse cara usa o locahost
    baseURL: 'http://10.0.3.21:3333'
})

export { api };