<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$key = "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";

$word = "";
$theme=$_GET['theme'];

$ch = curl_init("https://openrouter.ai/api/v1/chat/completions");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $key
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "model" => "openrouter/quasar-alpha",
    "messages" => [
        [
            "role" => "user",
            "content" => "Genera una parola a tema $theme la risposta deve essere solo la parola"
        ]
    ],
    "temperature" => 1.5 // Set temperature to 1.5
]));

$response = curl_exec($ch);
curl_close($ch);
// echo $response;
$temp = json_decode($response, true);
$word = $temp['choices'][0]['message']['content'] ?? '';

$words=[];

$prompt='';


foreach (str_split($word) as $letter) {
    $prompt .= "genera una parola a tema $theme che contenga la lettera $letter.\n";
}
$prompt .= '\n le lettere che richiedo non devono essere sempre nella stessa posizione\n';
$prompt .= '\n la risposta deve essere in formato JSON secondo questo schema {word: string, definition: string}\n';






$ch = curl_init("https://openrouter.ai/api/v1/chat/completions");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $key
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "model" => "openrouter/quasar-alpha",
    "messages" => [
        [
            "role" => "user",
            "content" => $prompt,
        ]
    ],
    "temperature" => 1.5 // Set temperature to 1.5
]));

$response = curl_exec($ch);
curl_close($ch);
// echo $response;
$temp = json_decode($response, true);
$words = $temp['choices'][0]['message']['content'] ?? '';
$wordsArray = json_decode($words, true);

$wordLetters = str_split($word);



for($i=0;$i<count($wordLetters);$i++){
    $wordsArray[$i]['index']=strpos($wordsArray[$i]['word'], $wordLetters[$i]);
}

$wordsArray['word']=$word;
$wordsArray['length']=strlen($word);

echo json_encode($wordsArray, JSON_PRETTY_PRINT);



?>
