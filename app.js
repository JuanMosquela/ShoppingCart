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
    fetchData();
	if(localStorage.getItem('cart')){
		cart = JSON.parse(localStorage.getItem('cart'));
		printCart();
	}
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

items.addEventListener('click', (e) => {
	btnAction(e)
})

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
    if(e.target.matches('.btn-dark')){
        
       setCart(e.target.parentElement)
		
    }

})

const setCart = obj => {
	
    const product = {
		id: obj.querySelector('button').dataset.id,
		title: obj.querySelector('h5').innerHTML,
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
	items.innerHTML = "";              
    Object.values(cart).forEach(product => { 
        templateCart.querySelector('th').textContent = product.title;
        templateCart.querySelectorAll('td')[1].textContent = product.stock;  
		templateCart.querySelector('.btn-info').dataset.id = product.id;      
        templateCart.querySelector('.btn-danger').dataset.id = product.id;
        templateCart.querySelector('span').innerHTML = product.stock * product.price; 

        const clone = templateCart.cloneNode(true)
        fragment.appendChild(clone)         
        
    })

    items.appendChild(fragment);
    printFooter();

	localStorage.setItem('cart', JSON.stringify(cart))

};



const printFooter = () => {
    footer.innerHTML = ""
    if(Object.keys(cart).length === 0){
        footer.innerHTML = `
		<th scope="row" colspan="5">Shoping Cart Empty - start buying!</th>` 
		
		return

    }

	const nCantidad = Object.values(cart).reduce((acc, {stock}) => acc + stock, 0);
	const nPrecio = Object.values(cart).reduce((acc,{stock,price}) => acc + stock * price, 0)
	
	
	templateFooter.querySelector('td').innerHTML = nCantidad;
	templateFooter.querySelector('span').innerHTML = nPrecio;
	const clone = templateFooter.cloneNode(true);
	fragment.appendChild(clone);     
	footer.appendChild(fragment);	 
	
}

document.addEventListener('click', (e) => {
	if(e.target.matches('#empty')){
		emptyCart();
	}
})

const emptyCart = () => {
	cart = {};	
	printCart();	
	printFooter();

}

const btnAction = (e) => {

	

	if(e.target.matches('.btn-info')){

		const product = cart[e.target.dataset.id];
		product.stock++ ;
		cart[e.target.dataset.id] = {...product}
		printCart();
	}

	if(e.target.matches('.btn-danger')){
		const product = cart[e.target.dataset.id];
		product.stock-- ;	

		if(product.stock === 0){
			delete cart[e.target.dataset.id]			
		}

		printCart();
		
	}
}










 



