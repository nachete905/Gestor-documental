export function validarTextArea() {
    let textarea = document.getElementById('mensaje');
    let contenido = textarea.value;
    let error = document.getElementById('texto-error');
    let charCount = document.getElementById('charCount');
    let boton = document.getElementById('enviar');

    charCount.textContent = `${contenido.length} caracteres`;
    if (contenido.length > 3000) {
        textarea.style.border = "2px solid red"
        error.style.display = 'block';
        boton.disabled = true
    } else {
        textarea.style.border='';
        error.style.display = 'none';
        boton.disabled = false;
    }
}