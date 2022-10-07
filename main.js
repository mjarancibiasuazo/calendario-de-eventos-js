
//VARIABLES
let events = []; //guardamos los eventos en el array
let arr = []; // cargar información y luego se asigna a events

//REFERENCIA A LOS ELEMENTOS HTML
const eventName = document.querySelector('#eventName');
const eventDate = document.querySelector('#eventDate');
const buttonAdd = document.querySelector('#bAdd');
const eventsContainer = document.querySelector('#eventsContainer');

//LOCAL STORAGE (ALMACENAMIENTO GUARDAMOS INFO DE LA ESTRUCTURA CLAVE VALOR)
const json = load(); //almacenamos lo guardado en JSON

//guardamos la info del arreglo, lo guardamos como un objeto JSON en texto.
try{
    arr = JSON.parse(json);//JSON.parse puede tronar si no estamos recupeando nada (undefine)
} catch (error){
    arr = []; //arreglo sigue siendo un arreglo
}
events = arr? [...arr]: []; //Si arreglo existe es decir si es diferente de null o undefine 
//ahora copias lo que tengo en arr para events, si no sigues siendo un arreglo vacio


renderEvents();//llamamoa a esta función para que la dibuje.





//encontrar el elemento con el queryselector al form
//evento submit ejecuta los métodos e.preventDefault y addEevnt();
document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    addEvent();
});


buttonAdd.addEventListener('click', (e)=> {
    e.preventDefault();
    addEvent();
});

//Función que valida los inputs
function addEvent(){
    if(eventName.value === "" || eventDate.value === ""){
        return; //se termina la acción con el return.
    }

    //La diferencia de fechas actual a la fecha del evento es negativa
   if(dateDiff(eventDate.value) < 0){ //fecha destino
    return;//no agruegues nada.
   } 

   //Nuevo Evento (objeto)
   const newEvent = {
    id: (Math.random() * 100).toString(36).slice(3),
    name: eventName.value,
    date: eventDate.value,
};

    //unshift agregamos un elemento al inicio del arreglo
    events.unshift(newEvent);
    
    save(JSON.stringify(events));//transformamos el arreglo de eventos en un string

    eventName.value = "";

    renderEvents();

}

//función que calcula la diferencia del día actual con la fecha ingresada.
//dateDiff almacena la diferencia entre las fechas.
function dateDiff(d){ //fecha destino
    const targetDate = new Date(d);
    const today = new Date();//fecha de hoy
    const difference = targetDate.getTime() - today.getTime();
    const days = Math.ceil(difference / (1000 * 3600 * 24));//mil milisegundos, 3600 segundos, 24 horas
    return days;
    //fecha destino restada con la fecha actual

}

function renderEvents(){
    const eventsHTML = events.map(event => {
        return `
            <div class="event">
                <div class="days">
                    <span class= "days-number">${dateDiff(event.date)}</span>
                    <span class= "days-text">días</span>
                </div>
                <div class="event-name">${event.name}</div>
                <div class="event-date">${event.date}</div>
                <div class="actions">
                    <button class="bDelete" data-id=${event.id}>Eliminar</button>
                </div>
            </div>
        `;
    });

    //eventssHTML sigue siendo un arreglo
    //join une todos los HTML con un String vacio.
    eventsContainer.innerHTML = eventsHTML.join("");

    //Elegimos todos los botones de eliminar que tengan .bDelete
    //Para cada botón le vamos a colocar su EventListener();
    document.querySelectorAll('.bDelete').forEach(button => {
        button.addEventListener('click', e => {
            const id = button.getAttribute('data-id');//obtenemos el id del botón
            events = events.filter(event => event.id != id);

            save(JSON.stringify(events));

            renderEvents();
        });
    });

}

//MODULO LOCAL STORAGE
//localStorage es el objeto de almacenamiento.

function save(data){
    localStorage.setItem('items', data);//items nombre de lo que vayamos a guardar
}

//REGRESAMOS LA INFROMACIÓN
function load(){
    return localStorage.getItem('items');
}