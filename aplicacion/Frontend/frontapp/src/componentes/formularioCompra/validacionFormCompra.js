export function validarNombre() {
    // Obtener el campo de nombre y el span de error
    const nombreInput = document.getElementById("nombre");
    const nombreError = document.getElementById("nombre-error");

    // Expresión regular que solo permite letras y espacios
    const regex = /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/;

    // Validar el campo de nombre
    if (!nombreInput.value.match(regex) || nombreInput.value.trim() === "") {
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


export function validarFotos() {
    let fotoPermisoElement = document.getElementById('permisoCirculacion');
    let permiso = fotoPermisoElement.value;
    let fotoFichaTecnicaElement = document.getElementById('fichaTecnica');
    let fichaTecnica = fotoFichaTecnicaElement.value;
    let fotoFichaVerdeElement = document.getElementById('fichaVerde');
    let fichaVerde = fotoFichaVerdeElement.value;

    let error1 = document.getElementById('foto1-error');
    let error2 = document.getElementById('foto2-error');
    let error3 = document.getElementById('foto3-error');

    let isValid = true;

    if (permiso === '') {
        fotoPermisoElement.style.border = "2px solid red";
        error1.style.display = 'block';
        isValid = false;
    } else {
        fotoPermisoElement.style.border = '';
        error1.style.display = 'none';
    }

    if (fichaTecnica === '') {
        fotoFichaTecnicaElement.style.border = "2px solid red";
        error2.style.display = 'block';
        isValid = false;
    } else {
        fotoFichaTecnicaElement.style.border = '';
        error2.style.display = 'none';
    }

    if (fichaVerde === '') {
        fotoFichaVerdeElement.style.border = "2px solid red";
        error3.style.display = 'block';
        isValid = false;
    } else {
        fotoFichaVerdeElement.style.border = '';
        error3.style.display = 'none';
    }

    return isValid;
}
export function validarComprador(){
    let selectValue = document.getElementById('comprador');
    let selectElement = selectValue.value;
    let error = document.getElementById('comprador-error');

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
export function validarMarca(){
    let marcaElement = document.getElementById('marca');
    let marca = marcaElement.value;
    let error = document.getElementById('marca-error');
    let inputValido = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+$/;

    if(inputValido.test(marca)){
        marcaElement.style.border = '';
        error.style.display = 'none';
        return true;
    }else {
        marcaElement.style.border = "2px solid red";
        error.style.display = 'block';
        return false;
    }
}
export function validarModelo(){
    let modeloElement = document.getElementById('modelo');
    let modelo = modeloElement.value;
    let error = document.getElementById('modelo-error');
    let inputValido = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+$/;

    if(inputValido.test(modelo)){
        modeloElement.style.border = '';
        error.style.display = 'none';
        return true;
    }else{
        modeloElement.style.border = "2px solid red";
        error.style.display = 'block';
        return false;
    }

}
export function validarCombustible(){
    let combustibleElement = document.getElementById('tipo_combustible');
    let combustible = combustibleElement.value;
    let error = document.getElementById('combustible-error');
    let inputValido = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+$/;

    if(inputValido.test(combustible)){
        combustibleElement.style.border = '';
        error.style.display = 'none';
        return true;
    }else{
        combustibleElement.style.border = "2px solid red";
        error.style.display = 'block';
        return false;
    }

}
export function validarCambio(){
    let cambioElement = document.getElementById('tipo_cambio');
    let cambio = cambioElement.value;
    let error = document.getElementById('cambio-error')
    let inputValido = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+$/;

    if(inputValido.test(cambio)){
        cambioElement.style.border = '';
        error.style.display = 'none';
        return true;
    }else{
        cambioElement.style.border = "2px solid red";
        error.style.display = 'block';
        return false;
    }

}
export function validarKilometraje(){
    let kilometrajeElement = document.getElementById('kilometraje');
    let kilometros =kilometrajeElement.value;
    let error =  document.getElementById('kilometraje-error')

    if(kilometros !== ''  && kilometros >0){
        kilometrajeElement.style.border = '';
        error.style.display = 'none';
        return true;
    }else{
        kilometrajeElement.style.border = "2px solid red";
        error.style.display = 'block';
        return false;
    }
}
export function validarAnnioMatriculacion(){
    let anioMatriculacionElement = document.getElementById('año_matriculacion');
    let anioMatriculacion = anioMatriculacionElement.value;
    let error = document.getElementById('annioMatriculacion-error');

    // Verificar que el campo no esté vacío
    if (anioMatriculacion === '') {
        anioMatriculacionElement.style.border = "2px solid red";
        error.style.display = 'block';
        return false;
    }

    // Convertir la fecha a un objeto Date
    let fechaMatriculacion = new Date(anioMatriculacion);

    // Verificar si la fecha es válida
    if (isNaN(fechaMatriculacion.getTime())) {
        anioMatriculacionElement.style.border = "2px solid red";
        error.style.display = 'block';
        return false;
    }

    // Verificar que la fecha no sea futura
    let fechaActual = new Date();
    if (fechaMatriculacion > fechaActual) {
        anioMatriculacionElement.style.border = "2px solid red";
        error.style.display = 'block';
        return false;
    }

    // Si todas las validaciones pasan
    anioMatriculacionElement.style.border = '';
    error.style.display = 'none';
    return true;
}
export function validarFotosCoches() {
    let fotosElement = document.getElementById('fotos');
    let fotos = fotosElement.files;  // Obtener los archivos seleccionados
    let error = document.getElementById('fotos-error');

    // Verificar que el campo no esté vacío
    if (fotos.length === 0) {
        fotosElement.style.border = "2px solid red";  // Establecer borde rojo
        error.style.display = 'block';  // Mostrar mensaje de error
        error.textContent = 'Por favor, suba entre 6 y 15 fotos.';  // Mensaje de error
        return false;  // Retornar false si está vacío
    } else if (fotos.length < 6 || fotos.length > 15) {
        fotosElement.style.border = "2px solid red";  // Establecer borde rojo
        error.style.display = 'block';  // Mostrar mensaje de error
        error.textContent = 'Debe subir entre 6 y 15 fotos.';  // Mensaje de error
        return false;  // Retornar false si el número de fotos no está en el rango permitido
    } else {
        fotosElement.style.border = '';  // Limpiar borde
        error.style.display = 'none';  // Ocultar mensaje de error
        return true;  // Retornar true si el número de fotos está en el rango permitido
    }
}
export function validarNombreEmpresa() {
    let nombreEmpresa = document.getElementById('nombreEmpresa');
    let nombreInput = nombreEmpresa.value;
    let empresaError = document.getElementById('nombreEmpresa-error');
    let regex = /^[a-zA-Z0-9\s\-.]{2,50}$/;

    // Validar el campo de nombre
    if (!regex.test(nombreInput) || nombreInput.trim() === "") {
        // Si no cumple la validación, cambiar el borde a rojo y mostrar el mensaje de error
        nombreEmpresa.style.border = "2px solid red";
        empresaError.style.display = 'block'; // Mostrar el mensaje de error
        return false;
    } else {
        // Si cumple la validación, restablecer el borde y ocultar el mensaje de error
        nombreEmpresa.style.border = "";
        empresaError.style.display = 'none'; // Ocultar el mensaje de error
        return true;
    }

}
export function validarContacto() {
    let contacto = document.getElementById('contacto');
    let contactoInput = contacto.value;
    let contactoError = document.getElementById('contacto-error');
    let regex = /^(?:\+?\d{1,3}[-.\s]?)?(?:\d{9}|\d{10}|\(\d{3}\)\s?\d{3}[-.\s]?\d{4}|\d{3}[-.\s]?\d{3}[-.\s]?\d{4})$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Verificar que el campo no esté vacío y que cumpla la expresión regular
    if (!contactoInput.match(regex) || contactoInput.trim() === "") {
        // Si no cumple la validación, cambiar el borde a rojo y mostrar el mensaje de error
        contacto.style.border = "2px solid red";
        contactoError.style.display = 'block'; // Mostrar el mensaje de error
        contactoError.textContent = 'Ingresa un contacto válido, puede ser un teléfono o un correo electrónico.'; // Mensaje de error
        return false;
    } else {
        // Si cumple la validación, restablecer el borde y ocultar el mensaje de error
        contacto.style.border = "";
        contactoError.style.display = 'none'; // Ocultar el mensaje de error
        return true;
    }
}

