var arrayPalabras4 = [];
var arrayPalabras6 = [];
var casillas = [];
var valorCasillas = [];
var letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
var guardarDatos = false;
var pistas = 3;

/*FUNCIONES DE LA CARGA DEL DICCIONARIO Y DEMÁS INFORMACIÓN INICIAL */

function cargarDiccionario(){
    let url = "https://ordenalfabetix.unileon.es/aw/diccionario.txt";
    fetch(url)
        .then(response => response.text())
        .then((response) => {
            almacenarPalabras(response);
        })
        .catch(function(){
            e => console.log(`Error :  ${e}`)
        });
}

function almacenarPalabras(texto){
    let palabras = texto.split("\n");
    palabras.forEach(function(elemento, indice, array) {
        if(elemento.length == 4){
            arrayPalabras4.push(elemento);
        }else if(elemento.length == 6){
            arrayPalabras6.push(elemento);
        }
    });
    console.log("Arrays cargados, ya se puede resolver");
    document.getElementById("botonResolver").disabled = false;
    document.getElementById("botonResolver").enabled = true;
}

function guardarReferenciasCasillas(){
    let fila = [];
    let id = "celda";
    for(var l=0; l<12; l++){
        if(l<6){
            for(var i=0; i<4; i++){
                fila.push(document.getElementById(id + letras[l] + i));
            }
            casillas.push(fila);
            fila = [];
        }else{
            for(var i=0; i<6; i++){
                fila.push(document.getElementById(id + letras[l] + i));
            }
            casillas.push(fila);
            fila = [];
        }
    }
}

/*FUNCIONES DE LA CARGA Y DESCARGA DE INFORMACIÓN GUARDADA */

function cargarInfoGuardada(){
    guardarReferenciasCasillas();

    let valores, num_pistas;

    if (typeof(Storage) !== "undefined") {
        valores = localStorage.getItem("valor_casillas");
        num_pistas = localStorage.getItem("pistas");
        if(valores !== null){
            document.getElementById("guardar").checked = true;
            guardarDatos = true;
            console.log(JSON.parse(valores));
            cargarValoresCasillas(JSON.parse(valores));
            this.pistas = parseInt(num_pistas);
            bajarPista();
        }else{
            document.getElementById("guardar").checked = false;
        }
    } else {
        alert("Sorry, your browser does not support Web Storage...");
    }
    console.log("Quedan " + this.pistas + " pistas")
}

function cargarValoresCasillas(valores){
    let fila = [];
    valorCasillas = [];
    for(var l=0; l<12; l++){
        if(l<6){
            for(var i=0; i<4; i++){
                fila.push(valores[l][i]);
                casillas[l][i].value = valores[l][i];
            }
            valorCasillas.push(fila);
            fila = [];
        }else{
            for(var i=0; i<6; i++){
                fila.push(valores[l][i]);
                casillas[l][i].value = valores[l][i];
            }
            valorCasillas.push(fila);
            fila = [];
        }
    }
}

function almacenamiento(){
    let valor = document.getElementById("guardar");
    let guardarDatos = valor.checked;
    if(guardarDatos){
        alert("SE GUARDARÁ EL PROGRESO");
        guardarEnMemoria();
    }else{
        localStorage.removeItem("valor_casillas");
        localStorage.removeItem("pistas");
        alert("EL PROGRESO NO SE GUARDARÁ");
    }
}

function guardarEnMemoria(){
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem("valor_casillas", JSON.stringify(valorCasillas));
    } else {
        alert("Sorry, your browser does not support Web Storage...");
    }
}

function guardarCasillas(){
    guardarValorCasillas();
    if(guardarDatos){
        guardarEnMemoria();
        guardarPistas();
    }
}

function guardarPistas(){
    localStorage.setItem("pistas", this.pistas);
}

function guardarValorCasillas(){
    let fila = [];
    valorCasillas = [];
    for(var l=0; l<12; l++){
        if(l<6){
            for(var i=0; i<4; i++){
                fila.push(casillas[l][i].value);
            }
            valorCasillas.push(fila);
            fila = [];
        }else{
            for(var i=0; i<6; i++){
                fila.push(casillas[l][i].value);
            }
            valorCasillas.push(fila);
            fila = [];
        }
    }
}

/*FUNCIONES DE PISTAS DE PALABRAS*/

function otorgarPista(){
    if(pistas>0){
        var letras = document.getElementById("letrasPista").value;
        letras = letras.toLowerCase();
        var palabras = [];
        var palabra = "";
        var coincide;

        arrayPalabras4.forEach(function(elemento, indice, array){
            coincide = true;
            palabra = elemento;
            console.log(palabra);
            for(var i=0; i<letras.length; i++){
                if(coincide && !palabra.includes(letras[i])){
                    coincide = false;
                }else{
                    palabra = eliminarCaracter(palabra,letras[i]);
                }
            }
            if(coincide) palabras.push(elemento);        
        });
        arrayPalabras6.forEach(function(elemento, indice, array){
            coincide = true;
            palabra = elemento;
            for(var i=0; i<letras.length; i++){
                if(coincide && !palabra.includes(letras[i])){
                    coincide = false;
                }else{
                    palabra = eliminarCaracter(palabra,letras[i]);
                }
            }
            if(coincide) palabras.push(elemento);
        });
        var texto = "";
        palabras.forEach(function(elemento, indice, array){
            texto = texto + elemento + "\n";
        });
        document.getElementById("pista").value = texto;
        this.pistas--;
        bajarPista();
    }else{
        alert("NO HAY MÁS PISTAS DISPONIBLES");
    }
    guardarPistas();
}

function bajarPista(){
    let texto = document.getElementById("botonPista").innerText;
    let nuevo = "";
    nuevo = nuevo + texto.slice(0, 13) + pistas + ")"
    document.getElementById("botonPista").innerText = nuevo;
    if(pistas<1){
        document.getElementById("botonPista").enabled = false;
        document.getElementById("botonPista").disabled = true;
    }
}

function eliminarCaracter(palabra, car){
    let final = "";
    let indice = palabra.indexOf(car);
    console.log(palabra + ", " + car + " -> " + indice);
    final = final + palabra.slice(0,indice);
    if(indice+1 < palabra.length){
        final = final + palabra.slice(indice+1, palabra.length);
    }
    return final;
}

/*FUNCIONES DE RESOLUCIÓN DEL TABLERO */

function resolverPasatiempo(){
    /*Comprobar si todas las palabras son correctas y si cumplen las condiciones de
    cambio de letra y permutacion */
    alert("Alerta de Boton");
}









