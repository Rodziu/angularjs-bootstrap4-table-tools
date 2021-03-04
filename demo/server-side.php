<?php
/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
$_POST = file_get_contents('php://input');
if(!empty($_POST)){
	$_POST = json_decode($_POST, true);
}
if(isset($_POST['limit']) && isset($_POST['offset']) && isset($_POST['order']) && isset($_POST['search'])){
	$data = json_decode(file_get_contents(dirname(__FILE__).'/mock_data.json'), true);
	$count = count($data);
	// search
	function hasSearchString($variable){
		if(is_array($variable)){
			foreach($variable as $v){
				if(hasSearchString($v)){
					return true;
				}
			}
		}else if(stripos($variable, $_POST['search']) !== false){
			return true;
		}
		return false;
	}

	if($_POST['search'] != ''){
		foreach($data as $k => $v){
			if(!hasSearchString($v)){
				unset($data[$k]);
			}
		}
		$data = array_values($data);
	}
	// filters
	function compareWithOperator($variable, $search, $operator = 'like'){
		if(is_array($search)){
			foreach($search as $s){
				if(compareWithOperator($variable, $s, $operator)){
					return true;
				}
			}
			return false;
		}
		switch($operator){
			case 'like':
				return stripos($variable, $search);
			case '>':
				return $variable > $search;
			case '<':
				return $variable < $search;
			case '>=':
				return $variable >= $search;
			case '<=':
				return $variable <= $search;
			case '==':
				return $variable == $search;
			default:
				return true;
		}
	}

	/**
	 * $_POST['filters'] = [
	 *        'field_name' => [
	 *            ['value' => '', 'operator' => '', 'isOr' => '']
	 *        ]
	 *        ...
	 * ]
	 */
	if(isset($_POST['filters'])){
		foreach($data as $k => $v){
			foreach($_POST['filters'] as $col => $filters){
				$filterResult = true;
				$anyPass = false;
				$orCondition = false;
				foreach($filters as $filter){
					if(!compareWithOperator($v[$col], $filter['value'], $filter['operator'])){
						if($filter['isOr']){
							$orCondition = true;
						}else{
							$filterResult = false;
							break;
						}
					}else{
						$anyPass = true;
					}
				}
				if($orCondition && !$anyPass){ // or filter passes if any other filter has passed
					$filterResult = false;
				}
				if(!$filterResult){
					unset($data[$k]);
					continue 2;
				}
			}
		}
	}
	//
	$countFiltered = count($data);
	// sort
	/**
	 * $_POST['order'] = [
	 *        ['col' => 'field', 'dir' => 'asc|desc']
	 *        ...
	 * ]
	 */
	$sort = [];
	foreach($data as $k => $v){
		foreach($_POST['order'] as $o){
			$sort[$o['col']][$k] = $v[$o['col']];
		}
	}
	$args = [];
	foreach($_POST['order'] as $o){
		$args[] = $sort[$o['col']];
		$args[] = $o['dir'] == 'asc' ? SORT_ASC : SORT_DESC;
	}
	$args[] = &$data;
	call_user_func_array('array_multisort', $args);
	// limit
	$data = array_slice($data, $_POST['offset'], $_POST['limit']);
	header('Content-type: text/json');
	echo json_encode([
		'count'         => $count,
		'countFiltered' => $countFiltered,
		'data'          => $data
	]);
	exit;
}
