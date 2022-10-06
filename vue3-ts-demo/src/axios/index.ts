import axios from 'axios';

const server  = axios.create({
    baseURL:"http://localhost:3001/api"
})

export const getApiList = () => server.get("/list").then(res => res.data);