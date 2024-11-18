
export function validarNombre() {
    // Obtener el campo de nombre y el span de error
    const nombreInput = document.getElementById("nombre");
    const nombreError = document.getElementById("nombre-error");

    // Expresión regular que solo permite letras y espacios
    const regex = /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/;

    // Validar el campo de nombre
    if (!regex.test(nombreInput.value.trim()) || nombreInput.value.trim() === "") {
        // Si no cumple la validación, cambiar el borde a rojo y mostrar el mensaje de error
        nombreInput.style.border = "2px solid red";
        nombreError.style.display = 'block'; // Mostrar el mensaje de error
        return false;
    } else {
        // Si cumple la validación, restablecer el borde y ocultar el mensaje de error
        nombreInput.style.border = "";
        nombreError.style.display = 'none'; // Ocultar el mensaje de error
        return true;
    }
}


export function validarApellido(){
    const apellidoInput = document.getElementById("apellido");
    const apellidoError = document.getElementById("apellido-error");

    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñ]+)?$/;
    if (!apellidoInput.value.match(regex) || apellidoInput.value.trim() === "") {
        // Si no cumple la validación, cambiar el borde a rojo y mostrar el mensaje de error
        apellidoInput.style.border = "2px solid red";
        apellidoError.style.display = 'block'; // Mostrar el mensaje de error
        return false;
    } else {
        // Si cumple la validación, restablecer el borde y ocultar el mensaje de error
        apellidoInput.style.border = "";
        apellidoError.style.display = 'none'; // Ocultar el mensaje de error
        return true;
    }

}

export function validarEmail(){
    const emailInput = document.getElementById("email");
    const emailError = document.getElementById("email-error");
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(emailInput.value.trim() === "" || !emailInput.value.match(regex)){
        emailInput.style.border = "2px solid red";
        emailError.style.display = 'block'; // Mostrar el mensaje de error
        return false;
    }else{
        emailInput.style.border = "";
        emailError.style.display = 'none'; // Mostrar el mensaje de error
        return regex.test(emailInput);
    }
    
   
}
export function validarTelefono() {
    const telefonoInput = document.getElementById("telefono");
    const telefonoError = document.getElementById("telefono-error");

    // Verificar si los elementos existen
    if (!telefonoInput || !telefonoError) {
        console.error("Elementos no encontrados en el DOM");
        return false;
    }

    // Expresión regular para validar el teléfono
    const regex = /^\+?\d+(\s?\d+)*$/;

    // Validar el campo de teléfono
    if (!telefonoInput.value.match(regex) || telefonoInput.value.trim() === "") {
        // Si no cumple la validación, cambiar el borde a rojo y mostrar el mensaje de error
        telefonoInput.style.border = "2px solid red";
        telefonoError.style.display = 'block'; // Mostrar el mensaje de error
        return false;
    } else {
        // Si cumple la validación, restablecer el borde y ocultar el mensaje de error
        telefonoInput.style.border = "";
        telefonoError.style.display = 'none'; // Ocultar el mensaje de error
        return true;
    }
}
export function validarPassword() {
    const passwordInput = document.getElementById("password");
    const passwordError = document.getElementById("contrasenna-error");
    const requisitosList = document.getElementById("password-requisitos");

    const mayuscula = document.getElementById("mayuscula");
    const numero = document.getElementById("numero");
    const especial = document.getElementById("especial");
    const longitud = document.getElementById("longitud");

    const password = passwordInput.value;

    // Expresiones regulares para los requisitos
    const regexMayuscula = /[A-Z]/;
    const regexNumero = /[0-9]/;
    const regexEspecial = /[!@#$%^&*(),.?":{}|<>]/;
    const regexLongitud = /.{8,}/;

    // Validar cada requisito
    const cumpleMayuscula = regexMayuscula.test(password);
    const cumpleNumero = regexNumero.test(password);
    const cumpleEspecial = regexEspecial.test(password);
    const cumpleLongitud = regexLongitud.test(password);

    // Actualizar el color de los requisitos
    mayuscula.style.color = cumpleMayuscula ? "green" : "red";
    numero.style.color = cumpleNumero ? "green" : "red";
    especial.style.color = cumpleEspecial ? "green" : "red";
    longitud.style.color = cumpleLongitud ? "green" : "red";

    // Mostrar u ocultar la lista de requisitos
    if (cumpleMayuscula && cumpleNumero && cumpleEspecial && cumpleLongitud) {
        passwordInput.style.border = "";
        passwordError.style.display = 'none';
        requisitosList.style.display = 'none';  // Ocultar la lista cuando todos los requisitos se cumplen
    } else {
        passwordInput.style.border = "2px solid red";
        passwordError.style.display = 'block';
        requisitosList.style.display = 'block';  // Mostrar la lista cuando algún requisito no se cumple
    }
}




export function validarDNI() {
    let dniElement = document.getElementById('dni'); // elemento HTML
    let dni = dniElement.value; // valor del campo de entrada
    let errorDNI = document.getElementById('dni-error');

    let letraDNI = dni.substring(8, 9);
    let numDNI = parseInt(dni.substring(0, 8));

    let letras = ['T', 'R', 'W', 'A', 'G', 'M', 'Y', 'F', 'P', 'D', 'X', 'B', 'N', 'J', 'Z', 'S', 'Q', 'V', 'H', 'L', 'C', 'K', 'E', 'T'];
    let letraCorrecta = letras[numDNI % 23];
    let formatoDNI = /^\d{8}[a-zA-Z]$/;

    if (formatoDNI.test(dni) && letraDNI.toUpperCase() === letraCorrecta) {
        dniElement.style.border = '';
        errorDNI.style.display = 'none';
        return true;
    } else {
        dniElement.style.border = "2px solid red";
        errorDNI.style.display = 'block'; // Mostrar el mensaje de error
        return false;
    }
}


export function validarCoche(){
    let cocheElement = document.getElementById('coche');
    let error = document.getElementById('coche-error');

    if(cocheElement === ''){
        cocheElement.style.border = "2px solid red";
        error.style.display = 'block';
        return false;
    }else{
        cocheElement.style.border = '';
        error.style.display = 'none';
        return true;
    }
}

export function validarMatricula(){
    let matriculaElement = document.getElementById('matricula');
    let matricula = matriculaElement.value;
    let error = document.getElementById('matricula-error');
    let matriculavalida = /^[A-Z]{1,2}-?\d{4}-?[A-Z]{1,2}$|^\d{4}-?[A-Z]{3}$/; //abarca formato antiguo y nuevo de matriculas

    if(matriculavalida.test(matricula)){
        matriculaElement.style.border = '';
        error.style.display = 'none';
        return true;
    }else{
        matriculaElement.style.border = "2px solid red";
        error.style.display = 'block';
        return false;
    }


}

export function validarVendedor(){
    let selectValue = document.getElementById('vendedor');
    let error = document.getElementById('vendedor-error');

    if(selectValue === ''){
        selectValue.style.border = "2px solid red";
        error.style.display = 'block';
        return false;
    }else{
        selectValue.style.border = '';
        error.style.display = 'none';
        return true;
    }
}
export function validarCIF(){
    let cif = document.getElementById('CIF');
    let errorCIF = document.getElementById('cif-error');
    let cifINPUT = cif.value;
    let regex = /^[ABCDEFGHJNPQRSUVW]\d{7}[0-9A-J]$/;

    if(regex.test(cifINPUT)){
        cif.style.border = "";
        errorCIF.style.display = 'none';
        return true;
    }else {
        cif.style.border = "2px solid red";
        errorCIF.style.display = 'block';
        return false;
    }
}

export function validarInstalaciones(){
    let instalaciones = document.getElementById('instalacionesCount');
    let instalacionesInput = instalaciones.value;
    let errorInstalaciones = document.getElementById('instalaiones-error');
    let boton = document.getElementById('next');

    if(isNaN(instalacionesInput) || instalacionesInput > 0){
        instalaciones.style.border = '';
        errorInstalaciones.style.display = 'none';
        boton.disabled = false;
        return true;
    }else{
        instalaciones.style.border = '2px solid red';
        errorInstalaciones.style.display = 'block';
        boton.disabled = true;
        return false;
    }
}
export function validarUbicacion(index) {
    let ubicacionInput = document.getElementById(`ubicacion_${index}`);
    let ubicacionValue = ubicacionInput.value; const ubicacionError = ubicacionInput.nextElementSibling;

    const regex = /^(calle|c|C\/)\s?[a-zA-ZÁ-Úá-ú0-9\s,'-]+\s\d+$/;
     if (!regex.test(ubicacionValue)) {
         ubicacionInput.style.border = "2px solid red";
         ubicacionError.style.display = 'block';
         return false;
     } else {
         ubicacionInput.style.border = "";
         ubicacionError.style.display = 'none';
         return true;
     }
}
export function validarLocalidad(index) {
    let localidadInput = document.getElementById(`localidad_${index}`);
    let localidadValue = localidadInput.value; const localidadError = localidadInput.nextElementSibling;
    let regex = /^[a-zA-ZÁ-Úá-ú\s]+$/;

    if (!regex.test(localidadValue)) {
        localidadInput.style.border = "2px solid red";
        localidadError.style.display = 'block';
        return false;
    } else {
        localidadInput.style.border = "";
        localidadError.style.display = 'none';
        return true;
    }
}
export function validarTelefonoInstalacion(index) {
    let telefonoInput = document.getElementById(`telefono_${index}`);
    let telefonoValue = telefonoInput.value;
    let telefonoError = telefonoInput.nextElementSibling;
    let regex = /^(?:\+?\d{1,3}[-.\s]?)?(?:\d{9}|\(\d{3}\)\s?\d{3}[-.\s]?\d{4}|\d{3}[-.\s]?\d{3}[-.\s]?\d{4})$/;

    if (!regex.test(telefonoValue)) {
        telefonoInput.style.border = "2px solid red";
        telefonoError.style.display = 'block';
        return false;
    } else { telefonoInput.style.border = "";
        telefonoError.style.display = 'none';
        return true;
    }
}


