$(document).ready(function () {

	console.log("Page : " + getName())

	if (getName() == "Home") {
		getNecessaryData().then(() => {
			unBlurBackground()
		}).catch(() => {

			Swal.fire({

				icon: 'warning',
				title: "Loading page has failed",
				showConfirmButton: false,
				heightAuto: false

			})

		})
	} else {

		authentication()

		document.body.addEventListener('scroll', () => {
			scrollFunction()
		})

		mutationObserve()

	}



});
let necessaryData = {
	staff: null,
	vehicles: null
}
let lastLoaded = {
	schedule: {
		name: null,
		date: {
			day: null,
			monthShort: null,
			monthLong: null,
			year: null
		},
		pending: null
	},
	balance: {
		name: null
	},
	fuel: {
		db: null,
		name: null,
		plate: null
	},
	fleet: {
		db: null,
		name: null,
		plate: null,
		editable: null
	}
}

function unBlurBackground() {
	$("#main").removeClass("blur-background");
	$("#loading").css({
		"display": "none"
	})
	console.log("page unblurred")
}

function authentication() {

	authenticationSequence().then(() => {
		return getNecessaryData()
	}).then(() => {
		unBlurBackground()
	})

}

function authenticationSequence() {

	return new Promise(function (resolveOuter) {

		getUserStatus(getName()).then(function (statusObject) {
			console.log("retrieving status...")
			console.log(statusObject)

			return new Promise(function (resolve) {
				resolve(statusObject)
			});

		}).then(function (statusObject) {

			return new Promise(function (resolve) {

				if (statusObject.serverStatus == "unlogged" || statusObject.localStatus == "unlogged") {

					handleLoginFlags("unlogged")
					resolve("authenticate")
					console.log("status is unlogged,proceed to password authentication..")
				} else {
					resolve("done")
					console.log("status is logged")
				}

			});

		}).then(function (action) {


			if (action == "authenticate") {

				sendPassword().then(function (response) {

					if (response == "correct") {
						handleLoginFlags("logged")

						showLoginAlert("logged").then(() => {
							resolveOuter()
						})
						console.log("password is correct,authentication is completed")

						getUserStatus(getName()).then(function (statusObject) {
							console.log(statusObject)
						})

					} else {
						console.log("password is wrong,we re-run authentication sequence")
						showLoginAlert("error").then(() => {
							authentication()
						})

					}

				})

			} else {
				resolveOuter()
				console.log("authentication is completed")
			}

		})

	});



}

function scrollFunction() {

	if (document.body.scrollTop > 20) {
		$("#top-button").addClass("top-button-show")
	} else {
		$("#top-button").removeClass("top-button-show")
	}
}

function topFunction() {
	$(document.body).animate({
		scrollTop: 0
	}, 600);
}

function getName() {

	var getname = $('html').data('name');

	return getname

}

function getNecessaryData() {

	console.log("retrieving necessary data for current page..")

	return new Promise(function (resolve, reject) {

		$.ajax({
			type: 'get',
			url: "http://localhost/Getaways-staff-management-system/backend/actions.php",
			data: {
				getStaff: null,
			},
			global: false,
			dataType: 'JSON'
		}).then(function (response) {

			necessaryData.staff = (response.map(value => value.name))

			if (getName() == "Home") {

				necessaryData.staff.forEach(i => {
					const tr_str =
						`<button class="btn btn-secondary" type="button" onclick="location.href='staff/index.php?staff=${i}'">${i}</button>`
					$("#staff-links-wrap").append(tr_str);
				})

			} else {

				necessaryData.staff.forEach(i => {
					const li =
						`<li><a class="dropdown-item show-by-staff">${i}</a></li>`
					$(".dropdown-staff").append(li);
				})

			}
			console.log("staff data is retrieved successfully.")

		}).then(function () {

			if (getName() !== "Home") {

				$.ajax({
					type: 'get',
					url: "http://localhost/Getaways-staff-management-system/backend/actions.php",
					data: {
						getVehicles: null,
					},
					global: false,
					dataType: 'JSON'
				}).then(function (response) {
					swal.close()
					necessaryData.vehicles = (response.map(value => value.plate))

					necessaryData.vehicles.forEach(i => {
						const li =
							`<li><a class="dropdown-item show-by-vehicle">${i}</a></li>`
						$(".dropdown-vehicles").append(li);
					})

					console.log("fleet data is retrieved successfully.")
					console.log("necessary data object below :")
					console.log(necessaryData)
					resolve()
				})

			} else {
				resolve()
			}



		}).catch(() => {

			reject()

		})

	});



}

function mutationObserve() {

	function balance() {
		$("#balance-table-wrap").find(".fa-ellipsis-h").toggleClass("rotate-ellipsis");
	}

	let balanceNode = document.querySelectorAll("#balance-table-wrap .dropdown-menu")[0]
	let balanceConfig = {
		attributes: true,
		attributeFilter: ['class']
	};

	let balanceObserver = new MutationObserver(balance);
	balanceObserver.observe(balanceNode, balanceConfig);

	// --------------------------------------------------------

	function fuel() {
		$("#fuel-table-wrap").find(".fa-ellipsis-h").toggleClass("rotate-ellipsis");
	}

	let fuelNode = document.querySelectorAll("#fuel-table-wrap .dropdown-menu")[0]
	let fuelConfig = {
		attributes: true,
		attributeFilter: ['class']
	};

	let fuelObserver = new MutationObserver(fuel);
	fuelObserver.observe(fuelNode, fuelConfig);

	// --------------------------------------------------------

	function fleet() {
		$("#fleet-table-wrap").find(".fa-ellipsis-h").toggleClass("rotate-ellipsis");
	}

	let fleetNode = document.querySelectorAll("#fleet-table-wrap .dropdown-menu")[0]
	let fleetConfig = {
		attributes: true,
		attributeFilter: ['class']
	};

	let fleetObserver = new MutationObserver(fleet);
	fleetObserver.observe(fleetNode, fleetConfig);

}

function getServerLogStatus() {

	return new Promise(function (resolve) {

		if (getName() !== "Home") {

			$.ajax({
				method: "get",
				url: "http://localhost/Getaways-staff-management-system/backend/actions.php",
				data: {
					getStatus: getName()
				},
				global: false,
				success: function (response) {

					resolve(response)

				}
			})

		}

	});

}

function getLocalLogStatus() {

	let status = localStorage.getItem(`${ getName() }-logged`) ? "logged" : "unlogged"

	return new Promise(function (resolve) {
		resolve(status)
	});

}

function handleLoginFlags(action) {

	if (action == "unlogged") {

		localStorage.removeItem(`${ getName() }-logged`)
		localStorage.removeItem("logginShown")

	}

	if (action == "logged") {

		localStorage.setItem(`${ getName() }-logged`, `Logged in ${getName()}`)

	}

}

function getUserStatus() {

	return new Promise(function (resolveOuter) {

		getServerLogStatus(getName()).then(function (statusFromServer) {

				return new Promise(function (resolve) {
					resolve(statusFromServer)
				});

			})
			.then(function (statusFromServer) {

				return new Promise(function (resolve) {
					getLocalLogStatus().then(function (statusFromLocalStorage) {
						resolve({
							serverStatus: statusFromServer,
							localStatus: statusFromLocalStorage
						})
					})

				});

			}).then(function (status) {
				resolveOuter(status)
			})

	});

}

function sendPassword() {

	return new Promise(function (resolve) {

		$.ajax({
			method: "get",
			url: "http://localhost/Getaways-staff-management-system/backend/actions.php",
			data: {
				sendPassword: getName(),
				password: prompt("Please enter your password")
			},
			global: false,
			success: function (response) {
				resolve(response)
			}
		})


	});

}

function showLoginAlert(action) {

	// if (!localStorage.getItem("logginShown")) {

	return new Promise(function (resolve) {


		if (action == "logged") {

			Swal.fire({

				icon: 'success',
				title: "<h6 style='color:white'>You are logged in</h6>",
				showConfirmButton: false,
				background: 'transparent',
				heightAuto: false,
				timer: 1000,
				didDestroy: () => {
					resolve()
				}

			})

		} else {

			Swal.fire({

				icon: 'error',
				title: "<h6 style='color:white'>Wrong password,try again</h6>",
				showConfirmButton: false,
				background: 'transparent',
				heightAuto: false,
				timer: 1000,
				didDestroy: () => {
					resolve()
				}

			})

		}

	});

	// 	localStorage.setItem("logginShown", true)

	// }

}

function editStaff(name) {

	const newId = $("#update-staff-id").length > 0 ? parseInt($("#update-staff-id").val().replace(/\D/g, "")) : 1
	let oldName;
	const newName = $("#update-staff-name").val()
	const newPassword = $("#update-staff-password").val()

	if (name == "staff") {

		$.ajax({
			method: "get",
			url: "http://localhost/Getaways-staff-management-system/backend/actions.php",
			data: {
				getSingleStaff: newId,
			},
			global: false,
			success: function (response) {
				oldName = response;


				if (newName.length == 0 || newPassword.length == 0) {

					Swal.showValidationMessage(`<i class="fas fa-exclamation-circle" style="color: indianred"></i> Please fill all required fields !`)
					window.setTimeout(function () {
						$(".swal2-validation-message").fadeOut(500);
					}, 1000);

				} else {

					let allNames = $('.staff-name').map(function () {
						return this.innerText
					}).get(); //I'M GETTING AN ARRAY OF ALL STAFF NAMES..

					let allNamesFiltered = allNames.filter(value => value !== capitalize(oldName)); // AND I'M FILTERING OUT THE OLD NAME OF THE RECORD...

					if (allNamesFiltered.includes(capitalize(newName)) == true) { //SO I CAN CHECK IF THERE IS A SAME NAME INSIDE THE LIST WITH THE NEW ONE..
						//THAT WAY I CAN SET A SAME NAME AS THE OLD NAME,BUT DIFFERENT PASSWORD,BUT NOT SET A SAME NAME WHICH APPEARS IN THE REST OF THE LIST

						Swal.showValidationMessage(`<i class="fas fa-exclamation-circle" style="color: indianred"></i>
					There is already a staff member with the same name,please choose a different one !`)
						window.setTimeout(function () {
							$(".swal2-validation-message").fadeOut(500);
						}, 3000);

					} else {

						$("#staff-list tbody").empty()
						$(".swal2-content").hide()
						Swal.showLoading()

						$.ajax({
							method: "POST",
							url: "http://localhost/Getaways-staff-management-system/backend/actions.php",
							data: {
								updateStaff: newId,
								oldName: capitalize(oldName),
								newName: capitalize(newName),
								password: newPassword,
							},
							global: false,
							success: function (msg) {

								Swal.showValidationMessage(`<i class="far fa-check-circle" style="color: green"></i> ${ msg }`)
								window.setTimeout(function () {
									$(".swal2-validation-message").fadeOut(2000);
								}, 1000);
								loadAjax("staff")
								$(".staff-vehicle-wrap").remove()
								$(".add-staff").show()

								setUnloggedStatus(newId, "staff")
							}

						})

					}

				}

			}
		})

	} else {

		$("#staff-list tbody").empty()
		$(".swal2-content").hide()
		Swal.showLoading()

		$.ajax({
			method: "POST",
			url: "http://localhost/Getaways-staff-management-system/backend/actions.php",
			data: {
				updateStaff: newId,
				oldName: null,
				newName: "admin",
				password: newPassword,
			},
			global: false,
			success: function (msg) {

				Swal.showValidationMessage(`<i class="far fa-check-circle" style="color: green"></i> ${ msg }`)
				window.setTimeout(function () {
					$(".swal2-validation-message").fadeOut(2000);
				}, 1000);
				loadAjax("staff")
				$(".staff-vehicle-wrap").remove()
				$(".add-staff").show()

				setUnloggedStatus(null, "admin")

			}

		})

	}

}

function setUnloggedStatus(id, name) {

	$.ajax({
		method: "post",
		url: "http://localhost/Getaways-staff-management-system/backend/actions.php",
		data: {
			setStatus: id,
			whoTo: name
		},
		global: false,
		success: function (response) {

			if (getName() == capitalize(name)) {
				location.reload();
			}
		}
	})

}
$(document).ajaxStart(function () {

	if (!Swal.isVisible() || !Swal.isLoading()) {

		Swal.fire({

			html: '<img id=swal-logo src=../img/getaways_logo.png>',
			showConfirmButton: false,
			allowOutsideClick: false,
			background: 'transparent',
			heightAuto: false

		})

	}


});

function getMonthString(num) {

	var month;
	switch (num) {
		case 01:
			month = "January";
			break;
		case 02:
			month = "February";
			break;
		case 03:
			month = "March";
			break;
		case 04:
			month = "April";
			break;
		case 05:
			month = "May";
			break;
		case 06:
			month = "June";
			break;
		case 07:
			month = "July";
			break;
		case 08:
			month = "August";
			break;
		case 09:
			month = "September";
			break;
		case 10:
			month = "October";
			break;
		case 11:
			month = "November";
			break;
		case 12:
			month = "December";
			break;
	}

	return month;

}

$(document).on('click', '#view-staff', function () {

	Swal.fire({

		showCancelButton: false,
		// showConfirmButton: false,
		title: "Staff",
		allowOutsideClick: false,
		confirmButtonText: "Close",
		customClass: {
			validationMessage: 'my-validation-message'
		},
		heightAuto: false,
		html: `<div class="d-flex flex-column justify-content-center align-items-center gap-1">
		<table class="table table-bordered" id="staff-list">
		<tr class="bg-light text-dark">
		<th>#</th><th>Name</th><th class="border-end-0">Password</th><th class="border-start-0" colspan="2"></th>
		</tr>
		</table>
		<button class="btn btn-success align-self-stretch add-staff"><span class="fas fa-user-plus"></span></button>
		</div>`,
		didOpen: () => {
			$(".swal2-content").hide()
			Swal.showLoading()
			loadAjax("staff")

		}

	})

});
$(document).on('click', '.add-staff', function () {
	Swal.resetValidationMessage()
	$(this).closest("div").append(`
	<div class="staff-vehicle-wrap d-flex flex-column gap-1">
	<span>New staff member</span>
	<div class="d-flex flex-row gap-1">
	<input id="update-staff-name" placeholder="Name" type="text" maxlength="10" class="form-control" style="text-transform: capitalize">
	<input id="update-staff-password" placeholder="Password" type="text" maxlength="6" class="form-control">
	</div>
	<div class="d-flex gap-1">
	<button class="btn btn-lg btn-success staff-confirm-add fas fa-check"></button>
	<button class="btn btn-lg btn-danger staff-vehicle-cancel fas fa-times flex-grow-1"></button>
	</div>
	</div>`)
	$(this).hide()

});
$(document).on('click', '.edit-staff', function () {

	Swal.resetValidationMessage()
	Swal.showValidationMessage(`<i class="fas fa-exclamation-circle" style="color: indianred"></i>The user will be logged out !`)

	const id = parseInt($(this).closest("tr").find(".staff-id").text().replace(/\D/g, ""))
	var memberName = $(this).closest("tr").find(".staff-name").text()
	const password = $(this).closest("tr").find(".staff-password").text()

	$(".add-staff").hide()
	$(".staff-vehicle-wrap").remove()

	$(this).closest("div").append(`
<div class="staff-vehicle-wrap d-flex flex-column gap-1">
<div class="d-flex justify-content-center align-items-center"><span>Edit staff member ?</span></div>
<div class="container-fluid">
<div class="row gap-1">
<input class="form-control col"  id="update-staff-id" placeholder="Name" type="text" style="text-transform: capitalize" value="#${id}" readonly>
<input class="form-control col" id="update-staff-name" placeholder="Name" type="text" style="text-transform: capitalize" value="${memberName}">
<input class="form-control col" id="update-staff-password" placeholder="Password" type="text" maxlength="6" value="${password}">
</div>
</div>
<div class="d-flex flex-row-reverse gap-1">
<button class="btn btn-danger col-3 staff-vehicle-cancel"><span class="fas fa-times"></span></button>
<button class="btn btn-success col-3 staff-confirm-edit"><span class="fas fa-check"></span></button>
</div>
</div>`)



});
$(document).on('click', '.edit-admin', function () {

	Swal.resetValidationMessage()
	Swal.showValidationMessage(`<i class="fas fa-exclamation-circle" style="color: indianred"></i>The user will be logged out !`)

	const memberName = $(this).closest("tr").find(".admin-name").text()
	const password = $(this).closest("tr").find(".admin-password").text()

	$(".add-staff").hide()
	$(".staff-vehicle-wrap").remove()

	$(this).closest("div").append(`
	<div class="staff-vehicle-wrap d-flex flex-column gap-1">
	<span>Edit Admin password ?</span>
	<div class="d-flex flex-row gap-1">
	<input id="update-staff-name" placeholder="Name" type="text" class="form-control" style="text-transform: capitalize" value="${memberName}" readonly>
	<input id="update-staff-password" placeholder="Password (Max 6 characters)" type="text" maxlength="6" class="form-control" value="${password}">
	</div>
	<div class="d-flex flex-row-reverse gap-1">
	<button class="btn btn-danger col-3 staff-vehicle-cancel"><span class="fas fa-times"></span></button>
	<button class="btn btn-success col-3 admin-confirm-edit"><span class="fas fa-check"></span></button>
	</div>
	</div>`)



});
$(document).on('click', '.delete-staff', function () {
	Swal.resetValidationMessage()

	const id = parseInt($(this).closest("tr").find(".staff-id").text().replace(/\D/g, ""))
	const name = $(this).closest("tr").find(".staff-name").text()
	const password = $(this).closest("tr").find(".staff-password").text()

	$(".add-staff").hide()
	$(".staff-vehicle-wrap").remove()

	$(this).closest("div").append(`
	<div class="staff-vehicle-wrap d-flex flex-column gap-1">
	<span style="color:red">Remove staff member ?</span>
	<div class="d-flex flex-row gap-1">
	<div><input id="update-staff-id" placeholder="Name" type="text" class="form-control" style="text-transform: capitalize" value="#${id}" readonly></div>
	<div><input id="update-staff-name" placeholder="Name" type="text" class="form-control" style="text-transform: capitalize" value="${name}" readonly></div>
	<div><input id="update-staff-password" placeholder="Password (Max 6 characters)" type="text" maxlength="6" class="form-control" value="${password}" readonly></div>
	</div>
	<div class="d-flex flex-row-reverse gap-1">
	<button class="btn btn-danger col-3 staff-vehicle-cancel"><span class="fas fa-times"></span></button>
	<button class="btn btn-success col-3 staff-confirm-delete"><span class="fas fa-check"></span></button>
	</div>
	</div>`)
});
$(document).on('click', '.staff-confirm-add', function () {
	Swal.resetValidationMessage()

	const memberName = $("#update-staff-name").val()
	const password = $("#update-staff-password").val()

	if ($("#update-staff-name").val().length == 0 || $("#update-staff-password").val().length == 0) {

		Swal.showValidationMessage(`<i class="fas fa-exclamation-circle" style="color: indianred"></i> Please fill all required fields !`)
		window.setTimeout(function () {
			$(".swal2-validation-message").fadeOut(500);
		}, 1000);

	} else {

		let allNames = $('.staff-name').map(function () {
			return this.innerText
		}).get();

		if (allNames.includes(capitalize(memberName)) == true) {

			Swal.showValidationMessage(`<i class="fas fa-exclamation-circle" style="color: indianred"></i>
	There is already a staff member with the same name,please choose a different one !`)
			window.setTimeout(function () {
				$(".swal2-validation-message").fadeOut(500);
			}, 3000);

		} else {

			$("#staff-list tbody").empty()
			$(".swal2-content").hide()
			Swal.showLoading()

			$.ajax({
				method: "POST",
				url: "http://localhost/Getaways-staff-management-system/backend/actions.php",
				data: {
					addStaff: capitalize(memberName),
					password: password,
				},
				global: false,
				success: function (msg) {

					Swal.showValidationMessage(`<i class="far fa-check-circle" style="color: green"></i> ${ msg }`)
					window.setTimeout(function () {
						$(".swal2-validation-message").fadeOut(2000);
					}, 1000);
					loadAjax("staff")
					$(".staff-vehicle-wrap").remove()
					$(".add-staff").show()

				}

			})

		}



	}

});
$(document).on('click', '.admin-confirm-edit', function () {
	Swal.resetValidationMessage()
	editStaff("admin")
});
$(document).on('click', '.staff-confirm-edit', function () {
	Swal.resetValidationMessage()
	editStaff("staff")
});
$(document).on('click', '.staff-confirm-delete', function () {
	Swal.resetValidationMessage()

	const id = $("#update-staff-id").val().replace(/\D/g, "")
	const memberName = $("#update-staff-name").val()

	if ($("#update-staff-name").val().length == 0 || $("#update-staff-password").val().length == 0) {

		Swal.showValidationMessage(`<i class="fas fa-exclamation-circle" style="color: indianred"></i> Please fill all required fields !`)
		window.setTimeout(function () {
			$(".swal2-validation-message").fadeOut(500);
		}, 1000);

	} else {

		$("#staff-list tbody").empty()
		$(".swal2-content").hide()
		Swal.showLoading()

		$.ajax({
			method: "POST",
			url: "http://localhost/Getaways-staff-management-system/backend/actions.php",
			data: {
				deleteStaff: id,
				name: capitalize(memberName)
			},
			global: false,
			success: function (msg) {

				Swal.showValidationMessage(`<i class="far fa-check-circle" style="color: green"></i> ${ msg }`)
				window.setTimeout(function () {
					$(".swal2-validation-message").fadeOut(2000);
				}, 1000);
				loadAjax("staff")
				$(".staff-vehicle-wrap").remove()
				$(".add-staff").show()

			}

		})

	}

});

$(document).on('click', '#view-fleet', function () {

	Swal.fire({

		showCancelButton: false,
		// showConfirmButton: false,
		title: "Fleet",
		allowOutsideClick: false,
		confirmButtonText: "Close",
		customClass: {
			validationMessage: 'my-validation-message'
		},
		heightAuto: false,
		html: `<div class="d-flex flex-column gap-1">
		<table class="table table-bordered align-self-center" id="fleet-list">
		<tr class="bg-light text-dark">
		<th>#</th><th class="border-end-0">Vehicle</th><th class="border-start-0" colspan="2"></th>
		</tr>
		</table>
		<button class="btn btn-success align-self-stretch add-vehicle"><span class="fas fa-plus"></span></button>
		</div>`,
		didOpen: () => {
			$(".swal2-content").hide()
			Swal.showLoading()
			loadAjax("fleet")

		}

	})

});
$(document).on('click', '.add-vehicle', function () {
	Swal.resetValidationMessage()
	$(this).closest("div").append(`
	<div class="staff-vehicle-wrap d-flex flex-column gap-1">
	<span>New vehicle</span>
	<div class="d-flex flex-row gap-1">
	<input id="vehicle-plate" placeholder="Plate" type="text" maxlength="8" class="form-control" style="text-transform: uppercase">
	</div>
	<div class="d-flex gap-1">
	<button class="btn btn-lg btn-success vehicle-confirm-add fas fa-check"></button>
	<button class="btn btn-lg btn-danger staff-vehicle-cancel fas fa-times flex-grow-1"></button>
	</div>
	</div>`)
	$(this).hide()

});
$(document).on('click', '.edit-vehicle', function () {

	Swal.resetValidationMessage()

	const id = parseInt($(this).closest("tr").find(".vehicle-id").text().replace(/\D/g, ""))
	var vehiclePlate = $(this).closest("tr").find(".vehicle-plate").text()


	$(".add-vehicle").hide()
	$(".staff-vehicle-wrap").remove()

	$(this).closest("div").append(`
	<div class="staff-vehicle-wrap d-flex flex-column gap-1">
	<div class="d-flex justify-content-center align-items-center"><span>Edit vehicle ?</span></div>
	<div class="d-flex flex-row gap-1">
	<div><input id="update-vehicle-id" placeholder="Name" type="text" class="form-control" style="text-transform: capitalize" value="#${id}" readonly></div>
	<div><input class="form-control" id="update-vehicle-plate" placeholder="Name" type="text" style="text-transform: uppercase" value="${vehiclePlate}"></div>
	</div>
	<div class="d-flex flex-row-reverse gap-1">
	<button class="btn btn-danger col-3 staff-vehicle-cancel"><span class="fas fa-times"></span></button>
	<button class="btn btn-success col-3 vehicle-confirm-edit"><span class="fas fa-check"></span></button>
	</div>
	</div>`)

});
$(document).on('click', '.delete-vehicle', function () {
	Swal.resetValidationMessage()

	const id = parseInt($(this).closest("tr").find(".vehicle-id").text().replace(/\D/g, ""))
	const vehiclePlate = $(this).closest("tr").find(".vehicle-plate").text()


	$(".add-vehicle").hide()
	$(".staff-vehicle-wrap").remove()

	$(this).closest("div").append(`
	<div class="staff-vehicle-wrap d-flex flex-column gap-1">
	<span style="color:red">Remove vehicle ?</span>
	<div class="d-flex flex-row gap-1">
	<div><input id="update-vehicle-id" placeholder="Name" type="text" class="form-control" style="text-transform: capitalize" value="#${id}" readonly></div>
	<div><input id="update-vehicle-plate" placeholder="Name" type="text" class="form-control" style="text-transform: capitalize" value="${vehiclePlate}" readonly></div>
	</div>
	<div class="d-flex flex-row-reverse gap-1">
	<button class="btn btn-danger col-3 staff-vehicle-cancel"><span class="fas fa-times"></span></button>
	<button class="btn btn-success col-3 vehicle-confirm-delete"><span class="fas fa-check"></span></button>
	</div>
	</div>`)
});
$(document).on('click', '.vehicle-confirm-add', function () {
	Swal.resetValidationMessage()

	const vehiclePlate = $("#vehicle-plate").val()

	if ($("#vehicle-plate").val().length == 0) {

		Swal.showValidationMessage(`<i class="fas fa-exclamation-circle" style="color: indianred"></i> Please fill all required fields !`)
		window.setTimeout(function () {
			$(".swal2-validation-message").fadeOut(500);
		}, 1000);

	} else {

		let allPlates = $('.vehicle-plate').map(function () {
			return this.innerText
		}).get();

		if (allPlates.includes(vehiclePlate.toUpperCase()) == true) {

			Swal.showValidationMessage(`<i class="fas fa-exclamation-circle" style="color: indianred"></i>
		There is already a vehicle with the same plate number,please choose a different one !`)
			window.setTimeout(function () {
				$(".swal2-validation-message").fadeOut(500);
			}, 3000);

		} else {

			$("#fleet-list tbody").empty()
			$(".swal2-content").hide()
			Swal.showLoading()

			$.ajax({
				method: "POST",
				url: "http://localhost/Getaways-staff-management-system/backend/actions.php",
				data: {
					addVehicle: vehiclePlate.toUpperCase()
				},
				global: false,
				success: function (msg) {

					Swal.showValidationMessage(`<i class="far fa-check-circle" style="color: green"></i> ${ msg }`)
					window.setTimeout(function () {
						$(".swal2-validation-message").fadeOut(2000);
					}, 1000);
					loadAjax("fleet")
					$(".staff-vehicle-wrap").remove()
					$(".add-vehicle").show()

				}

			})

		}



	}

});
$(document).on('click', '.vehicle-confirm-edit', function () {

	const id = parseInt($("#update-vehicle-id").val().replace(/\D/g, ""))
	const newPlate = $("#update-vehicle-plate").val()
	const allPlates = $('.vehicle-plate').map(function () {
		return this.innerText
	}).get();

	if (allPlates.includes(newPlate.toUpperCase())) {

		Swal.showValidationMessage(`<i class="fas fa-exclamation-circle" style="color: indianred"></i>
	There is already a vehicle with the same plate number,please choose a different one !`)
		window.setTimeout(function () {
			$(".swal2-validation-message").fadeOut(500);
		}, 3000);

	} else {

		Swal.resetValidationMessage()

		$("#fleet-list tbody").empty()
		$(".swal2-content").hide()
		Swal.showLoading()

		$.ajax({
			method: "POST",
			url: "http://localhost/Getaways-staff-management-system/backend/actions.php",
			data: {
				updateVehicle: id,
				plate: newPlate.toUpperCase()

			},
			global: false,
			success: function (msg) {

				Swal.showValidationMessage(`<i class="far fa-check-circle" style="color: green"></i> ${ msg }`)
				window.setTimeout(function () {
					$(".swal2-validation-message").fadeOut(2000);
				}, 1000);
				loadAjax("fleet")
				$(".staff-vehicle-wrap").remove()
				$(".add-vehicle").show()


			}

		})

	}

});
$(document).on('click', '.vehicle-confirm-delete', function () {
	Swal.resetValidationMessage()
	const id = $("#update-vehicle-id").val().replace(/\D/g, "")


	$("#fleet-list tbody").empty()
	$(".swal2-content").hide()
	Swal.showLoading()

	$.ajax({
		method: "POST",
		url: "http://localhost/Getaways-staff-management-system/backend/actions.php",
		data: {
			deleteVehicle: id
		},
		global: false,
		success: function (msg) {

			Swal.showValidationMessage(`<i class="far fa-check-circle" style="color: green"></i> ${ msg }`)
			window.setTimeout(function () {
				$(".swal2-validation-message").fadeOut(2000);
			}, 1000);
			loadAjax("fleet")
			$(".staff-vehicle-wrap").remove()
			$(".add-vehicle").show()

		}

	})

});
$(document).on('click', '.staff-vehicle-cancel', function () {
	Swal.resetValidationMessage()
	$(".staff-vehicle-wrap").remove()
	$(".add-staff").show()
	$(".add-vehicle").show()
});


$(document).on('click', '#admin', function () {
	window.location.href = "admin/index.html"
});

$(document).on('click', '#newjob', function () {

	jobActions("new");

});
$(document).on('click', '#new-balance', function () {

	balanceActions("new");

});
$(document).on('click', '#new-fuel-report', function () {
	fuelActions("new")
});
$(document).on('click', '#new-fleet-update', function () {
	fleetActions("new")
});

$(document).on('click', '.show-pending-tasks', function () {
	const name = $(this).attr("data-name");

	window.setTimeout(function () {
		loadSchedule(name, lastLoaded.schedule.date, true);
	}, 200);

})

$(document).on('click', '.show-by-staff', function () {
	const name = $(this).text()

	if ($(this).parents(".dropdown-menu").hasClass("schedule")) {

		if (name == "All today") {

			const myPromise = new Promise((resolve) => {

				let date = new Date();
				let day = date.toLocaleDateString(undefined, {
					day: "2-digit"
				});
				let month = date.getMonth() + 1

				let dateObj = {
					day: day.toString(),
					monthShort: getMonthString(month).substring(0, 3),
					monthLong: getMonthString(month),
					year: date.getFullYear().toString()
				}

				resolve(dateObj)

			});

			myPromise.then(function (date) {

				loadSchedule("Today", date, null);

			})






		} else {

			initialSwal()

			$(document).on('click', '.show-by-date', function () {

				Swal.fire({

					title: name + " schedule",
					showCancelButton: true,
					showCloseButton: true,
					reverseButtons: true,
					cancelButtonText: "Back",
					confirmButtonText: "Load schedule",
					heightAuto: false,
					html: `<input id="schedulePicker" type="month" class="form-control">`,
					preConfirm: () => {

						if ($("#schedulePicker").val().length < 1) {
							Swal.showValidationMessage("Please select a month/year")
						}

					}
				}).then((result) => {

					if (result.isConfirmed) {

						// .replace(/.*-/,'')  BEFORE -
						// .replace(/-.*/,'')  AFTER -

						let dateObj = {
							day: null,
							monthShort: getMonthString(parseInt($("#schedulePicker").val().replace(/.*-/, ''))).substring(0, 3),
							monthLong: getMonthString(parseInt($("#schedulePicker").val().replace(/.*-/, ''))),
							year: $("#schedulePicker").val().replace(/-.*/, '')
						}

						window.setTimeout(function () {
							loadSchedule(name, dateObj, null);
						}, 200);

					}

					if (result.isDismissed) {

						initialSwal()

					}

				})

			})

		}

		function initialSwal() {

			Swal.fire({

				title: name + " schedule",
				showCancelButton: false,
				showCloseButton: true,
				showConfirmButton: false,
				heightAuto: false,
				html: `<div class="container-fluid">
				<div class="row">
				<button class="col btn btn-warning mb-1 show-pending-tasks" data-name="${name}">Pending tasks</button>
				</div>
				<div class="row">
				<button class="col btn btn-success show-by-date">Tasks by date</button>
				</div>
				</div>`
			})

		}

	}

	if ($(this).parents(".dropdown").next(".wrap").is("#balance-wrap")) {

		loadBalance(name)

	}

	if ($(this).parents(".dropdown").next(".wrap").is("#fuel-wrap") || $(this).parents(".wrap").is("#fuel-wrap")) {
		loadFuel("driver", name, null);
	}

	if ($(this).parents(".dropdown").next(".wrap").is("#fleet-wrap") || $(this).parents(".wrap").is("#fleet-wrap")) {
		loadFleet("driver", name, null, true);
		$("#fleet-vehicle-selector").text("My updates by vehicle")
	}

});

$(document).on('click', '.show-by-vehicle', function () {

	const vehicle_plate = $(this).text()

	if (getName() == "Admin") {

		if ($(this).parents(".dropdown-menu").hasClass("fuel")) {
			loadFuel("vehicle", null, vehicle_plate);
		}
		if ($(this).parents(".dropdown-menu").hasClass("fleet")) {
			loadFleet("vehicle", null, vehicle_plate, true);
		}

	} else {

		if ($(this).parents(".dropdown").next(".wrap").is("#fuel-wrap") || $(this).parents(".wrap").is("#fuel-wrap")) {
			loadFuel("driverByVehicle", getName(), vehicle_plate);
		}

		if ($(this).parents(".dropdown").next(".wrap").is("#fleet-wrap") || $(this).parents(".wrap").is("#fleet-wrap")) {

			if (lastLoaded.fleet.editable == true) {
				loadFleet("vehicle", getName(), vehicle_plate, true);
			} else {
				loadFleet("vehicle", null, vehicle_plate, false);
			}

		}

	}

})
$(document).on('click', '#download-schedule', function () {

	let member;

	(async () => {

		const steps = ['1', '2']
		const swalQueueStep = Swal.mixin({
			confirmButtonText: 'Next',
			cancelButtonText: 'Back',
			//  progressSteps: steps,
			showCloseButton: true,
			reverseButtons: true,
			validationMessage: 'This field is required',
			allowOutsideClick: false,
			customClass: 'swal-width',
			heightAuto: false,
		})

		const values = []
		let currentStep

		for (currentStep = 0; currentStep < steps.length;) {
			if (steps[currentStep] == 1) {

				var result = await swalQueueStep.fire({
					title: 'Select staff member',
					html: '<select id="member-select" class="form-select"><option>All</option></select>',
					didOpen: () => {

						necessaryData.staff.forEach(i => {
							const options =
								`<option>${i}</option>`
							$("#member-select").append(options);
						})

						document.querySelectorAll("#member-select option").forEach(i => {

							if ($(i).text() == member) {

								$("#member-select").get(0).selectedIndex = $(i).index()

							}
						});

					},
					willClose: () => {

						member = $("#member-select option:selected").text();

					},
					showCancelButton: currentStep > 0,
					currentProgressStep: currentStep
				})

			} else if (steps[currentStep] == 2) {

				var result = await swalQueueStep.fire({
					title: member + " schedule",
					showCancelButton: false,
					showLoaderOnConfirm: true,
					confirmButtonText: "Download",
					html: '<input id="schedulePicker" type="month" class="form-control">',
					preConfirm: () => {

						if ($("#schedulePicker").val().length < 1) {
							Swal.showValidationMessage("Please select a month/year")
						} else {

							let date = {
								monthShort: getMonthString(parseInt($("#schedulePicker").val().replace(/.*-/, ''))).substring(0, 3),
								monthLong: getMonthString(parseInt($("#schedulePicker").val().replace(/.*-/, ''))),
								year: $("#schedulePicker").val().replace(/-.*/, '')
							}

							return $.ajax({
								method: "get",
								url: "http://localhost/Getaways-staff-management-system/backend/buildJobsWindow.php",
								data: {
									downloadJobs: member,
									monthShort: date.monthShort,
									monthLong: date.monthLong,
									year: date.year
								},
								dataType: 'JSON',
								success: function (response) {

									let obj = {
										name: member,
										month: date.monthLong,
										year: date.year,
										data: response
									}

									downloadExcel("schedule", obj)

								},
								error: function (response) {

									Swal.showValidationMessage(response.responseText)
									Swal.hideLoading()

								}

							});

						}

					},
					showCancelButton: currentStep > 0,
					currentProgressStep: currentStep
				})

			} else {
				break
			}


			if (result.value) {
				values[currentStep] = result.value
				currentStep++
			} else if (result.dismiss === Swal.DismissReason.cancel) {
				currentStep--
			} else {
				break
			}


		}

	})()


})

$(document).on('click', '.download-balance', function () {

	downloadExcel("balance")

})
$(document).on('click', '.reset-balance', function () {

	Swal.fire({
		title: "Are you sure you want to reset table ?",
		text: "Deleted transactions cannot be recovered !!",
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: 'green',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Yes',
		heightAuto: false
	}).then((result) => {

		if (result.isConfirmed) {


		}

	})

})
$(document).on('click', '.euro-income', function () {

	let id = $(this).closest("tr").find(".record-id").text()

	if ($(this).has("i").length > 0) {

		$.ajax({
			method: "get",
			url: "http://localhost/Getaways-staff-management-system/backend/buildBalanceWindow.php",
			data: {
				getReceipt: id,
			},
			dataType: 'JSON',
			success: function (response) {

				if (response.length > 0) {

					Swal.fire({
						imageUrl: response,
						heightAuto: false
					})

				} else {

					Swal.fire({
						text: 'Receipt not uploaded',
						iconHtml: '<i class="fas fa-file-invoice-dollar"></i>',
						customClass: {
							icon: 'no-border'
						},
						heightAuto: false
					})
				}

			}

		})

	}

})

$(document).on('click', '.select-records', function () {
	selectBoxesToggleVisibility(this)
	getCheckedBoxesAmount(this)
})
$(document).on('click', '.table-checkbox', function () {
	getCheckedBoxesAmount(this)
})
$(document).on('click', '.select-action-cancel', function () {
	selectBoxesToggleVisibility(this, true)
})
$(document).on('click', '.table-select-all-checkbox', function () {

	if ($(this).is(":checked")) {

		selectBoxesToggleChecks(this, "check")
		getCheckedBoxesAmount(this)

	} else {

		selectBoxesToggleChecks(this, "uncheck")
		getCheckedBoxesAmount(this)
	}

})
$(document).on('click', '.select-action-delete', function () {

	let table = $(this).parents(".wrap")

	if ($(this).parents(".wrap").is("#balance-wrap")) {

		createArray().then((array) => {

			Swal.fire({
				title: "Are you sure you want to delete selected transactions ?",
				text: "Deleted transactions cannot be recovered !!",
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: 'green',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes',
				heightAuto: false,
				preConfirm: () => {

					if (array.length < 1) {
						Swal.showValidationMessage(`Make a selection`)
					}

				}
			}).then((result) => {

				if (result.isConfirmed) {

					$.ajax({
						method: "POST",
						url: "http://localhost/Getaways-staff-management-system/backend/buildBalanceWindow.php",
						data: {
							deleteMultiple: array
						},
						success: function (msg) {

							loadBalance(lastLoaded.balance.name).then(() => {

								Swal.fire({

									icon: 'success',
									title: msg,
									//  timer: 2000,
									showConfirmButton: false,
									heightAuto: false

								})

							})

						}
					})


				}

			})

		})

	}

	if ($(this).parents(".wrap").is("#fuel-wrap")) {

		createArray().then((array) => {

			Swal.fire({
				title: "Are you sure you want to delete selected reports ?",
				text: "Deleted reports cannot be recovered !!",
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: 'green',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes',
				heightAuto: false,
				preConfirm: () => {

					if (array.length < 1) {
						Swal.showValidationMessage(`Make a selection`)
					}

				}
			}).then((result) => {

				if (result.isConfirmed) {

					$.ajax({
						method: "POST",
						url: "http://localhost/Getaways-staff-management-system/backend/buildFuelReports.php",
						data: {
							deleteMultiple: array
						},
						success: function (msg) {

							loadFuel(lastLoaded.fuel.db, lastLoaded.fuel.name, lastLoaded.fuel.plate).then(() => {

								Swal.fire({

									icon: 'success',
									title: msg,
									//  timer: 2000,
									showConfirmButton: false,
									heightAuto: false

								})

							})

						}
					})


				}

			})

		})

	}

	if ($(this).parents(".wrap").is("#fleet-wrap")) {

		createArray().then((array) => {

			Swal.fire({
				title: "Are you sure you want to delete selected updates ?",
				text: "Deleted updates cannot be recovered !!",
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: 'green',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes',
				heightAuto: false,
				preConfirm: () => {

					if (array.length < 1) {
						Swal.showValidationMessage(`Make a selection`)
					}

				}
			}).then((result) => {

				if (result.isConfirmed) {

					$.ajax({
						method: "POST",
						url: "http://localhost/Getaways-staff-management-system/backend/buildFleetReports.php",
						data: {
							deleteMultiple: array
						},
						success: function (msg) {

							loadFleet(lastLoaded.fleet.db, lastLoaded.fleet.name, lastLoaded.fleet.plate, lastLoaded.fleet.editable).then(() => {

								Swal.fire({

									icon: 'success',
									title: msg,
									//  timer: 2000,
									showConfirmButton: false,
									heightAuto: false

								})

							})

						}
					})


				}

			})

		})

	}


	function createArray() {

		return new Promise(resolveOuter => {

			let checkedBoxes = [...$(table).find(".table-checkbox:checked")]

			let checkedArr = checkedBoxes.map((checkbox) => {
				return $(checkbox).closest("tr").find(".record-id").text()
			})

			resolveOuter(checkedArr)

		})

	}



})

$(document).on('click', '.schedule-table button', function () {

	let html;
	let id = $(this).parents(".schedule-table").find(".table-id").text().replace(/\D/g, "")

	let thisTableClasslist = $(this).parents(".schedule-table").attr('class')

	if (getName() != "Admin") {

		html =
			`<div class="dropdown">
			<span style="display:none !important" class="this-parent-class ${ $(this).parents(".schedule-table").attr('class') }"></span>
	        <span style="display:none !important" class="this-parent-name">${ $(this).parents(".schedule-table").find('.driver').text() }</span>
			<button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">Select action</button>
			<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
			<li class="pending-activity"><a class="dropdown-item">Mark as pending</a></li>
			<li class="complete-activity"><a class="dropdown-item" style="color:green">Mark as completed</a></li>
			<li class="remarks-activity"><a class="dropdown-item" style="color:#cc7000">Add comments</a></li>
			</ul>
			</div>`


	} else {

		html =
			`<div class="dropdown">
	<button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">Select action</button>
	<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
	<li onclick="jobActions('update', ${id})"><a class="dropdown-item">Edit</a></li>
	<li onclick="jobActions('pending', ${id},'${thisTableClasslist}')"><a class="dropdown-item">Mark as pending</a></li>
	<li onclick="jobActions('complete', ${id},'${thisTableClasslist}')"><a class="dropdown-item" style="color:green">Mark as completed</a></li>
	<li onclick="jobActions('disable', ${id},'${thisTableClasslist}')"><a class="dropdown-item" style="color:#805300">Cancel activity</a></li>
	<li onclick="jobActions('delete', ${id})"><a class="dropdown-item" style="color:red">Delete</a></li>
	</ul>
	</div>`

	}

	Swal.fire({

		showCancelButton: false,
		showCloseButton: true,
		showConfirmButton: false,
		allowOutsideClick: true,
		heightAuto: false,
		html: html
	})


});
$(document).on('click', '.fa-comment', function () {

	let id = $(this).parents(".schedule-table").find(".table-id").text().replace(/\D/g, "")

	$.ajax({
		method: "get",
		url: "http://localhost/Getaways-staff-management-system/backend/buildJobsWindow.php",
		data: {
			getRemarks: id
		},
		success: function (response) {

			Swal.fire({

				title: "Comments :",
				html: "<i>" + response + "</i>",
				allowOutsideClick: false,
				heightAuto: false

			})

		}

	});




});
$(document).on('click', '.expand-task', function () {

	let thisContainer = $(this).parents(".schedule-table").find(".schedule-container");
	let id = $(this).parents(".schedule-table").find(".table-id").text().replace(/\D/g, "")
	let rotateCaret = $(this).parents(".schedule-table").find(".rotate-caret");

	$(this).find("i").toggleClass("rotate-caret");

	if (rotateCaret.length > 0) {

		$.ajax({
			method: "get",
			url: "http://localhost/Getaways-staff-management-system/backend/buildJobsWindow.php",
			data: {
				getExpandedJob: id,
			},
			dataType: 'JSON',
			success: function (response) {
				swal.close()
				// createClickedScheduleTable("unfolded",response)
				thisContainer.html(createClickedScheduleTable("folded", response[0]))


			}

		});

	} else {

		$.ajax({
			method: "get",
			url: "http://localhost/Getaways-staff-management-system/backend/buildJobsWindow.php",
			data: {
				getExpandedJob: id,
			},
			dataType: 'JSON',
			success: function (response) {
				swal.close()
				// createClickedScheduleTable("unfolded",response)
				thisContainer.html(createClickedScheduleTable("unfolded", response[0]))


			}

		});

	}





});
$(document).on('click', '.table-button', function () {

	let id = $(this).closest("tr").find(".record-id").text()

	if ($(this).parents(".wrap").is("#balance-wrap")) {

		balanceActions("edit", id)

	}

	if ($(this).parents(".wrap").is("#fuel-wrap")) {

		fuelActions("edit", id)

	}

	if ($(this).parents(".wrap").is("#fleet-wrap")) {

		fleetActions("edit", id)

	}




})

$(document).on('click', '.show-fuel-all', function () {
	loadFuel("all", null, null);
})
$(document).on('click', '.fuel-button', function () {

	var id = $(this).closest("tr").find(".id-fuel").text()

	Swal.fire({

		//  icon: 'question',
		showCancelButton: false,
		showConfirmButton: false,
		allowOutsideClick: true,
		heightAuto: false,
		html: `<div class="dropdown">
		<button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">Select action</button>
		<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
		<li class="edit-fuel"><span class="this-id">${id}</span><a class="dropdown-item">Edit</a></li>
		<li class="delete-fuel"><span class="this-id">${id}</span><a class="dropdown-item" style="color:red">Delete</a></li>
		</ul>
		</div>`
	})


})
$(document).on('click', '.edit-fuel', function () {

	let id = $(this).closest("li").find(".this-id").text()
	fuelActions("edit", id)

});
$(document).on('click', '.delete-fuel', function () {

	var id = $(this).closest("li").find(".this-id").text()

	Swal.fire({
		title: "Are you sure you want to delete fuel report ?",
		html: "Deleted reports cannot be recovered !!".fontcolor("red"),
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: 'green',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Yes',
		heightAuto: false
	}).then((result) => {
		if (result.isConfirmed) {

			deleteFuel();

		} else {

			Swal.fire({

				icon: 'error',
				title: "Cancelled !",
				timer: 1100,
				showConfirmButton: false,
				heightAuto: false

			})

		}
	})


	function deleteFuel() {

		$.ajax({
			method: "POST",
			url: "http://localhost/Getaways-staff-management-system/backend/buildFuelReports.php",
			data: {
				deleteFuelReport: id
			},
			success: function (msg) {

				saveLog("Fuel report #" + id + " is  " + "deleted", moment().format('DD/MM/YYYY HH:mm'), "")

				loadFuel(lastLoaded.fuel.db, lastLoaded.fuel.name, lastLoaded.fuel.plate).then(() => {

					Swal.fire({

						icon: 'success',
						title: msg,
						//  timer: 2000,
						showConfirmButton: false,
						heightAuto: false

					})

				})

			}
		})




	}


})
$(document).on('input', '#fuel-select', function () {
	this.nextElementSibling.value = this.value + " %"
});


$(document).on('click', '.show-fleet-all', function () {

	if (getName() == "Admin") {
		loadFleet("all", null, null, true);
	} else {
		loadFleet("all", null, null, false);
		$("#fleet-vehicle-selector").text("All updates by vehicle")
	}


})
$(document).on('click', '.fleet-button', function () {

	var id = $(this).closest("tr").find(".id-fleet").text()

	Swal.fire({

		//  icon: 'question',
		showCancelButton: false,
		showConfirmButton: false,
		allowOutsideClick: true,
		heightAuto: false,
		html: `<div class="dropdown">
		<button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">Select action</button>
		<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
		<li class="edit-fleet"><span class="this-id">${id}</span><a class="dropdown-item">Edit</a></li>
		<li class="delete-fleet"><span class="this-id">${id}</span><a class="dropdown-item" style="color:red">Delete</a></li>
		</ul>
		</div>`
	})


})
$(document).on('click', '.edit-fleet', function () {
	var id = $(this).closest("li").find(".this-id").text()
	fleetActions("edit", id)
})
$(document).on('click', '.delete-fleet', function () {

	var id = $(this).closest("li").find(".this-id").text()

	Swal.fire({
		title: "Are you sure you want to delete vehicle report ?",
		html: "Deleted reports cannot be recovered !!".fontcolor("red"),
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: 'green',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Yes',
		heightAuto: false
	}).then((result) => {
		if (result.isConfirmed) {

			deleteFleet();

		} else {

			Swal.fire({

				icon: 'error',
				title: "Cancelled !",
				timer: 1100,
				showConfirmButton: false,
				heightAuto: false

			})

		}
	})


	function deleteFleet() {

		$.ajax({
			method: "POST",
			url: "http://localhost/Getaways-staff-management-system/backend/buildFleetReports.php",
			data: {
				deleteFleetReport: id
			},
			success: function (msg) {

				saveLog("Vehicle report #" + id + " is  " + "deleted", moment().format('DD/MM/YYYY HH:mm'), "")

				loadFleet(lastLoaded.fleet.db, lastLoaded.fleet.name, lastLoaded.fleet.plate, lastLoaded.fleet.editable).then(() => {

					Swal.fire({

						icon: 'success',
						title: msg,
						//  timer: 2000,
						showConfirmButton: false,
						heightAuto: false

					})

				})

			}
		})




	}


})
$(document).on('click', '#get-gps', function () {

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {

			var getcoords = `${position.coords.latitude},${position.coords.longitude}`;
			$("#location-input").val(getcoords)
		}, function () {

			Swal.showValidationMessage("You denied gps location")

		});

	} else {

		Swal.showValidationMessage("Geolocation is not supported by this browser")

	}

});
$(document).on('click', '.fleet-gps', function () {

	let id = $(this).closest("tr").find(".record-id").text()
	let url = `https://www.google.com.sa/maps/search/${location}?hl=en`

	$.ajax({
		method: "get",
		url: "http://localhost/Getaways-staff-management-system/backend/buildFleetReports.php",
		dataType: 'JSON',
		data: {
			getFleetInfo: id,
		},
		success: function (response) {

			if (response[0].comments.length > 0 || response[0].location.length > 0) {

				let comments = response[0].comments.length > 0 ? `<div class="d-flex flex-column bg-light rounded border">
				<div class="text-dark p-1">Driver's comments :</div>
				<div class="fst-italic bg-white p-1 rounded-bottom">${response[0].comments}</div>
				</div>` : ""
				let location = response[0].location.length > 0 ? `<button data-location="${response[0].location}" class="btn btn-primary text-nowrap fleet-location">Go to parking location</button>` : ""

				Swal.fire({
					iconHtml: '<i class="fas fa-car"></i>',
					customClass: {
						icon: 'fleet-info-icon'
					},
					title: response[0].vehicle,
					heightAuto: false,
					showConfirmButton: false,
					showCloseButton: true,
					html: `<div class="d-flex flex-column gap-1 p-2 fleet-info-wrap">
						${comments}
						${location}
						</div>`
				})

			} else {

				Swal.fire({

					icon: 'error',
					title: "There is no vehicle location data or comments for this record",
					heightAuto: false

				})

			}

		}

	})

});
$(document).on('click', '.fleet-location', function () {

	let location = $(this).data('location');
	let locationUrl = `https://www.google.com.sa/maps/search/${location}?hl=en`

	Swal.fire({
		title: 'Open Google Maps ?',
		iconHtml: '<img id="gmaps-png" src="/img/gmaps.png">',
		customClass: {
			icon: 'no-border'
		},
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Yes',
		heightAuto: false
	}).then((result) => {
		if (result.isConfirmed) {

			window.open(locationUrl, '_blank');

		}
	})

});
$(document).on('click', '.schedule-gps', function () {
	const location = $(this).next().text();
	const location2 = "Melia athens"

	// var url = `https://www.google.com.sa/maps/search/${location},/${location2}?hl=en`
	var url = `https://www.google.com.sa/maps/search/${location}?hl=en`

	//MULTIPLE STOPS
	// var url = `https://www.google.com/maps/dir/Current+Location/${location}/${location2}`




	Swal.fire({
		title: `Go to ${capitalize(location)} ?`,
		iconHtml: '<img id="gmaps-png" src="/img/gmaps.png">',
		customClass: {
			icon: 'no-border'
		},
		// html:'<i class="fas fa-map-marker-alt"></i>',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Yes',
		heightAuto: false
	}).then((result) => {
		if (result.isConfirmed) {

			window.open(url, '_blank');

		} else {

			//WHEN RESULT IS NOT CONFIRMED

		}
	})

});


$(document).on('click', '#logs', function () {
	$("#logs-wrap").slideUp("fast");
	$("#logs-wrap").slideDown("fast");

	refreshLogs();

});
$(document).on('click', '.btn-close', function () {
	$(this).closest(".wrap").slideUp("fast");
	selectBoxesToggleVisibility(this, true)
});
$(document).on('click', '.features', function () {

	Swal.fire({


		title: 'Upcoming features',
		html: `<div class="features-list">
		<div>
		<span><i class="fas fa-play"></i></span>
		<span class="features-content">
		<span><i><b>Notification service</b></i></span>
		<span class="feature-time"><i class="far fa-clock"></i><b>2 months</b></span>
		</span>
		</div>
		</div>`,
		showConfirmButton: false,
		showCloseButton: true,
		heightAuto: false

	})

})
$(document).on('click', '.request', function () {

	var textarea_text;

	(async () => {

		const {
			value: text
		} = await Swal.fire({
			title: "Send request/Report bug".fontsize(4),
			input: 'textarea',
			customClass: {
				validationMessage: 'my-validation-message'
			},
			confirmButtonText: 'Submit',
			confirmButtonColor: 'green',
			cancelButtonText: 'Close',
			showCloseButton: true,
			allowOutsideClick: false,
			heightAuto: false,
			showLoaderOnConfirm: true,
			html: `<table class="table table-striped" id="requests-list">
		  <thead>
		  <tr>
		  <th>#</th>
		  <th>Submitter</th>
		  <th>Request/Bug report</th>
		  </tr>
		  </thead>
		 <tbody>
		 </tbody>
		  </table>`,
			showCancelButton: false,
			didOpen: () => {

				loadAjax("requests")

			},
			preConfirm: () => {


				if ($(".swal2-textarea").val().length > 0) {

					if (confirm("Submit request ?")) {

						return $.ajax({
							method: "POST",
							url: "http://localhost/Getaways-staff-management-system/backend/actions.php",
							data: {
								insertRequest: $(".swal2-textarea").val(),
								staff: getName()
							},
							global: false, // PREVENTS AJAXSTART LOADER TO APPEAR --> https://stackoverflow.com/a/45119355/14718856
							success: function (response) {
								if (response) {
									Swal.showValidationMessage(`<i class="far fa-check-circle" style="color: green"></i> ${response}`)

								}
								loadAjax("requests")

								$(".swal2-textarea").css({
									'border-color': 'green'
								});

							}
						})

					}

				} else {
					$(".swal2-textarea").css({
						'border-color': 'red'
					});
					Swal.showValidationMessage(`<i class="fa fa-info-circle" style="color: indianred"></i>Please type your request/bug report`)
				}

			}

		})

	})()

})
$(document).on('click', '.about', function () {

	Swal.fire({


		title: 'About',
		html: `<div class="about-list">
<span id="app-info"><b>Getaways Greece - V1.0</b></span><br>
<span id="clarification"><i>This software is created and developed to be used exclusively by <a href="https://getawaysgreece.com/">Getaways Greece</a>,
sharing,editing and republishing of data stored in this application is prohibited.<br>Violation of this order will 
be subject to legal actions and all rights are reserved.
</i></span>
		</div>`,
		showConfirmButton: false,
		showCloseButton: true,
		heightAuto: false

	})

	{
		/* <span id="author-info">Author: <b>Vaggelis Magonezos</b> 
		<span id="author-info-icons">
		<a href="viber://contact?number=%2B306947813200"><i class="fab fa-viber"></i></a>
		<a href="https://web.whatsapp.com/send?phone=+306947813200"><i class="fab fa-whatsapp-square"></i></a>
		<a href="tel:+306947813200"><i class="fas fa-phone-square"></i></a>
		<a href="mailto:evaggelos.magonezos@gmail.com"><i class="far fa-envelope"></i></a>
		</span>
		</span> */
	}

})
$(document).on('change', '#myFileInput', function () {

	let reader = new FileReader()
	reader.readAsDataURL(this.files[0]);
	reader.onload = (e) => {
		$('#image-container').attr('src', e.target.result);
	}

});


$(document).on('click', '.add-plan-row', function () {
	$(this).parents("table").find("tbody").append(addPlanRows(1))
	planRowIndex()
});
$(document).on('click', '.delete-plan-row', function () {
	$(this).closest("tr").remove()
	planRowIndex()
});

function getCheckedBoxesAmount(selector) {

	let allCheckBoxesCheckedProps = [...$(selector).closest(".wrap").find(".table .table-checkbox")].map((checkbox) => {
		return checkbox.checked
	})

	if (allCheckBoxesCheckedProps.includes(false)) {
		$(selector).closest(".wrap").find(".table .table-select-all-checkbox").prop("checked", false)
	} else {
		$(selector).closest(".wrap").find(".table .table-select-all-checkbox").prop("checked", true)
	}


	let checkedBoxes = [...$(selector).parents(".wrap").find(".table-checkbox:checked")]

	if (checkedBoxes.length > 0) {
		$(selector).closest(".wrap").find(".btn-danger").text(checkedBoxes.length)
	} else {
		$(selector).closest(".wrap").find(".btn-danger").html(`<i class="m-0 far fa-trash-alt"></i>`)
	}

}

function selectBoxesToggleVisibility(selector, hide) {

	$(selector).closest(".wrap").find("input:checkbox").prop("checked", false);

	if (hide) {

		$(selector).closest(".wrap").find(".select-action-buttons").hide()
		$(selector).closest(".wrap").find(".table .table-select-all-checkbox").hide()
		$(selector).closest(".wrap").find(".table-button").show()
		$(selector).closest(".wrap").find(".table-checkbox").hide()
		$(selector).closest(".wrap").find(".table-buttons").removeClass("table-checkboxes")

	} else {

		$(selector).closest(".wrap").find(".select-action-buttons").toggle()
		$(selector).closest(".wrap").find(".table .table-select-all-checkbox").toggle()
		$(selector).closest("table").find(".table-button").toggle()
		$(selector).closest("table").find(".table-checkbox").toggle()
		$(selector).closest("table").find(".table-buttons").toggleClass("table-checkboxes")

	}

}

function selectBoxesToggleChecks(selector, action) {

	if (action == "check") {

		$(selector).closest(".wrap").find(".table-checkbox").prop('checked', true);
		$(selector).removeClass("btn-dark text-light")
		$(selector).addClass("btn-light text-dark")


	} else {

		$(selector).closest(".wrap").find(".table-checkbox").prop('checked', false);
		$(selector).removeClass("btn-light text-dark")
		$(selector).addClass("btn-dark text-light")

	}

}

function addPlanRows(times) {

	// WITH MAP
	// const rows = [...Array(times)].map(val => row ).join('');
	// return rows;


	// WITH LOOP
	//  let rows = "";
	//  const row = `<span>This is a span</span>`;

	//  for (let i = 0; i < times; i++){
	//     rows += row 
	//  }
	//  return rows;


	const row = `<tr class="plan-row">
	<td class="plan-row-id"></td>
	<td contenteditable="true" class="pickup-plan-input" style="text-transform: capitalize"></td>
	<td contenteditable="true" class="pickup-plan-input"></td>
	<td contenteditable="true" style="width:50%" placeholder="-" class="pickup-plan-input"></td>
	<td class="delete-plan-row"><i class="far fa-trash-alt" style="color:red;font-size:1.4em"></i></td>
	</tr>`

	return row.repeat(times);
}

function addPickup() {

	const pickup =
		`<table class="table table-bordered plan-table">
<thead>
<tr>
<th class="slide-left"><i class="fas fa-arrow-left"></i></th>
<th colspan="3" id="pickup-plan-title"></th>
<th class="slide-right"><i class="fas fa-arrow-right"></i></th>
</tr>
<tr>
<td contenteditable="true" colspan="4" placeholder="Meeting point" class="pickup-plan-mp" style="text-transform: capitalize"></td><td contenteditable="true" placeholder="Time" class="pickup-plan-time"></td>
</tr>
<tr>
<th class="add-plan-row" style="width:10%"><i class="fas fa-plus" style="color:green;font-size:1.8em"></i></th>
<th style="width:40%">Name</th><th style="width:10%">Pax</th>
<th colspan="2" style="width:40%">Details</th>
</tr>
</thead>
<tbody class="pickup-plan-tbody">
</tbody>
</table>
`

	return pickup

}

function planRowIndex() {

	document.querySelectorAll('.plan-row-id').forEach(i => {

		$(i).text("#" + ($(i).closest("tr").index() + 1))

	});

}

function addLocationMarkers(times) {

	const marker = `<i class="fas fa-map-marker-alt col-1" style="color:grey"></i>`

	return marker.repeat(times);

}



function jobActions(action, id, classlist) {

	let date, activity, driver, escort, vehicle, details, pickups = [],
		counter;

	$(document).on('click', '.store-stop', function () {

		if (pickups[counter]) {

			Swal.showValidationMessage(`<i class="far fa-check-circle" style="color: green"></i> Pick-up #${ counter + 1 } is updated !!`)
			window.setTimeout(function () {
				$(".swal2-validation-message").fadeOut(2000);
			}, 1000);

		} else {

			Swal.showValidationMessage(`<i class="far fa-check-circle" style="color: green"></i> Pick-up #${ counter + 1 } is saved !!`)
			window.setTimeout(function () {
				$(".swal2-validation-message").fadeOut(2000);
			}, 1000);

		}

		const $table = $('.plan-table-wrap table');

		let plan_obj = {
			meeting_point: $table.find('.pickup-plan-mp').text(),
			time: $table.find('.pickup-plan-time').text(),
			guests: $table.find('.plan-row').map((i, row) => ({
				name: row.cells[1].innerText.trim(),
				pax: row.cells[2].innerText.trim(),
				details: row.cells[3].innerText.trim(),
			})).get()
		}



		// var plan_inputs = $('.pickup-plan-input').map(function () {
		// return this.innerText
		// }).get();  //get all cell current texts in an array       

		// var plan_inputs =  $('.plan-row').map(obj =>{ return obj.find(".plan-inputs").map(obj =>{ return { "name":obj[0],"pax":obj[1],"details":obj[2] }  }).join('')  }).join('')  

		pickups.splice(counter, 1, plan_obj)

		handleLocationMarkers()
	});
	$(document).on('click', '.new-stop', function () {

		newPickup()
		counter = pickups.length;
		$("#pickup-plan-title").text(`Pick-up #${counter + 1 }`)
	});
	$(document).on('click', '.delete-stop', function () {


		if (pickups.length !== 0) { //if array is not empty at click event

			if (confirm(`Delete pick-up #${counter + 1} ?`)) {

				Swal.showValidationMessage(`<i class="far fa-check-circle" style="color: red"></i> Pick-up #${ counter + 1 } is deleted !!`)
				window.setTimeout(function () {
					$(".swal2-validation-message").fadeOut(2000);
				}, 1000);

				pickups.splice(counter, 1)
				swapPickups("delete")

				if (pickups.length === 0) { //if array becomes empty after splice
					newPickup()
					$("#pickup-plan-title").text(`Pick-up #${counter + 1 }`)
				}

			}

		} else { // if array is empty at click event

			Swal.showValidationMessage(`<i class="fas fa-exclamation-circle" style="color: indianred"></i> No pick-ups stored !!`)
			window.setTimeout(function () {
				$(".swal2-validation-message").fadeOut(2000);
			}, 1000);

		}

		$(".pickup-plan-visual-counter").html(addLocationMarkers(pickups.length))
		$(".pickup-plan-visual-counter i:eq(" + counter + ")").css({
			'color': 'green'
		});

	});
	$(document).on('click', '.slide-left', function () {
		swapPickups("left")

		handleLocationMarkers()
	});
	$(document).on('click', '.slide-right', function () {
		swapPickups("right")

		handleLocationMarkers()

	});

	function swapPickups(direction) {


		if (direction == "left") {

			if (pickups[counter - 1]) {
				counter--
				swap(counter)
			}

		}
		if (direction == "right") {

			if (pickups[counter + 1]) {
				counter++
				swap(counter)

			}
		}
		if (direction == "delete") {

			if (pickups[counter - 1]) {
				counter--
				swap(counter)

			} else if (pickups[counter]) {

				swap(counter)

			}

		}

		function swap(counter) {

			let rows_html =
				pickups[counter].guests.map((obj, index) => {
					let details = obj.details.length > 0 ? obj.details : "-";
					return `<tr class="plan-row">
		<td class="plan-row-id">${ "#" + ( index +1 ) }</td>
		<td contenteditable="true" style="text-transform: capitalize">${obj.name}</td>
		<td contenteditable="true">${obj.pax}</td>
		<td contenteditable="true" style="width:50%">${details}</td>
		<td class="delete-plan-row"><i class="far fa-trash-alt" style="color:red;font-size:1.4em"></i></td>
		</tr>`
				}).join('')


			$(".pickup-plan-tbody").empty()
			$(".pickup-plan-tbody").append(rows_html)
			$(".pickup-plan-mp").text(pickups[counter].meeting_point)
			$(".pickup-plan-time").text(pickups[counter].time)
			$("#pickup-plan-title").text(`Pick-up #${counter + 1 }`)


		}

	}

	function newPickup() {

		$(".plan-table-wrap").html(addPickup()) //creating new empty pickup form
		$(".pickup-plan-tbody").empty()
		$(".pickup-plan-tbody").append(addPlanRows(1)) // add one row 
		planRowIndex(); // setting index value in first cells in rows

	}

	function handleLocationMarkers() {

		$(".pickup-plan-visual-counter").html(addLocationMarkers(pickups.length))
		$(".pickup-plan-visual-counter i:eq(" + counter + ")").css({
			'color': 'green'
		});

		$(".pickup-plan-visual-counter i").length > 0 ? $("#visual-counter-wrap").show() : $("#visual-counter-wrap").hide()

	}

	if (action == "new") {
		jobBuilder()
	} else if (action == "pending") {

		pending(id, classlist)

	} else if (action == "complete") {

		complete(id, classlist)

	} else if (action == "disable") {

		disable(id, classlist)

	} else if (action == "delete") {

		deleteJob(id)

	} else {
		getDataForUpdateCall().then(function () {
			jobBuilder()
		})
	}

	function jobBuilder() {

		(async () => {


			const steps = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
			const swalQueueStep = Swal.mixin({
				confirmButtonText: 'Next',
				cancelButtonText: 'Back',
				//  progressSteps: steps,
				showCloseButton: true,
				reverseButtons: true,
				validationMessage: 'This field is required',
				allowOutsideClick: false,
				customClass: 'swal-width',
				heightAuto: false,
			})

			const values = []
			let currentStep

			for (currentStep = 0; currentStep < steps.length;) {
				if (steps[currentStep] == 1) {

					var result = await swalQueueStep.fire({
						title: 'Select driver',
						html: '<select id="driver-select" class="form-select"><option>TBD</option></select>',
						didOpen: () => {

							necessaryData.staff.forEach(i => {
								const options =
									`<option>${i}</option>`
								$("#driver-select").prepend(options);
							})

							document.querySelectorAll("#driver-select option").forEach(i => {

								if ($(i).text() == driver) {

									$("#driver-select").get(0).selectedIndex = $(i).index()

								}
							});

						},
						willClose: () => {

							driver = $("#driver-select option:selected").text();

						},
						showCancelButton: currentStep > 0,
						currentProgressStep: currentStep
					})

				} else if (steps[currentStep] == 2) {

					var result = await swalQueueStep.fire({
						title: 'Select escort',
						html: '<select id="escort-select" class="form-select"><option>-</option><option>TBD</option></select>',
						didOpen: () => {

							necessaryData.staff.forEach(i => {
								const options =
									`<option>${i}</option>`
								$("#escort-select").prepend(options);
							})

							document.querySelectorAll("#escort-select option").forEach(i => {

								if ($(i).text() == escort) {

									$("#escort-select").get(0).selectedIndex = $(i).index()

								}
							});

						},
						willClose: () => {

							escort = $("#escort-select option:selected").text();

						},
						showCancelButton: currentStep > 0,
						currentProgressStep: currentStep
					})

				} else if (steps[currentStep] == 3) {

					var result = await swalQueueStep.fire({

						title: 'Select date',
						html: '<div><input id="datepicker" readonly></div>',
						didOpen: () => {

							datepicker();

							$("#datepicker").val(date)

						},
						willClose: () => {

							var dateinput = $("#datepicker").val()

							date = dateinput;

						},
						preConfirm: () => {

							if ($("#datepicker").val().length < 1) {
								Swal.showValidationMessage("Please enter a date")
							}

						},
						showCancelButton: currentStep > 0,
						currentProgressStep: currentStep
					})
				} else if (steps[currentStep] == 4) {


					var result = await swalQueueStep.fire({
						title: 'Select activity type',
						html: '<select id="activity-select" class="form-select"><option>Sounio sunset</option><option>Sounio morning</option><option>Athens H/D</option><option>Athens F/D</option><option>Delfoi</option><option>Argolis</option><option>TBD</option></select>',
						didOpen: () => {

							document.querySelectorAll("#activity-select option").forEach(i => {

								if ($(i).text() == activity) {

									$("#activity-select").get(0).selectedIndex = $(i).index()

								}
							});

						},
						willClose: () => {

							activity = $("#activity-select option:selected").text();

						},
						showCancelButton: currentStep > 0,
						currentProgressStep: currentStep
					})
				} else if (steps[currentStep] == 5) {


					var result = await swalQueueStep.fire({
						title: 'Select vehicle',
						html: '<select id="vehicle-select" class="form-select"><option>TBD</option></select>',
						didOpen: () => {

							necessaryData.vehicles.forEach(i => {
								const options =
									`<option>${i}</option>`
								$("#vehicle-select").prepend(options);
							})

							document.querySelectorAll("#vehicle-select option").forEach(i => {

								if ($(i).text() == vehicle) {

									$("#vehicle-select").get(0).selectedIndex = $(i).index()

								}
							});

						},
						willClose: () => {

							vehicle = $("#vehicle-select option:selected").text();

						},
						showCancelButton: currentStep > 0,
						currentProgressStep: currentStep
					})
				} else if (steps[currentStep] == 6) {


					var result = await swalQueueStep.fire({
						title: 'Add pick-up plan',
						html: `<div class="container p-0">
						<div class="row p-0">
						<button class="btn btn-primary store-stop col-8 me-1">Save pick-up<i class="fas fa-file-export" style="color:white"></i></button>
						<button class="btn btn-success new-stop col"><i class="fas fa-plus" style="color:white"></i></button>
						</div>
						<div id="visual-counter-wrap">
						<div class="pickup-plan-visual-counter row d-flex justify-content-center mt-1 p-1" style="background: #e6e6e6;border-radius: 0.1em;"></div>
						</div>
						<div class="plan-table-outer-wrap mt-1 mb-1 row p-0">
						<div class="plan-table-wrap p-0"></div>
						</div>
						<div class="row p-0">
						<button class="btn btn-danger delete-stop col">Delete pick-up<i class="far fa-trash-alt" style="color:white"></i></button>
						</div>					
						</div>
						`,
						customClass: {
							validationMessage: 'my-validation-message'
						},
						didOpen: () => {
							counter = 0;

							let rows_html = pickups.length > 0 ? pickups[counter].guests.map((obj, index) => {
								let details = obj.details.length > 0 ? obj.details : "-";
								return `<tr class="plan-row">
							<td class="plan-row-id">${ "#" + ( index +1 ) }</td>
							<td contenteditable="true" style="text-transform: capitalize">${obj.name}</td>
							<td contenteditable="true">${obj.pax}</td>
							<td contenteditable="true" style="width:50%">${details}</td>
							<td class="delete-plan-row"><i class="far fa-trash-alt" style="color:red;font-size:1.4em"></i></td>
							</tr>`
							}).join('') : ""

							$(".plan-table-wrap").html(addPickup()) //first we add a new pickup form
							$("#pickup-plan-title").text(`Pick-up #${counter + 1 }`)
							if (pickups.length == 0) { // if we dont have anything stored in the array "pickups" ...
								$(".pickup-plan-tbody").append(addPlanRows(1)) // ... we just add one row
							} else { // ... otherwise we add the content of the first "pickups" array object -->
								$(".pickup-plan-mp").text(pickups[counter].meeting_point)
								$(".pickup-plan-time").text(pickups[counter].time)
								$(".pickup-plan-tbody").append(rows_html) // adding the stored amount of rows
							}

							handleLocationMarkers()

							planRowIndex(); // we give index texts in the first cells

						},
						willClose: () => {
							counter = 0;
						},
						showCancelButton: currentStep > 0,
						currentProgressStep: currentStep
					})
				} else if (steps[currentStep] == 7) {


					var result = await swalQueueStep.fire({
						title: 'Add details',
						html: '<div class="container"><textarea cols="50" rows="10" class="form-control" id="details-textarea"></textarea></div>',
						didOpen: () => {

							$("#details-textarea").val(details)

						},
						willClose: () => {

							var textarea = $("#details-textarea").val()

							details = textarea;

						},
						showCancelButton: currentStep > 0,
						currentProgressStep: currentStep
					})
				} else if (steps[currentStep] == 8) {

					let tempDetails = details.length > 0 ? details : "-";

					var result = await swalQueueStep.fire({
						title: 'Review activity',
						html: `<div class="d-flex flex-column">
						    <table class="table table-bordered align-self-center">
						    <tr class="bg-secondary text-light"><th>Date</th><th colspan="2">Activity</th></tr>
							<tr>
							<td class="date">${date}</td>
							<td class="activity" colspan="2">${activity}</td>
							</tr>
							<tr class="bg-secondary text-light"><th>Driver</th><th>Escort</th><th>Vehicle</th></tr><tr>
							<td class="driver">${driver}</td>
							<td class="driver">${escort}</td>
							<td class="timest">${vehicle}</td>
							</tr>
							<tr class="bg-secondary text-light"><th colspan="6">Details</th></tr>
							<tr><td colspan="6">${tempDetails}</td></tr>
							</table>
							</div>`,
						showCancelButton: currentStep > 0,
						currentProgressStep: currentStep
					})

				} else if (steps[currentStep] == 9) {


					var result = await swalQueueStep.fire({
						title: 'Finalize activity ?',
						confirmButtonText: 'YES',
						confirmButtonColor: '#33cc33',
						cancelButtonColor: '#e62e00',
						showCancelButton: currentStep > 0,
						currentProgressStep: currentStep,



					})

				} else if (steps[currentStep] == 10) {

					if (action == "new") {
						addNewCall()
					} else {
						updateCall()
					}

				} else {
					break
				}


				if (result.value) {
					values[currentStep] = result.value
					currentStep++
				} else if (result.dismiss === Swal.DismissReason.cancel) {
					currentStep--
				} else {
					break
				}


			}



		})()

	}

	async function getDataForUpdateCall() {

		return $.ajax({
			method: "get",
			url: "http://localhost/Getaways-staff-management-system/backend/actions.php",
			data: {
				idGetData: id,
			},
			dataType: 'JSON',
			success: function (response) {

				var len = response.length;
				for (var i = 0; i < len; i++) {

					date = response[i].date;
					activity = response[i].activity;
					driver = response[i].driver;
					escort = response[i].escort;
					vehicle = response[i].vehicle;
					details = response[i].details;
					pickups = JSON.parse(response[i].pickups)

				}
			}
		})

	}

	function addNewCall() {

		$.ajax({
			method: "POST",
			url: "http://localhost/Getaways-staff-management-system/backend/actions.php",
			data: {
				date: date,
				driver: driver,
				escort: escort,
				activity: activity,
				vehicle: vehicle,
				pickups: JSON.stringify(pickups),
				details: details,
				dbclass: "pending"
			},
			success: function (response) {

				[lastLoaded.schedule.name, lastLoaded.schedule.pending] = [driver, true]

				loadSchedule(lastLoaded.schedule.name, lastLoaded.schedule.date, lastLoaded.schedule.pending).then(() => {

					saveLog("New activity to " + driver, moment().format('DD/MM/YYYY HH:mm'), "")

					Swal.fire({

						icon: 'success',
						title: response,
						showConfirmButton: false,
						heightAuto: false

					})
				})

			}
		})


	}

	function updateCall() {

		$.ajax({
			method: "POST",
			url: "http://localhost/Getaways-staff-management-system/backend/actions.php",
			data: {
				idUpdate: id,
				dateUpdate: date,
				driver: driver,
				escort: escort,
				activity: activity,
				vehicle: vehicle,
				pickups: JSON.stringify(pickups),
				details: details
			},
			success: function (response) {

				loadSchedule(lastLoaded.schedule.name, lastLoaded.schedule.date, lastLoaded.schedule.pending).then(() => {

					saveLog("Activity #" + id + " updated", moment().format('DD/MM/YYYY HH:mm'), "")

					Swal.fire({

						icon: 'success',
						title: response,
						showConfirmButton: false,
						heightAuto: false

					})
				})

			}
		})

	}

	function pending(id, classlist) {

		if (classlist.includes("pending")) {

			Swal.fire({

				icon: 'warning',
				title: "Already marked as pending !",
				timer: 1100,
				showConfirmButton: false,
				heightAuto: false

			})

		} else {

			Swal.fire({
				title: "Mark activity #" + id + " as pending ?",
				icon: 'question',
				showCancelButton: true,
				confirmButtonColor: 'green',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes',
				heightAuto: false
			}).then((result) => {
				if (result.isConfirmed) {

					pendingActivity();

				} else {

					Swal.fire({

						icon: 'error',
						title: "Cancelled !",
						timer: 1100,
						showConfirmButton: false,
						heightAuto: false

					})

				}
			})


		}

		function pendingActivity() {

			$.ajax({
				method: "POST",
				url: "http://localhost/Getaways-staff-management-system/backend/actions.php",
				data: {
					pendingid: id,
					dbclass: "pending",
				},
				success: function (response) {

					loadSchedule(lastLoaded.schedule.name, lastLoaded.schedule.date, lastLoaded.schedule.pending).then(() => {

						saveLog("Activity #" + id + " is " + "pending", moment().format('DD/MM/YYYY HH:mm'), "pending")

						Swal.fire({

							icon: 'success',
							title: response,
							showConfirmButton: false,
							heightAuto: false

						})
					})

				}

			})

		}

	}

	function complete(id, classlist) {

		if (classlist.includes("jobdone")) {

			Swal.fire({

				icon: 'warning',
				title: "Already marked as completed !",
				timer: 1100,
				showConfirmButton: false,
				heightAuto: false

			})

		} else {

			Swal.fire({
				title: "Mark activity #" + id + " as completed ?",
				icon: 'question',
				showCancelButton: true,
				confirmButtonColor: 'green',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes',
				heightAuto: false
			}).then((result) => {
				if (result.isConfirmed) {

					completeActivity();

				} else {

					Swal.fire({

						icon: 'error',
						title: "Cancelled !",
						timer: 1100,
						showConfirmButton: false,
						heightAuto: false

					})

				}
			})


		}

		function completeActivity() {

			$.ajax({
				method: "POST",
				url: "http://localhost/Getaways-staff-management-system/backend/actions.php",
				data: {
					completeid: id,
					dbclass: "jobdone",
				},
				success: function (response) {

					loadSchedule(lastLoaded.schedule.name, lastLoaded.schedule.date, lastLoaded.schedule.pending).then(() => {

						saveLog("Activity #" + id + " is " + "completed", moment().format('DD/MM/YYYY HH:mm'), "")

						Swal.fire({

							icon: 'success',
							title: response,
							showConfirmButton: false,
							heightAuto: false

						})
					})

				}
			})
		}

	}

	function disable(id, classlist) {

		if (classlist.includes("cancelled")) {

			Swal.fire({

				icon: 'warning',
				title: "Already marked as disabled !",
				timer: 1100,
				showConfirmButton: false,
				heightAuto: false

			})

		} else {

			Swal.fire({
				title: "Mark activity #" + id + " as cancelled ?",
				//  html: "Any unsaved work will be deleted !!".fontcolor("red"),
				text: 'Cancelled activities will remain in database,and can be re-activated later',
				icon: 'question',
				showCancelButton: true,
				confirmButtonColor: 'green',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes',
				heightAuto: false
			}).then((result) => {
				if (result.isConfirmed) {

					disableActivity();

				} else {

					Swal.fire({

						icon: 'error',
						title: "Cancelled !",
						timer: 1100,
						showConfirmButton: false,
						heightAuto: false

					})

				}
			})


		}

		function disableActivity() {




			$.ajax({
				method: "POST",
				url: "http://localhost/Getaways-staff-management-system/backend/actions.php",
				data: {
					disableid: id,
					dbclass: "cancelled",
				},
				success: function (response) {

					loadSchedule(lastLoaded.schedule.name, lastLoaded.schedule.date, lastLoaded.schedule.pending).then(() => {

						saveLog("Activity #" + id + " is " + "cancelled", moment().format('DD/MM/YYYY HH:mm'), "cancel")

						Swal.fire({

							icon: 'success',
							title: response,
							showConfirmButton: false,
							heightAuto: false

						})
					})

				}
			})
		}

	}

	function deleteJob(id) {

		Swal.fire({
			title: "Are you sure you want to delete activity ?",
			html: "Deleted activities cannot be recovered !!".fontcolor("red"),
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: 'green',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes',
			heightAuto: false
		}).then((result) => {
			if (result.isConfirmed) {

				deleteActivity();

			} else {

				Swal.fire({

					icon: 'error',
					title: "Cancelled !",
					timer: 1100,
					showConfirmButton: false,
					heightAuto: false

				})

			}
		})


		function deleteActivity() {




			$.ajax({
				method: "POST",
				url: "http://localhost/Getaways-staff-management-system/backend/actions.php",
				data: {
					deleteid: id
				},
				success: function (response) {

					loadSchedule(lastLoaded.schedule.name, lastLoaded.schedule.date, lastLoaded.schedule.pending).then(() => {

						saveLog("Activity #" + id + " is  " + "deleted", moment().format('DD/MM/YYYY HH:mm'), "deleteJob")

						Swal.fire({

							icon: 'success',
							title: response,
							showConfirmButton: false,
							heightAuto: false

						})
					})

				}
			})




		}

	}

}

function balanceActions(action, id) {

	let staff, description, date, type, amount, imageAsBase64UrlString;

	if (action == "new") {
		balanceBuilder()
	} else {
		getDataForUpdateCall().then(function () {
			balanceBuilder()
		})
	}

	function balanceBuilder() {

		(async () => {

			const steps = ['1', '2', '3', '4', '5', '6', '7', '8']
			const swalQueueStep = Swal.mixin({
				confirmButtonText: 'Next',
				cancelButtonText: 'Back',
				//  progressSteps: steps,
				showCloseButton: true,
				reverseButtons: true,
				validationMessage: 'This field is required',
				allowOutsideClick: false,
				customClass: 'swal-width',
				heightAuto: false,
				didOpen: () => {


				}

			})

			const values = []
			let currentStep

			for (currentStep = 0; currentStep < steps.length;) {
				if (steps[currentStep] == 1) {

					if (getName() === "Admin") {

						var result = await swalQueueStep.fire({
							title: 'Select staff member',
							html: '<select id="staff-select" class="form-select"></select>',
							didOpen: () => {

								necessaryData.staff.forEach(i => {
									const options =
										`<option>${i}</option>`
									$("#staff-select").append(options);
								})

								document.querySelectorAll("#staff-select option").forEach(i => {

									if ($(i).text() == staff) {

										$("#staff-select").get(0).selectedIndex = $(i).index()

									}
								});

							},
							willClose: () => {

								staff = $("#staff-select option:selected").text();

							},
							showCancelButton: currentStep > 0,
							currentProgressStep: currentStep
						})

					} else {

						var result = await swalQueueStep.fire({
							didOpen: () => {
								staff = getName();

								$(".swal2-confirm").click();

							}
						})

					}

				} else if (steps[currentStep] == 2) {

					var result = await swalQueueStep.fire({

						title: 'Select date',
						html: '<div><input id="datepicker" readonly></div>',
						didOpen: () => {

							datepicker("lowercase");

							$("#datepicker").val(date)

						},
						willClose: () => {

							date = $("#datepicker").val()


						},
						preConfirm: () => {

							if ($("#datepicker").val().length < 1) {
								Swal.showValidationMessage("Please enter a date")
							}

						},
						showCancelButton: true
					})

				} else if (steps[currentStep] == 3) {

					var result = await swalQueueStep.fire({
						title: 'Select transaction type',
						html: '<select id="type-select" class="form-select"><option>Income</option><option>Expense</option></select>',
						didOpen: () => {

							document.querySelectorAll("#type-select option").forEach(i => {

								if ($(i).text() == capitalize(type)) {

									$("#type-select").get(0).selectedIndex = $(i).index()

								}
							});

						},
						willClose: () => {

							type = $("#type-select option:selected").text().toLowerCase();

						},
						showCancelButton: currentStep > 0,
						currentProgressStep: currentStep
					})

				} else if (steps[currentStep] == 4) {


					var result = await swalQueueStep.fire({
						title: 'Add description',
						html: '<input id="description-input" type="text" maxlength="22" class="form-control">',
						didOpen: () => {

							$("#description-input").val(description)

						},
						willClose: () => {

							description = $("#description-input").val()

						},
						preConfirm: () => {

							if ($("#description-input").val().length < 1) {
								Swal.showValidationMessage("Please enter a description")
							}

						},
						showCancelButton: currentStep > 0,
						currentProgressStep: currentStep
					})
				} else if (steps[currentStep] == 5) {


					var result = await swalQueueStep.fire({
						title: 'Add amount in €',
						html: '<input id="amount-input" type="text" class="form-control">',
						didOpen: () => {

							$("#amount-input").val(amount.replace(",", "."))

						},
						willClose: () => {

							amount = $("#amount-input").val().replace(",", ".")

						},
						preConfirm: () => {

							if ($("#amount-input").val().length < 1) {
								Swal.showValidationMessage("Please enter an amount")
							}

						},
						showCancelButton: currentStep > 0,
						currentProgressStep: currentStep
					})
				} else if (steps[currentStep] == 6) {

					var result = await swalQueueStep.fire({
						title: 'Add receipt',
						html: `<div class="form-group">
						<input id="myFileInput" class="form-control mb-1" type="file" accept="image/*;capture=camera">
						<img id="image-container"/>
						</div>`,
						didOpen: () => {

							$('#image-container').attr('src', imageAsBase64UrlString);

						},
						willClose: () => {

							imageAsBase64UrlString = $('#image-container').attr('src');

						},
						showCancelButton: currentStep > 0,
						currentProgressStep: currentStep
					})

				} else if (steps[currentStep] == 7) {


					var result = await swalQueueStep.fire({
						title: 'Finalize ?',
						confirmButtonText: 'YES',
						confirmButtonColor: '#33cc33',
						cancelButtonColor: '#e62e00',
						showCancelButton: currentStep > 0,
						currentProgressStep: currentStep,



					})

				} else if (steps[currentStep] == 8) {

					if (action == "new") {
						addNewCall()
					} else {
						updateCall()
					}

				} else {
					break
				}


				if (result.value) {
					values[currentStep] = result.value
					currentStep++
				} else if (result.dismiss === Swal.DismissReason.cancel) {
					currentStep--
				} else {
					break
				}


			}



		})()

	}

	function addNewCall() {

		$.ajax({
			method: "post",
			url: "http://localhost/Getaways-staff-management-system/backend/buildBalanceWindow.php",
			data: {
				description: description,
				datetrans: date,
				amount: amount,
				staff: staff,
				dbclass: type,
				receipt: imageAsBase64UrlString
			},
			success: function (msg) {

				loadBalance(staff).then(() => {

					saveLog("New transaction for " + capitalize(staff), moment().format('DD/MM/YYYY HH:mm'), "balance")

					Swal.fire({

						icon: 'success',
						title: msg,
						//  timer: 2000,
						showConfirmButton: false,
						heightAuto: false

					})

				})


			}

		})

	}
	async function getDataForUpdateCall() {

		return $.ajax({
			method: "get",
			url: "http://localhost/Getaways-staff-management-system/backend/buildBalanceWindow.php",
			data: {
				idGetBalanceData: id,
			},
			dataType: 'JSON',
			success: function (response) {

				var len = response.length;
				for (var i = 0; i < len; i++) {
					description = response[i].description;
					date = response[i].date;
					amount = response[i].euro;
					staff = response[i].staff;
					type = response[i].class;
					imageAsBase64UrlString = response[i].receipt;

				}

			}

		});

	}

	function updateCall() {

		$.ajax({
			method: "post",
			url: "http://localhost/Getaways-staff-management-system/backend/buildBalanceWindow.php",
			data: {
				balanceid: id,
				descriptionEdit: description,
				datetrans: date,
				amount: amount,
				staff: staff,
				dbclass: type,
				receipt: imageAsBase64UrlString
			},
			success: function (msg) {

				loadBalance(staff).then(() => {
					saveLog("Transaction #" + id + " updated", moment().format('DD/MM/YYYY HH:mm'), "balance")

					Swal.fire({

						icon: 'success',
						title: msg,
						//  timer: 2000,
						showConfirmButton: false,
						heightAuto: false

					})

				})

			}

		})

	}
}

function fuelActions(action, id) {

	let date, staff, vehicle, amount, payment, imageAsBase64UrlString;

	if (action == "new") {
		fuelBuilder()
	} else {
		getDataForUpdateCall().then(function () {
			fuelBuilder()
		})
	}

	function fuelBuilder() {

		let expenseAdded;

		(async () => {

			const steps = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
			const swalQueueStep = Swal.mixin({
				confirmButtonText: 'Next',
				cancelButtonText: 'Back',
				//  progressSteps: steps,
				showCloseButton: true,
				reverseButtons: true,
				validationMessage: 'This field is required',
				allowOutsideClick: false,
				customClass: 'swal-width',
				heightAuto: false,
				didOpen: () => {


				}

			})

			const values = []
			let currentStep

			for (currentStep = 0; currentStep < steps.length;) {
				if (steps[currentStep] == 1) {

					if (getName() === "Admin") {

						var result = await swalQueueStep.fire({
							title: 'Select staff member',
							html: '<select id="staff-select" class="form-select"></select>',
							didOpen: () => {

								necessaryData.staff.forEach(i => {
									const options =
										`<option>${i}</option>`
									$("#staff-select").append(options);
								})

								document.querySelectorAll("#staff-select option").forEach(i => {

									if ($(i).text() == staff) {

										$("#staff-select").get(0).selectedIndex = $(i).index()

									}
								});

							},
							willClose: () => {

								staff = $("#staff-select option:selected").text();

							},
							showCancelButton: currentStep > 0,
							currentProgressStep: currentStep
						})

					} else {

						var result = await swalQueueStep.fire({
							didOpen: () => {
								staff = getName();

								$(".swal2-confirm").click();

							}
						})

					}

				} else if (steps[currentStep] == 2) {

					var result = await swalQueueStep.fire({

						title: 'Select date',
						html: '<div><input id="datepicker" readonly></div>',
						didOpen: () => {

							datepicker("lowercase");

							$("#datepicker").val(date)

						},
						willClose: () => {

							var dateinput = $("#datepicker").val()

							date = dateinput;


						},
						preConfirm: () => {

							if ($("#datepicker").val().length < 1) {
								Swal.showValidationMessage("Please enter a date")
							}

						},
						showCancelButton: true
					})



				} else if (steps[currentStep] == 3) {

					var result = await swalQueueStep.fire({
						title: 'Select vehicle',
						html: '<select id="vehicle-select" class="form-select"></select>',
						didOpen: () => {

							necessaryData.vehicles.forEach(i => {
								const options =
									`<option>${i}</option>`
								$("#vehicle-select").append(options);
							})

							document.querySelectorAll("#vehicle-select option").forEach(i => {

								if ($(i).text() == vehicle) {

									$("#vehicle-select").get(0).selectedIndex = $(i).index()

								}
							});

						},
						willClose: () => {

							vehicle = $("#vehicle-select option:selected").text();

						},
						showCancelButton: currentStep > 0,
						currentProgressStep: currentStep
					})

				} else if (steps[currentStep] == 4) {

					var result = await swalQueueStep.fire({
						title: 'Select payment type',
						html: '<select id="payment-select" class="form-select"><option>CARD</option><option>CASH</option></select>',
						didOpen: () => {

							document.querySelectorAll("#payment-select option").forEach(i => {

								if ($(i).text() == payment) {

									$("#payment-select").get(0).selectedIndex = $(i).index()

								}
							});

						},
						willClose: () => {

							payment = $("#payment-select option:selected").text();

						},
						showCancelButton: true
					})


				} else if (steps[currentStep] == 5) {

					var result = await swalQueueStep.fire({
						title: 'Add receipt',
						html: `<div class="form-group">
						<input id="myFileInput" class="form-control mb-1" type="file" accept="image/*;capture=camera">
						<img id="image-container"/>
						</div>`,
						didOpen: () => {

							$('#image-container').attr('src', imageAsBase64UrlString);

						},
						willClose: () => {

							imageAsBase64UrlString = $('#image-container').attr('src');

						},
						showCancelButton: currentStep > 0,
						currentProgressStep: currentStep
					})

				} else if (steps[currentStep] == 6) {


					var result = await swalQueueStep.fire({
						title: 'Add amount in €',
						html: '<input id="amount-input" type="number" class="form-control">',
						willOpen: () => {



						},
						didOpen: () => {

							$("#amount-input").val(amount.replace(",", "."))

						},
						willClose: () => {

							amount = $("#amount-input").val().replace(",", ".")

						},
						preConfirm: () => {

							if ($("#amount-input").val().length < 1) {
								Swal.showValidationMessage("Please enter an amount")
							}

						},
						showCancelButton: true
					})
				} else if (steps[currentStep] == 7) {

					if (payment === "CASH" && !expenseAdded ) {


						result = await swalQueueStep.fire({

							title: 'Do you want to add this transaction as an expense ?',
							showCancelButton: true,
							showLoaderOnConfirm: true,
							confirmButtonText: 'Yes (Add)',
							confirmButtonColor: 'green',
							showDenyButton: true,
							denyButtonText: `No (Next)`,
							denyButtonColor: '#2778c4',
							preConfirm: () => {

								return $.ajax({
									method: "POST",
									url: "http://localhost/Getaways-staff-management-system/backend/buildBalanceWindow.php",
									data: {
										description: "ΚΑΥΣΙΜΑ ΜΕ ΜΕΤΡΗΤΑ",
										datetrans: date,
										amount: amount,
										staff: staff,
										dbclass: "expense",
										staffcap: capitalize(staff),
										receipt: imageAsBase64UrlString
									},
									success: function (response) {

										Swal.showValidationMessage(response)
										$(".swal2-confirm").remove()
										$(".swal2-deny").text("Next")
										expenseAdded = true;
									}

								})
							}

						})

					}

				} else if (steps[currentStep] == 8) {

					var result = await swalQueueStep.fire({
						title: 'Finalize ?',
						confirmButtonText: 'YES',
						confirmButtonColor: '#33cc33',
						cancelButtonColor: '#e62e00',
						showCancelButton: currentStep > 0,
						currentProgressStep: currentStep
					})


				} else if (steps[currentStep] == 9) {

					if (action == "new") {
						addNewCall()
					} else {
						updateCall()
					}

				} else {
					break
				}


				if (result.dismiss === Swal.DismissReason.confirm) {
					values[currentStep] = result.value
					currentStep++
				} else if (result.dismiss === Swal.DismissReason.cancel) {
					currentStep--
				} else {
					break
				}


			}



		})()

	}

	function addNewCall() {

		$.ajax({
			method: "POST",
			url: "http://localhost/Getaways-staff-management-system/backend/buildFuelReports.php",
			data: {
				insertFuelReport: date,
				staff: staff,
				vehicle: vehicle,
				amount: amount,
				payment: payment,
				receipt: imageAsBase64UrlString
			},
			success: function (msg) {

				loadFuel(lastLoaded.fuel.db, lastLoaded.fuel.name, lastLoaded.fuel.plate).then(() => {

					saveLog("New fuel report for " + capitalize(staff), moment().format('DD/MM/YYYY HH:mm'), "fuel")

					Swal.fire({

						icon: 'success',
						title: msg,
						//  timer: 2000,
						showConfirmButton: false,
						heightAuto: false

					})

				})

			}

		})

	}
	async function getDataForUpdateCall() {

		return $.ajax({
			method: "get",
			url: "http://localhost/Getaways-staff-management-system/backend/buildFuelReports.php",
			data: {
				idGetFuelData: id,
			},
			dataType: 'JSON',
			success: function (response) {

				var len = response.length;
				for (var i = 0; i < len; i++) {
					date = response[i].date;
					staff = response[i].staff;
					vehicle = response[i].vehicle;
					amount = response[i].amount;
					payment = response[i].payment;
					imageAsBase64UrlString = response[i].receipt;
				}

			}

		});

	}

	function updateCall() {

		$.ajax({

			method: "POST",
			url: "http://localhost/Getaways-staff-management-system/backend/buildFuelReports.php",
			data: {
				editFuelReport: id,
				date: date,
				staff: staff,
				vehicle: vehicle,
				amount: amount,
				payment: payment,
				receipt: imageAsBase64UrlString

			},
			success: function (msg) {

				loadFuel(lastLoaded.fuel.db, lastLoaded.fuel.name, lastLoaded.fuel.plate).then(() => {

					saveLog("Fuel report #" + id + " updated", moment().format('DD/MM/YYYY HH:mm'), "fuel")

					Swal.fire({

						icon: 'success',
						title: msg,
						//  timer: 2000,
						showConfirmButton: false,
						heightAuto: false

					})

				})

			}

		})

	}

}

function fleetActions(action, id) {


	var date, driver, vehicle, fuel = 0,
		comments, km, location

	if (action == "new") {
		fleetBuilder()
	} else {
		getDataForUpdateCall().then(function () {
			fleetBuilder()
		})
	}


	function fleetBuilder() {

		(async () => {







			const steps = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
			const swalQueueStep = Swal.mixin({
				confirmButtonText: 'Next',
				cancelButtonText: 'Back',
				//  progressSteps: steps,
				showCloseButton: true,
				reverseButtons: true,
				validationMessage: 'This field is required',
				allowOutsideClick: false,
				customClass: 'swal-width',
				heightAuto: false,
				didOpen: () => {


				}

			})

			const values = []
			let currentStep

			for (currentStep = 0; currentStep < steps.length;) {
				if (steps[currentStep] == 1) {

					if (getName() === "Admin") {

						var result = await swalQueueStep.fire({
							title: 'Select staff member',
							html: '<select id="staff-select" class="form-select"></select>',
							didOpen: () => {

								necessaryData.staff.forEach(i => {
									const options =
										`<option>${i}</option>`
									$("#staff-select").append(options);
								})

								document.querySelectorAll("#staff-select option").forEach(i => {

									if ($(i).text() == driver) {

										$("#staff-select").get(0).selectedIndex = $(i).index()

									}
								});

							},
							willClose: () => {

								driver = $("#staff-select option:selected").text();

							},
							showCancelButton: currentStep > 0,
							currentProgressStep: currentStep
						})

					} else {

						var result = await swalQueueStep.fire({
							didOpen: () => {
								driver = getName();

								$(".swal2-confirm").click();

							}
						})

					}

				} else if (steps[currentStep] == 2) {

					var result = await swalQueueStep.fire({

						title: 'Select date',
						html: '<div><input id="datepicker" readonly></div>',
						didOpen: () => {

							datepicker("lowercase");

							$("#datepicker").val(date)

						},
						willClose: () => {

							var dateinput = $("#datepicker").val()

							date = dateinput;


						},
						preConfirm: () => {

							if ($("#datepicker").val().length < 1) {
								Swal.showValidationMessage("Please enter a date")
							}

						},
						showCancelButton: true
					})



				} else if (steps[currentStep] == 3) {

					var result = await swalQueueStep.fire({
						title: 'Select vehicle',
						html: '<select id="vehicle-select" class="form-select"></select>',
						didOpen: () => {

							necessaryData.vehicles.forEach(i => {
								const options =
									`<option>${i}</option>`
								$("#vehicle-select").append(options);
							})

							document.querySelectorAll("#vehicle-select option").forEach(i => {

								if ($(i).text() == vehicle) {

									$("#vehicle-select").get(0).selectedIndex = $(i).index()

								}
							});


						},
						willClose: () => {

							vehicle = $("#vehicle-select option:selected").text();

						},
						showCancelButton: currentStep > 0,
						currentProgressStep: currentStep
					})

				} else if (steps[currentStep] == 4) {

					var result = await swalQueueStep.fire({
						title: 'Add current fuel amount',
						html: '<input id="fuel-select" type="range" min="0" max="100" step="5"><output id="fuel-select-output"></output>',
						didOpen: () => {

							$("#fuel-select").val(fuel)
							$("#fuel-select-output").val(fuel + " %")

						},
						willClose: () => {

							var currFuel = $("#fuel-select").val()

							fuel = currFuel;

						},
						showCancelButton: true
					})


				} else if (steps[currentStep] == 5) {


					var result = await swalQueueStep.fire({
						title: 'Add current odometer indication (km)',
						html: '<input id="km-input" type="number" class="form-control">',
						didOpen: () => {

							$("#km-input").val(km.replace(",", "."))

						},
						willClose: () => {

							var km_input = $("#km-input").val().replace(",", ".")

							km = km_input;

						},
						preConfirm: () => {

							if ($("#km-input").val().length < 1) {
								Swal.showValidationMessage("Please enter km indication")
							}

						},
						showCancelButton: true
					})
				} else if (steps[currentStep] == 6) {

					var result = await swalQueueStep.fire({
						title: 'Add parking location',
						html: `<div class="input-group mb-3">
						<input id="location-input" type="text" class="form-control" placeholder="Type address or get from GPS">
						<button id="get-gps" class="btn btn-success" type="button">GPS</button>
						</div>`,
						showCancelButton: true,
						didOpen: () => {

							$("#location-input").val(location)

						},
						willClose: () => {

							location = $("#location-input").val()

						}

					})

				} else if (steps[currentStep] == 7) {

					var result = await swalQueueStep.fire({
						title: 'Add comments',
						html: '<textarea id="comments-input" class="swal2-textarea resheight-textarea" placeholder="Car needs cleaning,dashboard shows malfunction..etc" style="display: flex;"></textarea>',
						didOpen: () => {

							$("#comments-input").val(comments)
							// resheightstextarea();

						},
						willClose: () => {

							var comments_input = $("#comments-input").val()

							comments = comments_input;

						},
						showCancelButton: true
					})

				} else if (steps[currentStep] == 8) {


					var result = await swalQueueStep.fire({
						title: 'Finalize ?',
						confirmButtonText: 'YES',
						confirmButtonColor: '#33cc33',
						cancelButtonColor: '#e62e00',
						showCancelButton: currentStep > 0,
						currentProgressStep: currentStep


					})

				} else if (steps[currentStep] == 9) {

					if (action == "new") {
						addNewCall()
					} else {
						updateCall()
					}


				} else {
					break
				}


				if (result.dismiss === Swal.DismissReason.confirm) {
					values[currentStep] = result.value
					currentStep++
				} else if (result.dismiss === Swal.DismissReason.cancel) {
					currentStep--
				} else {
					break
				}


			}



		})()

	}

	function addNewCall() {

		$.ajax({
			method: "POST",
			url: "http://localhost/Getaways-staff-management-system/backend/buildFleetReports.php",
			data: {
				insertFleetReport: date,
				staff: driver,
				vehicle: vehicle,
				fuel: fuel,
				km: km,
				comments: comments,
				location: location
			},
			success: function (msg) {

				loadFleet(lastLoaded.fleet.db, lastLoaded.fleet.name, lastLoaded.fleet.plate, lastLoaded.fleet.editable).then(() => {

					saveLog("New fleet update for " + vehicle, moment().format('DD/MM/YYYY HH:mm'), "fleet")

					Swal.fire({

						icon: 'success',
						title: msg,
						//  timer: 2000,
						showConfirmButton: false,
						heightAuto: false

					})

				})

			}

		})

	}
	async function getDataForUpdateCall() {

		return $.ajax({
			method: "POST",
			url: "http://localhost/Getaways-staff-management-system/backend/buildFleetReports.php",
			data: {
				idGetFleetData: id,
			},
			dataType: 'JSON',
			success: function (response) {

				var len = response.length;
				for (var i = 0; i < len; i++) {
					date = response[i].date;
					driver = response[i].staff;
					vehicle = response[i].vehicle;
					fuel = response[i].fuel;
					km = response[i].km;
					comments = response[i].comments;
					location = response[i].location;

				}
			}
		})

	}

	function updateCall() {

		$.ajax({

			method: "POST",
			url: "http://localhost/Getaways-staff-management-system/backend/buildFleetReports.php",
			data: {
				editFleetReport: id,
				date: date,
				staff: driver,
				vehicle: vehicle,
				fuel: fuel,
				km: km,
				comments: comments,
				location: location
			},
			success: function (msg) {

				loadFleet(lastLoaded.fleet.db, lastLoaded.fleet.name, lastLoaded.fleet.plate).then(() => {

					saveLog("Fleet update #" + id + " has updated", moment().format('DD/MM/YYYY HH:mm'), "fleet")

					Swal.fire({

						icon: 'success',
						title: msg,
						//  timer: 2000,
						showConfirmButton: false,
						heightAuto: false

					})

				})

			}

		})

	}


}



function createScheduleTables(arr, member) {

	return arr.map(obj => { //MAP RETURNS A NEW ARRAY FOR EVERY ITERATION

		let headerBgColor = obj.class == "jobdone" ? "bg-success" : obj.class == "cancelled" ? "bg-danger" : obj.class == "pending" ? "bg-warning" : null
		let headerTextColor = obj.class == "pending" ? "text-dark" : "text-light";
		let statusText = obj.class == "pending" ? "PENDING" : obj.class == "cancelled" ? "CANCELLED" : "COMPLETED"
		let statusIcon = obj.class == "jobdone" ? `<i class="fas fa-check align-middle"></i>` : obj.class == "cancelled" ? `<i class="fas fa-exclamation align-middle"></i>` : ""
		let commentIcon = obj.remarks ? `<i class="fas fa-comment align-middle"></i>` : ""
		let iconColumn = (statusIcon == "" && commentIcon == "") ? "" : `<div class="col border border-bottom-0 border-end-0 border-1 p-1 d-flex flex-row justify-content-center align-items-center gap-2">
		${statusIcon} ${commentIcon}
		</div>`;

		return ` <div class="schedule-table ${obj.class}">
			  <div class="container-fluid">
			  <div class="row ${headerTextColor} ${headerBgColor}">
			  <div class="col-6 border border-bottom-0 border-end-0 border-1 p-1 d-flex flex-row justify-content-center align-items-center">
			  ${statusText}
			  </div>
			  ${iconColumn}
			  <div class="expand-task col border border-bottom-0 border-1 p-1 d-flex flex-row justify-content-center align-items-center">
			  <i class="fas fa-angle-down fs-2"></i>
			  </div>
			  </div>
			  <div class="schedule-container">
			  <div class="row bg-light">
			  <div class="col d-flex flex-row justify-content-center align-items-center border border-1 p-1">
			   <span class="table-id">Task #${obj.id}</span>
			   </div>
			   <div class="col d-flex justify-content-center align-items-center border border-start-0 border-1 p-1 added-activity">${obj.activity}</div>
			   </div>
			   <div class="row table-header-driverdate bg-light">
			   <div class="col d-flex justify-content-center align-items-center border border-top-0 border-end-0 border-1 p-1 fw-bold">${obj.date}</div>
			   </div>
			   </div>
			   </div>
			   </div>`;
	}).join('');

}

function createClickedScheduleTable(state, obj) {

	let details_html = (obj.details !== null && obj.details.length > 0) ? `
	<div class="row bg-secondary text-light">
	<div class="col d-flex justify-content-center align-items-center border border-bottom-0 border-top-0 border-1 p-1">Details</div>
	</div>
	<div class="row bg-light">
   <div class="col d-flex justify-content-center align-items-center border border-bottom-0 border-top-0 border-1 p-1">${obj.details}</div>
   </div>
   ` : ""

	let pickups = JSON.parse(obj.pickups)
	let pickups_html = (pickups !== null && pickups.length > 0) ?
		`<div class="row bg-secondary text-light">
		    <div class="col d-flex justify-content-center align-items-center border border-bottom-0 border-top-0 border-1 p-1">Pick-ups plan</div>
		    </div>
			<div class="row">
			<table class="table table-bordered border col bg-light">
			<tbody>` +
		pickups.map(obj => {
			return `
			<tr class="pickups-row border-top-0 border-bottom-0">
			<td class="schedule-gps" rowspan="${obj.guests.length +1}"><i class="fas fa-location-arrow text-success"></i></td>
			<td class="capitalize border-0" rowspan="${obj.guests.length +1}">${obj.meeting_point}</td>
			<td class="border-top-0" rowspan="${obj.guests.length +1}">${obj.time}</td>
			</tr>` +
				obj.guests.map(obj => {
					let details = obj.details.length > 0 ? obj.details : "-";
					return `<tr class="border-top-0">
			<td class="border-end-0" colspan="2">${obj.name}</td>
			<td class="pickup-plan-pax border-start-0">x${obj.pax}</td>
			<td class="border-0" style="min-width: 2em !important;">${details}</td>
			</tr>`
				}).join('')
		}).join('') +
		`</tbody>
		</table>
		</div>` : ""

	if (state == "folded") {

		return ` <div class="row bg-light">
		<div class="col d-flex flex-row justify-content-center align-items-center border border-1 p-1">
		 <span class="table-id">Task #${obj.id}</span>
		 </div>
		 <div class="col d-flex justify-content-center align-items-center border border-start-0 border-1 p-1">${obj.activity}</div>
		 </div>
		 <div class="row bg-light">
		 <div class="col d-flex justify-content-center align-items-center border border-top-0 border-bottom-0 border-1 p-1 fw-bold">${obj.date}</div>
		 </div>
		 `;

	} else {



		return `<div class="row bg-light">
					<div class="col d-flex flex-row justify-content-center align-items-center border border-1 p-1 table-id">Task #${obj.id}</div>
					 <div class="col d-flex justify-content-center align-items-center border border-start-0 border-1 p-1">${obj.activity}</div>
					 </div>
					 <div class="row bg-light">
					 <div class="col d-flex justify-content-center align-items-center border border-top-0 border-bottom-0 border-1 p-1 fw-bold">${obj.date}</div>
					 </div>
					 <div class="row bg-secondary text-light">
		             <div class="col d-flex justify-content-center align-items-center border border-bottom-0 border-top-0 border-end-0 border-1 p-1">Driver</div>
		             <div class="col d-flex justify-content-center align-items-center border border-bottom-0 border-top-0 border-end-0 border-1 p-1">Escort</div>
		             <div class="col d-flex justify-content-center align-items-center border border-bottom-0 border-top-0 border-1 p-1">Vehicle</div>
		             </div>
					 <div class="row bg-light">
		             <div class="col d-flex justify-content-center align-items-center border border-bottom-0 border-top-0 border-end-0 border-1 p-1 driver">${obj.driver}</div>
		             <div class="col d-flex justify-content-center align-items-center border border-bottom-0 border-top-0 border-end-0 border-1 p-1">${obj.escort}</div>
		             <div class="col d-flex justify-content-center align-items-center border border-bottom-0 border-top-0 border-1 p-1">${obj.vehicle}</div>
		             </div>
					 ${pickups_html}
					 ${details_html}
					 <div class="row">
                    <button class="btn">EDIT ACTIVITY <i class="far fa-edit"></i></button>
                    </div>
					 `;

	}

}

function loadSchedule(name, date, pending) {

	$("#jobs-table-wrap").empty();
	$("#schedule-wrap").slideUp("fast");

	return myPromise = new Promise(function (resolve) {

		let headerMonth = name == "Today" ? "" : pending == true ? "pending" : date.monthLong;

		[lastLoaded.schedule.name, lastLoaded.schedule.date.day, lastLoaded.schedule.date.monthShort, lastLoaded.schedule.date.monthLong, lastLoaded.schedule.date.year, lastLoaded.schedule.pending] = [name, date.day, date.monthShort, date.monthLong, date.year, pending]

		$.ajax({
			method: "get",
			url: "http://localhost/Getaways-staff-management-system/backend/buildJobsWindow.php",
			data: {
				getLimitedJobs: name,
				day: date.day,
				monthShort: date.monthShort,
				monthLong: date.monthLong,
				year: date.year,
				pending: pending
			},
			dataType: 'JSON',
			success: function (response) {

				$("#schedule-wrap").slideDown("fast");
				$(".jobs-dbname").text(`${name} ${headerMonth} tasks`)
				$("#jobs-table-wrap").append(createScheduleTables(response, name));

				swal.close()
				resolve()

			},
			error: function (response) {
				let notFoundMsg = `<div class="container bg-danger text-light rounded-bottom">
	<div class="row">
	<div class="col d-flex flex-row justify-content-center align-items-center p-1">
	 ${response.responseText}
	 </div>
	</div>
	</div>`

				$("#schedule-wrap").slideDown("fast");

				$(".jobs-dbname").text(`${name} ${headerMonth} tasks`)
				$("#jobs-table-wrap").append(notFoundMsg);

				swal.close()
				resolve()
			}

		});

	});

};


function loadBalance(name) {

	return myPromise = new Promise(function (resolveOuter) {

		let inner = new Promise((resolve) => {

			$("#balance-wrap").slideUp("fast");
			$("#balance-tbody").empty();

			resolve()

		}).then(() => {

			$("#balance-wrap").slideDown("fast");
			$(".balance-header-th").text(`${name} balance`)
			$("#balance-table-wrap table").data("name", name);

			callBalanceDatabase(name).then(success => {
				return createBalanceTable("success", success)
			}).then(() => {
				swal.close()
			}).catch(error => {
				createBalanceTable("error", error)
				swal.close()
			}).then(() => {
				resolveOuter()
				selectBoxesToggleVisibility("#balance-wrap", true)
				lastLoaded.balance.name = name;
			})

		})

	});



}

function callBalanceDatabase(name) {

	let myPromise = new Promise(function (resolve, reject) {

		$.ajax({
			method: "POST",
			url: "http://localhost/Getaways-staff-management-system/backend/buildBalanceWindow.php",
			data: {
				getBalance: name
			},
			dataType: 'JSON',
			success: function (response) {
				resolve(response)
			},
			error: function (response) {
				reject(response)
			}

		})


	});

	return myPromise

};

function createBalanceTable(action, data) {

	return myPromise = new Promise(function (resolveOuter) {


		if (action == "success") {

			return myPromise = new Promise((resolve) => {

				var len = data.length;
				for (var i = 0; i < len; i++) {
					var id = data[i].id;
					var description = data[i].description;
					var date = data[i].date;
					var euro = data[i].euro;
					var dbclass = data[i].class;


					var tr_str =
						`<tr class="${dbclass}-row">
					<td class="record-id p-0">${id}</td>
					<td class="description-income p-0">${description}</td>
					<td class="date-income p-0">${date}</td>
					<td class="euro-income ${dbclass} p-0">${euro} €</td>
					<td class="euro-expenses ${dbclass} p-0">${euro} €</td>
					<td class="table-buttons"><div class="d-flex justify-content-center align-items-center"><div class="table-button">Edit</div><input class="table-checkbox" type="checkbox" style="display:none;width: 1.9em;height: 1.9em;"></div></td>
					</tr>`

					$("#balance-tbody").append(tr_str);

				}

				window.setTimeout(function () {
					giveZeroToTd();
				}, 50); //EMPTY CELLS TO ZERO
				window.setTimeout(function () {

					$("#expenses-total").text(calcBalance("expenses"));
					$("#income-total").text(calcBalance("incomes"));
					zeroToEmptyString();
					calcTotalBalance();

				}, 100); //CALCULATIONS

				resolve()

			}).then(() => {

				resolveOuter()

			})


		} else {

			return myPromise = new Promise((resolve) => {

				let notFoundMsg = `<tr>
			<td colspan="6" class="bg-danger text-light border rounded-bottom border-top-0" style="font-size:0.9em">${data.responseText}</td>
			</tr>`

				window.setTimeout(function () {
					giveZeroToTd();
				}, 50); //EMPTY CELLS TO ZERO
				window.setTimeout(function () {

					$("#expenses-total").text(calcBalance("expenses"));
					$("#income-total").text(calcBalance("incomes"));
					zeroToEmptyString();
					calcTotalBalance();

				}, 100); //CALCULATIONS

				$("#balance-tbody").append(notFoundMsg);

				resolve()

			}).then(() => {

				resolveOuter()

			})
		}
	});

}


function loadFuel(db, name, plate) {

	return myPromise = new Promise(function (resolveOuter) {

		let inner = new Promise((resolve) => {

			$("#fuel-wrap").slideUp("fast");
			$("#fuel-tbody").empty();

			resolve()

		}).then(() => {
			callFuelDatabase(db, name, plate).then(success => {
				return createFuelTable(success)
			}).then(() => {
				$("#fuel-wrap").slideDown("fast");
				swal.close()
			}).catch(error => {

				Swal.fire({

					icon: 'warning',
					title: error.responseText,
					showConfirmButton: false,
					heightAuto: false

				})

			}).then(() => {
				resolveOuter()
				lastLoaded.fuel.db = db;
				lastLoaded.fuel.name = name;
				lastLoaded.fuel.plate = plate;
				selectBoxesToggleVisibility("#fuel-wrap", true)
			})

		})

	});

}

function callFuelDatabase(db, name, plate) {

	return myPromise = new Promise(function (resolveOuter, rejectOuter) {

		if (db == "all") {

			$.ajax({
				method: "POST",
				url: "http://localhost/Getaways-staff-management-system/backend/buildFuelReports.php",
				data: {
					getAllFuel: null,
				},
				dataType: 'JSON',
				success: function (response) {
					resolveOuter(response)
				},
				error: function (response) {
					rejectOuter(response)
				}

			});

		}

		if (db == "driver") {

			$.ajax({
				method: "POST",
				url: "http://localhost/Getaways-staff-management-system/backend/buildFuelReports.php",
				data: {
					getDriverFuel: name,
				},
				dataType: 'JSON',
				success: function (response) {
					resolveOuter(response)
				},
				error: function (response) {
					rejectOuter(response)
				}

			});

		}

		if (db == "vehicle") {

			$.ajax({
				method: "POST",
				url: "http://localhost/Getaways-staff-management-system/backend/buildFuelReports.php",
				data: {
					getVehicleFuel: plate,
				},
				dataType: 'JSON',
				success: function (response) {
					resolveOuter(response)
				},
				error: function (response) {
					rejectOuter(response)
				}

			});

		}

		if (db == "driverByVehicle") {

			$.ajax({
				method: "POST",
				url: "http://localhost/Getaways-staff-management-system/backend/buildFuelReports.php",
				data: {
					getVehicleFuelByDriver: name,
					plate: plate

				},
				dataType: 'JSON',
				success: function (response) {
					resolveOuter(response)
				},
				error: function (response) {
					rejectOuter(response)
				}

			});

		}

	});

};

function createFuelTable(response) {

	return myPromise = new Promise(function (resolve) {

		var len = response.length;
		for (var i = 0; i < len; i++) {
			var id = response[i].id;
			var date = response[i].date;
			var staff = response[i].staff;
			var vehicle = response[i].vehicle;
			var amount = response[i].amount;
			var payment = response[i].payment;

			var tr_str =
				`<tr>
		<td class="record-id p-1 border-end">${id}</td>
		<td class="date-fuel p-0 border-end">${date}</td>
		<td class="staff-fuel p-0 border-end">${staff}</td>
		<td class="vehicle-fuel p-0 border-end">${vehicle}</td>
		<td class="amount-fuel p-0 border-end">${amount} €</td>
		<td class="payment-fuel p-0 border-end">${payment}</i></td>
		<td class="table-buttons"><div class="table-button text-light">Edit</div><input class="table-checkbox" type="checkbox" style="display:none;width: 1.9em;height: 1.9em"></td>
		</tr>`



			$("#fuel-tbody").append(tr_str);

			if (i === len - 1) {
				resolve()
			}

		}


	});

}


function loadFleet(db, name, plate, editable) {

	return myPromise = new Promise(function (resolveOuter) {

		let inner = new Promise((resolve) => {

			$("#fleet-wrap").slideUp("fast");
			$("#fleet-tbody").empty();

			resolve()

		}).then(() => {
			callFleetDatabase(db, name, plate).then(success => {
				return createFleetTable(success, editable)
			}).then(() => {
				$("#fleet-wrap").slideDown("fast");
				swal.close()
			}).catch(error => {

				Swal.fire({

					icon: 'warning',
					title: error.responseText,
					showConfirmButton: false,
					heightAuto: false

				})

			}).then(() => {
				resolveOuter()
				lastLoaded.fleet.db = db;
				lastLoaded.fleet.name = name;
				lastLoaded.fleet.plate = plate;
				lastLoaded.fleet.editable = editable;
				selectBoxesToggleVisibility("#fleet-wrap", true)
			})

		})

	});

}

function callFleetDatabase(db, name, plate) {

	return myPromise = new Promise(function (resolveOuter, rejectOuter) {

		if (db == "all") {

			$.ajax({
				method: "POST",
				url: "http://localhost/Getaways-staff-management-system/backend/buildFleetReports.php",
				data: {
					getAllFleet: null
				},
				dataType: 'JSON',
				success: function (response) {
					resolveOuter(response)
				},
				error: function (response) {
					rejectOuter(response)
				}

			});

		}

		if (db == "vehicle") {

			$.ajax({
				method: "POST",
				url: "http://localhost/Getaways-staff-management-system/backend/buildFleetReports.php",
				data: {
					getVehicleFleet: plate,
					staff: name
				},
				dataType: 'JSON',
				success: function (response) {
					resolveOuter(response)
				},
				error: function (response) {
					rejectOuter(response)
				}

			});

		}

		if (db == "driverLast") {

			$.ajax({
				method: "POST",
				url: "http://localhost/Getaways-staff-management-system/backend/buildFleetReports.php",
				data: {
					getDriverFleetLast: name
				},
				dataType: 'JSON',
				success: function (response) {
					resolveOuter(response)
				},
				error: function (response) {
					rejectOuter(response)
				}

			});

		}

		if (db == "driver") {

			$.ajax({
				method: "POST",
				url: "http://localhost/Getaways-staff-management-system/backend/buildFleetReports.php",
				data: {
					getDriverFleet: name,
					plate: plate
				},
				dataType: 'JSON',
				success: function (response) {
					resolveOuter(response)
				},
				error: function (response) {
					rejectOuter(response)
				}

			});

		}

	});
};

function createFleetTable(response, editable) {

	return myPromise = new Promise(function (resolve) {

		var len = response.length;
		for (var i = 0; i < len; i++) {
			var id = response[i].id;
			var date = response[i].date;
			var staff = response[i].staff;
			var vehicle = response[i].vehicle;
			var fuel = response[i].fuel;
			var km = response[i].km;

			let tr_str;

			if (editable == true) {

				tr_str = `<tr class="all-fleet">
<td class="fleet-gps p-1"><i class="fas fa-question-circle text-success" style="font-size:1.5em"></i></td>
<td class="record-id p-0">${id}</td>
<td class="staff-fleet p-0">${staff}</td>
<td class="date-fleet p-0">${date}</td>
<td class="vehicle-fleet p-0">${vehicle}</td>
<td class="fuel-fleet p-0">${fuel}%</td>
<td class="km-fleet p-1">${km}</td>
<td class="table-buttons"><div class="table-button text-light">Edit</div><input class="table-checkbox" type="checkbox" style="display:none;width: 1.9em;height: 1.9em"></td>
</tr>`

				$("#fleet-table-wrap table thead tr:nth-child(1) th:nth-child(2)").show()
				$("#fleet-table-wrap table thead tr:nth-child(2) th:nth-child(8)").show()

			} else {

				tr_str = `<tr class="all-fleet">
<td class="fleet-gps p-1"><i class="fas fa-question-circle text-success" style="font-size:1.5em"></i></td>
<td class="record-id p-0">${id}</td>
<td class="staff-fleet p-0">${staff}</td>
<td class="date-fleet p-0">${date}</td>
<td class="vehicle-fleet p-0">${vehicle}</td>
<td class="fuel-fleet p-0">${fuel}%</td>
<td class="km-fleet p-1">${km}</td>
</tr>`

				$("#fleet-table-wrap table thead tr:nth-child(1) th:nth-child(2)").hide()
				$("#fleet-table-wrap table thead tr:nth-child(2) th:nth-child(8)").hide()

			}




			$("#fleet-tbody").append(tr_str);


			if (i === len - 1) {
				resolve()
			}

		}

	});

}


function saveLog(action, date, dbclass) {

	var user = getName()

	$.ajax({
		method: "POST",
		url: "http://localhost/Getaways-staff-management-system/backend/actions.php",
		data: {
			userlog: user,
			actionlog: action,
			datelog: date,
			dbclasslog: dbclass
		},
		success: function (response) {
			//		refreshLogs();
		}
	})


}

function refreshLogs() {

	loadlogsdb().then(() => {

		swal.close()

	}).catch(() => {

		swal.close()

	})

}

function loadlogsdb() {

	return new Promise((resolve, reject) => {

		$("#logs-tbody").empty();

		$.ajax({
			url: 'http://localhost/Getaways-staff-management-system/backend/buildLogWindow.php',
			type: 'get',
			dataType: 'JSON',
			success: function (response) {
				var len = response.length;
				for (var i = 0; i < len; i++) {
					//                var id = response[i].id;
					var user = response[i].user;
					var action = response[i].action;
					var date = response[i].date;
					//                var dbclass = response[i].class;

					var tr_str =

						'<tr>' +
						'<td class="log-user p-1 border-bottom-0">' + user + '</td>' +
						'<td class="log-action p-1 border-bottom-0">' + action + '</td>' +
						'<td class="log-date p-1 border-bottom-0">' + date + '</td>' +
						'</tr>';

					$("#logs-tbody").append(tr_str);

				}
				resolve()
			},
			error: function (response) {

				let notFoundMsg = `<tr>
					<td colspan="8" class="bg-danger text-light border rounded-bottom border-top-0" style="font-size:0.9em">${response.responseText}</td>
					</tr>`

				$("#logs-tbody").append(notFoundMsg);
				reject()
			}

		})

	})



};


function calcBalance(value) {

	var all_expenses = [];
	var all_incomes = [];

	document.querySelectorAll('.euro-expenses').forEach(i => {

		all_expenses.push(parseFloat($(i).text()));

	});

	document.querySelectorAll('.euro-income').forEach(i => {

		all_incomes.push(parseFloat($(i).text()));

	});


	if (value == "expenses") {
		return all_expenses.reduce((a, b) => a + b, 0).toFixed(1) + " €"
	}

	if (value == "incomes") {
		return all_incomes.reduce((a, b) => a + b, 0).toFixed(1) + " €"
	}

}

function calcTotalBalance() {
	let income = parseFloat($("#income-total").text())
	let expense = parseFloat($("#expenses-total").text())
	let total_balance = $("#income-balance");
	let balance = income - expense;

	$(total_balance).text(balance.toFixed(1) + " €")

	if (balance < 0) {

		$(total_balance).css({
			'color': 'red'
		});


	} else {

		$(total_balance).css({
			'color': 'green'
		});

	}
}

function zeroToEmptyString() {

	document.querySelectorAll('#balance-tbody td').forEach(i => {

		if ($(i).text() == "0") {

			$(i).text("")
			if ($(i).closest("tr").hasClass("expense-row")) {

				$(i).append('<i class="fas fa-file-invoice-dollar"></i>')
			}


		}

	});

}

function giveZeroToTd() {

	document.querySelectorAll('.income-row td:nth-child(5)').forEach(i => {


		$(i).text("0")


	});

	document.querySelectorAll('.expense-row td:nth-child(4)').forEach(i => {


		$(i).text("0")


	});

}

function datepicker(format) {

	if (format == undefined) {

		$('#datepicker').datepicker({
			dateFormat: 'dd MM yy',
			beforeShow: function (input, inst) {
				setTimeout(() => {
					inst.dpDiv.outerWidth($('#datepicker').outerWidth());
				}, 0);
			},
		});

	} else if (format == "lowercase") {

		$('#datepicker').datepicker({
			dateFormat: 'dd/mm/yy',
			beforeShow: function (input, inst) {
				setTimeout(() => {
					inst.dpDiv.outerWidth($('#datepicker').outerWidth());
				}, 0);

			},
		});

	}

	$('.ui-datepicker').on('click', function () {
		$(this).outerWidth( $('#datepicker').outerWidth() );
	});

}

function capitalize(str) {
	return str.replace(/\b\w/g, function (char) {
		return char.toUpperCase();
	});
}

function addIconsInFuelReports() {

	document.querySelectorAll('.payment-fuel').forEach(i => {

		if ($(i).text() == "CARD") {

			if ($(i).find(".fas").length == 0) {

				$(i).append(`<i class="fas fa-credit-card"></i>`)

			}

		}

		if ($(i).text() == "CASH") {

			if ($(i).find(".fas").length == 0) {

				$(i).append(`<i class="fas fa-wallet"></i>`)

			}


		}

	});

}

function downloadExcel(table, data) {

	let name = $('#balance-table-wrap table').data('name')

	if (table == "schedule") {

		createExcelFile("schedule", data).then(message => {
			console.log(message)
		})

	}

	if (table == "balance") {

		callBalanceDatabase(name).then(successData => {

			createExcelFile("balance", successData).then(message => {

				Swal.fire({

					icon: 'success',
					title: message,
					showConfirmButton: false,
					heightAuto: false

				})

			})


		}).catch(errorData => {

			Swal.fire({

				icon: 'warning',
				title: errorData.responseText,
				showConfirmButton: false,
				heightAuto: false

			})

		})

	}

}

function createExcelFile(table, data) {

	return myPromise = new Promise(function (resolve) {

		if (table == "schedule") {

			let scheduleData = data;

			const workbook = new ExcelJS.Workbook();
			const worksheet = workbook.addWorksheet(`${scheduleData.name} ${scheduleData.month} ${scheduleData.year} schedule`);

			worksheet.columns = [{
					header: 'id',
					key: 'id',
					width: 6
				},
				{
					header: 'Status',
					key: 'status',
					width: 15
				},
				{
					header: 'Date',
					key: 'date',
					width: 20
				},
				{
					header: 'Activity',
					key: 'activity',
					width: 20
				},
				{
					header: 'Driver',
					key: 'driver',
					width: 15
				},
				{
					header: 'Escort',
					key: 'escort',
					width: 15
				},
				{
					header: 'Vehicle',
					key: 'vehicle',
					width: 12
				}
			];

			worksheet.getRow(1).height = 20;

			worksheet.columns.forEach(column => {

				column.alignment = {
					vertical: 'middle',
					horizontal: 'center'
				};
			})

			worksheet.getRow(1).eachCell({
				includeEmpty: true
			}, function (cell) {
				worksheet.getCell(cell.address).fill = {

					type: 'pattern',
					pattern: 'solid',
					fgColor: {
						argb: 'f2f2f2'
					}

				}
			})

			worksheet.getRow(1).eachCell({
				includeEmpty: true
			}, function (cell) {
				worksheet.getCell(cell.address).font = {
					bold: true,
					size: 12
				}
			})

			worksheet.views = [{
				state: 'frozen',
				ySplit: 1
			}]; // FIRST ROW STICKY

			scheduleData.data.forEach(obj => {

				let objClass;
				switch (obj.class) {
					case "jobdone":
						objClass = "COMPLETED";
						break;
					case "pending":
						objClass = "PENDING";
						break;
					case "cancelled":
						objClass = "CANCELLED";
						break;
				}

				let row = worksheet.addRow({
					id: obj.id,
					status: objClass, //= "jobdone" ? "COMPLETED" : obj.class = "pending" ? "PENDING" : "CANCELLED" //changing the property itself..
					date: obj.date,
					activity: obj.activity,
					driver: obj.driver,
					escort: obj.escort,
					vehicle: obj.vehicle
				});

				[1, 2, 3, 4, 5, 6, 7].map(x => row.getCell(x).border = {
					top: {
						style: 'thin',
						color: {
							argb: 'b3b3b3'
						}
					},
					left: {
						style: 'thin',
						color: {
							argb: 'b3b3b3'
						}
					},
					bottom: {
						style: 'thin',
						color: {
							argb: 'b3b3b3'
						}
					},
					right: {
						style: 'thin',
						color: {
							argb: 'b3b3b3'
						}
					}
				});

				if (objClass == "COMPLETED") {

					[1, 2, 3, 4, 5, 6, 7].map(x => row.getCell(x).fill = {

						type: 'pattern',
						pattern: 'solid',
						fgColor: {
							argb: 'ccffcc'
						}

					})

				}

				if (objClass == "CANCELLED") {

					[1, 2, 3, 4, 5, 6, 7].map(x => row.getCell(x).fill = {

						type: 'pattern',
						pattern: 'solid',
						fgColor: {
							argb: 'ffcccc'
						}

					})

				}

				if (objClass == "PENDING") {

					[1, 2, 3, 4, 5, 6, 7].map(x => row.getCell(x).fill = {

						type: 'pattern',
						pattern: 'solid',
						fgColor: {
							argb: 'ffffb3'
						}

					})

				}

			});


			workbook.xlsx.writeBuffer().then((data) => {
				const blob = new Blob([data], {
					type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
				});

				let filename = `${scheduleData.name}-${scheduleData.month}_${scheduleData.year}-schedule`

				saveAs(blob, filename);

				resolve("File was created succesfully !")

			}); //write and download file

		}

		if (table == "balance") {

			let name = $('#balance-table-wrap table').data('name')

			let balanceData = data;

			const workbook = new ExcelJS.Workbook();
			const worksheet = workbook.addWorksheet(`${name} balance`);

			worksheet.columns = [{
					header: 'Total balance',
					key: 'total',
					width: 16
				},
				{
					header: '',
					key: 'second',
					width: 25
				},
				{
					header: '',
					key: 'third',
					width: 14
				},
				{
					header: '',
					key: 'income',
					width: 13
				},
				{
					header: '',
					key: 'expenses',
					width: 13
				}
			];

			[1, 2, 3, 4, 5].map(x => worksheet.getRow(1).getCell(x).border = {
				top: {
					style: 'thin',
					color: {
						argb: '8c8c8c'
					}
				},
				left: {
					style: 'thin',
					color: {
						argb: '8c8c8c'
					}
				},
				bottom: {
					style: 'thin',
					color: {
						argb: '8c8c8c'
					}
				},
				right: {
					style: 'thin',
					color: {
						argb: '8c8c8c'
					}
				}
			})

			let row2 = worksheet.addRow({
				total: {
					formula: "D3-E3"
				},
				income: "Income",
				expenses: "Expenses"
			});

			row2.getCell(1).font = {
				bold: true,
				size: 13
			};

			[1, 2, 3, 4, 5].map(x => row2.getCell(x).border = {
				top: {
					style: 'thin',
					color: {
						argb: '8c8c8c'
					}
				},
				left: {
					style: 'thin',
					color: {
						argb: '8c8c8c'
					}
				},
				bottom: {
					style: 'thin',
					color: {
						argb: '8c8c8c'
					}
				},
				right: {
					style: 'thin',
					color: {
						argb: '8c8c8c'
					}
				}
			})

			let row3 = worksheet.addRow({
				total: "Transaction id",
				second: "Description",
				third: "Date",
				income: {
					formula: "SUM(D4:D1048576)"
				},
				expenses: {
					formula: "SUM(E4:E1048576)"
				}
			});

			[1, 2, 3, 4, 5].map(x => row3.getCell(x).border = {
				top: {
					style: 'thin',
					color: {
						argb: '8c8c8c'
					}
				},
				left: {
					style: 'thin',
					color: {
						argb: '8c8c8c'
					}
				},
				bottom: {
					style: 'thin',
					color: {
						argb: '8c8c8c'
					}
				},
				right: {
					style: 'thin',
					color: {
						argb: '8c8c8c'
					}
				}
			})

			balanceData.forEach(obj => {
				if (obj.class == "income") {

					let row = worksheet.addRow({
						total: parseFloat(obj.id),
						second: obj.description,
						third: obj.date,
						income: parseFloat(obj.euro)
					});

					[1, 2, 3, 4, 5].map(x => row.getCell(x).border = {
						top: {
							style: 'thin',
							color: {
								argb: 'b3b3b3'
							}
						},
						left: {
							style: 'thin',
							color: {
								argb: 'b3b3b3'
							}
						},
						bottom: {
							style: 'thin',
							color: {
								argb: 'b3b3b3'
							}
						},
						right: {
							style: 'thin',
							color: {
								argb: 'b3b3b3'
							}
						}
					});

					[1, 2, 3, 4, 5].map(x => row.getCell(x).fill = {

						type: 'pattern',
						pattern: 'solid',
						fgColor: {
							argb: 'ccffcc'
						}

					})

				}

				if (obj.class == "expense") {

					let row = worksheet.addRow({
						total: parseFloat(obj.id),
						second: obj.description,
						third: obj.date,
						expenses: parseFloat(obj.euro)
					});

					[1, 2, 3, 4, 5].map(x => row.getCell(x).border = {
						top: {
							style: 'thin',
							color: {
								argb: 'b3b3b3'
							}
						},
						left: {
							style: 'thin',
							color: {
								argb: 'b3b3b3'
							}
						},
						bottom: {
							style: 'thin',
							color: {
								argb: 'b3b3b3'
							}
						},
						right: {
							style: 'thin',
							color: {
								argb: 'b3b3b3'
							}
						}
					});

					[1, 2, 3, 4, 5].map(x => row.getCell(x).fill = {

						type: 'pattern',
						pattern: 'solid',
						fgColor: {
							argb: 'ffcccc'
						}

					})

				}
			});

			[1, 2, 3].map(row => {
				worksheet.getRow(row).height = 20;
			});

			worksheet.columns.forEach(column => {
				column.alignment = {
					vertical: 'middle',
					horizontal: 'center'
				};
			})

			worksheet.mergeCells('A1:C1');
			worksheet.mergeCells('A2:C2');
			worksheet.mergeCells('D1:E1');

			worksheet.views = [{
				state: 'frozen',
				ySplit: 3
			}]; // FIRST 3 ROWS STICKY

			['A1', 'D2', 'E2', 'A3', 'B3', 'C3'].map(key => {
				worksheet.getCell(key).fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: {
						argb: 'e6e6e6'
					}
				};
			});

			['D1', 'E1', 'A2', 'D3', 'E3'].map(key => {
				worksheet.getCell(key).fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: {
						argb: 'fafafa'
					}
				};
			});

			worksheet.getCell('D3').font = {
				color: {
					argb: "248f24"
				},
				bold: true,
				size: 12
			}
			worksheet.getCell('E3').font = {
				color: {
					argb: "ff471a"
				},
				bold: true,
				size: 12
			}

			workbook.xlsx.writeBuffer().then((data) => {
				const blob = new Blob([data], {
					type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
				});

				let filename = `${name}-balance_${moment().format('DD-MMM-YYYY_HH:mm')}`

				saveAs(blob, filename);

				resolve("File was created succesfully !")

			}); //write and download file

		}

	});



}

function loadAjax(db) {

	if (db == "requests") {

		$("#requests-list tbody").empty()

		new Promise(function (getData) {

			getData(

				$.ajax({
					method: "POST",
					url: "http://localhost/Getaways-staff-management-system/backend/actions.php",
					data: {
						getRequests: null,
					},
					global: false, // PREVENTS AJAXSTART LOADER TO APPEAR --> https://stackoverflow.com/a/45119355/14718856
					dataType: 'JSON',
					success: function (response) {
						var len = response.length;
						for (var i = 0; i < len; i++) {
							var id = response[i].id;
							var request = response[i].request;
							var staff = response[i].staff;

							var tr_str =
								`<tr>
							<td>${id}</td>
							<td>${staff}</td>
							<td>${request}</td>
							</tr>`


							$("#requests-list tbody").append(tr_str);


						}

					}
				})
			)

		}).then(function () {

			if ($(".swal2-html-container table tbody tr").length > 0) {
				$("#requests-list").show()
			}

		})



	}

	if (db == "staff") {

		$.ajax({
			method: "get",
			url: "http://localhost/Getaways-staff-management-system/backend/actions.php",
			data: {
				getAdmin: null,
			},
			global: false,
			dataType: 'JSON',
			success: function (response) {

				var len = response.length;
				for (var i = 0; i < len; i++) {

					var name = response[i].name;
					var password = response[i].password;

					let tr_str =
						`<tr class="table-light">
						<td class="admin-name p-1" colspan="2">${name}</td>
						<td class="admin-password p-1">${password}</td>
						<td class="edit-admin p-1" colspan="2"><i class="fas fa-user-edit"></i></td>
						</tr>`

					$("#staff-list tbody").append(tr_str);

				}

				$.ajax({
					method: "get",
					url: "http://localhost/Getaways-staff-management-system/backend/actions.php",
					data: {
						getStaff: null,
					},
					global: false,
					dataType: 'JSON',
					success: function (response) {

						Swal.hideLoading()
						$(".swal2-content").show()

						var len = response.length;
						for (var i = 0; i < len; i++) {

							var id = response[i].id;
							var name = response[i].name;
							var password = response[i].password;

							let tr_str =
								`<tr>
									<td class="staff-id">#${id}</td>
									<td class="staff-name">${name}</td>
									<td class="staff-password">${password}</td>
									<td class="edit-staff"><i class="fas fa-user-edit"></i></td>
									<td class="delete-staff"><i class="fas fa-trash-alt text-danger"></i></td>
									</tr>`

							$("#staff-list tbody").append(tr_str);

						}
					}
				})
			}
		})



	}

	if (db == "fleet") {

		$.ajax({
			method: "get",
			url: "http://localhost/Getaways-staff-management-system/backend/actions.php",
			data: {
				getVehicles: null,
			},
			global: false,
			dataType: 'JSON',
			success: function (response) {

				Swal.hideLoading()
				$(".swal2-content").show()

				var len = response.length;
				for (var i = 0; i < len; i++) {

					var id = response[i].id;
					var plate = response[i].plate;

					let tr_str =
						`<tr>
					<td class="vehicle-id">#${id}</td>
					<td class="vehicle-plate">${plate}</td>
					<td class="edit-vehicle"><i class="fas fa-edit"></i></td>
					<td class="delete-vehicle"><i class="fas fa-trash-alt text-danger"></i></td>
					</tr>`

					$("#fleet-list tbody").append(tr_str);

				}

			}
		})



	}

}

//TODO align checkboxes like in balance
//TODO make own schedule visible only to staff
//TODO make upload image to fleet report
//TODO add ''guides'' database
//TODO notifications..?