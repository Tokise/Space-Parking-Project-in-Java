document.addEventListener('DOMContentLoaded', () => {
    fetchClientData();
    fetchDashboardData(); // Fetch dashboard data on page load
});

// Fetch client data from the server and populate the table
function fetchClientData() {
    fetch('user-data')  // This endpoint should return the active parking client data
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('clientTableBody');
            tableBody.innerHTML = '';  // Clear the table before appending new rows

            data.forEach(client => {
                const row = document.createElement('tr');

                // ID column
                const idCell = document.createElement('td');
                idCell.textContent = client.id;
                row.appendChild(idCell);

                // Client Name column
                const nameCell = document.createElement('td');
                nameCell.textContent = client.client_name;
                row.appendChild(nameCell);

                // License Plate column
                const licenseCell = document.createElement('td');
                licenseCell.textContent = client.license_plate;
                row.appendChild(licenseCell);

                // Parking Slot column
                const slotCell = document.createElement('td');
                slotCell.textContent = client.parking_slot;
                row.appendChild(slotCell);

                // Start Time column
                const startTimeCell = document.createElement('td');
                startTimeCell.textContent = client.start_time;
                row.appendChild(startTimeCell);

                // End Time column (will be empty if not stopped yet)
                const endTimeCell = document.createElement('td');
                endTimeCell.textContent = client.end_time || 'In Progress';
                row.appendChild(endTimeCell);

                // Parking Fee column (only calculated if end_time is available)
                const feeCell = document.createElement('td');
                if (client.end_time) {
                    const parkingFee = calculateParkingFee(client.start_time, client.end_time);
                    feeCell.textContent = `₱${parkingFee}`;
                } else {
                    feeCell.textContent = 'Calculating...';
                }
                row.appendChild(feeCell);

                // Actions column with "Stop Time" button
                const actionsCell = document.createElement('td');
                const stopTimeButton = document.createElement('button');
                stopTimeButton.textContent = 'Stop Time';

                // Apply modern styles to the dynamically generated button
                stopTimeButton.style.backgroundColor = "#760419";  // Modern green color
                stopTimeButton.style.border = "none";
                stopTimeButton.style.color = "white";
                stopTimeButton.style.padding = "4px 8px";
                stopTimeButton.style.textAlign = "center";
                stopTimeButton.style.textDecoration = "none";
                stopTimeButton.style.display = "inline-block";
                stopTimeButton.style.fontSize = "12px";
                stopTimeButton.style.margin = "4px 2px";
                stopTimeButton.style.cursor = "pointer";
                stopTimeButton.style.borderRadius = "3px";  // Rounded corners
                stopTimeButton.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";  // Slight shadow

                stopTimeButton.onclick = () => stopTime(client.id);
                actionsCell.appendChild(stopTimeButton);
                row.appendChild(actionsCell);

                // Append row to table body
                tableBody.appendChild(row);
            });

            // Update dashboard counts after populating the table
            fetchDashboardData();
        })
        .catch(error => console.error('Error fetching client data:', error));
}


// Send POST request to stop time for a client
function stopTime(clientId) {
    fetch(`stop-time?client_id=${clientId}`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Time stopped successfully!');
                fetchClientData();  // Refresh client data after stopping time
            } else {
                alert('Error stopping time: ' + data.message);
            }
        })
        .catch(error => console.error('Error stopping time:', error));
}

// Function to calculate the parking fee
function calculateParkingFee(startTime, endTime) {
    const ratePerHour = 50;  // PHP rate per hour
    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = (end - start) / (1000 * 60 * 60);  // Convert to hours
    return (Math.round(duration * ratePerHour * 100) / 100).toFixed(2);  // Round to 2 decimal places
}

// Function to fetch and update dashboard data
function fetchDashboardData() {
    fetch('dashboard-data')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Update the displayed counts
            document.getElementById("online-clients").innerText = data.online_count;
            document.getElementById("available-slots").innerText = data.available_slots; // Automatically reflects the count
            document.getElementById("completed-clients").innerText = data.completed_count;
			document.getElementById("unpaid-client").innerText = data.unpaid_client;
			document.getElementById("total-revenue").innerText = parseFloat(data.total_revenue).toFixed(2);
			

           
        })
        .catch(error => {
            console.error('Error fetching dashboard data:', error);
        });
}



// Function to start periodic dashboard updates
function startDashboardUpdates() {
    fetchDashboardData(); // Initial fetch
    setInterval(fetchDashboardData, 300000); // Update every 3 seconds
}

// Function to add a new client and refresh the dashboard
function addClient(clientData) {
    fetch('user-data', { // Replace with your actual endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(clientData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            fetchDashboardData(); // Refresh dashboard data
        } else {
            console.error('Error adding client:', data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Call this function when the page loads
window.onload = startDashboardUpdates;

// Sample data for the graphs
const revenueData = [1200, 1500, 800, 2000, 1800, 2300];
const clientData = [10, 15, 7, 20, 18, 25];

// Revenue Chart
const ctx1 = document.getElementById('revenueChart').getContext('2d');
const revenueChart = new Chart(ctx1, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Monthly Revenue',
            data: revenueData,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true, // Optional: fill under the line chart for better visibility
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false, // Allow chart to fill container
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    font: {
                        size: 18 // Increased Y-axis tick font size
                    },
                    padding: 10 // Increased padding for Y-axis ticks
                },
                title: {
                    display: true,
                    text: 'Revenue', // Optional: Y-axis title
                    font: {
                        size: 20 // Increased title font size
                    }
                }
            },
            x: {
                ticks: {
                    font: {
                        size: 18 // Increased X-axis tick font size
                    },
                    padding: 10 // Increased padding for X-axis ticks
                },
                title: {
                    display: true,
                    text: 'Months', // Optional: X-axis title
                    font: {
                        size: 20 // Increased title font size
                    }
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    font: {
                        size: 18 // Increased legend font size
                    }
                }
            },
            tooltip: {
                bodyFont: {
                    size: 16 // Increased tooltip font size
                },
                titleFont: {
                    size: 18 // Increased tooltip title font size
                }
            }
        }
    }
});

// Clients Chart
const ctx2 = document.getElementById('clientsChart').getContext('2d');
const clientsChart = new Chart(ctx2, {
    type: 'bar',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Monthly Active Clients',
            data: clientData,
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 2 // Increased border width for visibility
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false, // Allow chart to fill container
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    font: {
                        size: 18 // Increased Y-axis tick font size
                    },
                    padding: 10 // Increased padding for Y-axis ticks
                },
                title: {
                    display: true,
                    text: 'Clients', // Optional: Y-axis title
                    font: {
                        size: 20 // Increased title font size
                    }
                }
            },
            x: {
                ticks: {
                    font: {
                        size: 18 // Increased X-axis tick font size
                    },
                    padding: 10 // Increased padding for X-axis ticks
                },
                title: {
                    display: true,
                    text: 'Months', // Optional: X-axis title
				
                    font: {
                        size: 20 // Increased title font size
                    }
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    font: {
                        size: 18 // Increased legend font size
                    }
                }
            },
            tooltip: {
                bodyFont: {
                    size: 16 // Increased tooltip font size
                },
                titleFont: {
                    size: 18 // Increased tooltip title font size
                }
            }
        }
    }
});

		
const ctx = document.getElementById('vehicleTypeChart').getContext('2d');
const vehicleTypeChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['2 Wheels', '4 Wheels', '8 Wheels', '12 Wheels', '16 Wheels', '18 Wheels'],
        datasets: [{
            data: [10, 20, 15, 5, 5, 2],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                top: 20, // Adjust this value to move the pie chart down
                bottom: 0,
                left: 0,
                right: 0
            }
        },
        plugins: {
            title: {
                display: true,
                text: 'Vehicle Type Management', // Title text
				
                font: {
                    size: 18, // Adjust font size if needed
                    weight: 'bold' // Make it bold
                },
                padding: {
                    bottom: 20 // Add padding below the title
                }
            },
            legend: {
                display: true,
                position: 'top',
			
                align: 'start',
                labels: {
                    boxWidth: 15,
                    padding: 15
                }
            }
        }
    }
});


