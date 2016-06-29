<?
$arUrlRewrite = array(
	array(
		"CONDITION" => "#^/visual/(.*)#",
		"ID" => "kelnik:estate.selector",
		"PATH" => "/visual/index.php",
	),
	array(
		"CONDITION" => "#^/news/#",
		"RULE" => "",
		"ID" => "bitrix:news",
		"PATH" => "/news/index.php",
	),
	array(
		"CONDITION" => "#^/kvartiry/flat/([0-9]+)/pdf/(.*)#",
		"RULE" => "FLAT_ID=\$1",
		"ID" => "kelnik:estate.flat.pdf",
		"PATH" => "/kvartiry/flat/pdf/index.php",
	),
	array(
		"CONDITION" => "#^/kvartiry/flat/([0-9]+)/(.*)#",
		"RULE" => "FLAT_ID=\$1",
		"ID" => "kelnik:estate.flat",
		"PATH" => "/kvartiry/flat/index.php",
	),
);

?>
