<?php require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");
$APPLICATION->SetTitle("Визуальный выборщик");
$APPLICATION->SetPageProperty("title", "Жилая недвижимость");
$APPLICATION->SetPageProperty("keywords", "Жилая недвижимость");
$APPLICATION->SetPageProperty("description", "Жилая недвижимость");

$objectId = (int)$_REQUEST['objectId'] ? (int)$_REQUEST['objectId'] : 1;
?>

<?php $APPLICATION->IncludeComponent("kelnik:estate.selector", '', array(
    'SEF_MODE' => 'Y',
    'SEF_FOLDER' => '/',
    'objectId' => $objectId,
)); ?>

<? require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/footer.php"); ?>
