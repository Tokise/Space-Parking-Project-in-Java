// Function to create a 10x10 parking slot grid
function generateParkingGrid() {
    const gridContainer = document.getElementById('slot-grid');
    const rows = 10;
    const cols = 10;
    let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''); // Alphabet for the columns (A-Z)
    
    // Create the grid
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let slotId = `${alphabet[j]}${i + 1}`; // Slot ID like A1, B2, etc.
            let slot = document.createElement('div');
            slot.textContent = slotId;
            slot.classList.add('grid-item'); // Add a common grid-item class for styling
            slot.dataset.slotId = slotId; // Store the slotId in the data attribute
            slot.addEventListener('click', handleSlotClick); // Add click event for selecting the slot
            gridContainer.appendChild(slot);
        }
    }
}

// Function to handle click event on the slot
function handleSlotClick(event) {
    const selectedSlot = event.target;

    // Check if the slot is occupied
    if (selectedSlot.classList.contains('occupied')) {
        alert('This slot is already occupied. Please select another one.');
    } else {
        // If not occupied, mark the slot as selected (you can add your own class here to highlight selected slot)
        selectedSlot.classList.add('selected');
        // Store the selected slot in a global variable or update a hidden form field to submit with the form
        document.getElementById('selected-slot').value = selectedSlot.dataset.slotId;
    }
}

// Function to fetch parking slot status and update the grid
function fetchParkingSlotStatus() {
    // Fetch data from the server (GET request to the servlet endpoint)
    fetch('user-data')  // The endpoint that returns the client parking slot data
        .then(response => response.json())
        .then(data => {
            // Loop through each client in the data
            data.forEach(client => {
                const parkingSlot = client.parking_slot; // Get parking slot from client data
                
                if (parkingSlot) {
                    // Find the corresponding grid item by its data-slot-id attribute (e.g., A1, B2, etc.)
                    const slotElement = document.querySelector(`[data-slot-id="${parkingSlot}"]`);
                    
                    if (slotElement) {
                        // Mark the slot as occupied (add 'occupied' class which will make it red)
                        slotElement.classList.add('occupied');
                    }
                }
            });

            // Re-enable clicking on available slots
            enableAvailableSlots();
        })
        .catch(error => {
            console.error('Error fetching parking slot data:', error);
        });
}

// Function to enable available slots for clicking
function enableAvailableSlots() {
    const slots = document.querySelectorAll('.grid-item');
    slots.forEach(slot => {
        if (!slot.classList.contains('occupied')) {
            slot.classList.remove('selected'); // Remove any previous selection
            slot.addEventListener('click', handleSlotClick); // Re-attach click event
        }
    });
}

// Function to handle form submission (submit client data)
function handleFormSubmission(event) {
    event.preventDefault();  // Prevent form from submitting normally

    // Get form data
    const form = document.getElementById('client-form');
    const formData = new FormData(form);

    // Send the form data to the server
    fetch(form.action, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // On success, update the slot grid
        alert('Client added successfully!');
        
        // Re-fetch the slot data to update the grid
        fetchParkingSlotStatus();

        // Optionally, reset the form or selected slot
        form.reset();
    })
    .catch(error => {
        console.error('Error submitting form:', error);
        alert('There was an error processing the form.');
    });
}

// Execute grid generation and slot fetching when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    generateParkingGrid(); // Generate the parking slots grid
    fetchParkingSlotStatus(); // Fetch and update the status of the slots (occupied or available)

    // Attach form submit handler
    const form = document.getElementById('parking-form');
    form.addEventListener('submit', handleFormSubmission);
});
