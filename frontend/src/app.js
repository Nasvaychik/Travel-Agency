import axios from 'axios';

export const app = axios.create({
    baseURL: "http://localhost:8080/"
});

async function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

app.interceptors.request.use(async (request) => {
    const accessToken = localStorage.getItem('token');

    if (accessToken) {
        request.headers.Authorization = `Bearer ${accessToken}`;
    }

    return request;
});

app.interceptors.response.use(async (response) => {
    if (response.status === 401) {
        logout.then(() => {
            window.location.href = `/login/?next=${encodeURIComponent(window.location.pathname + window.location.search + window.location.hash)}`;
        })
        
    }
    return response;
}, async (error) => {
    if (error.response && error.response.status === 401) {
        logout().then(() => {
            window.location.href = `/login/?next=${encodeURIComponent(window.location.pathname + window.location.search + window.location.hash)}`;
        });
    }
    return error;
})

app.interceptors.response.use(
    (response) => {
        if (response.status >= 200 && response.status < 300) {
            return response;
        }
        return Promise.reject(response);
    },
    (error) => {
        return Promise.reject(error.response.detail);
    }
);