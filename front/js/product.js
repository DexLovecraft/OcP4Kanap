let url = new URL(window.location.href)
let id = url.searchParams.get("id")
const apiLink = `http://127.0.0.1:3000/api/products/${id}`

let color = ''
let quantity = 1

fetch(apiLink)
    .then(response => response.json())
    .then(data => {
        completion(data)
    })
    .catch(error => console.log('---',error,'---'))

//this function display all information
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

//this event listen to the option of personalisation and push it into a var
document.querySelector('#colors').addEventListener('input', (e) => {
    color = e.target.value
})

//this event listen to the option of personalisation and push it into a var after verification
document.querySelector('#quantity').addEventListener('input', (e) => {
    if (document.querySelector('#quantity').validity.valid === true){
        quantity = e.target.value
        console.log(quantity)
    }
    else{
        quantity = 1
        document.querySelector('#quantity').value = quantity
        console.log(quantity)
        console.log('hors champ')
        window.alert("Quantité invalide, Veuillez entré une quantité entre 1 et 100")
    }
})


const saveToCartVerification = () => {
    if(document.getElementById('colors').value){
        saveToCart()
    }
    else{
        window.alert("vous n'avez pas choisi de couleur")
    }
    //saveToCart()
} 


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
    console.log(existingItems)
} 

document.querySelector('#addToCart').addEventListener('click', saveToCartVerification)

/*if(a == 1 && b == 2){
    console.log(c)
}
/*let chat = localStorage

chat.setItem("monchat","bagera")

console.log(chat)
let monchat = chat.getItem("monchat")
console.log(monchat)
console.log(chat.getItem("monchat"))*/