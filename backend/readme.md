# API Documentation

## Users
POST /users/login

    Description: Logs a user into the system.

    Request Body:
        email: User's email address (String)
        user_passw: User's password (String)
        role (Optional): User's role (String, default: "member")

    Success Response:
        Status Code: 200
        Response Body:
        `{
        "status": 200,
        "message": "Login successful",
        "jwtToken": "your_jwt_token_here"
        }`


    Error Responses:
        If authentication fails:
            Status Code: Varies (depends on error)
            Response Body: Error message

---

POST /users/register

    Description: Registers a new user in the system.

    Request Body:
        email: User's email address (String)
        f_name: User's first name (String)
        l_name: User's last name (String)
        user_passw: User's password (String)
        user_dob: User's date of birth (String)
        role: User's role (String)

    Success Response:
        Status Code: 200
        Response Body: "User registered successfully"

    Error Responses:
        If user email already exists:
            Status Code: 400
            Response Body: "User already exists"
        If there's an error during registration:
            Status Code: 500
            Response Body: Error message

---

GET /users/getUserInfo

    Description: Retrieves user information using token info for the user email.

    

    Success Response:
        Status Code: 200
        Response Body: User information

    Error Responses:
        If unauthorized:
            Status Code: 401
            Response Body: "Unauthorized access"
        If there's an error retrieving user info:
            Status Code: 500
            Response Body: Error message

---

PUT /users/updateUserInfo

    Description: Updates user information.

    Request Body:
        email: User's email address (String)
        f_name (Optional): User's updated first name (String)
        l_name (Optional): User's updated last name (String)
        user_passw: User's current password (String)
        user_dob (Optional): User's updated date of birth (String)
        new_passw (Optional): User's new password (String)

    Success Response:
        Status Code: 200
        Response Body: "User info updated successfully"

    Error Responses:
        If unauthorized:
            Status Code: 401
            Response Body: "Unauthorized access"
        If user authentication fails:
            Status Code: Varies (depends on error)
            Response Body: Error message
        If there's no data provided to update user info:
            Status Code: 404
            Response Body: "No data provided to update user info"
        If there's an error updating user info:
            Status Code: 500
            Response Body: Error message
			
---

POST /users/checkUserEmailRoleExists

    Description:
        Checks if a user with a specific role exists.

    Request Body:
        - role: Role of the user to check (String)

    Request Headers:
        - Authorization: Bearer token for the authenticated user

    Success Responses:
        Status Code: 200 OK
        Response Body: `true` if a user with the specified role exists, `false` otherwise

    Error Responses:
        Status Code: 401 Unauthorized
        Response Body: "Unauthorized access"

        Status Code: 404 Not Found
        Response Body: `false` if a user with the specified role does not exist

        Status Code: 500 Internal Server Error
        Response Body: "An error occurred while checking user existence"

---

## Classes

GET /classes/getAllGroupClasses

	Description:
		Retrieves all group classes available in the system.

	Request Parameters:
		None

	Request Headers:
		Authorization: Bearer your_jwt_token_here

	Success Response:
		Status Code: 200 OK
		Response Body: Array of objects containing class information

	Error Responses:
		Status Code: 500 Internal Server Error
		Response Body: "An error occurred while fetching classes"

---

GET /classes/getClassSchedule

	Description:
		Retrieves the schedule of a specific class in ascending order of date and time.

	Request Parameters:
		- classid: ID of the class to retrieve schedule for (String)

	Request Headers:
		Authorization: Bearer your_jwt_token_here

	Success Response:
		Status Code: 200 OK
		Response Body: Array of objects containing class schedule information

	Error Responses:
		Status Code: 500 Internal Server Error
		Response Body: "An error occurred while fetching class schedule"

---

GET /classes/getAllClasses

	Description:
		Retrieves all classes available in the system.

	Request Parameters:
		None

	Request Headers:
		Authorization: Bearer your_jwt_token_here

	Success Response:
		Status Code: 200 OK
		Response Body: Array of objects containing class information

	Error Responses:
		Status Code: 401 Unauthorized
		Response Body: "Unauthorized access"

		Status Code: 500 Internal Server Error
		Response Body: "An error occurred while fetching classes"


## Schedules

GET /schedules/getMemberSchedule

	Description:
		Retrieves the schedule of a member.

	Request Parameters:
		- memberid: ID of the member whose schedule is to be retrieved (String)

	Request Headers:
		Authorization: Bearer your_jwt_token_here

	Success Response:
		Status Code: 200 OK
		Response Body: Array of objects containing member schedule information

	Error Responses:
		Status Code: 500 Internal Server Error
		Response Body: "An error occurred while fetching member schedule"

---

POST /schedules/createGroupSchedule

	Description:
		Creates a group schedule for a class.

	Request Parameters:
		- id: ID of the schedule (String)
		- classid: ID of the class (String)
		- roomid: ID of the room (String)
		- date: Date of the schedule (String)
		- start_time: Start time of the schedule (String)
		- duration: Duration of the schedule (String)
		- type: Type of the schedule (String)
		- status: Status of the schedule (String, default: "pending")
		- trainerid: ID of the trainer (String)

	Request Headers:
		Authorization: Bearer your_jwt_token_here

	Success Response:
		Status Code: 200 OK
		Response Body: "Schedule created successfully"

	Error Responses:
		Status Code: 401 Unauthorized
		Response Body: "Unauthorized access"

		Status Code: 500 Internal Server Error
		Response Body: "An error occurred while creating schedule"

---

POST /schedules/createPersonalSchedule

	Description:
		Creates a personal schedule for a member.

	Request Parameters:
		- id: ID of the schedule (String)
		- classid: ID of the class (String)
		- roomid: ID of the room (String)
		- date: Date of the schedule (String)
		- start_time: Start time of the schedule (String)
		- duration: Duration of the schedule (String)
		- type: Type of the schedule (String)
		- status: Status of the schedule (String, default: "pending")
		- trainerid: ID of the trainer (String)

	Request Headers:
		Authorization: Bearer your_jwt_token_here

	Success Response:
		Status Code: 200 OK
		Response Body: "Schedule created successfully"

	Error Responses:
		Status Code: 401 Unauthorized
		Response Body: "Unauthorized access"

		Status Code: 500 Internal Server Error
		Response Body: "An error occurred while creating schedule"

---

GET /schedules/getTrainerSchedule

	Description:
		Retrieves the schedule of a trainer.

	Request Parameters:
		- trainerid: ID of the trainer whose schedule is to be retrieved (String)

	Request Headers:
		Authorization: Bearer your_jwt_token_here

	Success Response:
		Status Code: 200 OK
		Response Body: Array of objects containing trainer schedule information

	Error Responses:
		Status Code: 401 Unauthorized
		Response Body: "Unauthorized access"

		Status Code: 500 Internal Server Error
		Response Body: "An error occurred while fetching trainer schedule"



## Members

GET /members/getFitnessGoals/:status

	Description:
		Retrieves fitness goals of a member based on the specified status.

	Request Parameters:
		- memberid: ID of the member (String)
		- status: Status of the fitness goals ("all", "completed", "to-do", "in-progress", "incomplete") (String)

	Request Headers:
		Authorization: Bearer your_jwt_token_here

	Success Response:
		Status Code: 200 OK
		Response Body: Array of objects containing fitness goals information

	Error Responses:
		Status Code: 400 Bad Request
		Response Body: "Invalid status provided"

		Status Code: 401 Unauthorized
		Response Body: "Unauthorized access"

		Status Code: 500 Internal Server Error
		Response Body: "An error occurred while fetching fitness goals"

---

GET /members/getHealthMetrics

	Description:
		Retrieves health metrics of a member.

	Request Parameters:
		- memberid: ID of the member (String)

	Request Headers:
		Authorization: Bearer your_jwt_token_here

	Success Response:
		Status Code: 200 OK
		Response Body: Array of objects containing health metrics information

	Error Responses:
		Status Code: 401 Unauthorized
		Response Body: "Unauthorized access"

		Status Code: 500 Internal Server Error
		Response Body: "An error occurred while fetching health metrics"

---

GET /members/getWeeklyRoutines

	Description:
		Retrieves weekly routines of a member.

	Request Parameters:
		- memberid: ID of the member (String)

	Request Headers:
		Authorization: Bearer your_jwt_token_here

	Success Response:
		Status Code: 200 OK
		Response Body: Array of objects containing weekly routines information

	Error Responses:
		Status Code: 401 Unauthorized
		Response Body: "Unauthorized access"

		Status Code: 500 Internal Server Error
		Response Body: "An error occurred while fetching weekly routines"

---

POST /members/selectExercise

	Description:
		Selects an exercise for the specific weekly routine of a member.

	Request Parameters:
		- memberid: ID of the member (String)
		- exerciseid: ID of the exercise (String)
		- week_date: Date of the week (String)
		- rep: Repetitions of the exercise (String)
		- weight: Weight used for the exercise (String)

	Request Headers:
		Authorization: Bearer your_jwt_token_here

	Success Response:
		Status Code: 200 OK
		Response Body: "Exercise added to weekly routine"

	Error Responses:
		Status Code: 401 Unauthorized
		Response Body: "Unauthorized access"

		Status Code: 500 Internal Server Error
		Response Body: "An error occurred while adding exercise to weekly routine"

---

POST /members/payBill

	Description:
		Pays a bill for a specific schedule.

	Request Parameters:
		- memberid: ID of the member (String)
		- scheduleid: ID of the schedule (String)
		- paidAmount: Amount paid for the bill (String)

	Request Headers:
		Authorization: Bearer your_jwt_token_here

	Success Response:
		Status Code: 200 OK
		Response Body: "Bill paid successfully. Booking Complete!"

	Error Responses:
		Status Code: 401 Unauthorized
		Response Body: "Unauthorized access"

		Status Code: 400 Bad Request
		Response Body: "Incorrect amount paid"

		Status Code: 500 Internal Server Error
		Response Body: "An error occurred while paying bill"

---

GET /members/getAllMembersByName

	Description:
		Retrieves all members by their first name and/or last name.

	Request Parameters:
		- user_fname: First name of the member (String)
		- user_lname: Last name of the member (String)

	Request Headers:
		Authorization: Bearer your_jwt_token_here

	Success Response:
		Status Code: 200 OK
		Response Body: Array of objects containing member information

	Error Responses:
		Status Code: 400 Bad Request
		Response Body: "No search criteria provided"

		Status Code: 401 Unauthorized
		Response Body: "Unauthorized access"

		Status Code: 500 Internal Server Error
		Response Body: "An error occurred while fetching members"

---

GET /members/getMemberInvoice

	Description:
		Retrieves invoices of a member.

	Request Parameters:
		- memberid: ID of the member (String)

	Request Headers:
		Authorization: Bearer your_jwt_token_here

	Success Response:
		Status Code: 200 OK
		Response Body: Array of objects containing invoice information

	Error Responses:
		Status Code: 401 Unauthorized
		Response Body: "Unauthorized access"

		Status Code: 500 Internal Server Error
		Response Body: "An error occurred while fetching invoices"

---

GET /members/getMemberSchedule:filterDate

	Description:
		Retrieves the schedule of a member based on the specified date.

	Request Parameters:
		- memberid: ID of the member (String)
		- filterDate: Date to filter the schedule (String)

	Request Headers:
		Authorization: Bearer your_jwt_token_here

	Success Response:
		Status Code: 200 OK
		Response Body: Array of objects containing member schedule information

	Error Responses:
		Status Code: 401 Unauthorized
		Response Body: "Unauthorized access"

		Status Code: 500 Internal Server Error
		Response Body: "An error occurred while fetching member schedule"


## Trainers

GET /trainers/getAllTrainers

	Description:
		Retrieves information about all trainers.

	Request Headers:
		Authorization: Bearer your_jwt_token_here

	Success Response:
		Status Code: 200 OK
		Response Body: Array of objects containing trainer information

	Error Responses:
		Status Code: 500 Internal Server Error
		Response Body: "An error occurred while fetching trainers"

---

GET /trainers/getTrainerAvailability

	Description:
		Retrieves availability of a trainer.

	Request Parameters:
		- trainerid: ID of the trainer (String)

	Request Headers:
		Authorization: Bearer your_jwt_token_here

	Success Response:
		Status Code: 200 OK
		Response Body: Array of objects containing trainer availability information

	Error Responses:
		Status Code: 500 Internal Server Error
		Response Body: "An error occurred while fetching trainer availability"

---

GET /trainers/getTrainerSchedule/:filterDate

	Description:
		Retrieves the schedule of a trainer based on the specified date.

	Request Parameters:
		- trainerid: ID of the trainer (String)
		- filterDate: Date to filter the schedule ("all" or specific date in "YYYY-MM-DD" format) (String)

	Request Headers:
		Authorization: Bearer your_jwt_token_here

	Success Response:
		Status Code: 200 OK
		Response Body: Array of objects containing trainer schedule information

	Error Responses:
		Status Code: 401 Unauthorized
		Response Body: "Unauthorized access"

		Status Code: 500 Internal Server Error
		Response Body: "An error occurred while fetching trainer availability"

---

POST /trainers/addAvailability

	Description:
		Adds new availability for a trainer.

	Request Body:
		- date: Date for availability (String)
		- start_time: Start time for availability (String)
		- end_time: End time for availability (String)
		- trainerid: ID of the trainer (String)

	Request Headers:
		Authorization: Bearer your_jwt_token_here

	Success Response:
		Status Code: 200 OK
		Response Body: "Availability added successfully"

	Error Responses:
		Status Code: 401 Unauthorized
		Response Body: "Unauthorized access"

		Status Code: 500 Internal Server Error
		Response Body: "An error occurred while adding availability"

---

POST /trainers/removeAvailability

	Description:
		Removes availability for a trainer.

	Request Parameters:
		- availabilityid: ID of the availability to remove (String)

	Request Headers:
		Authorization: Bearer your_jwt_token_here

	Success Response:
		Status Code: 200 OK
		Response Body: "Availability removed successfully"

	Error Responses:
		Status Code: 401 Unauthorized
		Response Body: "Unauthorized access"

		Status Code: 500 Internal Server Error
		Response Body: "An error occurred while removing availability"

---

PUT /trainers/updateAvailability

	Description:
		Updates availability for a trainer.

	Request Body:
		- availabilityid: ID of the availability to update (String)
		- date: New date for availability (String)
		- start_time: New start time for availability (String)
		- end_time: New end time for availability (String)

	Request Headers:
		Authorization: Bearer your_jwt_token_here

	Success Response:
		Status Code: 200 OK
		Response Body: "Availability updated successfully"

	Error Responses:
		Status Code: 401 Unauthorized
		Response Body: "Unauthorized access"

		Status Code: 500 Internal Server Error
		Response Body: "An error occurred while updating availability"


## Admin

GET /admin/getAllRooms

	Description:
		Retrieves information about all rooms.

	Request Headers:
		Authorization: Bearer your_jwt_token_here

	Success Response:
		Status Code: 200 OK
		Response Body: Array of objects containing room information

	Error Responses:
		Status Code: 401 Unauthorized
		Response Body: "Unauthorized access"

		Status Code: 500 Internal Server Error
		Response Body: "An error occurred while fetching rooms"

---

GET /admin/getAllEquipments

	Description:
		Retrieves information about all equipments in a specific room.

	Request Parameters:
		- roomid: ID of the room to retrieve equipments from (String)

	Request Headers:
		Authorization: Bearer your_jwt_token_here

	Success Response:
		Status Code: 200 OK
		Response Body: Array of objects containing equipment information

	Error Responses:
		Status Code: 401 Unauthorized
		Response Body: "Unauthorized access"

		Status Code: 500 Internal Server Error
		Response Body: "An error occurred while fetching equipments"

---

GET /admin/getAllInvoices

	Description:
		Retrieves information about all invoices.

	Request Headers:
		Authorization: Bearer your_jwt_token_here

	Success Response:
		Status Code: 200 OK
		Response Body: Array of objects containing invoice information

	Error Responses:
		Status Code: 401 Unauthorized
		Response Body: "Unauthorized access"

		Status Code: 500 Internal Server Error
		Response Body: "An error occurred while fetching invoices"

---

PUT /admin/updateRoom

	Description:
		Updates the room for a specific schedule.

	Request Parameters:
		- roomid: ID of the new room (String)
		- scheduleid: ID of the schedule to update (String)

	Request Headers:
		Authorization: Bearer your_jwt_token_here

	Success Response:
		Status Code: 200 OK
		Response Body: "Room updated successfully"

	Error Responses:
		Status Code: 401 Unauthorized
		Response Body: "Unauthorized access"

		Status Code: 500 Internal Server Error
		Response Body: "An error occurred while updating room"

---

PUT /admin/updateEquipmentStatus

	Description:
		Updates the status of a specific equipment.

	Request Parameters:
		- equipmentid: ID of the equipment to update (String)
		- status: New status of the equipment ("active" or "inactive") (String)

	Request Headers:
		Authorization: Bearer your_jwt_token_here

	Success Response:
		Status Code: 200 OK
		Response Body: "Equipment status updated successfully"

	Error Responses:
		Status Code: 401 Unauthorized
		Response Body: "Unauthorized access"

		Status Code: 500 Internal Server Error
		Response Body: "An error occurred while updating equipment status"
