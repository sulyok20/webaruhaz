/*
Create (új sor, új objektum)
Read (táblázat lista)
Update (sor (objektum) módoisítás)
Delete (sor tötlés)

CRUD műveletek
*/

//state

state = {
    //Adatstruktúra
    products: [
        {
            id: idGen(),
            name: "Áru 1",
            price: 1500,
            quantity: 97,
            isInStock: true
        },
        {
            id: idGen(),
            name: "Áru 2",
            price: 2500,
            quantity: 15,
            isInStock: true
        },
        {
            id: idGen(),
            name: "Áru 3",
            price: 3500,
            quantity: 25,
            isInStock: false
        },
        {
            id: idGen(),
            name: "Áru 4",
            price: 4500,
            quantity: 10,
            isInStock: true
        }
    ],

    cart: [],

    event: "read", //milyen állapotban van: read, delete, update, create
    currentId: null //Update esetén itt tároljuk a módosítandó product id-jét
}

//#region Segéd függvények
//Űrlap megjelenítése
function formView(){
    document.getElementById("form").classList.remove("d-none")
}

//űrlap elrejtése
function formHide(){
    document.getElementById("form").classList.add("d-none")
}

//Id generátor
function idGen(){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

//id alapján megkeresi az index-et: id -> index
function searchIndex(id){
    for (let index = 0; index < state.products.length; index++) {
        if (id === state.products[index].id) {
            return index;
        }
    }
}
//#endregion 

//Mégse gomb működtetése
document.getElementById("cancel-product").onclick=function(){
    state.event = "read";
    formHide();
};

//Create: Új áru gomb
document.getElementById("new-product").onclick = function(id){
    state.event = "create";
    //látszódjon az Új áru cím

    document.getElementById("title-new").classList.remove("d-none");
    document.getElementById("title-update").classList.add("d-none");
    formView();
};

//Save: Mentés gomb
document.getElementById("save-product").onclick = function(event){
    event.preventDefault();

    //Hozzájutás az adatokhoz
    let name = document.getElementById("name").value;
    let price = +document.getElementById("price").value;
    let isInStock = document.getElementById("isInStock").checked;

    //validálás
    let errorList = [];
    if (! (name)){
        console.log("namehiba");
        document.getElementById("name-label").classList.add("text-danger");
        errorList.push("Name hiba");
    }else{
        document.getElementById("name-label").classList.remove("text-danger");
    }
    if (! (price)){
        console.log("namehiba");
        document.getElementById("price-label").classList.add("text-danger");
        errorList.push("Price hiba");
    }else{
        document.getElementById("price-label").classList.remove("text-danger");
    }

    if (errorList.length >0) {
        return;
    }

   //alapban generálunk
    let id = idGen();
    if(state.event === "update") {
        //update: az kéne, amire kattintottunk
        id = state.currentId;
    }
  

    let product = {
        id: id,
        name: name,
        price: price,
        isInStock: isInStock
    }

    if (state.event == "create" ) {
        state.products.push(product);
    }
   else if (state.event = "update") {
        let index = searchIndex(id);
        state.products[index] = product;
    }
    
    renderProducts();
    formHide()

    //mezők ürítése
    document.getElementById("name").value = null;
    document.getElementById("price").value = null;
}

//kosar megmutatasa
function cartRender(){
    //kosar ablak megjelenitese
    cartBoxView()
    //lista eloallitasa
    let cardHTML = "";
    let total = 0;
    //vegigmegyunk a kosaron
    for (const product of state.cart) {
        cardHTML += `
        
        <li class="list-group-item">${product.name}, ${product.price}ft/db, ${product.quantity}db, ár: ${product.price*product.quantity}
            <button type="button" class="btn btn-danger btn-sm" 
            onclick="deleteFromCart('${product.id}')">
            Törlés
            </button>
        </li>     
      
        `;
        total += product.price*product.quantity;
    }

    
    
    //lista berakasa az ul-be
    document.getElementById("cartlist").innerHTML=cardHTML

    //total kiirasa

    document.getElementById("total").innerHTML = total;
}

//kosar aru mennyiseg kiszamolasa es beirasa

function renderCartCount(){
    //mennyi aru van a kosarba 
    let count = state.cart.length;
    
    //ird ki ezt az erteke a "cart-count"-ba
    document.getElementById("cart-count").innerHTML = count
}

//torles a kosarbol
//issue: torles a kosarbol
function deleteFromCart(id) {
    //megkeressuk a cartban az indexet ami az idhez tartozik
    let index = searchIndexByIDInCart(id);

    //kiszedjuk a kosarbol az indexhez tartozo arut
    
    //darabszam korrekcio
    
    //1. megkeresem a dbszamoz
    let quantity = state.cart[index].quantity
    //2. megkeresem a raktarban a kitorolt arut
    let indexP = searchIndex(id);
    //3. korrigalom a darabszamot
    state.products[indexP].quantity += quantity
    
    
    state.cart.splice(index,1)
    //render: kosar, kartyak
    cartRender();
    renderProducts();
    
}
    
function searchIndexByIDInCart(id){
    let indexR = -1
    for (let index = 0; index < state.cart.length; index++) {
        if (state.cart[index].id == id) {
            indexR = index
            break
        }
    }
    return indexR;
}


//vasarlas
//issue: ki kell dolgozni a fizetes folyamatat
function payRender(){
    console.log("payRender");
    cartBoxHide()
}

//tovabb vasarolok
function ContinueBuy(){
    console.log("ContinueBuy()");
    cartBoxHide();
}

//kosar eltuntetese
function cartBoxHide(){
    document.getElementById("cart-box").classList.add("d-none")

}

function cartBoxView(){
    document.getElementById("cart-box").classList.remove("d-none")

}


//Read: product lista
function renderProducts(){
    state.event = "read";
    let prodctsHtml = "";
    
    state.products.forEach(product => {
        prodctsHtml += `
        <div class="col">
            <div class="card ${product.quantity > 0 ? "" : "bg-warning"}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">Termék ár: ${product.price} Ft</p>
                    <p class="card-text">Raktáron: ${product.quantity} db</p>
                </div>

                <div class="d-flex flex-row m-2">
                    <!-- Törlés -->
                    <button type="button" 
                        class="btn btn-danger btn-sm"
                        onclick="deleteProduct('${product.id}')"
                    >
                        Törlés
                    </button>

                    <!-- Módosítás -->
                    <button type="button" 
                        class="btn btn-success ms-2 btn-sm"
                        onclick="updateProduct('${product.id}')"
                    >
                        Módosít
                    </button>
                </div>

                <div class="d-flex flex-row m-2">
                    <!-- Kosárba rakás -->
                    <button type="button" 
                        class="btn btn-outline-success col-4"
                        onclick="intoCart('${product.id}')"
                    >
                        <i class="bi bi-cart-plus"></i>
                    </button>
                    
                    <!-- Mennyit rakok a kosárba -->
                    <input
                        type="number"
                        class="form-control ms-2"
                        id="${product.id}"
                        value="1"
                        min="1"
                        max="${product.quantity}"
                        onchange="quantityInputCheck('${product.id}')"
                    />
                </div>
            </div>
        </div>`;
        
    });
    document.getElementById("product-list").innerHTML = prodctsHtml;
}

function quantityInputCheck(id){
    //kiszedjuk mi van beleirva
    let quantity = + document.getElementById(id).value
    console.log("check", id, quantity);

    //kiszedjuk az id alapjan hogy a raktarban mennyi van belole
    let index = searchIndex(id);
    let quantityP = state.products[index].quantity

    //vizsgalat ha tobbet vagy negativot irtunk akkor korrigalunk

    if (quantity < 0) {
        document.getElementById(id).value = 1
    } else if(quantity > quantityP){
        document.getElementById(id).value = quantityP
    }

}

//Kosár
//issue: Ugyanazt a terméket többször be lehet tenni
//issue: nem kell az isInsStock: bevitel, és egyéb helyeken
function intoCart(id){
    //Derítsük ki az indexet
    let index = searchIndex(id);
    
    let quantity = +document.getElementById(`${id}`).value

    //Mennyiség korrektció:
    //le kell vonni az eredeti mennyiségből
    state.products[index].quantity = state.products[index].quantity - quantity;

    // let product = {
    //     id: state.products[index].id,
    //     name: state.products[index].name,
    //     price: state.products[index].price,
    //     quantity: quantity,
    //     isInStock: state.products[index].isInStock
    // }
    let product = {...state.products[index]}
    product.quantity = quantity;

    // let product = state.products[index];

    // van e  a kosarban id ju aru?
    let indexC = searchIndexByIDInCart(id)
    if (indexC === -1) {
        //meg nincs ilyen a kosarba
        //push a kosarba
        state.cart.push(product);
    } else {
        state.cart[indexC].quantity += quantity;
    }

    //a kosárba ezzel amennyiséggel kell berakni
    //push a kosárba
    state.cart.push(product);


    //újrarendereljük a termékeket
    renderProducts();
    renderCartCount()
    //logojuk a kosarat
    console.log(state.cart);

}



//Update: Módosít gomb függvénye
function updateProduct(id){
    state.event = "update"
    state.currentId = id;
    //kerüljenek bele az űrlapba a kártya datai
    let index = searchIndex(id);
    //beolvassuk az űrlapba
    let name = state.products[index].name
    let price = state.products[index].price
    let isInStock = state.products[index].isInStock
    document.getElementById("name").value = name;
    document.getElementById("price").value = price;
    document.getElementById("isInStock").checked = isInStock;

    document.getElementById("title-update").classList.remove("d-none");
    document.getElementById("title-new").classList.add("d-none");

    formView();
    console.log(id);
}

//Delete: Töröl gomb függvénye
function deleteProduct(id){
    state.event = "delete";
    let index = searchIndex(id)
    state.products.splice(index,1);
    renderProducts()
}

//Amikor betöltődött az oldal, elindul a: renderProducts függvény
window.onload = renderProducts;