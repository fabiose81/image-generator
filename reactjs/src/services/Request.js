import axios from 'axios'

export function s3(data) {
    const headers = getHeaders('application/json');
    return request('s3', data, headers);
}

export function generateImageByAudio(data) {
    const headers = getHeaders('application/octet-stream');
    return request('audio', data, headers);
}

export function generateImageByText(data) {
    const headers = getHeaders('application/json');
    return request('image', data, headers);
}

export function request(service, data, headers) {
    return new Promise((resolve, reject) => {
        axios.post('http://localhost:5000/'.concat(service),
            data,
            {
                headers: headers
            })
            .then(result => {
                resolve(result.data)
            })
            .catch((error) => {
                reject(error.response.data)
            });
    });
}

const getHeaders = (contentType) => {
    const headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    headers.append('Access-Control-Allow-Credentials', true);
    headers.append('Content-Type', contentType);

    return headers;
}