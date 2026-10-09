import axios from "axios";
// import cookie from 'vue-cookies'

axios.defaults.params = {};
axios.defaults.params.hash = 'ee006bee2e5f11e55e3043d04f3fb12e';
// axios.defaults.params.hash = cookie.get('admin');
axios.defaults.params.token = process.env.VUE_APP_API_TOKEN;
// axios.defaults.params.token = '276b80ee1d65e6c30dfdf2958ad23ffa';

export default {

    endpoint(uri) {
        if(uri.substring(0, 1) == "/") {
            uri = uri.substring(1, uri.length);
        }
        return process.env.VUE_APP_API_URL + "/" + uri;
    },

    get(uri, params = {}) {
        return axios.get(this.endpoint(uri), {
            params: params,
            withCredentials: true,
        });
    },

    post(uri, params = {}) {
        return axios.post(this.endpoint(uri), params);
    },

    put(uri, params = {}) {
        return axios.put(this.endpoint(uri), params);
    },

    patch(uri, params = {}) {
        return axios.patch(this.endpoint(uri), {
            params: params,
            withCredentials: true,
        });
    },

    delete(uri, params = {}) {
        return axios.delete(this.endpoint(uri), {
            params: params,
            withCredentials: true,
        });
    }
    
}