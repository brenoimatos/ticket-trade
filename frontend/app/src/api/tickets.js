import { BASE_URL } from '../api/apiConfig';

export async function getTickets(eventId) {
    return fetch(`${BASE_URL}/tickets/?event_id=${eventId}`)
    .then(res => res.json())
    .catch(err => console.error(err));
}

export async function createTicket(event_id, price, is_for_sale) {
    try {
        const res = await fetch(`${BASE_URL}/tickets/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({event_id, price, is_for_sale}),
            credentials: 'include'
        })
    
        const data = await res.json();
        
        if (!res.ok) {
            throw {
                message: data.detail,
                statusText: res.statusText,
                status: res.status
            }
        }
        return data;
    } catch (err) {
        console.error(err);
    }
}


// const response = await fetch(`${BASE_URL}/tickets/`, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json'
    //       },
    //       body: JSON.stringify(ticketData),
    //       credentials: 'include'
    //     });