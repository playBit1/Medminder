// get promise
const get = (url) => {
    return new Promise((resolve, reject) => {
        $.get(url)
            .done(resolve)
            .fail(reject)
    })
}

// post promise 
const post = (url, data) => {
    return new Promise((resolve, reject) => {
        $.post(url, data)
            .done(resolve)
            .fail(reject);
    });
};

// combine times object into a string
const formatTime = (timeObj) => {
    return Object.values(timeObj).filter(time => time).join(', ');
};

const addIntoTable = (items) => {
    $("#card-section").empty();
    for (const medicationName in items) {
        if (items.hasOwnProperty(medicationName)) {
            const item = items[medicationName];
            const itemString = encodeURIComponent(JSON.stringify(item));
            let itemToAppend = 
                `<tr data-id="${item._id}"><td>${item.medication_name}</td>` +
                `<td>${item.dosage}</td>` +
                `<td>${item.frequency}</td>` +
                `<td>${new Date(item.start_date).toLocaleDateString()}</td>` +
                `<td>${new Date(item.end_date).toLocaleDateString()}</td>` +
                `<td>${formatTime(item.time)}</td>` +
                `<td><span class="status-ongoing">Ongoing</span></td>` +
                `<td><a onclick="openEditModal('${itemString}')"><i class="material-icons grey-text text-darken-1 edit-icon">edit</i></a>` +
                `<a><i class="material-icons red-text delete-icon">delete</i></a></td></tr>`;
            $("#card-section").append(itemToAppend);
        }
    }
};

// testing purposes: to be deleted
const login = () => {
    const data = {
        user_email : "john.doe@example.com", 
        user_password: "password123"
    };

    $.post('/auth/login', data, async (response) => {
        if (response.statusCode == 201) {
            console.log('Medication added successfully:', response.data);
            await alert('Medication added successfully');
        } else {
            console.error('Error adding medication:', response.message);
            await alert('Error adding medication');
        }
    });
}

const getMedications = async () => {
    try {
        const res = await get('/medManager/getMeds');
        addIntoTable(res.data);
    } catch (err) {
        console.error('Error getting medications:', err);
    }
};

async function validateForm(modalId) {
    // Validate inputs
    const med_id = $(modalId + ' #med_id').val();
    const medication_name = $(modalId + ' #med_name').val();
    const dosage = $(modalId + ' #dosage').val();
    const frequency = $(modalId + ' #frequency').val();
    const time1 = $(modalId + ' #time1').val();
    const time2 = $(modalId + ' #time2').val() ?? "";
    const time3 = $(modalId + ' #time3').val() ?? "";
    const time4 = $(modalId + ' #time4').val() ?? "";
    const start_date = $(modalId + ' #start_date').val();
    const end_date = $(modalId + ' #end_date').val();

    // Check if all required fields are filled
    if (!medication_name || !dosage || !frequency || !time1 || !start_date || !end_date) {
        alert('Please fill in all required fields.');
        return;
    }

    const formData = {
        _id: med_id,
        medication_name: medication_name,
        dosage: dosage,
        frequency: frequency,
        time1: time1,
        time2: time2,
        time3: time3,
        time4: time4,
        start_date: start_date,
        end_date: end_date
    };

    return formData;
}

const addNewMedication = async () => {

    const formData = await validateForm("#addModal");
    if (formData == null) {
        return;
    }
    console.log(formData);

    try {
        const result = await post('/medManager/addMed', formData);
        alert(result.message);
        $('#addModal').modal('close');
        getMedications();
    } catch (err) {
        console.error('Error adding medication:', err);
    }
}

const editMedication = async () => {
    const formData = await validateForm("#editModal");

    try {
        const result = await post('/medManager/editMed', formData);
        await alert(result.message);
        $('#editModal').modal('close');
        getMedications();
    } catch (err) {
        console.error('Error editing medication:', err);
        await alert('Error editing medication');
    }
}

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

$(document).ready(function() { 
    $('#downloadbtn').click(()=>{ 
        downloadpdf();
    });
    login();    // to be deleted
    getMedications();
    $('#addModal #formSubmit').click(()=>{ 
        addNewMedication();
    });
    $('#editModal #formSubmit').click(() => {
        editMedication();
    })
});