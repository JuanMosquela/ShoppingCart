let cart = {}

const templateFooter = document.getElementById('template-footer').content;
const templateCart = document.getElementById('template-cart').content;
const templateCards = document.getElementById('template-card').content;
const fragment = document.createDocumentFragment();
const items = document.getElementById('items');
const footer = document.getElementById('footer');
const btnAdd = document.querySelector('.btn-info');
const btnRemove = document.querySelector('.btn-danger');

document.addEventListener('DOMContentLoaded', () => {
    fetchData()
})

const fetchData = async () => {

    try{
        loading(true);
        const url = await fetch ("api.json");
        const data = await url.json();
        printCards(data)

    }
    catch(error){

        console.log(error)

    }
    finally{
        loading(false)
    }
}

const printCards = (data) => {
    
    const containerCards = document.getElementById('container-cards');    

    data.forEach(item => {
        const clone = templateCards.cloneNode(true);
        clone.querySelector('img').setAttribute('src', item.thumbnailUrl);
        clone.querySelector('h5').innerHTML = item.title;
        clone.querySelector('p').innerHTML = item.precio;
        clone.querySelector("button").dataset.id = item.id;
        fragment.appendChild(clone)

    });

    containerCards.appendChild(fragment)
}

const loading = (state) => {
    const loader = document.getElementById('loading');

    if(state){
        loader.classList.remove('d-none')
    }else{
        loader.classList.add('d-none')
    }
}

document.addEventListener('click', (e)=> {
    e.stopPropagation()
    if(e.target.matches('.btn')){
        
        setCart(e.target.parentElement.parentElement)
    }

})

const setCart = obj => {
    const product = {
		id: obj.querySelector('button').dataset.id,
		title: obj.querySelector('h5').innerHTML ,
		price: obj.querySelector('p').innerHTML,
        
        stock: 1	
    }

    if(cart.hasOwnProperty(product.id)){
        product.stock = cart[product.id].stock + 1
    }

    cart[product.id] = {...product};
    printCart()
}

const printCart = () => {
    Object.values(cart).forEach(product => { 
        items.innerHTML = "";              
        templateCart.querySelector('th').innerHTML = product.title;
        templateCart.querySelector('td').innerHTML = product.stock;
        
        templateCart.querySelector('.btn-danger').dataset.id = product.id;
        templateCart.querySelector('span').innerHTML = product.stock * product.price;

         const clone = templateCart.cloneNode(true)
         fragment.appendChild(clone)         
        
    })

    items.appendChild(fragment);
    console.log(items)

}


btnAdd.addEventListener('click', (e)=>{
    if(e.target.matches('.btn-info')){
        product.stock = cart[product.id].stock + 1

    }
})

btnRemove.addEventListener('click', (e)=>{
    if(e.target.matches('.btn-danger')){
        product.stock = cart[product.id].stock - 1

    }
})



