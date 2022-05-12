<?php
header('Access-Control-Allow-Origin: *');

include "config/config.php";

if(isset ($_REQUEST["getLimitedJobs"]) ){
$name = $_REQUEST["getLimitedJobs"];
$day = $_REQUEST["day"];
$monthShort = $_REQUEST["monthShort"];
$monthLong = $_REQUEST["monthLong"];
$year = $_REQUEST["year"];
$pending = $_REQUEST["pending"];
	
	if ($name == "All") {
		
	$query = "SELECT id,date,activity,driver,escort,remarks,class FROM jobs WHERE ( date LIKE '% $monthShort $year' OR date LIKE '% $monthLong $year' ) ORDER BY id DESC ";
	
	}elseif ( $name == "Today" ){

	$query = "SELECT id,date,activity,driver,escort,remarks,class FROM jobs WHERE ( date LIKE '$day $monthShort $year' OR date LIKE '$day $monthLong $year' ) ORDER BY id DESC ";

	}elseif ( $pending == true ){

	$query = "SELECT id,date,activity,driver,escort,remarks,class FROM jobs WHERE ( driver='$name' OR escort='$name' ) AND class= 'pending' ORDER BY id DESC ";
	
	}else {
	
	$query = "SELECT id,date,activity,driver,escort,remarks,class FROM jobs WHERE ( driver='$name' OR escort='$name' ) AND ( date LIKE '% $monthShort $year' OR date LIKE '% $monthLong $year' ) ORDER BY id DESC ";
	
	}

	if ( $pending == true && $name == "All" ){

	$query = "SELECT id,date,activity,driver,escort,remarks,class FROM jobs WHERE class= 'pending' ORDER BY id DESC ";
			
	}
	
	$result = mysqli_query($conn,$query) or die(mysqli_error());

	if(mysqli_num_rows($result) > 0){

		while($row = mysqli_fetch_array($result)){
			$id = $row['id'];
			$date = $row['date'];
			$activity = $row['activity'];
			$driver = $row['driver'];
			$escort = $row['escort'];
			$class = $row['class'];
			$remarks = $row['remarks'];
		
			$return_arr[] = array("id" => $id,
							"date" => $date,
							"activity" => $activity,
							"driver" => $driver,
							"escort" => $escort,
							"class" => $class,
							"remarks" => $remarks
							);
		
		
		}

			// Encoding array in JSON format
	echo json_encode($return_arr);

	} else {
		echo 'No records found !';
	}

	
	};

	if(isset ($_REQUEST["getExpandedJob"]) ){
		$id = $_REQUEST["getExpandedJob"];
		
		$query = "SELECT * FROM jobs WHERE id='$id' ORDER BY id DESC";
		
		$result = mysqli_query($conn,$query) or die(mysqli_error());
		
			while($row = mysqli_fetch_array($result)){
				$id = $row['id'];
				$date = $row['date'];
				$activity = $row['activity'];
				$driver = $row['driver'];
				$escort = $row['escort'];
				$vehicle = $row['vehicle'];
				$pickups = $row['pickups'];
				$class = $row['class'];
				$details = $row['details'];
				$remarks = $row['remarks'];
			
				$return_arr[] = array("id" => $id,
								"date" => $date,
								"activity" => $activity,
								"driver" => $driver,
								"escort" => $escort,
								"vehicle" => $vehicle,
								"pickups" => $pickups,
								"class" => $class,
								"details" => $details,
								"remarks" => $remarks
								);
			
			
			}
		
			// Encoding array in JSON format
		echo json_encode($return_arr);
		
		};

		
if(isset ($_REQUEST["downloadJobs"]) ){
	$name = $_REQUEST["downloadJobs"];
	$monthShort = $_REQUEST["monthShort"];
	$monthLong = $_REQUEST["monthLong"];
	$year = $_REQUEST["year"];
		
		if ($name == "All") {
			
		$query = "SELECT id,date,activity,driver,escort,remarks,class,vehicle FROM jobs WHERE ( date LIKE '% $monthShort $year' OR date LIKE '% $monthLong $year' ) ORDER BY id DESC ";
		
		}else {
		
		$query = "SELECT id,date,activity,driver,escort,remarks,class,vehicle FROM jobs WHERE ( driver='$name' OR escort='$name' ) AND ( date LIKE '% $monthShort $year' OR date LIKE '% $monthLong $year' ) ORDER BY id DESC ";
		
		}
	
		$result = mysqli_query($conn,$query) or die(mysqli_error());
	
		if(mysqli_num_rows($result) > 0){
	
			while($row = mysqli_fetch_array($result)){
				$id = $row['id'];
				$date = $row['date'];
				$activity = $row['activity'];
				$driver = $row['driver'];
				$escort = $row['escort'];
				$vehicle = $row['vehicle'];
				$class = $row['class'];

				$return_arr[] = array("id" => $id,
								"date" => $date,
								"activity" => $activity,
								"driver" => $driver,
								"escort" => $escort,
								"vehicle" => $vehicle,
								"class" => $class
								);
			
			
			}
	
				// Encoding array in JSON format
		echo json_encode($return_arr);
	
		} else {
			echo 'No records found !';
		}
	
		
		};

//GET DRIVERS REMARKS
if(isset ($_REQUEST["getRemarks"]) ){
	$id = $_REQUEST["getRemarks"];
  
	$sql = "SELECT remarks FROM jobs WHERE id='$id' ";
	
	$result = mysqli_query($conn,$sql);
	$row = mysqli_fetch_assoc($result);
		
	 echo $row['remarks'];
	 
	};

?>
