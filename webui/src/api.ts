const BASE_URL = "http://localhost:8000"

export const ApiService = {
    get: function(endpoint: string) {
        return fetch(`${BASE_URL}/${endpoint}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP Error: Status: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetch data', error.message);
            throw error;
        });
    },
}
