// Fetch and display client data in the table
document.addEventListener('DOMContentLoaded', () => {
    fetchClientData();
});

function fetchClientData() {
    fetch('out-client-data') // Ensure this endpoint matches your servlet
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Log data to verify it's being fetched
            const tableBody = document.getElementById('clientTableBody');
            tableBody.innerHTML = ''; // Clear existing rows

            data.forEach(client => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${client.id}</td>
                    <td>${client.license_plate}</td>
                    <td>${client.client_name}</td>
                    <td>${client.parking_slot}</td>
                    <td>${client.start_time}</td>
                    <td>${client.end_time ? client.end_time : 'In Progress'}</td>
                    <td>${client.parking_fee ? `₱${client.parking_fee.toFixed(2)}` : 'Calculating...'}</td>
					<td>${client.payment ? client.payment : 'Unknown'}</td>
                `;

                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching client data:', error));
}
