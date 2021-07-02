import axios from 'axios';
import global from '../globais.js';

let token =  window.localStorage.getItem('token_uems');

const instance = axios.create({
  baseURL: global,
  headers: {
    "Content-Type": "application/json",
    "authorization": `Bearer ${token}`
  }
});

export default instance;