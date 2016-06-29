<?php
$DOC_ROOT = dirname(__FILE__);

require_once($DOC_ROOT . '/bitrix/modules/main/include/prolog_before.php');

if (!CModule::IncludeModule('iblock')) {
    ShowError(GetMessage('IBLOCK_MODULE_NOT_INSTALLED'));
    return;
}

$requiredModules = array('estate');
foreach ($requiredModules as $requiredModule) {
    if (!CModule::IncludeModule($requiredModule)) {
        ShowError(GetMessage('F_NO_MODULE'));
        return;
    }
}

use Bitrix\Estate as Estate;

$action = !empty($_GET['action']) ? $_GET['action'] : false;
// copyMasks.php?action=buildings
if ($action === 'buildings') {
    $fromTo = array(
        1 => array(4, 5, 6),
        2 => array(3),
    );
    foreach ($fromTo as $from => $to) {
        // Этажи корпуса
        $floors = Estate\EstateFloorTable::getAssoc(array(
            'filter' => array(
                'PARENT' => $from,
            ),
            'order' => array(
                'NUMBER' => 'ASC',
                'ID' => 'ASC',
            ),
        ),
            'ID',
            'NAME'
        );

        $sourceFloors = array();
        $floorIds = array();
        foreach ($floors as $id => $name) {
            $sourceFloors[$name] = array();
        }
        //Квартиры корпуса
        $flats = Estate\EstateFlatTable::getAssoc(array(
            'filter' => array(
                'PARENT' => array_keys($floors),
            ),
            'order' => array(
                'NUMBER' => 'ASC',
            ),
        ));
        foreach ($flats as $flat) {
            $sourceFloors[$floors[$flat['PARENT']]][$flat['NAME']] = $flat;
        }
        foreach ($to as $buildingId) {
            $floors = Estate\EstateFloorTable::getAssoc(
                array(
                    'filter' => array(
                        'PARENT' => $buildingId,
                    ),
                    'order' => array(
                        'NUMBER' => 'ASC'
                    ),
                ),
                'ID',
                'NAME'
            );

            $flats = Estate\EstateFlatTable::getAssoc(array(
                'filter' => array(
                    'PARENT' => array_keys($floors)
                ),
                'order' => array(
                    'NUMBER' => 'ASC'
                )
            ));
            foreach ($flats as $flat) {
                $sourceFlat = $sourceFloors[$floors[$flat['PARENT']]][$flat['NAME']];
                if (!$sourceFlat) {
                    echo 'Не найдена исходная квартира для квартиры ID ' . $flat['ID'], '<br>';
                    continue;
                }
                $upd = array(
                    'IMAGE' => \CFile::CopyFile($sourceFlat['IMAGE']),
                    // 'IMAGE_3D'       => \CFile::CopyFile($sourceFlat['IMAGE_3D']),
                    'IMAGE_ON_FLOOR' => \CFile::CopyFile($sourceFlat['IMAGE_ON_FLOOR']),
                    'NAV_COORD' => $sourceFlat['NAV_COORD'],
                    'PLANOPLAN' => $sourceFlat['PLANOPLAN'],
                );
                Estate\EstateFlatTable::Update($flat['ID'], $upd);
            }
        }
    }
}

// copyMasks.php?action=floors&building=1&from=1&to=3
if ($action === 'floors') {
    if (empty($_GET['building']) || empty($_GET['from']) || empty($_GET['to'])) {
        echo 'Нет building, from или to';
        return;
    }
    $building = (int)$_GET['building'];
    $from = (int)$_GET['from'];
    $to = (int)$_GET['to'];

    // Этажи корпуса
    $floors = Estate\EstateFloorTable::getAssoc(array(
        'filter' => array(
            'PARENT' => $building,
            '>=NUMBER' => $from,
            '<=NUMBER' => $to,
        ),
        'order' => array(
            'ID' => 'ASC',
            'NUMBER' => 'ASC',
        ),
    ));

    $arPrepareFloor = array();
    foreach ($floors as $floor) {
        $arPrepareFloor[$floor['PARENT_SECTION']][] = $floor;
    }
    unset($floors);

    ksort($arPrepareFloor);
    foreach ($arPrepareFloor as $floors) {
        $sourceFlats = array();
        $i = 0;
        foreach ($floors as $floor) {
            $flats = Estate\EstateFlatTable::getAssoc(array(
                'filter' => array(
                    'PARENT' => $floor['ID']
                ),
                'order' => array(
                    'SORT' => 'ASC'
                ),
                'runtime' => array(
                    'SORT' => array(
                        'data_type' => 'string',
                        'expression' => array(
                            '%s + 0 ', 'NAME'
                        )
                    ))
            ));

            if ($floor['NAME'] == $from) {
                $sourceFlats = $flats;
                continue;
            }

            foreach ($flats as $k => $flat) {
                $sourceFlat = $sourceFlats[$k];
                if (!$sourceFlat) {
                    echo 'Не найдена исходная квартира для квартиры ID ' . $flat['ID'], '<br>';
                    continue;
                }
                $upd = array(
                    'IMAGE' => \CFile::CopyFile($sourceFlat['IMAGE']),
                    // 'IMAGE_3D'       => \CFile::CopyFile($sourceFlat['IMAGE_3D']),
                    'IMAGE_ON_FLOOR' => \CFile::CopyFile($sourceFlat['IMAGE_ON_FLOOR']),
                    'NAV_COORD' => $sourceFlat['NAV_COORD'],
                    'PLANOPLAN' => $sourceFlat['PLANOPLAN'],
                );
                Estate\EstateFlatTable::Update($flat['ID'], $upd);
            }
        }
    }
}
