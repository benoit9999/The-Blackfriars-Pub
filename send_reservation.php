<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $name = htmlspecialchars(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $phone = htmlspecialchars(trim($_POST["phone"]));
    $date = htmlspecialchars(trim($_POST["date"]));
    $time = htmlspecialchars(trim($_POST["time"]));
    $guests = htmlspecialchars(trim($_POST["guests"]));
    $message = htmlspecialchars(trim($_POST["message"]));
    
    $options = isset($_POST["options"]) ? $_POST["options"] : [];
    $sanitized_options = array_map(function($opt) {
        return htmlspecialchars(trim($opt));
    }, $options);
    $options_str = !empty($sanitized_options) ? implode(", ", $sanitized_options) : "Aucune option sélectionnée";

    if (empty($name) || empty($email) || empty($date) || empty($time) || empty($guests)) {
        echo "Erreur : Veuillez remplir tous les champs obligatoires (Nom, E-mail, Date, Heure, Nombre de convives).";
        exit;
    }
    
    // Adresse e-mail de destination (celle du pub)
    $to = "neodastes@gmail.com";
    
    // Sujet de l'e-mail
    $subject = "☘️ Nouvelle demande de Réservation - " . $name;
    
    $email_content = "
    <html>
    <head>
      <title>Nouvelle Réservation - The Blackfriars</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; padding: 25px; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .header { background-color: #00402E; color: #E8C35D; padding: 15px 20px; border-radius: 6px 6px 0 0; text-align: center; margin: -25px -25px 25px -25px; }
        .header h2 { margin: 0; font-size: 22px; font-weight: normal; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { padding: 12px 10px; border-bottom: 1px solid #eee; text-align: left; }
        th { width: 40%; color: #555; font-weight: bold; }
        td { color: #222; }
        .message-box { background: #fafafa; padding: 15px; border: 1px solid #eee; border-left: 4px solid #00402E; margin-top: 20px; border-radius: 0 4px 4px 0; }
        .footer { text-align: center; margin-top: 25px; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 15px; }
      </style>
    </head>
    <body>
      <div class='container'>
        <div class='header'>
          <h2>☘️ Nouvelle Demande de Réservation</h2>
        </div>
        <p>Bonjour,</p>
        <p>Vous avez reçu une nouvelle demande de réservation via le formulaire de contact du site internet de <strong>The Blackfriars Pub</strong>.</p>
        
        <table>
          <tr><th>Nom & Prénom :</th><td>{$name}</td></tr>
          <tr><th>E-mail :</th><td><a href='mailto:{$email}'>{$email}</a></td></tr>
          <tr><th>Téléphone :</th><td>{$phone}</td></tr>
          <tr><th>Date demandée :</th><td>{$date}</td></tr>
          <tr><th>Heure estimée :</th><td>{$time}</td></tr>
          <tr><th>Nombre de convives :</th><td>{$guests} personnes</td></tr>
          <tr><th>Options souhaitées :</th><td>{$options_str}</td></tr>
        </table>
        
        <p><strong>Message / Demande spéciale :</strong></p>
        <div class='message-box'>
          " . (!empty($message) ? nl2br($message) : "Aucun message particulier.") . "
        </div>
        
        <div class='footer'>
          <p>Cet e-mail a été envoyé automatiquement depuis le site web <a href='https://theblackfriars.be'>theblackfriars.be</a>.</p>
        </div>
      </div>
    </body>
    </html>
    ";
    
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    
    $headers .= "From: The Blackfriars Web <no-reply@theblackfriars.be>" . "\r\n";
    $headers .= "Reply-To: {$email}" . "\r\n";
    
    if (mail($to, $subject, $email_content, $headers)) {
        header("Location: merci.html");
        exit;
    } else {
        echo "Désolé, une erreur est survenue lors de l'envoi de votre message de réservation. Veuillez réessayer plus tard ou appeler le pub directement.";
    }
} else {
    header("Location: reservation.html");
    exit;
}
?>
