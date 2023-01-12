const apiLink = `http://127.0.0.1:3000/api/products`

fetch(apiLink)
    .then(response => response.json())
    .then(data => {
        for (let id in data){
            fetch(`${apiLink}/${data[id]._id}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch(error => console.log('---',error,'---'))
        }
    })
    .catch(error => console.log('---',error,'---'))