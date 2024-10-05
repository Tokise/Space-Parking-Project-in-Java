<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up Form</title>
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
		<p>Create Account with <span>Space</span><br>
		Login now!</p>
		
	</div>
	
	
	<div class="container">
        <div class="form-container">
            <h1>Sign Up</h1>
            <form method="post" action="register">
                <div class="input-group">
                    <input type="text" id="name" name="name" placeholder="Name" required>
                    <i class="fa-solid fa-user icon"></i>
                </div>
                <div class="input-group">
                    <input type="email" id="email" name="email" placeholder="Email" required>
                    <i class="fa-solid fa-envelope icon"></i>
                </div>
                <div class="input-group">
                    <input type="password" id="password" name="pass" placeholder="Password" required>
                    <i class="fa-solid fa-lock icon"></i>
                </div>
                <div class="input-group">
                    <input type="password" id="repassword" name="repassword" placeholder="Re-enter Password" required>
                    <i class="fa-solid fa-lock icon"></i>
                </div>
                <div class="input-group">
                    <input type="tel" id="contact" name="contact" placeholder="Contact Number" required>
                    <i class="fa-solid fa-phone icon"></i>
                </div>
                <button type="submit">
             		Create Account
                </button>
            </form>
            <p class="login-prompt">Already have an account? <a href="login.jsp">Login here</a></p>
        </div>
    </div>
    
    <!-- JS -->
	
	<script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
	

	<script type="text/javascript">
		var status = document.getElementById("status").value;
		if(status == "success"){
			swal("Congrats","Account Created Successfully","success");
		}
		
	</script>
</body>
</html>
