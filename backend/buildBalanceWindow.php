<?php
header('Access-Control-Allow-Origin: *');

include "config/config.php";

if(isset ($_REQUEST["getBalance"]) ){
$name = $_REQUEST["getBalance"];

$return_arr = array();

$query = "SELECT * FROM balance WHERE staff='$name' ORDER BY id DESC";


$result = mysqli_query($conn,$query) or die(mysqli_error());

if(mysqli_num_rows($result) > 0){

while($row = mysqli_fetch_array($result)){
	
    $id = $row['id'];
    $description = $row['description'];
    $date = $row['date'];
    $euro = $row['euro'];
	$staff = $row['staff'];
	$class = $row['class'];
    


    $return_arr[] = array("id" => $id,
		            "description" => $description,
                    "date" => $date,
					"euro" => $euro,
					"staff" => $staff,
                    "class" => $class
                    );


}

// Encoding array in JSON format
echo json_encode($return_arr);

} else {
    echo 'No stored transactions !';
}

};

//INSERT BALANCE
if(isset ($_REQUEST["description"]) ){
    $description = $_REQUEST["description"];
    $date = $_REQUEST["datetrans"];
    $amount = $_REQUEST["amount"];
    $staff = $_REQUEST["staff"];
    $class = $_REQUEST["dbclass"];
    $receipt = $_REQUEST["receipt"];
    
    
    
    $sql = "INSERT INTO balance (description, date, euro, staff, class, receipt)
    VALUES ( '$description', '$date', '$amount', '$staff', '$class' , '$receipt')";
    
    if ($conn->query($sql) === TRUE) {
        
      echo "New balance transaction added for ".$staff."!";
        
      exit;
      }else {
      echo "Error: " . $sql . "<br>" . $conn->error;
      exit;
      }
        
    };
    
    //GET DATA FOR BALANCE
    if(isset ($_REQUEST["idGetBalanceData"]) ){
    $getid = $_REQUEST["idGetBalanceData"];
        
    $sql = "SELECT * FROM balance WHERE id=$getid";
    
    $result = mysqli_query($conn,$sql);
    
    while($row = mysqli_fetch_array($result)){
    
        $description = $row['description'];
        $date = $row['date'];
        $euro = $row['euro'];
          $staff = $row['staff'];
          $class = $row['class'];
        $receipt = $row["receipt"];
    
    
        $return_arr[] = array("description" => $description,
                        "date" => $date,
                        "euro" => $euro,
                        "staff" => $staff,
                        "class" => $class,
                        "receipt" => $receipt
                        );
    
    
    }
    
    // Encoding array in JSON format
    echo json_encode($return_arr);
    
        
    };
    
    //EDIT BALANCE
    if(isset ($_REQUEST["balanceid"]) ){
    $id = $_REQUEST["balanceid"];
    $description = $_REQUEST["descriptionEdit"];
    $date = $_REQUEST["datetrans"];
    $amount = $_REQUEST["amount"];
    $staff = $_REQUEST["staff"];
    $class = $_REQUEST["dbclass"];
    $receipt = $_REQUEST["receipt"];
    
    
    $sql = "UPDATE balance SET description='$description', date='$date', euro='$amount', staff='$staff', class='$class', receipt='$receipt'  WHERE id='$id'";
    
    if ($conn->query($sql) === TRUE) {
        
      echo "Transaction #".$id." has updated succesfully !";
        
      exit;
      }else {
      echo "Error: " . $sql . "<br>" . $conn->error;
      exit;
      }
        
    };
    
    //DELETE MULTIPLE BALANCE
    if(isset ($_REQUEST["deleteMultiple"]) ){
    $id = $_REQUEST["deleteMultiple"];
    $ids = join("','",$id);   
    $sql = "DELETE FROM balance WHERE id IN ('$ids')";
    
      if ($conn->query($sql) === TRUE) {
        echo "Transactions has deleted from database succesfully";
        exit;
        }else {
        echo "Error: " . $sql . "<br>" . $conn->error;
        exit;
        }
      };
    
      //GET RECEIPT
      if(isset ($_REQUEST["getReceipt"]) ){
        $id = $_REQUEST["getReceipt"];
        
          $sql = "SELECT receipt FROM balance WHERE id = '$id' ";
          
          $result = mysqli_query($conn,$sql);
          $row = mysqli_fetch_assoc($result);
              
           echo json_encode( $row['receipt'] );
          
          };

?>

 