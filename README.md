for user:

api points: 
	# for showing default welcome message
	# mandatory to run first in url
	# because it creates folder and file for filehandling:

	GET: http://localhost:8080
	HEADER: "Authorization": "bearer 123"
	
------------------------------------------------------------------------------
	#Creating user
	
	HEADER: "Authorization": "bearer 123"
	POST: http://localhost:8080/user/create-user
	BODY: {
  		"firstName": "testFirstName",
  		"lastName" : "testLastName",
  		"email": "test@123.com",
  		"password": "12345"
		}
		
-------------------------------------------------------------------------------
	# Getting user information
	
	HEADER: "Authorization": "bearer 123"
	GET: http://localhost:8080/user/get-user/1
	
-------------------------------------------------------------------------------
	# Getting all users
	
	
	HEADER: "Authorization": "bearer 123"
	GET: http://localhost:8080/user/get-all-user
	
		
-----------------------------------------------------------------------------
	#Updating user
	
	
	HEADER: "Authorization": "bearer 123"
	PATCH: http://localhost:8080/user/update-user/1
	BODY: {
  		"firstName": "shailesh....",
  		"lastName" : "singh....",
  		"email": "shailesh@123.com",
  		"password": "12345...."
		}
	
-----------------------------------------------------------------------------
	# FOR TODO
	
	#Getting todo
	
		HEADER: "Authorization": "bearer 1"
		GET : http://localhost:8080/todo
		
------------------------------------------------------------------------------
	# Create TODO:
		
		HEADER: "Authorization": "bearer 1"
		POST: http://localhost:8080/todo
		BODY: {
  			"todoName" : "todo 1",
  			"todoDescription" : "todo description 1"
			}
			
--------------------------------------------------------------------------------		
	#UPdate Todo
	
		HEADER: "Authorization": "bearer 1"	
		PATCH: http://localhost:8080/todo/2
		BODY: {
  			"todoName" : "todo 11",
  			"todoDescription" : "todo description 11"
			}
			
-------------------------------------------------------------------------------
	# Delete Todo
	
		HEADER: "Authorization": "bearer 1"
		DELETE: http://localhost:8080/todo/1
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
	
