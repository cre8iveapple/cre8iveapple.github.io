<?php
//load xml
$xml_file_open = simplexml_load_file(“http://rss.cbc.ca/lineup/sports.xml&#8221;);
//parse xml
displayChildrenRecursive($xml_file_open);

function displayChildrenRecursive($xmlObj,$depth=0) {
//make array of stopwords to ignore – go get them from here.
$stopwords =
$stopwords = explode(“,”, $stopwords);

//loop through xml tags
foreach($xmlObj->children() as $child) {
//get descriptions
if($child->getName()==’description’) {
//get text
$childStringRaw = print_r((string)$child,true);
//drop excess HTML in description
$childStringMid = explode(“<p>”, $childStringRaw);
$childStringLeft = explode(“</p>”, $childStringMid[1]);
$childString = $childStringLeft[0];
//escape quotes
$childString = str_replace(“‘”,”\'”,$childString);
//separate description into individual words
$childArray = explode(” “, $childString);
//loop through words
foreach ($childArray as $word)
{
//disregard if the word is a stopword
if (!in_array(strtolower($word), $stopwords, TRUE)) {
//get rid of spaces
$trimmed = trim($word);
//add to javascript array
echo “js_array.push(‘$trimmed’);\n”;
}
}
}
//run on next tag
displayChildrenRecursive($child,$depth+1);
}
}
?>