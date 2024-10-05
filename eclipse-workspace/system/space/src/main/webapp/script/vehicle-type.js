document.addEventListener('DOMContentLoaded', () => {
    fetchClientData();
});

function fetchClientData() {
    fetch('vehicle-type')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Check if data is being logged correctly
            const tableBody = document.getElementById('clientTableBody');
            tableBody.innerHTML = ''; // Clear existing rows

            data.forEach(client => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${client.id}</td>
                    <td>${client.license_plate}</td>
                    <td>${client.client_name}</td>
                    <td>${client.client_type}</td>
					<td>${client.vehicle_type}</td>
                    <td>${client.contact_number}</td>
                `;

                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching client data:', error));
}
