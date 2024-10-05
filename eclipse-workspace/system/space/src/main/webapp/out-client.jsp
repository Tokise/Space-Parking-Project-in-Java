<%@ page contentType="text/html; charset=UTF-8" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment</title>
    <!-- Google Font: Poppins -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- FontAwesome CDN -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="css/index-style.css"> <!-- Use the same stylesheet for consistency -->
</head>
<body>
        <!-- Sidebar -->
    <div class="sidebar" id="sidebar">
        <div class="logo">
            <h1><a href="index.jsp">Space</a></h1>
        </div>
        <a href="index.jsp" class="sidebar-link"><i class="fas fa-home"></i> Home</a>
        <a href="addClient.jsp" id="add-client-btn" class="sidebar-link"><i class="fas fa-user-plus"></i> Add Client</a>
        <a href="client-type.jsp" class="sidebar-link"><i class="fas fa-users"></i> Client Type</a>
        <a href="vehicle-type.jsp" class="sidebar-link"><i class="fas fa-car"></i> Vehicle Type</a>
        <a href="payment.jsp" class="sidebar-link"><i class="fas fa-credit-card"></i> Payment</a>
        <a href="out-client.jsp" class="sidebar-link"><i class="fas fa-sign-out-alt"></i> Out Clients</a>
        <footer class="out">
        <a href="logout" class="logout-btn"><i class="fas fa-power-off"></i> <span class="text">Logout</span></a>
        </footer>
    </div>>

    <!-- Top Bar -->
    <div class="top-bar">
    <button onclick="history.back()" class="back">BACK</button>
        <div class="search-out">
            <input type="text" class="search-input" placeholder="Search...">
            <button class="search-button"><i class="fas fa-search"></i></button>
            <button class="dark-mode-out"><i class="fa"></i></button> <!-- Dark mode toggle -->
        </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
	   <h2>Paid / Out Clients</h2>
        <table id="completed-parking-table">
            <thead>
                <tr>
                	<th>ID</th>
                     <th>License Plate</th>
                    <th>Client Name</th>
                    <th>Parking Slot</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Parking Fee</th> <!-- New column for parking fee -->
                    <th>Payment Status</th>
                </tr>
            </thead>
            <tbody id="clientTableBody"> 
                <!-- Data will be populated by the server-side script or JavaScript -->
            </tbody>
        </table>
    </div>

    <script src="script/out-client.js"></script>
    <script src="script/dark-mode.js"></script>
    

</body>
</html>