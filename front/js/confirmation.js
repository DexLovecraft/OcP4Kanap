let url = new URL(window.location.href)

//cet ligne affiche le order ID a ca place
document.querySelector('#orderId').textContent = url.searchParams.get('orderId')

//puis suprime tout du local storage car la commande a été passer
localStorage.clear()