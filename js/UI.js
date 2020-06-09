class UI {
    constructor() {

          //instanciar la api 
          this.api = new API();
          // crear los markers con layer group
          this.markers= new L.LayerGroup();
         // Iniciar el mapa
         this.mapa = this.inicializarMapa();

       


    }

    inicializarMapa() {
         // Inicializar y obtener la propiedad del mapa
         const map = L.map('mapa').setView([19.390519, -99.3739778], 6);
         const enlaceMapa = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
         L.tileLayer(
             'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
             attribution: '&copy; ' + enlaceMapa + ' Contributors',
             maxZoom: 18,
             }).addTo(map);
         return map;
    };

     mostrarEstablecimientos(){
        this.api.obtenerDatos()
            .then(datos=>{
                const resultado = datos.respuestaJSON.results;

                //ejecutar la función para mostrar los pines 

                this.mostrarPines(resultado);
            })
    };

    mostrarPines(datos){
        //limpiar los markers 
        this.markers.clearLayers();

        datos.forEach(dato => {

              //destructuring
              const {latitude, longitude, calle, regular, premium} = dato; 

            //crear popup
            const opcionesPopup = new L.popup()
                    .setContent(`
                                <p><b>Calle: </b> ${calle}</p> 
                                <p><b>Regular: </b>$ ${regular}</p> 
                                <p><b>Premium: </b>$ ${premium}</p> 
                    `);

          
            // agrgar el pin 
            const marker = new L.marker([
                parseFloat(latitude),
                parseFloat(longitude)
            ]).bindPopup(opcionesPopup);
            this.markers.addLayer(marker);
        });
        this.markers.addTo(this.mapa);
    }

    // buscador 
    obtenerSugerencias(busqueda){
        this.api.obtenerDatos()
            .then(datos =>{
                const resultados = datos.respuestaJSON.results;

                // enviar el json y busqueda al filtrado 
                this.filtrarSugerencias(resultados, busqueda);
            });
    }
    // filtra las sugerencias 
    filtrarSugerencias(resultados, busqueda){
        // filtrar con .filter 
        const filtro = resultados.filter(filtro => filtro.calle.indexOf(busqueda) !== -1);
        console.log(filtro);
        // mostrar pines 
        this.mostrarPines(filtro);
    }
}