 <?php
    $recepient = "banket@kalugaplaza.ru";
    $sitename = "Калуга Плаза";
    $name = trim($_POST["name"]);
    $phone = trim($_POST["phone"]);

    $message = "Имя: $name\nТелефон: $phone\n";

    $pagetitle = "Заявка с сайта \"$sitename\"";
    mail($recepient, $pagetitle, $message, "Content-type: text/plain; charset=\"utf-8\"\n From: $recepient");
?>