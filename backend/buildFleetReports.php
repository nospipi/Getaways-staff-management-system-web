<?php
header('Access-Control-Allow-Origin: *');

include "config/config.php";

if(isset ($_REQUEST["getAllFleet"]) ){  // i'm getting the last record for every unique vehicle number
    
$sql = "SELECT * FROM fleet WHERE id IN (SELECT MAX(id) FROM fleet GROUP BY vehicle) ORDER BY id DESC";

$result = mysqli_query($conn,$sql) or die(mysqli_error());

if(mysqli_num_rows($result) > 0){

while($row = mysqli_fetch_array($result)){

    $id = $row['id'];
	$date = $row['date'];
    $staff = $row['staff'];
	$vehicle = $row['vehicle'];
    $fuel = $row['fuel'];
	$km = $row['km'];
	$comments = $row['comments'];
    $location = $row['location'];


    $return_arr[] = array("id" => $id,
                    "date" => $date,
                    "staff" => $staff,
				    "vehicle" => $vehicle,
					"fuel" => $fuel,
					"km" => $km,
					"comments" => $comments,
					"location" => $location
					
					);


}

// Encoding array in JSON format
echo json_encode($return_arr);

} else {
    echo 'No records found !';
}

    
};


if(isset ($_REQUEST["getVehicleFleet"]) ){
$getVehicle = $_REQUEST["getVehicleFleet"];
$getDriver = $_REQUEST["staff"];

if ( $getDriver == null ){
    $sql = "SELECT * FROM fleet WHERE vehicle = '$getVehicle' ORDER BY id DESC";
}else{
    $sql = "SELECT * FROM fleet WHERE vehicle = '$getVehicle' AND staff = '$getDriver' ORDER BY id DESC";
}


$result = mysqli_query($conn,$sql) or die(mysqli_error());

if(mysqli_num_rows($result) > 0){

while($row = mysqli_fetch_array($result)){

    $id = $row['id'];
	$date = $row['date'];
    $staff = $row['staff'];
	$vehicle = $row['vehicle'];
    $fuel = $row['fuel'];
	$km = $row['km'];
	$comments = $row['comments'];


    $return_arr[] = array("id" => $id,
                    "date" => $date,
                    "staff" => $staff,
				    "vehicle" => $vehicle,
					"fuel" => $fuel,
					"km" => $km,
					"comments" => $comments
					
					);


}

// Encoding array in JSON format
echo json_encode($return_arr);


} else {
    echo 'No records found !';
}
    
};

if(isset ($_REQUEST["getDriverFleetLast"]) ){
$getDriver = $_REQUEST["getDriverFleetLast"];

$sql = "SELECT * FROM fleet WHERE  staff = '$getDriver' AND id IN (SELECT MAX(id) FROM fleet GROUP BY vehicle) ORDER BY id DESC";
    
        
    $result = mysqli_query($conn,$sql) or die(mysqli_error());
    
    if(mysqli_num_rows($result) > 0){
    
    while($row = mysqli_fetch_array($result)){
    
        $id = $row['id'];
        $date = $row['date'];
        $staff = $row['staff'];
        $vehicle = $row['vehicle'];
        $fuel = $row['fuel'];
        $km = $row['km'];
        $comments = $row['comments'];
    
    
        $return_arr[] = array("id" => $id,
                        "date" => $date,
                        "staff" => $staff,
                        "vehicle" => $vehicle,
                        "fuel" => $fuel,
                        "km" => $km,
                        "comments" => $comments
                        
                        );
    
    
    }
    
    // Encoding array in JSON format
    echo json_encode($return_arr);
    
    
    } else {
        echo 'No records found !';
    }
        
    };

if(isset ($_REQUEST["getDriverFleet"]) ){
    $getDriver = $_REQUEST["getDriverFleet"];
    $getVehicle = $_REQUEST["plate"];

    if( $getVehicle == null ){
        $sql = "SELECT * FROM fleet WHERE staff = '$getDriver' ORDER BY id DESC";
    }else{
        $sql = "SELECT * FROM fleet WHERE staff = '$getDriver' AND vehicle = '$getVehicle' ORDER BY id DESC";
    }
        
    $result = mysqli_query($conn,$sql) or die(mysqli_error());
    
    if(mysqli_num_rows($result) > 0){
    
    while($row = mysqli_fetch_array($result)){
    
        $id = $row['id'];
        $date = $row['date'];
        $staff = $row['staff'];
        $vehicle = $row['vehicle'];
        $fuel = $row['fuel'];
        $km = $row['km'];
        $comments = $row['comments'];
    
    
        $return_arr[] = array("id" => $id,
                        "date" => $date,
                        "staff" => $staff,
                        "vehicle" => $vehicle,
                        "fuel" => $fuel,
                        "km" => $km,
                        "comments" => $comments
                        
                        );
    
    
    }
    
    // Encoding array in JSON format
    echo json_encode($return_arr);
    
    
    } else {
        echo 'No records found !';
    }
        
    };

if(isset ($_REQUEST["insertFleetReport"]) ){
$date = $_REQUEST["insertFleetReport"];
$staff = $_REQUEST["staff"];
$vehicle = $_REQUEST["vehicle"];
$fuel = $_REQUEST["fuel"];
$km = $_REQUEST["km"];
$comments = $_REQUEST["comments"];
$location = $_REQUEST["location"];


$sql = "INSERT INTO fleet (date, staff, vehicle, fuel, km, comments, location)
VALUES ('$date', '$staff', '$vehicle', '$fuel', '$km', '$comments', '$location')";

if ($conn->query($sql) === TRUE) {
	
  echo "New vehicle update added for ".$vehicle."!";
    
  exit;
  }else {
  echo "Error: " . $sql . "<br>" . $conn->error;
  exit;
  }
    
};

if(isset ($_REQUEST["deleteFleetReport"]) ){
$id = $_REQUEST["deleteFleetReport"];
$sql = "DELETE FROM fleet WHERE id=$id ";
	
if ($conn->query($sql) === TRUE) {
  echo "Vehicle report has deleted from database succesfully";
  exit;
  }else {
  echo "Error: " . $sql . "<br>" . $conn->error;
  exit;
  }
};

//GET DATA FOR FLEET
if(isset ($_REQUEST["idGetFleetData"]) ){
    $getid = $_REQUEST["idGetFleetData"];
        
    $sql = "SELECT * FROM fleet WHERE id=$getid";
    
    $result = mysqli_query($conn,$sql);
    
    while($row = mysqli_fetch_array($result)){

        $id = $row['id'];
        $date = $row['date'];
        $staff = $row['staff'];
        $vehicle = $row['vehicle'];
        $fuel = $row['fuel'];
        $km = $row['km'];
        $comments = $row['comments'];
        $location = $row['location'];
    
    
        $return_arr[] = array("id" => $id,
                        "date" => $date,
                        "staff" => $staff,
                        "vehicle" => $vehicle,
                        "fuel" => $fuel,
                        "km" => $km,
                        "comments" => $comments,
                        "location" => $location
                        
                        );
    
    
    }
    
    // Encoding array in JSON format
    echo json_encode($return_arr);
    
        
    };

//GET FLEET INFO - COMMENTS AND LOCATION
  if(isset ($_REQUEST["getFleetInfo"]) ){
    $id = $_REQUEST["getFleetInfo"];

    $sql = "SELECT comments,location,vehicle FROM fleet WHERE  id=$id ";
    
    $result = mysqli_query($conn,$sql);
    
    while($row = mysqli_fetch_array($result)){
    
        $comments = $row['comments'];
        $location = $row['location'];
        $vehicle = $row['vehicle'];

        $return_arr[] = array("comments" => $comments,
                        "location" => $location,
                        "vehicle" => $vehicle
              );
    
    }

  echo json_encode($return_arr);
  
  };


//EDIT FLEET
if(isset ($_REQUEST["editFleetReport"]) ){
    $id = $_REQUEST["editFleetReport"];
    $date = $_REQUEST["date"];
    $staff = $_REQUEST["staff"];
    $vehicle = $_REQUEST["vehicle"];
    $fuel = $_REQUEST["fuel"];
    $km = $_REQUEST["km"];
    $comments = $_REQUEST["comments"];
    $location = $_REQUEST["location"];
    
    
    $sql = "UPDATE fleet SET date='$date', staff='$staff', vehicle='$vehicle', fuel='$fuel', km='$km', comments='$comments', location='$location' WHERE id='$id'";
    
    if ($conn->query($sql) === TRUE) {
        
      echo "Vehicle update #".$id." has updated succesfully !";
        
      exit;
      }else {
      echo "Error: " . $sql . "<br>" . $conn->error;
      exit;
      }
        
    };

            //DELETE MULTIPLE
            if(isset ($_REQUEST["deleteMultiple"]) ){
                $id = $_REQUEST["deleteMultiple"];
                $ids = join("','",$id);   
                $sql = "DELETE FROM fleet WHERE id IN ('$ids')";
                
                  if ($conn->query($sql) === TRUE) {
                    echo "Reports has deleted from database succesfully";
                    exit;
                    }else {
                    echo "Error: " . $sql . "<br>" . $conn->error;
                    exit;
                    }
                  };

?>
