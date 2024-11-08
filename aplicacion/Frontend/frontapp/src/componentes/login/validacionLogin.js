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

export function validarPassword() {
    const passwordInput = document.getElementById("password");
    const passwordError = document.getElementById("contrasenna-error");
    const password = passwordInput.value;

    const regexMayuscula = /[A-Z]/;
    const regexNumero = /[0-9]/;
    const regexEspecial = /[!@#$%^&*(),.?":{}|<>]/;
    const regexLongitud = /.{8,}/;

    const cumpleMayuscula = regexMayuscula.test(password);
    const cumpleNumero = regexNumero.test(password);
    const cumpleEspecial = regexEspecial.test(password);
    const cumpleLongitud = regexLongitud.test(password);

    if (cumpleMayuscula && cumpleNumero && cumpleEspecial && cumpleLongitud){
        passwordInput.style.border = "";
        passwordError.style.display = 'none';

    }else{
        passwordInput.style.border = "2px solid red";
        passwordError.style.display = 'block';
    }
}