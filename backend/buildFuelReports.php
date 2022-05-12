<?php
header('Access-Control-Allow-Origin: *');

include "config/config.php";

if(isset ($_REQUEST["getAllFuel"]) ){
	
$sql = "SELECT * FROM fuel ORDER BY id DESC";

$result = mysqli_query($conn,$sql) or die(mysqli_error());

if(mysqli_num_rows($result) > 0){

while($row = mysqli_fetch_array($result)){

    $id = $row['id'];
	$date = $row['date'];
    $staff = $row['staff'];
	$vehicle = $row['vehicle'];
    $amount = $row['amount'];
	$payment = $row['payment'];



    $return_arr[] = array("id" => $id,
                    "date" => $date,
                    "staff" => $staff,
				    "vehicle" => $vehicle,
					"amount" => $amount,
					"payment" => $payment
					
					);


}

// Encoding array in JSON format
echo json_encode($return_arr);

} else {
    echo 'No records found !';
}

    
};

if(isset ($_REQUEST["getDriverFuel"]) ){
$getDriver = $_REQUEST["getDriverFuel"];
	
$sql = "SELECT * FROM fuel WHERE staff = '$getDriver' ORDER BY id DESC";

$result = mysqli_query($conn,$sql) or die(mysqli_error());

if(mysqli_num_rows($result) > 0){

while($row = mysqli_fetch_array($result)){

    $id = $row['id'];
	$date = $row['date'];
    $staff = $row['staff'];
	$vehicle = $row['vehicle'];
    $amount = $row['amount'];
	$payment = $row['payment'];

    $return_arr[] = array("id" => $id,
                    "date" => $date,
                    "staff" => $staff,
				    "vehicle" => $vehicle,
					"amount" => $amount,
					"payment" => $payment
					
					);


}

// Encoding array in JSON format
echo json_encode($return_arr);

} else {
    echo "No records found for {$getDriver} !";
}

    
};

if(isset ($_REQUEST["getVehicleFuel"]) ){
$getVehicle = $_REQUEST["getVehicleFuel"];
	
$sql = "SELECT * FROM fuel WHERE vehicle = '$getVehicle' ORDER BY id DESC";

$result = mysqli_query($conn,$sql) or die(mysqli_error());

if(mysqli_num_rows($result) > 0){

while($row = mysqli_fetch_array($result)){

    $id = $row['id'];
	$date = $row['date'];
    $staff = $row['staff'];
	$vehicle = $row['vehicle'];
    $amount = $row['amount'];
	$payment = $row['payment'];

    $return_arr[] = array("id" => $id,
                    "date" => $date,
                    "staff" => $staff,
				    "vehicle" => $vehicle,
					"amount" => $amount,
					"payment" => $payment
					
					);


}

// Encoding array in JSON format
echo json_encode($return_arr);

} else {
    echo "No records found for {$getVehicle} !";
}

    
};

if(isset ($_REQUEST["getVehicleFuelByDriver"]) ){
$getDriver = $_REQUEST["getVehicleFuelByDriver"];
$getVehicle = $_REQUEST["plate"];
        
    $sql = "SELECT * FROM fuel WHERE vehicle = '$getVehicle' AND staff = '$getDriver' ORDER BY id DESC";
    
    $result = mysqli_query($conn,$sql) or die(mysqli_error());
    
    if(mysqli_num_rows($result) > 0){
    
    while($row = mysqli_fetch_array($result)){
    
        $id = $row['id'];
        $date = $row['date'];
        $staff = $row['staff'];
        $vehicle = $row['vehicle'];
        $amount = $row['amount'];
        $payment = $row['payment'];
    
        $return_arr[] = array("id" => $id,
                        "date" => $date,
                        "staff" => $staff,
                        "vehicle" => $vehicle,
                        "amount" => $amount,
                        "payment" => $payment
                        
                        );
    
    
    }
    
    // Encoding array in JSON format
    echo json_encode($return_arr);
    
    } else {
        echo "No records found for {$getVehicle} !";
    }
    
        
    };

if(isset ($_REQUEST["insertFuelReport"]) ){
$date = $_REQUEST["insertFuelReport"];
$staff = $_REQUEST["staff"];
$vehicle = $_REQUEST["vehicle"];
$amount = $_REQUEST["amount"];
$payment = $_REQUEST["payment"];
$receipt = $_REQUEST["receipt"];


$sql = "INSERT INTO fuel (date, staff, vehicle, amount, payment, receipt)
VALUES ('$date', '$staff', '$vehicle','$amount', '$payment', '$receipt')";

if ($conn->query($sql) === TRUE) {
	
  echo "New fuel report added for ".$staff."!";
    
  exit;
  }else {
  echo "Error: " . $sql . "<br>" . $conn->error;
  exit;
  }
    
};

//DELETE FUEL
if(isset ($_REQUEST["deleteFuelReport"]) ){
$id = $_REQUEST["deleteFuelReport"];
$sql = "DELETE FROM fuel WHERE id=$id ";
	
if ($conn->query($sql) === TRUE) {
  echo "Fuel report has deleted from database succesfully";
  exit;
  }else {
  echo "Error: " . $sql . "<br>" . $conn->error;
  exit;
  }
};


//GET DATA FOR FUEL
if(isset ($_REQUEST["idGetFuelData"]) ){
    $getid = $_REQUEST["idGetFuelData"];
        
    $sql = "SELECT * FROM fuel WHERE id=$getid";
    
    $result = mysqli_query($conn,$sql);
    
    while($row = mysqli_fetch_array($result)){

        $id = $row['id'];
        $date = $row['date'];
        $staff = $row['staff'];
        $vehicle = $row['vehicle'];
        $amount = $row['amount'];
        $payment = $row['payment'];
        $receipt = $row["receipt"];

        $return_arr[] = array("id" => $id,
                        "date" => $date,
                        "staff" => $staff,
                        "vehicle" => $vehicle,
                        "amount" => $amount,
                        "payment" => $payment,
                        "receipt" => $receipt
                        
                        );
    
    
    }
    
    // Encoding array in JSON format
    echo json_encode($return_arr);
    
        
    };


//EDIT FUEL
if(isset ($_REQUEST["editFuelReport"]) ){
    $id = $_REQUEST["editFuelReport"];
    $date = $_REQUEST["date"];
    $staff = $_REQUEST["staff"];
    $vehicle = $_REQUEST["vehicle"];
    $amount = $_REQUEST["amount"];
    $payment = $_REQUEST["payment"];
    $receipt = $_REQUEST["receipt"];
   
    $sql = "UPDATE fuel SET date='$date', staff='$staff', vehicle='$vehicle', amount='$amount', payment='$payment', receipt='$receipt' WHERE id='$id'";
    
    if ($conn->query($sql) === TRUE) {
        
      echo "Fuel report #".$id." has updated succesfully !";
        
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
            $sql = "DELETE FROM fuel WHERE id IN ('$ids')";
            
              if ($conn->query($sql) === TRUE) {
                echo "Reports has deleted from database succesfully";
                exit;
                }else {
                echo "Error: " . $sql . "<br>" . $conn->error;
                exit;
                }
              };

?>
