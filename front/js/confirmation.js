const apiLink = `http://localhost:3000/api/products`


fetch(`${apiLink}/order`, {
    method: 'POST',
    headers: {
        'Accept': 'application/json', 
        'Content-Type': 'application/json'
    },
    body: localStorage.getItem('data')
    })
    .then(response => response.json())
    .then(data => {
        document.querySelector('#orderId').textContent = data.orderId
        localStorage.clear()   
    })
    .catch(error => console.error('Error:', error));