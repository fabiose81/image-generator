import axios from 'axios'

export function AIService(params) {
    return new Promise((resolve, reject) => {
        axios.post('http://localhost:5000/'.concat(params.service),
            params.data,
            {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
                    'Content-Type': params.contentType,
                    'Access-Control-Allow-Credentials': true
                }
            })
            .then(result => {
                resolve(result.data)
            })
            .catch((error) => {
                reject(error)
            });
    });
}