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

document.querySelector('#colors').addEventListener('input', (e) => {
    color = e.target.value
    console.log(color)
})

document.querySelector('#quantity').addEventListener('input', (e) => {
    if(e.target.value <= 100){
        quantity = e.target.value
        console.log(quantity)
    }
    else{
        quantity = 100
        console.log(quantity)
    }
})