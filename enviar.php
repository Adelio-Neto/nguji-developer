<?php
// Permitir apenas requisições POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Pega o corpo JSON enviado pelo JS
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data) {
        echo "Dados inválidos.";
        exit;
    }

    // Email de destino
    $destinatario = "luisnetoadelio@gmail.com";

    // Assunto e corpo vindos do JS
    $assunto = $data["assunto"] ?? "Nova inscrição";
    $mensagem = $data["corpo"] ?? "";

    // Cabeçalhos do e-mail
    $headers = "From: noreply@seudominio.com\r\n";
    $headers .= "Reply-To: noreply@seudominio.com\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    // Enviar e-mail
    if (mail($destinatario, $assunto, $mensagem, $headers)) {
        echo "OK";
    } else {
        echo "Erro ao enviar email.";
    }
} else {
    echo "Método inválido.";
}
?>
