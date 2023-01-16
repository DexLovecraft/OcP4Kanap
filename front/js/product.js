let url = new URL(window.location.href)
let id = url.searchParams.get("id")
const apiLink = `http://127.0.0.1:3000/api/products/${id}`

let color = ''
let quantity = 0

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
    if (document.querySelector('#quantity').validity.valid == true){
        quantity = e.target.value
        console.log(quantity)
    }
    else{
        quantity = 0
        console.log(quantity)
        console.log('hors champ')
        window.alert("Quantité invalide, Veuillez entré une quantité entre 1 et 100")
    }
})

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

    existingItems.push(newItem)
    localStorage.setItem("items", JSON.stringify(existingItems))
    console.log(existingItems)
} 

document.querySelector('#addToCart').addEventListener('click', saveToCart)

a = 1
b = 3 
c = 2

if(a == 1 && b == 2){
    console.log(c)
}
/*let chat = localStorage

chat.setItem("monchat","bagera")

console.log(chat)
let monchat = chat.getItem("monchat")
console.log(monchat)
console.log(chat.getItem("monchat"))*/