<!DOCTYPE html>
<html lang="en" spellcheck=false data-name="<?php echo $_GET['staff']; ?>">
<head>
<title>Getaways</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no">
<meta charset="UTF-8">
<link rel="icon" type="image/png" href="../img/getaways_logo.png"/>
<script type="text/javascript" src="../dep/jquery-3.6.0.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js" integrity="sha512-uto9mlQzrs59VwILcLiRYeLKPPbS/bT71da/OEBYEwcdNUk8jYIy+D176RYoop1Da+f9mvkYrmj5MCLZWEtQuA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.css" integrity="sha512-aOG0c6nPNzGk+5zjwyJaoRUgCdOrfSDhmMID2u4+OIslr0GjpLKo7Xm0Ao3xmpM4T8AmIouRkqwj1nrdVsLKEQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />
<script src="../dep/sweetalert.js" type="text/javascript"></script>
<script src=../js/index.js></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
<script src="../dep/moment.js"></script>
<link rel="stylesheet" type="text/css" href="../css/index.css">
<script lang="javascript" src="../dep/exceljs.js"></script>
<script lang="javascript" src="../dep/FileSaver.min.js"></script>
<script src="../dep/fontawesome.js" crossorigin="anonymous"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat+Alternates:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Teko:wght@300;400;500;600;700&family=Ubuntu+Condensed&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap" rel="stylesheet">
</head>
<body>
<div id="app" class="container">
<a href="../index.html">
<div class="d-flex flex-row justify-content-center align-items-center p-2" id=logowrap>
<img id=logo class="rotate" src=../img/getaways_logo.png><img id=logo2 src=../img/getaways_logon_cropped.png>
</div>
</a>
<div id="loading">App is loading...</div>
<div id="main" class="d-flex flex-column gap-1 pb-5 blur-background">
<div class="dropdown d-flex flex-column gap-1">
  <button class="btn btn-lg btn-primary dropdown-toggle fs-6" data-bs-toggle="dropdown" aria-expanded="false">
Staff schedule
  </button>
  <ul class="dropdown-menu dropdown-menu-dark schedule">
    <li><a class="dropdown-item show-by-staff">All today</a></li>
    <li><a class="dropdown-item show-by-staff">All</a></li>
    <li><hr class="dropdown-divider"></li>
    <div class="dropdown-staff">
  </div>
  <li><hr class="dropdown-divider"></li>
  <li id="download-schedule"><a class="dropdown-item"><i class="fas fa-save"></i>Save file</a></li>
	<li id="newjob"><a class="dropdown-item"><i class="fas fa-plus"></i>Add new task</a></li>
  </ul>
</div>
<div id="schedule-wrap" class="wrap">
<div class="d-flex flex-column gap-1" id="jobs-table">
<button type="button" class="btn-close btn-lg"></button>
<div class="container sticky-top">
  <div class="row">
  <div class="jobs-dbname col d-flex justify-content-center align-items-center p-2 rounded-top" style="background: hsl(0, 0%, 87%)"></div>
  </div>
</div>
<div id="jobs-table-wrap"></div>
</div>
</div>
<div class="dropdown d-flex flex-column">
  <button class="btn btn-lg btn-primary dropdown-toggle fs-6" type="button" data-bs-toggle="dropdown" aria-expanded="false">
My balance
  </button>
  <ul class="dropdown-menu dropdown-menu-dark balance">
  <li><a class="dropdown-item show-by-staff"><?php echo $_GET['staff']; ?></a></li>
  <li><hr class="dropdown-divider"></li>
	<li id="new-balance"><a class="dropdown-item"><i class="fas fa-plus"></i>Add new transaction</a></li>
  </ul>
</div>
<div id="balance-wrap" class="wrap">
<div class="d-flex flex-column gap-1" id="balance-table">
<button type="button" class="btn-close btn-lg"></button>
<div class="container select-action-buttons" style="display: none;">
<div class="row gap-1">
  <button type="button" class="col btn btn-sm btn-danger p-1 select-action-delete"><i class="m-0 far fa-trash-alt"></i></button>
  <button type="button" class="col-7 btn btn-sm btn-light select-action-cancel">Cancel</button>
</div>
</div>
<div id="balance-table-wrap">
<table class="table">
<thead class="sticky-top bg-light">
<tr id="balance-header"><th class="balance-header-th" colspan="5" style="background: hsl(0, 0%, 87%)"></th>
  <th class="text-dark" style="background: rgb(196, 196, 196)">
  <div class="dropdown">
  <div data-bs-toggle="dropdown"><i class="fas fa-ellipsis-h"></i>
  </div>
  <ul class="dropdown-menu dropdown-menu-dark">
    <li class="download-balance"><a class="dropdown-item"><i class="fas fa-save"></i> Save file</a></li>
    <li><hr class="dropdown-divider"></li>
    <li class="select-records"><a class="dropdown-item"><i class="far fa-trash-alt"></i> Batch delete</a></li>
    <li class="reset-balance"><a class="dropdown-item"><i class="fas fa-exclamation-circle text-danger"></i> Reset table</a></li>
  </ul>
  </div>
  </th></tr>
<tr><th colspan="3" class="p-1">Total balance</th><th colspan="3" style="background: hsl(0, 0%, 95%);"></th></tr>
<tr><th colspan="3" id="income-balance" class="p-1"></th><th class="p-1">Income</th><th class="p-1 border-end-0">Expenses</th><th class="p-0"></th></tr>
<tr class="border-bottom-0">
  <th class="p-0 border-bottom-0" style="background: hsl(0, 0%, 95%);">#</th>
  <th class="p-0 border-bottom-0">Description</th>
  <th class="p-1 border-bottom-0">Date</th>
  <th id="income-total" class="p-0 border-bottom-0"></th>
  <th id="expenses-total" class="p-0 border-bottom-0 border-end-0"></th>
  <th class="p-1 border-bottom-0"><div class="d-flex justify-content-center align-items-center"><input class="table-select-all-checkbox" type="checkbox" style="display:none;width: 1.9em;height: 1.9em;"></div></th>
</tr>
</thead>
<tbody id="balance-tbody">
</tbody>
</table>	
</div>
</div>
</div>
<div class="dropdown d-flex flex-column gap-1">
  <button class="btn btn-lg btn-primary dropdown-toggle fs-6" type="button" data-bs-toggle="dropdown" aria-expanded="false">
My fuel reports
  </button>
  <ul class="dropdown-menu dropdown-menu-dark">
	<li><a class="dropdown-item show-by-staff"><?php echo $_GET['staff']; ?></a>
  <li><hr class="dropdown-divider"></li>
  <div class="dropdown-vehicles">
    </div>
  <li><hr class="dropdown-divider"></li>
	<li id="new-fuel-report"><a class="dropdown-item"><i class="fas fa-plus"></i>Add new fuel report</a></li>
  </ul>
	</div>
<div id="fuel-wrap" class="wrap">
<div class="d-flex flex-column gap-1" id="fuel-table">
<button type="button" class="btn-close btn-lg"></button>
  <div class="container select-action-buttons" style="display: none;">
    <div class="row gap-1">
      <button type="button" class="col btn btn-sm btn-danger p-1 select-action-delete"><i class="m-0 far fa-trash-alt"></i></button>
      <button type="button" class="col-7 btn btn-sm btn-light select-action-cancel">Cancel</button>
    </div>
    </div>
<div id="fuel-table-wrap">
<table class="table table-striped bg-light">
<thead class="sticky-top bg-light">
  <tr><th colspan="6" style="background: hsl(0, 0%, 87%)">Fuel reports</th>
    <th class="text-dark" style="background: rgb(196, 196, 196)">
      <div class="dropdown">
      <div data-bs-toggle="dropdown"><i class="fas fa-ellipsis-h"></i>
      </div>
      <ul class="dropdown-menu dropdown-menu-dark">
        <li class="select-records"><a class="dropdown-item"><i class="far fa-trash-alt"></i> Batch delete</a></li>
      </ul>
      </div>
      </th>
  </tr>
<tr class="border-bottom-0">
<th class="p-1 border-end border-bottom-0">#</th>
<th class="p-1 border-end border-bottom-0">Date</th>
<th class="p-1 border-end border-bottom-0">Driver</th>
<th class="p-1 border-end border-bottom-0">Vehicle</th>
<th class="p-1 border-end border-bottom-0">Amount</th>
<th class="p-1 border-end-0 border-bottom-0">Payment</th>
<th class="p-1 border-end border-start-0 border-bottom-0"><div class="d-flex justify-content-center align-items-center"><input class="table-select-all-checkbox" type="checkbox" style="display:none;width: 1.9em;height: 1.9em;"></div></th>
</tr>
</thead>
<tbody id="fuel-tbody">
</tbody>
</table>	
</div>
</div>
</div>
<div class="dropdown d-flex flex-column gap-1">
  <button class="btn btn-lg btn-primary dropdown-toggle fs-6" type="button" data-bs-toggle="dropdown" aria-expanded="false">
Fleet updates
  </button>
  <ul class="dropdown-menu dropdown-menu-dark fleet">
  <li><a class="dropdown-item show-by-staff"><?php echo $_GET['staff']; ?></a></li>
    <li><a class="dropdown-item show-fleet-all">VIew last update by vehicle</a></li>
    <li><hr class="dropdown-divider"></li>
    <li id="new-fleet-update"><a class="dropdown-item"><i class="fas fa-plus"></i>Add new vehicle update</a></li>
  </ul>
</div>
<div id="fleet-wrap" class="wrap">
  <div class="d-flex flex-column gap-1" id="fleet-table">
  <button type="button" class="btn-close btn-lg"></button>
  <div class="dropdown d-flex flex-column">
  <button id="fleet-vehicle-selector" class="btn btn-light btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
All updates by vehicle
  </button>
  <ul class="dropdown-menu dropdown-menu-dark fuel">
    <div class="dropdown-vehicles">
  </div>
  </ul>
</div>
  <div class="container select-action-buttons" style="display: none;">
    <div class="row gap-1">
      <button type="button" class="col btn btn-sm btn-danger p-1 select-action-delete"><i class="m-0 far fa-trash-alt"></i></button>
      <button type="button" class="col-7 btn btn-sm btn-light select-action-cancel">Cancel</button>
    </div>
    </div>
  <div id="fleet-table-wrap">
  <table class="table table-striped bg-light">
  <thead class="sticky-top bg-light">
  <tr>
    <th colspan="7" style="background: hsl(0, 0%, 87%)">Fleet updates</th>
    <th class="text-dark" style="background: rgb(196, 196, 196)">
      <div class="dropdown">
      <div data-bs-toggle="dropdown"><i class="fas fa-ellipsis-h"></i>
      </div>
      <ul class="dropdown-menu dropdown-menu-dark">
        <li class="select-records"><a class="dropdown-item"><i class="far fa-trash-alt"></i> Batch delete</a></li>
      </ul>
      </div>
      </th>
  </tr>
  <tr class="border-bottom-0">
    <th class="border-bottom-0"></th>
    <th class="p-1 border-end border-bottom-0">#</th>
    <th class="p-1 border-end border-bottom-0">Driver</th>
    <th class="p-1 border-end border-bottom-0">Date</th>
    <th class="p-1 border-end border-bottom-0">Vehicle</th>
    <th class="p-1 border-end border-bottom-0">Fuel</th>
    <th class="p-1 border-bottom-0">Km</th>
    <th class="p-1 border-bottom-0"><div class="d-flex justify-content-center align-items-center"><input class="table-select-all-checkbox" type="checkbox" style="display:none;width: 1.9em;height: 1.9em;"></div></th>
  </tr>
  </thead>
  <tbody id="fleet-tbody">
  </tbody>
  </table>	
  </div>
  </div>
  </div>
  <div class="dropdown d-flex flex-column gap-1">
  <button class="btn btn-lg btn-primary dropdown-toggle fs-6" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="margin-bottom:0.10rem">
 Info<i class="fas fa-info"></i>
  </button>
  <ul class="dropdown-menu dropdown-menu-dark">
  <li><a class="dropdown-item features">Upcoming features</a>
  <li><a class="dropdown-item request">Request changes/Report bugs</a>
  <li><a class="dropdown-item about">About</a>
  </ul>
  </div>
  <div class="fixed-bottom d-flex justify-content-between align-items-center p-2 bg-secondary bg-opacity-75">
  <div class="fas fa-user text-dark fs-5"></div>
  <div id="page-footer" class="fs-5 text-light"><?php echo $_GET['staff']; ?></div>
  <button id="top-button" onclick="topFunction()" style="opacity: 0;" class="btn btn-dark text-light border fas fa-arrow-up" type="button"></button>
</div>
</div>
</div>
</body>
</html>