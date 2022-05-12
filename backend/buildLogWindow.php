<?php
header('Access-Control-Allow-Origin: *');

include "config/config.php";

$return_arr = array();

$query = "SELECT * FROM logs ORDER BY id DESC";

$result = mysqli_query($conn,$query) or die(mysqli_error());

if(mysqli_num_rows($result) > 0){

while($row = mysqli_fetch_array($result)){
	
    // $id = $row['id'];
    $user = $row['user'];
    $action = $row['action'];
    $date = $row['date'];
	// $class = $row['class'];
    


    $return_arr[] = array(//"id" => $id,
		            "user" => $user,
                    "action" => $action,
                    "date" => $date//,
                   // "class" => $class
                    );


}

// Encoding array in JSON format
echo json_encode($return_arr);

} else {
    echo 'No records found !';
}

?>
