<?php
header('Access-Control-Allow-Origin: *');

include "config/config.php";

//INSERT ACTIVITY
if(isset ($_REQUEST["date"]) ){
$date = $_REQUEST["date"];
$activity = $_REQUEST["activity"];
$driver = $_REQUEST["driver"];
$escort = $_REQUEST["escort"];
$vehicle = $_REQUEST["vehicle"];
$pickups = $_REQUEST["pickups"];
$details = $_REQUEST["details"];
$class = $_REQUEST["dbclass"];

$sql1 = "INSERT INTO jobs (date, activity, driver, escort, vehicle, pickups, details, class)
VALUES ('$date', '$activity', '$driver', '$escort', '$vehicle', '$pickups', '$details', '$class')";

if ($conn->query($sql1) === TRUE) {
	
  echo "New activity assigned succesfully to ".$driver."!";
    
  exit;
  }else {
  echo "Error: " . $sql1 . "<br>" . $conn->error;
  exit;
  }
    
};

//UPDATE ACTIVITY
if (isset ($_REQUEST["idUpdate"]) ){
$id = $_REQUEST["idUpdate"];
$date = $_REQUEST["dateUpdate"];
$activity = $_REQUEST["activity"];
$driver = $_REQUEST["driver"];
$escort = $_REQUEST["escort"];
$vehicle = $_REQUEST["vehicle"];
$pickups = $_REQUEST["pickups"];
$details = $_REQUEST["details"];

$sql = "UPDATE jobs SET date='$date',
activity='$activity' ,
driver='$driver' ,
escort='$escort' ,
vehicle='$vehicle' ,
pickups='$pickups' ,
details='$details' WHERE id='$id'";

if ($conn->query($sql) === TRUE) {
	
  echo "Activity #".$id." has updated succesfully !";
    
  exit;
  }else {
  echo "Error: " . $sql . "<br>" . $conn->error;
  exit;
  }
    
};

//UPDATE REMARKS
if(isset ($_REQUEST["idUpdateRemarks"]) ){
$id = $_REQUEST["idUpdateRemarks"];
$remarks = $_REQUEST["remarks"];

$sql = "UPDATE jobs SET remarks='$remarks' WHERE id='$id'";

if ($conn->query($sql) === TRUE) {
	
  echo "Activity #".$id." has updated succesfully !";
    
  exit;
  }else {
  echo "Error: " . $sql . "<br>" . $conn->error;
  exit;
  }
    
};

//PENDING ACTIVITY
if(isset ($_REQUEST["pendingid"]) ){
$id = $_REQUEST["pendingid"];
$class = $_REQUEST["dbclass"];


$sql = "UPDATE jobs SET class='$class' WHERE id='$id'";

if ($conn->query($sql) === TRUE) {
	
  echo "Activity #".$id." has updated succesfully !";
    
  exit;
  }else {
  echo "Error: " . $sql . "<br>" . $conn->error;
  exit;
  }
    
};

//COMPLETE ACTIVITY
if(isset ($_REQUEST["completeid"]) ){
$id = $_REQUEST["completeid"];
$class = $_REQUEST["dbclass"];


$sql = "UPDATE jobs SET class='$class' WHERE id='$id'";

if ($conn->query($sql) === TRUE) {
	
  echo "Activity #".$id." has updated succesfully !";
    
  exit;
  }else {
  echo "Error: " . $sql . "<br>" . $conn->error;
  exit;
  }
    
};

//DISABLE ACTIVITY
if(isset ($_REQUEST["disableid"]) ){
$id = $_REQUEST["disableid"];
$class = $_REQUEST["dbclass"];


$sql = "UPDATE jobs SET class='$class' WHERE id='$id'";

if ($conn->query($sql) === TRUE) {
	
  echo "Activity #".$id." has updated succesfully !";
    
  exit;
  }else {
  echo "Error: " . $sql . "<br>" . $conn->error;
  exit;
  }
    
};

//DELETE DB RECORD
if(isset ($_REQUEST["deleteid"]) ){
$id = $_REQUEST["deleteid"];
$sql = "DELETE FROM jobs WHERE id=$id ";
	
if ($conn->query($sql) === TRUE) {
  echo "Activity #".$id." has deleted from database succesfully";
  exit;
  }else {
  echo "Error: " . $sql . "<br>" . $conn->error;
  exit;
  }
};

//GET DATA FOR UPDATE FUNCTION
if(isset ($_REQUEST["idGetData"]) ){
  $getid = $_REQUEST["idGetData"];
    
  $sql = "SELECT * FROM jobs WHERE id=$getid";
  
  $result = mysqli_query($conn,$sql);
  
  while($row = mysqli_fetch_array($result)){
    
    $id = $row['id'];
    $date = $row['date'];
    $activity = $row['activity'];
    $driver = $row['driver'];
    $escort = $row["escort"];
    $vehicle = $row['vehicle'];
    $pickups = $row['pickups'];
    $details = $row['details'];
    $remarks = $row['remarks'];
    $class = $row['class'];

      $return_arr[] = array("id" => $id,
                      "date" => $date,
                      "activity" => $activity,
              "driver" => $driver,
            "escort" => $escort,
            "vehicle" => $vehicle,
            "pickups" => $pickups,
            "details" => $details,
            "remarks" => $remarks,
                      "class" => $class
            );
  
  
  }
  
  // Encoding array in JSON format
  echo json_encode($return_arr);
  
      
  };

//ADD TO LOGGER
if(isset ($_REQUEST["userlog"]) ){
$user = $_REQUEST["userlog"];
$action = $_REQUEST["actionlog"];
$date = $_REQUEST["datelog"];
$class = $_REQUEST["dbclasslog"];

$sql = "INSERT INTO logs (user, action, date, class)
VALUES ('$user', '$action', '$date', '$class')";

if ($conn->query($sql) === TRUE) {
	
//  echo "New activity assigned succesfully to ".$driver."!";
    
  exit;
  }else {
  echo "Error: " . $sql . "<br>" . $conn->error;
  exit;
  }
    
};

  //GET ADMIN
  if(isset ($_REQUEST["getAdmin"]) ){

    $sql = "SELECT * FROM admin";
    
    $result = mysqli_query($conn,$sql);
    
    while($row = mysqli_fetch_array($result)){
    
        $name = $row['name'];
        $password = $row['password'];
        $status = $row['status'];
  
        $return_arr[] = array("name" => $name,
                        "password" => $password,
                        "status" => $status,
              );
    
    
    }

  // Encoding array in JSON format
  echo json_encode($return_arr);
  
      
  };

  //GET ALL STAFF
if(isset ($_REQUEST["getStaff"]) ){

  $sql = "SELECT * FROM staff";
  
  $result = mysqli_query($conn,$sql);
  
  while($row = mysqli_fetch_array($result)){
  
      $id = $row['id'];
      $name = $row['name'];
      $password = $row['password'];

      $return_arr[] = array("id" => $id,
                      "name" => $name,
                      "password" => $password,
            );
  
  
  }
  
  // Encoding array in JSON format
  echo json_encode($return_arr);
  
      
  };

  //GET SINGLE STAFF
if(isset ($_REQUEST["getSingleStaff"]) ){
$id = $_REQUEST["getSingleStaff"];

  $sql = "SELECT name FROM staff WHERE id = '$id' ";
  
  $result = mysqli_query($conn,$sql);
  $row = mysqli_fetch_assoc($result);
      
   echo $row['name'];
  
  };


  //INSERT STAFF MEMBER
if(isset ($_REQUEST["addStaff"]) ){
  $name = $_REQUEST["addStaff"];
  $password = $_REQUEST["password"];

  
  $sql = "INSERT INTO staff (name, password, status)
  VALUES ( '$name', '$password', 'unlogged')";

// mkdir("staff/".$name."");
// $url = "staff/".$name."/index.html";
// $myfile = fopen($url, "w") or die("Unable to create page!");
// fwrite($myfile, $markup);
// fclose($myfile);  
  
  if ($conn->query($sql) === TRUE) {
    
    echo "Staff member added succesfully !";
      
    exit;
    }else {
    echo "Error: " . $sql . "<br>" . $conn->error;
    exit;
    }
      
  };

  //EDIT STAFF MEMBER
if(isset ($_REQUEST["updateStaff"]) ){
  $id = $_REQUEST["updateStaff"];
  $oldName = $_REQUEST["oldName"];
  $newName = $_REQUEST["newName"];
  $password = $_REQUEST["password"];


if( $newName == "admin" ){
  $sql = "UPDATE admin SET password='$password' WHERE id=1";
}else{
  $sql = "UPDATE staff SET name='$newName', password='$password' WHERE id='$id'";

  // rename("staff/".$oldName."", "staff/".$newName."");

}

if ($conn->query($sql) === TRUE) {
    
    echo "Updated succesfully !";
      
    exit;
    }else {
    echo "Error: " . $sql . "<br>" . $conn->error;
    exit;
    }

  };

  //DELETE STAFF MEMBER
if(isset ($_REQUEST["deleteStaff"]) ){
  $id = $_REQUEST["deleteStaff"];
  $name = $_REQUEST["name"];
  // $dir = "staff/".$name."";

  $sql = "DELETE FROM staff WHERE id=$id ";

   if ($conn->query($sql) === TRUE) {
    echo "Staff member is removed succesfully";

    $sql="SET  @num := 0"; 
    $result=$conn->query($sql);
    $sql="UPDATE staff SET id = @num := (@num+1)"; 
    $result=$conn->query($sql);
    $sql="ALTER TABLE staff AUTO_INCREMENT =1"; 
    $result=$conn->query($sql);

    //shell_exec("rm -rf " . $dir);   // DELETE THE DIRECTORY WITH THE PROVIDED NAME,RM = 
    // REMOVE RF = RECURSIVE AND FORCEFULLY -  IGNORING PERMISSIONS,REFACTOR THIS USING SAFER RMDIR AND UNLINK FOR EMPTYING THE FOLDER

    exit;
    }else {
    echo "Error: " . $sql . "<br>" . $conn->error;
    exit;
    }
    
  };

      //GET ALL VEHICLES
if(isset ($_REQUEST["getVehicles"]) ){

  $sql = "SELECT * FROM vehicles";
  
  $result = mysqli_query($conn,$sql);
  
  while($row = mysqli_fetch_array($result)){
  
      $id = $row['id'];
      $plate = $row['plate'];

      $return_arr[] = array("id" => $id,
                      "plate" => $plate
            );
  }
  
  // Encoding array in JSON format
  echo json_encode($return_arr);
  
  };

    //INSERT VEHICLE
  if(isset ($_REQUEST["addVehicle"]) ){
    $plate = $_REQUEST["addVehicle"];
    
    $sql = "INSERT INTO vehicles (plate) VALUES ( '$plate')";
      
    if ($conn->query($sql) === TRUE) {
      
      echo "Vehicle added succesfully !";
        
      exit;
      }else {
      echo "Error: " . $sql . "<br>" . $conn->error;
      exit;
      }
        
    };
  
    //EDIT VEHICLE
  if(isset ($_REQUEST["updateVehicle"]) ){
    $id = $_REQUEST["updateVehicle"];
    $plate = $_REQUEST["plate"];
  
  $sql = "UPDATE vehicles SET plate='$plate' WHERE id='$id'";
  
  if ($conn->query($sql) === TRUE) {
      
      echo "Updated succesfully !";
        
      exit;
      }else {
      echo "Error: " . $sql . "<br>" . $conn->error;
      exit;
      }
  
    };
  
    //DELETE VEHICLE
  if(isset ($_REQUEST["deleteVehicle"]) ){
    $id = $_REQUEST["deleteVehicle"];

    $sql = "DELETE FROM vehicles WHERE id=$id ";
  
     if ($conn->query($sql) === TRUE) {
      echo "Vehicle is removed succesfully";

      $sql="SET  @num := 0"; 
      $result=$conn->query($sql);
      $sql="UPDATE vehicles SET id = @num := (@num+1)"; 
      $result=$conn->query($sql);
      $sql="ALTER TABLE vehicles AUTO_INCREMENT =1"; 
      $result=$conn->query($sql);

      exit;
      }else {
      echo "Error: " . $sql . "<br>" . $conn->error;
      exit;
      }
      
    };

    //STATUS CHECK
if(isset ($_REQUEST["getStatus"]) ){
  $name = $_REQUEST["getStatus"];

  if ( $name == "Admin" ){
    $sql = "SELECT status FROM admin WHERE id = 1 ";
  }else{
    $sql = "SELECT status FROM staff WHERE name = '$name' ";
  }
  
    $result = mysqli_query($conn,$sql);
    $row = mysqli_fetch_assoc($result);
        
     echo $row['status'];

    };

//SET UNLOGGED STATUS
if(isset ($_REQUEST["setStatus"]) ){
  $id = $_REQUEST["setStatus"];
  $whoTo = $_REQUEST["whoTo"];

  if( $whoTo == "staff" ){
  $sql = "UPDATE staff SET status='unlogged' WHERE id='$id'";
  }else{
  $sql = "UPDATE admin SET status='unlogged' WHERE id=1";
  }

  if ($conn->query($sql) === TRUE) {

    echo "".$name." is logged out !";
    
    exit;
    }else {
    echo "Error: " . $sql . "<br>" . $conn->error;
    exit;
    }

  };

  //PASSWORD CHECK
if(isset ($_REQUEST["sendPassword"]) ){
$name = $_REQUEST["sendPassword"];
$password = $_REQUEST["password"];

if( $name == "Admin" ){
  $sql = "SELECT password FROM admin WHERE id = 1";
}else{
  $sql = "SELECT password FROM staff WHERE name = '$name' ";
}

  $result = mysqli_query($conn,$sql);
  $row = mysqli_fetch_assoc($result);
  
  $checkPass;

  if ( $password === $row['password'] ){

$checkPass = "correct";

if( $name == "Admin" ){

$sql1 = "UPDATE admin SET status='logged' WHERE id = 1";
$result1=$conn->query($sql1);

}else{

  $sql1 = "UPDATE staff SET status='logged' WHERE name = '$name' ";
  $result1=$conn->query($sql1);

}

  }else{

$checkPass = "Wrong password,try again";

  }
  
echo $checkPass;
  
  };

if(isset ($_REQUEST["getRequests"]) ){

    
  $sql = "SELECT * FROM requests";
  
  $result = mysqli_query($conn,$sql);
  
  while($row = mysqli_fetch_array($result)){
    
    $id = $row['id'];
    $staff = $row['staff'];
    $request = $row['request'];

  
      $return_arr[] = array("id" => $id,
                      "staff" => $staff,
                      "request" => $request
            );
  
  
  }

  $sql="SET  @num := 0"; 
  $result=$conn->query($sql);
  $sql="UPDATE requests SET id = @num := (@num+1)"; 
  $result=$conn->query($sql);
  $sql="ALTER TABLE requests AUTO_INCREMENT =1"; 
  $result=$conn->query($sql);
  
  // Encoding array in JSON format
  echo json_encode($return_arr);
  
      
  };

  //INSERT ACTIVITY
if(isset ($_REQUEST["insertRequest"]) ){
  $request = $_REQUEST["insertRequest"];
  $staff = $_REQUEST["staff"];

  $sql1 = "INSERT INTO requests (request, staff)
  VALUES ('$request', '$staff')";
  
  if ($conn->query($sql1) === TRUE) {
    
    echo "New request submitted succesfully";
      
    exit;
    }else {
    echo "Error: " . $sql1 . "<br>" . $conn->error;
    exit;
    }
      
  };

?>
