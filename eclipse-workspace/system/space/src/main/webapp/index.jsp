<%
    if (session.getAttribute("name") == null) {
        response.sendRedirect("login.jsp");
    }
%>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Space Parking System</title>
    <!-- Google Font: Poppins -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- FontAwesome CDN -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <!-- Chart.js for graphs -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <!-- Custom CSS -->
    <link rel="stylesheet" href="css/index-style.css">
</head>
<body>

    <!-- Sidebar -->
    <div class="sidebar" id="sidebar">
        <div class="logo">
            <h1><a href="index.jsp">Space</a></h1>
        </div>
        <a href="index.jsp" class="sidebar-link"><i class="fas fa-home"></i> Home</a>
        <a href="addClient.jsp" id="add-client-btn" class="sidebar-link"><i class="fas fa-user-plus"></i>  Add Client</a>
        <a href="client-type.jsp" class="sidebar-link"><i class="fas fa-users"></i> Client Type</a>
        <a href="vehicle-type.jsp" class="sidebar-link"><i class="fas fa-car"></i> Vehicle Type</a>
        <a href="payment.jsp" class="sidebar-link"><i class="fas fa-credit-card"></i> Payment</a>
        <a href="out-client.jsp" class="sidebar-link"><i class="fas fa-sign-out-alt"></i> Out Clients</a>
        <footer class="out">
        <a href="logout" class="logout-btn"><i class="fas fa-power-off"></i> <span class="text">Logout</span></a>
        </footer>
    </div>

    <!-- Top Bar -->
    <div class="top-bar">
        <div class="nav">Dashboard</div>    
        
        <div class="search-container">
            <input type="text" class="search-bar" placeholder="Search...">
            <button class="search-button"><i class="fas fa-search"></i></button>
        </div>
        <button class="dark-mode-toggle"><i class="fa"></i></button>
    </div>

    <!-- Main Content -->
    <div class="main-content">
        <!-- Dashboard Analytics -->
        <div class="dashboard-grid">
            <!-- Online Clients -->
            <div class="dashboard-item">
            	
                	<div class="dashboard-icon">
                    <i class="fas fa-user-check"></i>
              	  </div>
                	<div class="dashboard-details">
                    <h3><a href="#records">Online Clients</a></h3>
                    <p id="online-clients">0</p>
               	   </div>
            
            </div>
            
                            <!-- Vehicle Type -->
            <div class="dashboard-item">
                <div class="dashboard-icon">
                    <i class="fas fa-car"></i>
                </div>
                <div class="dashboard-details">
                   <div class="text">
                    <h3><a href="vehicle-type.jsp">Vehicle Type</a></h3>
				  </div>   
               </div>
            </div>
            
                        <!-- Clients Type -->
            <div class="dashboard-item">
                <div class="dashboard-icon">
                    <i class="fas fa-users"></i>
                </div>
                <div class="dashboard-details">
                <div class="text">
                    <h3><a href="client-type.jsp">Clients Type</a></h3>
                </div>   
                </div>
            </div>
            

            <!-- Available Parking Slots -->
            <div class="dashboard-item">
                <div class="dashboard-icon">
                    <i class="fas fa-parking"></i>
                </div>
                <div class="dashboard-details">
                    <h3>Available Slots</h3>
                    <p id="available-slots">0</p>
                </div>
            </div>
            
            	 <!-- Unpaid Client -->
            <div class="dashboard-item">
                <div class="dashboard-icon">
                    <i class="fas fa-money-bill-wave"></i>
                </div>
                <div class="dashboard-details">
                    <h3><a href="payment.jsp">Unpaid Clients</a></h3>
                    <p id="unpaid-client">0</p>
                </div>
            </div>
            

            <!-- Completed Clients -->
            <div class="dashboard-item">
                <div class="dashboard-icon">
                    <i class="fas fa-user-xmark"></i>
                </div>
                <div class="dashboard-details">
                    <h3><a href="out-client.jsp">Out Clients</a></h3>
                    <p id="completed-clients">0</p>
                </div>
            </div>
			
		
			
            <!-- Total Revenue -->
            <div class="dashboard-item">
                <div class="dashboard-icon">
                    <i class="fas fa-peso-sign"></i>
                </div>
                <div class="dashboard-details">
                    <h3>Total Revenue</h3>
                    <p id="total-revenue">0</p>
                </div>
            </div>
            
                    
                                

  </div>

            
       
		
        <div class="analytics"><!-- Analytics Graph Section -->
        <h2>Analytics Overview</h2>
        <div class="analytics-section">
        	<canvas id="vehicleTypeChart" class="pie"></canvas>
            <canvas id="revenueChart"></canvas>
            <canvas id="clientsChart"></canvas> 
        </div>
        </div>

        <!-- Online Parking Records -->
        <h2>Online Clients Records</h2>
        <table class="records" id="records">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>License Plate</th>
                    <th>Client Name</th>
                    <th>Parking Slot</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Parking Fee</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="clientTableBody">
                <!-- Data will be dynamically inserted here -->
            </tbody>
        </table>
</div>

    <!-- JavaScript -->
    <script src="script/main.js"></script>
    <script src="script/dark-mode.js"></script>
   
</body>
</html>
