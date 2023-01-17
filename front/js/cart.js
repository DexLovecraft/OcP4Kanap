const existingItems = JSON.parse(localStorage.getItem("items"))
const apiLink = `http://127.0.0.1:3000/api/products`

let cartItemContainer = document.querySelector('#cart__items')

const productInCartDisplay = () => {
    for (let object in existingItems){
        fetch(`${apiLink}/${existingItems[object].id}`)
            .then(response => response.json())
            .then(data => {
                let cartItem = document.createElement('article')
                cartItem.classList.add('cart__item')
                cartItem.dataset.id = `{${existingItems[object].id}}`
                cartItem.dataset.color = `{${existingItems[object].color}}`

                cartItemContainer.appendChild(cartItem)

                let cartImgContainer = document.createElement('div')
                cartImgContainer.classList.add('cart__item__img')
                cartItem.appendChild(cartImgContainer)

                let cartImg = document.createElement('img')
                cartImg.src = data.imageUrl
                cartImg.alt = data.altTxt
                cartImgContainer.appendChild(cartImg)

                let cartItemContent = document.createElement('div')
                cartItemContent.classList.add('cart__item__content')
                cartItem.appendChild(cartItemContent)

                let cartItemDescription = document.createElement('div')
                cartItemDescription.classList.add('cart__item__content__description')
                cartItemContent.appendChild(cartItemDescription)

                let itemName = document.createElement('h2')
                itemName.textContent = data.name
                let itemColor = document.createElement('p')
                itemColor.textContent = existingItems[object].color
                let itemPrice = document.createElement('p')
                itemPrice.textContent = `${data.price} €`

                cartItemDescription.appendChild(itemName)
                cartItemDescription.appendChild(itemColor)
                cartItemDescription.appendChild(itemPrice)

                let cartItemSettings = document.createElement('div')
                cartItemContent.classList.add('cart__item__content__settings')
                cartItemContent.appendChild(cartItemSettings)

                let cartQuantityContainer = document.createElement('div')
                cartQuantityContainer.classList.add('cart__item__content__settings__quantity')
                cartItemSettings.appendChild(cartQuantityContainer)

                let quantity = document.createElement('p')
                quantity.textContent = 'Qté : '
                let quantityForm = document.createElement('input')
                quantityForm.classList.add('itemQuantity')
                quantityForm.type = 'number'
                quantityForm.name = 'itemQuantity'
                quantityForm.min = '1'
                quantityForm.max = '100'
                quantityForm.value = `${existingItems[object].quantity}`

                cartQuantityContainer.appendChild(quantity)
                cartQuantityContainer.appendChild(quantityForm)

                let cartDelete = document.createElement('div')
                cartDelete.classList.add('cart__item__content__settings__delete')
                cartItemSettings.appendChild(cartDelete)

                let cartDeleteContent = document.createElement('p')
                cartDeleteContent.classList.add('deleteItem')
                cartDeleteContent.textContent = 'Supprimer'
                cartDelete.appendChild(cartDeleteContent)
            })
            .catch(error => console.log('---',error,'---'))
        }
 }

const totalQuantityCalc = () => {
    let totalQuantity = 0  
    for(let object in existingItems){
        totalQuantity += parseInt(existingItems[object].quantity)
    }
    document.querySelector('#totalQuantity').textContent = totalQuantity
}

const totalPriceCalc = () => {
    let totalPrice = 0
    for(let object in existingItems){
        fetch(`${apiLink}/${existingItems[object].id}`)
        .then(response => response.json())
        .then(data => {
            totalPrice = totalPrice + existingItems[object].quantity * data.price
            document.querySelector('#totalPrice').textContent = totalPrice
        })
        .catch(error => console.log('---',error,'---'))
    }
}

//faut que je puisse le lancer a voir demain 
const quantityModification = () => {
    document.querySelector('.itemQuantity').addEventListener('input', e => {
        console.log(e)
    })
}

totalQuantityCalc()

totalPriceCalc()

productInCartDisplay()

