export function getOrders() {
    return fetch(`http://localhost:3000/orders`)
        .then(response => response.json())
}

export function getOrderByID(id) {
    return fetch(`http://localhost:3000/orders/${id}`)
        .then(response => response.json())
}

export function setOrder(order) {
    const options = {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(order)
    }

    return fetch("http://localhost:3000/orders", options)
        .then(response => response.json())
}

export function editOrder(order, id) {
    const options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(order)
    }

    return fetch(`http://localhost:3000/orders/${id}`, options)
        .then(response => response.json())
}

export function deleteOrder(id) {
    const options = {
        method: 'DELETE',
    }

    return fetch(`http://localhost:3000/orders/${id}`, options)
        .then(response => response.json())
}

export function getClients() {
    return fetch(`http://localhost:3000/clients`)
        .then(response => response.json())
}

export function getModels() {
    return fetch(`http://localhost:3000/models`)
        .then(response => response.json())
}

export function getComplectation() {
    return fetch(`http://localhost:3000/complectation`)
        .then(response => response.json())
}

export function getCities() {
    return fetch(`http://localhost:3000/cities`)
        .then(response => response.json())
}