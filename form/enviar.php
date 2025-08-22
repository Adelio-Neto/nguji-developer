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
    $destinatario = "academia@nguji.ao";

    // Assunto e corpo vindos do JS
    $assunto = $data["assunto"] ?? "Nova inscrição";
    $mensagem = $data["corpo"] ?? "";

 // Cabeçalhos do e-mail
$headers  = "From: NGUJI Academia <geral@nguji.ao>\r\n";
$headers .= "Reply-To: academia@nguji.ao\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";


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
