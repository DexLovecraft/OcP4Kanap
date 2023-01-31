let url = new URL(window.location.href)
let id = url.searchParams.get("id")
const apiLink = `http://localhost:3000/api/products/${id}`

let color = ''
let quantity = '1'

fetch(apiLink)
    .then(response => response.json())
    .then(data => {
        completion(data)
    })
    .catch(error => console.log('---',error,'---'))

//ce fonction lancée dans le fetch, recupere les données du produit sur le quelle on a cliquer, et affiche tout les detail 
const completion = (data) => {
    let img = document.createElement('img')
    img.src = data.imageUrl
    img.alt = data.altTxt
    document.querySelector('.item__img').appendChild(img)

    document.querySelector('#title').textContent = data.name
    document.querySelector('#price').textContent = data.price
    document.querySelector('#description').textContent = data.description

    data.colors.forEach(color => {
        let option = document.createElement('option')
        option.value = color
        option.textContent = color
        document.querySelector('#colors').appendChild(option)
    })
}

//Cet evenenement ecoute le formaluaire a option couleur et injecte la selection dans une variable.0
document.querySelector('#colors').addEventListener('input', (e) => {
    color = e.target.value
})

//Cet evenement ecoute le formulaire de selection de quantité, verifie si la donnée rentrer et valide et si elle l'est l'injecte dans une variable. si elle ne l'est pas, affiche une errreur et reinitialise la valeur.
document.querySelector('#quantity').addEventListener('input', (e) => {
    if (document.querySelector('#quantity').validity.valid === true){
        quantity = e.target.value
    }
    else{
        quantity = 1
        document.querySelector('#quantity').value = quantity
        window.alert("Quantité invalide, Veuillez entré une quantité entre 1 et 100")
    }
})

//cet fonction verifie que l'on a bien choise une couleur et si oui appelle la fonction saveToCart
const saveToCartVerification = () => {
    if(document.getElementById('colors').value){
        saveToCart()
    }
    else{
        window.alert("vous n'avez pas choisi de couleur")
    }
} 

//La fonction ajouter au panier creer la viable items existant si elle n'existe pas dans le localstorage, creer un nouvelle item avec l'id correspondant a la page, la couleurs et la quatité choisie
//apres ca on verifie que le produit exactement identitique n'existe pas, si il existe on modifie le produit existant en lui ajoutant la noiuvelle quantité
//si il n'existe pas on ajoute le nouvelle item, dans les deux cas a la fin on sauvegarde dans le local storage
const saveToCart = () =>  {
    let existingItems = JSON.parse(localStorage.getItem("items"));
    if(existingItems === null) {
        existingItems = []
    }

    const newItem = {
        id: id,
        color: color,
        quantity: quantity
    }

    const existingItemIndex = existingItems.findIndex(item => item.id === id && item.color === color)

    if (existingItemIndex !== -1) {
        existingItems[existingItemIndex].quantity = parseInt(existingItems[existingItemIndex].quantity) + parseInt(newItem.quantity)
        existingItems[existingItemIndex].quantity = String(existingItems[existingItemIndex].quantity)
        existingItems.splice(existingItemIndex, 1, existingItems[existingItemIndex])
    } else {
        existingItems.push(newItem)
    }

    localStorage.setItem("items", JSON.stringify(existingItems))
} 

//cet evenement ecoute le bouton ajouter au panier, et appelle la fonction de verification
document.querySelector('#addToCart').addEventListener('click', saveToCartVerification)