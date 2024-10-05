<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Form</title>
    <!-- Google Font: Poppins -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap">
    <!-- FontAwesome CDN -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="alert/dist/sweetalert.css">
</head>
<body>
<input type="hidden" id="status" value="<%= request.getAttribute("status") %>">

	<div class="info">
		<p>See the Future of Parking with <span>Space</span><br>
		Sign up now!</p>
		
	</div>
	
	
	<div class="container">
        <div class="form-container">
            <h1>LOGIN</h1>
            <form method="post" action="login">
                <div class="input-group">
                    <input type="text" id="username" name="username" placeholder="Username" required>
                    <i class="fa-solid fa-user icon"></i>
                </div>
                <div class="input-group">
                    <input type="password" id="password" name="password" placeholder="Password" required>
                    <i class="fa-solid fa-lock icon"></i>
                </div>
                <button type="submit">
                  	Login
                </button>
            </form>
            <p class="signup-prompt">Don't have an account? <a href="registration.jsp">Sign up here</a></p>
        </div>
    </div>
    
    <!-- JS -->
	
			<script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
			<script src="script/script.js"></script>
	

	<script type="text/javascript">
		var status = document.getElementById("status").value;
		if(status == "failed"){
			swal("Sorry","Wrong Username and Password","error");
		}
		
	</script>
</body>
</html>
