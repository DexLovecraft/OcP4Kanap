const existingItems = JSON.parse(localStorage.getItem("items"))
const apiLink = `http://localhost:3000/api/products`

let cartItemContainer = document.querySelector('#cart__items')

//Cet fonction affiche le contenue du panier de maniere dynamique en recuperant les inforamtion du localstorage et de l'api, elle appelle ensuite les fonction de modification.
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

 //cet fonction calcul la quatité total et l'injecte dans l'html
const totalQuantityCalc = () => {
    let totalQuantity = 0  
    for(let object in existingItems){
        totalQuantity += parseInt(existingItems[object].quantity)
    }
    document.querySelector('#totalQuantity').textContent = totalQuantity
}

//cet fonction calcul le prix total sans sauvegarder le prix, elle va donc chercher dans l'api le prix de tout les produit du panier et le multiplie a la quantité 
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

//cet fonction permet de modifié la quantité d'un produit tout en remplacant l'ancienne quantité dans le localsotrage par la nouvelle.
const quantityModification = (num) => {
    document.querySelectorAll('.itemQuantity')[num].addEventListener('input', e => {
        let newQuantity = 0
        if (document.querySelectorAll('.itemQuantity')[num].validity.valid == true){
            newQuantity = e.target.value 
        }
        else{
            newQuantity = 1
            document.querySelectorAll('.itemQuantity')[num].value = newQuantity
            window.alert("Quantité invalide, Veuillez entrer une quantité entre 1 et 100")
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
        totalQuantityCalc()
        totalPriceCalc()
    })
}

//cette fonction peremet de suprimer un rpoduit du panier
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

const contact = {}
let products = []

const orderForm = document.querySelector('.cart__order__form')

const firstNameField = document.querySelector('#firstName')
const lastNameField = document.querySelector('#lastName')
const addressField = document.querySelector('#address')
const cityField = document.querySelector('#city')
const emailField = document.querySelector('#email')
const orderButton = document.querySelector('#order')


//cet fonction verifie si il y a des chiffre dans un champs
const withNumber = (value) => {
    const regexNum = new RegExp('[0-9]')
    return regexNum.test(value)
}

//cet fonction verifie si ce qui est rentrer dans un champs est un e-mail valide
const isEmailValid = (email) => {
    const regexMail = new RegExp('/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/')
    return regexMail.test(email)
}

//cet fonction a l'aide de la fonction withNumber verifie si il y a des chifre dans le champs prénom, si il y en a elle affiche une erreur et retourne false 
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

//cet fonction a l'aide de la fonction withNumber verifie si il y a des chifre dans le champs nom, si il y en a elle affiche une erreur et retourne false
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

//cet fonction a l'aide de la fonction withNumber verifie si il y a des chifre dans le champs adresse, si il y en a pas elle affiche une erreur et retourne false
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

//cet fonction a l'aide de la fonction withNumber verifie si il y a des chifre dans le champs ville, si il y en a elle affiche une erreur et retourne false
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

//cet fonction a l'aide de la fonction isEmailValid verifie si l'email du champs correspondant est valid, si oui retourne true 
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

//cet evenement ecoute le bouton commander. il verifie que toutes les verification retourne true apres les avoir appeller. si oui il fait un apelle a api et redirige vers la page confirmation avec le orderId dans le lien
//si non, les erreur correspondante a chaque verification s'affiche
orderForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let firstNameValid = firstNameValidation(), lastNameValid = lastNameValidation(), 
    cityValid = cityValidation(),
    addressValid = addressValidation(),
    emailValid = emailValidation()

    let isFormValid = firstNameValid && lastNameValid && cityValid && addressValid && emailValid

    if(isFormValid){
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