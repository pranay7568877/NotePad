function addTicket() {
  var ticketNumberInput = document.getElementById("ticketNumberInput");
  var ticketDetailsInput = document.getElementById("ticketDetailsInput");
  var fileInput = document.getElementById("fileInput");

  var formData = new FormData();
  formData.append("ticketNumber", ticketNumberInput.value);
  formData.append("ticketDetails", ticketDetailsInput.value);
  formData.append("file", fileInput.files[0]);

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/api/tickets", true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      clearFields();
      getTickets();
    } else {
      console.error("Error adding ticket:", xhr.responseText);
    }
  };
  xhr.send(formData);
}

function cancelTicket() {
  clearFields();
}

function clearFields() {
  var ticketNumberInput = document.getElementById("ticketNumberInput");
  var ticketDetailsInput = document.getElementById("ticketDetailsInput");
  var fileInput = document.getElementById("fileInput");

  ticketNumberInput.value = "";
  ticketDetailsInput.value = "";
  fileInput.value = "";
}

function getTickets() {
  var ticketList = document.getElementById("ticketList");

  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/api/tickets", true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      var tickets = JSON.parse(xhr.responseText);
      ticketList.innerHTML = "";

      tickets.forEach(function (ticket) {
        var ticketDiv = document.createElement("div");
        ticketDiv.className = "ticket";
        ticketDiv.innerHTML = `
          <p><strong>Ticket Number:</strong> ${ticket.ticketNumber}</p>
          <p><strong>Ticket Details:</strong> ${ticket.ticketDetails}</p>
          ${ticket.image ? `<img src="uploads/${ticket.image}" alt="Ticket Image">` : ""}
          <button onclick="editTicket('${ticket._id}')">Edit</button>
        `;
        ticketList.appendChild(ticketDiv);
      });
    } else {
      console.error("Error retrieving tickets:", xhr.responseText);
    }
  };
  xhr.send();
}

function editTicket(ticketId) {
  // Implement the logic for editing a ticket
  console.log(`Editing ticket with ID ${ticketId}`);
}

getTickets();
