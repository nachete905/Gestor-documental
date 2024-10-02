
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




