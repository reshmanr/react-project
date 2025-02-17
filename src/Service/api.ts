import axios from 'axios';

const api = axios.create({
  // baseURL: "https://67adb21d3f5a4e1477deb028.mockapi.io/blogwebsite"
  baseURL: "https://67adb21d3f5a4e1477deb028.mockapi.io"
})

export default api;