import { BASE_URL } from './index';

export const api_getAllSupportTickets = (token: any) => {
    const uri = `${BASE_URL}/api/v1/support/`;
    return new Promise((resolve, reject) => {
        fetch(uri, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data?.status !== 200) {
                    throw new Error(data.message || 'something went wrong!');
                }
                resolve(data);
            })
            .catch(err => {
                reject(err);
            });
    });
};

export const api_addSupportTicket = (token: any, data: any) => {
    const uri = `${BASE_URL}/api/v1/support/`;
    return new Promise((resolve, reject) => {
        fetch(uri, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data),
        })
            .then(res => res.json())
            .then(data => {
                if (data?.status !== 200) {
                    throw new Error(data.message || 'something went wrong!');
                }
                resolve(data);
            })
            .catch(err => {
                reject(err);
            });
    });
};

export const api_updateSupportTicket = (token: any, data: any) => {
    const uri = `${BASE_URL}/api/v1/support/update`;
    return new Promise((resolve, reject) => {
        fetch(uri, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data),
        })
            .then(res => res.json())
            .then(data => {
                if (data?.status !== 200) {
                    throw new Error(data.message || 'something went wrong!');
                }
                resolve(data);
            })
            .catch(err => {
                reject(err);
            });
    });
};

export const api_getSupportTicketsChats = (token: any, id: any) => {
    const uri = `${BASE_URL}/api/v1/support/chat/${id}`;
    return new Promise((resolve, reject) => {
        fetch(uri, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
        })
            .then(res => res.json())
            .then(data => {
                console.log(data, 'chat');
                if (data?.status !== 200) {
                    throw new Error(data.message || 'something went wrong!');
                }
                resolve(data);
            })
            .catch(err => {
                reject(err);
            });
    });
};

export const api_sendSupportTicketChat = (token: any, data: any) => {
    const uri = `${BASE_URL}/api/v1/support/send/chat`;
    return new Promise((resolve, reject) => {
        fetch(uri, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data),
        })
            .then(res => res.json())
            .then(data => {
                if (data?.status !== 200) {
                    throw new Error(data.message || 'something went wrong!');
                }
                resolve(data);
            })
            .catch(err => {
                reject(err);
            });
    });
};