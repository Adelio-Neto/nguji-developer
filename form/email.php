<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $to = "geral@nguji.ao"; 
    $name = strip_tags(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $subject = strip_tags(trim($_POST["subject"]));
    $message = trim($_POST["message"]);

    if (empty($name) || empty($subject) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode([
            "status" => "error",
            "message" => "Preencha todos os campos corretamente."
        ]);
        exit;
    }

  
    $email_content = "Nome: $name\n";
    $email_content .= "Email: $email\n\n";
    $email_content .= "Mensagem:\n$message\n";

  
    $headers = "From: $name <$email>";

    // Enviar email
    if (mail($to, $subject, $email_content, $headers)) {
        echo json_encode([
            "status" => "success",
            "message" => "Mensagem enviada com sucesso!"
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Ocorreu um erro ao enviar a mensagem."
        ]);
    }

} else {
    // Acesso direto não permitido
    http_response_code(403);
    echo "Método não permitido.";
}
?>
