const addIntoTable = (items) => {
    // Iterate over the keys of the items object
    for (const medicationName in items) {
        if (items.hasOwnProperty(medicationName)) {
            const item = items[medicationName];
            let itemToAppend = 
                '<tr><td>' + item.medication_name + '</td>' +
                '<td>' + item.dosage + '</td>' +
                '<td>' + item.frequency + '</td>' +
                '<td>' + new Date(item.start_date).toLocaleDateString() + '</td>' +
                '<td>' + new Date(item.end_date).toLocaleDateString() + '</td>' +
                '<td>' + formatTime(item.time) + '</td>' +
                '<td><span class="status-ongoing">Ongoing</span></td>' +
                '<td><a onclick="openModal(\'editModal\')"><i class="material-icons grey-text text-darken-1 edit-icon">edit</i></a>' + 
                '<a><i class="material-icons red-text delete-icon">delete</i></a></td></tr>';
            $("#card-section").append(itemToAppend);
        }
    }
};

const getMedications = () => {
    // Make a request to the server to get the medication data
    $.get('/medManager/getMeds', (response) => {
        console.log(response); // Log the response to check its structure
        if (response.statusCode == 200) {
            // Display the medications in the table
            addIntoTable(response.data[3]);
        } else {
            console.error("Unexpected response format or status code:", response);
        }
    });
};

const formatTime = (timeObj) => {
    return Object.values(timeObj).filter(time => time).join(', ');
};

$(document).ready(function() { 
    $('.modal').modal();    
    $('select').formSelect();
    initializeModal('addModal', "Add Medication");
    initializeModal('editModal', "Edit Medication");
    $('#downloadbtn').click(()=>{ 
        downloadpdf();
    })
    getMedications();
});

function downloadpdf() {
    var doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text("Medication Records", 14, 15);
    
    // Add patient
    doc.setFontSize(12);
    doc.text("Patient: John Doe", 14, 25);

    doc.autoTable({
        html: '#table',
        startY: 35
    });

    doc.save('medication_records.pdf');
}
