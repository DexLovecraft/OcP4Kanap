const existingItems = JSON.parse(localStorage.getItem("items"))
const apiLink = `http://localhost:3000/api/products`

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

                setTimeout(() => {
                    quantityModification(object)
                    deleteItem(object)
                },50)
                
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
    if(existingItems.length == 0){
        totalPrice = 0
        document.querySelector('#totalPrice').textContent = totalPrice    }
    else{
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
}

//faut que je puisse le lancer a voir demain 
const quantityModification = (num) => {
    document.querySelectorAll('.itemQuantity')[num].addEventListener('input', e => {
        let newQuantity = 0
        let id = ''
        let color = ''
        let quantity = 0
        if (document.querySelectorAll('.itemQuantity')[num].validity.valid == true){
            newQuantity = e.target.value 
        }
        else{
            newQuantity = 1
            document.querySelectorAll('.itemQuantity')[num].value = newQuantity
            console.log('hors champ')
            window.alert("Quantité invalide, Veuillez entré une quantité entre 1 et 100")
        }

        existingItems[num].quantity = newQuantity
        const newItem = {
            id: existingItems[num].id,
            color: existingItems[num].color,
            quantity: newQuantity
        }
            
        if (existingItems[num].quantity !== newQuantity) {
            existingItems.splice(existingItems[num], 1, newItem)
        }
        localStorage.setItem("items", JSON.stringify(existingItems))
        console.log(existingItems)
        totalQuantityCalc()
        totalPriceCalc()
    })
}

const deleteItem = (num) => {
        document.querySelectorAll('.deleteItem')[num].addEventListener('click', (e) => {
        existingItems.splice(existingItems[num], 1)
        localStorage.setItem("items", JSON.stringify(existingItems))
        cartItemContainer.innerHTML = ''

        setTimeout(() => {
            productInCartDisplay()
            totalQuantityCalc()
            totalPriceCalc()
        }, 50)
    })
}

/*let isValid = false
const regexNum = new RegExp('[0-9]')
const regexMail = new RegExp('^[^\s@]+@[^\s@]+\.[^\s@]+$')

let test1 = 'alex'*/
const contact = {}
let products = []

const orderForm = document.querySelector('.cart__order__form')

const firstNameField = document.querySelector('#firstName')
const lastNameField = document.querySelector('#lastName')
const addressField = document.querySelector('#address')
const cityField = document.querySelector('#city')
const emailField = document.querySelector('#email')
const orderButton = document.querySelector('#order')

const withNumber = (value) => {
    const regexNum = new RegExp('[0-9]')
    return regexNum.test(value)
}

const isEmailValid = (email) => {
    const regexMail = new RegExp('/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/')
    return regexMail.test(email)
}

const firstNameValidation = () => {
    let valid = false 
    const firstName = firstNameField.value.trim()
    let errorField = document.querySelector('#firstNameErrorMsg')
    if(withNumber(firstName)){
        let valid = false 
        errorField.textContent = 'Il ne doit pas y avoir de chiffres dans ce champs'
        return valid
    }
    else{
        valid = true
        const newValue = {firstName : firstName}
        Object.assign(contact, newValue)
        errorField.textContent = ''
        return valid
    }
}

const lastNameValidation = () => {
    let valid = false 
    const lastName = lastNameField.value.trim()
    let errorField = document.querySelector('#lastNameErrorMsg')
    if(withNumber(lastName)){
        let valid = false 
        errorField.textContent = 'Il ne doit pas y avoir de chiffres dans ce champs'
        return valid
    }
    else{
        valid = true
        const newValue = {lastName : lastName}
        Object.assign(contact, newValue)
        errorField.textContent = ''
        return valid
    }
}

const addressValidation = () => {
    let valid = false 
    const address = addressField.value.trim()
    let errorField = document.querySelector('#addressErrorMsg')
    if(!withNumber(address)){
        let valid = false 
        errorField.textContent = 'Il doit y avoir au moins un chiffres dans ce champs'
        return valid
    }
    else{
        valid = true
        const newValue = {address : address}
        Object.assign(contact, newValue)
        errorField.textContent = ''
        return valid
    }
}

const cityValidation = () => {
    let valid = false 
    const city = cityField.value.trim()
    let errorField = document.querySelector('#cityErrorMsg')
    if(withNumber(city)){
        let valid = false 
        errorField.textContent = 'Il ne doit pas y avoir de chiffres dans ce champs'
        return valid
    }
    else{
        valid = true
        const newValue = {city : city}
        Object.assign(contact, newValue)
        errorField.textContent = ''
        return valid
    }
}

const emailValidation = () => {
    let valid = false 
    const email = emailField.value.trim()
    let errorField = document.querySelector('#emailErrorMsg')
    if(isEmailValid(email)){
        let valid = false 
        errorField.textContent = 'Vous devez rentrer une adresse e-mail valide'
        return valid
    }
    else{
        valid = true
        const newValue = {email : email}
        Object.assign(contact, newValue)
        errorField.textContent = ''
        return valid
    }
}


orderForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let firstNameValid = firstNameValidation(), lastNameValid = lastNameValidation(), 
    cityValid = cityValidation(),
    addressValid = addressValidation(),
    emailValid = emailValidation()

    let isFormValid = firstNameValid && lastNameValid && cityValid && addressValid && emailValid

    if(isFormValid){
        console.log('formulaire ok')
        for(let object in existingItems){
            products.push(existingItems[object].id)
        }
        let data = {contact, products}
        fetch(`${apiLink}/order`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                  document.location.href = `./confirmation.html?orderId=${data.orderId}`
            })
            .catch(error => console.error('Error:', error));
    }
})

totalQuantityCalc()
totalPriceCalc()
productInCartDisplay()

/*const contact = {
	firstName: "Alex",
	lastName: "Lovecraft",
	address: "1 place spire le maitre",
	city: "Vincennes",
	email: "andrewlondon16@gmail.com",
}
const products = ["107fb5b75607497b96722bda5b504926","055743915a544fde83cfdfc904935ee7"]
const data = {contact, products}

fetch(`${apiLink}/order`, {
    method: 'POST',
    headers: {
        'Accept': 'application/json', 
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data)
        console.log(data.orderId)    
    })
    .catch(error => console.error('Error:', error));*/