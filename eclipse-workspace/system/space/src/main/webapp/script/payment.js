// Fetch and display client data in the table
document.addEventListener('DOMContentLoaded', () => {
    fetchClientData();
});

function fetchClientData() {
    fetch('payment-list') // Ensure this endpoint is correct
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('clientTableBody');
            tableBody.innerHTML = ''; // Clear existing rows

            data.forEach(client => {
                const row = document.createElement('tr');

                // Create and append the cells to the row
                const idCell = document.createElement('td');
                idCell.textContent = client.id;
                row.appendChild(idCell);

                const licensePlateCell = document.createElement('td');
                licensePlateCell.textContent = client.license_plate;
                row.appendChild(licensePlateCell);

                const clientNameCell = document.createElement('td');
                clientNameCell.textContent = client.client_name;
                row.appendChild(clientNameCell);

                const parkingSlotCell = document.createElement('td');
                parkingSlotCell.textContent = client.parking_slot;
                row.appendChild(parkingSlotCell);

                const startTimeCell = document.createElement('td');
                startTimeCell.textContent = client.start_time;
                row.appendChild(startTimeCell);

                const endTimeCell = document.createElement('td');
                endTimeCell.textContent = client.end_time ? client.end_time : 'In Progress';
                row.appendChild(endTimeCell);

                const feeCell = document.createElement('td');
                feeCell.textContent = client.parking_fee ? `₱${client.parking_fee.toFixed(2)}` : 'Calculating...';
                row.appendChild(feeCell);

                // Create 'Pay Bill' button
                const payButton = document.createElement('button');
                payButton.textContent = 'Pay Bill';

                // Apply modern styles to the button
                payButton.style.backgroundColor = "#760419"; // Modern green color
                payButton.style.border = "none";
                payButton.style.color = "white";
                payButton.style.padding = "4px 8px";
                payButton.style.textAlign = "center";
                payButton.style.textDecoration = "none";
                payButton.style.display = "inline-block";
                payButton.style.fontSize = "13px";
                payButton.style.margin = "4px 2px";
                payButton.style.cursor = "pointer";
                payButton.style.borderRadius = "3px"; // Rounded corners
                payButton.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)"; // Slight shadow

                // Add the click event to the button
                payButton.onclick = () => openPaymentModal(
                    client.id, 
                    client.client_name, 
                    client.parking_fee, 
                    client.parking_slot, 
                    client.vehicle_type, 
                    client.client_type, 
                    client.duration, 
                    client.start_time, 
                    client.end_time, 
                    client.contact_number, 
                    client.client_age, 
                    client.license_plate
                );

                // Create the actions cell and append the button
                const actionsCell = document.createElement('td');
                actionsCell.appendChild(payButton);
                row.appendChild(actionsCell);

                // Append the row to the table body
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching client data:', error));
}


// Open the payment modal with client details
function openPaymentModal(id, name, fee, slot, vehicle, type, duration, startTime, endTime, contactNumber, age, licensePlate) {
    document.getElementById('clientId').innerText = id;
    document.getElementById('clientName').innerText = name;
    document.getElementById('amountToPay').innerText = fee ? fee.toFixed(2) : '0.00';
    
    // Store client data for later use in receipt generation
    document.getElementById('confirmPayment').dataset.client = JSON.stringify({
        id, name, fee, slot, vehicle, type, duration, startTime, endTime, contactNumber, age, licensePlate
    });

    document.getElementById('payAmount').value = ''; // Clear previous input
    document.getElementById('exchangeAmount').innerText = '0'; // Reset exchange
    document.getElementById('paymentModal').style.display = 'block'; // Show modal
}

// Close the payment modal
function closeModal() {
    document.getElementById('paymentModal').style.display = 'none';
}

// Calculate and display the exchange when the pay amount is entered
document.getElementById('payAmount').addEventListener('input', function() {
    const amountToPay = parseFloat(document.getElementById('amountToPay').innerText);
    const payAmount = parseFloat(this.value);

    if (!isNaN(payAmount)) {
        const exchange = payAmount - amountToPay;
        document.getElementById('exchangeAmount').innerText = exchange >= 0 ? exchange.toFixed(2) : '0';
    } else {
        document.getElementById('exchangeAmount').innerText = '0';
    }
});

document.getElementById('confirmPayment').addEventListener('click', function() {
    const client = JSON.parse(this.dataset.client);
    const payAmount = parseFloat(document.getElementById('payAmount').value);
    const amountToPay = parseFloat(document.getElementById('amountToPay').innerText);

    if (payAmount >= amountToPay) {
        closeModal();

        // Send payment data to the server
        fetch('user-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                id: client.id, // Send only the client id
                payment: payAmount // Send the payment amount
            })
        })
        .then(response => {
            if (response.ok) {
                console.log('Payment recorded successfully.');

                // Automatically generate the receipt after successful payment
                generateReceipt(client.id); // Pass the client ID directly to generateReceipt
            } else {
                console.error('Error recording payment:', response.statusText);
            }
        })
        .catch(error => console.error('Fetch error:', error));
    } else {
        alert('The paid amount must be equal to or greater than the amount due.');
    }
});

// Function to generate the receipt with updated formatting
function generateReceipt(clientId) {
    const clientData = JSON.parse(document.getElementById('confirmPayment').dataset.client); // Get client data
    const payAmount = parseFloat(document.getElementById('payAmount').value); // Use the amount paid
    const exchange = payAmount - parseFloat(document.getElementById('amountToPay').innerText); // Calculate exchange

    const { jsPDF } = window.jspdf;

    // Create a new PDF document with custom dimensions
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, 185] // Width of 80mm and height of 200mm for a compact receipt
    });

    // Use Poppins font (if jsPDF supports it) or fallback to a standard font
    doc.setFont('Poppins', 'normal');

    // Add a header and center it
    doc.setFontSize(16);
    const header = 'Space Parking System';
    const headerWidth = doc.getTextWidth(header);
    doc.text(header, (80 - headerWidth) / 2, 10); // Center the header

    // Add a line for separation
    doc.line(5, 15, 75, 15);

    // Set font size for details
    doc.setFontSize(13);
    
    // Add details with updated spacing and alignment
    const details = [
        `Client ID: ${clientData.id}`,
        `License Plate: ${clientData.licensePlate}`, // Ensure license plate is displayed correctly
        `Client Name: ${clientData.name}`,
        `Client Type: ${clientData.type}`,
        `Vehicle Type: ${clientData.vehicle}`,
        `Client Age: ${clientData.age}`,
        `Contact Number: ${clientData.contactNumber}`,
        `Parking Slot: ${clientData.slot}`,
        `Start Time: ${clientData.startTime}`,
        `End Time: ${clientData.endTime ? clientData.endTime : 'In Progress'}`,
        `Duration (min): ${clientData.duration}`,
        `Parking Fee: ${clientData.fee.toFixed(2)} Pesos`, // Change peso sign to "Pesos"
        `Amount Paid: ${payAmount.toFixed(2)} Pesos`, // Change peso sign to "Pesos"
        `Exchange: ${exchange.toFixed(2)} Pesos` // Change peso sign to "Pesos"
    ];

    let y = 20; // Starting y position for details
    details.forEach(detail => {
        const detailWidth = doc.getTextWidth(detail);
        doc.text(detail, 10, y); // Adjusted x position to 10 for left alignment
        y += 8; // Add space between lines
    });

    // Add a footer and center it
    doc.line(5, y, 75, y); // Line at the bottom
    doc.setFontSize(12);
    const footerText = 'Thank you for using our service!';
    const footerWidth = doc.getTextWidth(footerText);
    doc.text(footerText, (80 - footerWidth) / 2, y + 10); // Center the footer

    // Save the PDF
    doc.save(`receipt_${clientData.id}.pdf`);
}
