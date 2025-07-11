import { API_URL } from "@/config";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
    baseURL: API_URL,
    headers:{
        "Content-Type": "application/json"
    }
})

let isRefreshing = false;
let FailRequestQueue: {
    resolve: () => void,
    reject: (error:unknown) => void
}[] =[];

api.interceptors.request.use(async (config)=>{
    const token = await SecureStore.getItemAsync("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
})

api.interceptors.response.use( (response)=> response ,async (error)=>{
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
               FailRequestQueue.push({
                resolve: () => resolve(api(originalRequest)),
                reject
               })
            })
        }
        originalRequest._retry = true
        isRefreshing = true

        try {
            const refreshToken = await SecureStore.getItemAsync("refreshToken")
            const randToken = await SecureStore.getItemAsync("randToken")

            const { data } = await axios.post(API_URL + "api/v1/refresh-token",{
                refreshToken,randToken
            },{
                 headers:{
                        "Content-Type": "application/json",
                        Authorization: `Bearer 32421313`
                    }
            });
             await SecureStore.setItemAsync("token", data.token)
             await SecureStore.setItemAsync("refreshToken", data.refreshToken)
             await SecureStore.setItemAsync("randToken", data.randToken)

             api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`

             FailRequestQueue.forEach(({resolve})=> resolve())
             FailRequestQueue = [];
             return api(originalRequest)
        } catch (refresherror) {
               await SecureStore.deleteItemAsync("token");
                await SecureStore.deleteItemAsync("refreshToken");
             await SecureStore.deleteItemAsync("randToken");
              await SecureStore.deleteItemAsync("session");

              FailRequestQueue.forEach(({reject}) => {
                reject(refresherror)
              })
              FailRequestQueue = []
              return Promise.reject(refresherror)        
        }finally{
            isRefreshing = false;
        }
    }
      return Promise.reject(error)   
})

export default api