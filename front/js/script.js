const apiLink = `http://127.0.0.1:3000/api/products`



//This function create each cart dynaiccaly. form the creation of dom element to the completion by the server response
const cardCreation = () => {
    let Items = document.querySelector('#items')
    fetch(apiLink)
    .then(response => response.json())
    .then(data => {
        for (let object in data){
            let cardConntainer = document.createElement('a')
            cardConntainer.href = `./product.html?id=${data[object]._id}`
            Items.appendChild(cardConntainer)
    
            let cardConntainers = document.querySelectorAll('#items a')[object]
            let card = document.createElement('article')
            cardConntainers.appendChild(card)
    
            let cards = document.querySelectorAll('#items a article')[object]
    
            let img = document.createElement('img')
            img.src = data[object].imageUrl
            img.alt = data[object].altTxt
            let title = document.createElement('h3')
            title.classList.add('productName')
            title.textContent = data[object].name
            let description = document.createElement('p')
            description.classList.add('productDescription')
            description.textContent = data[object].description
    
            cards.appendChild(img)
            cards.appendChild(title)
            cards.appendChild(description)
        }
    })
    .catch(error => console.log('---',error,'---'))
}

cardCreation()