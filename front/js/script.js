const apiLink = `http://localhost:3000/api/products`



//Cet fonction creer a elle seul les carte produits de maniere dynamique. elle recupere les information produit dans l'api et les affiche sur la page
function cardCreation() {
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