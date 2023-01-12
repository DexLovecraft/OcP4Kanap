fetch('http://127.0.0.1:3000/api/products')
    .then(response => response.json())
    .then(data => {
        fetch(`http://127.0.0.1:3000/api/products/${data[0]._id}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch(error => console.log('---',error,'---'))
    })
    .catch(error => console.log('---',error,'---'))