// Get promise for GET request
const get = (url) => {
  return new Promise((resolve, reject) => {
    $.get(url).done(resolve).fail(reject);
  });
};

// Get promise for POST request
const post = (url, data) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: resolve,
      error: reject,
    });
  });
};

// combine times object into a string
const formatTime = (timeObj) => {
  return Object.values(timeObj)
    .filter((time) => time)
    .join(', ');
};

const addIntoTable = (items) => {
  $('#card-section').empty();
  const today = new Date();
  for (const medicationName in items) {
    if (items.hasOwnProperty(medicationName)) {
      const item = items[medicationName];
      const itemString = encodeURIComponent(JSON.stringify(item));
      const startDate = new Date(item.start_date);
      const endDate = new Date(item.end_date);
      let status;

      if (endDate < today) {
        status = 'Completed';
      } else if (startDate > today) {
        status = 'Pending';
      } else {
        status = 'Ongoing';
      }

      let itemToAppend =
        `<tr><td>${item.medication_name}</td>` +
        `<td>${item.dosage}</td>` +
        `<td>${item.frequency}</td>` +
        `<td>${startDate.toLocaleDateString()}</td>` +
        `<td>${endDate.toLocaleDateString()}</td>` +
        `<td>${formatTime(item.time)}</td>` +
        `<td><span class="status-${status
          .toLowerCase()
          .replace(' ', '-')}"">${status}</span></td>` +
        `<td><a onclick="openEditModal('${itemString}')"><i class="material-icons grey-text text-darken-1 edit-icon">edit</i></a>` +
        `<a onclick="deleteMed('${item._id}')"><i class="material-icons red-text delete-icon">delete</i></a></td></tr>`;
      $('#card-section').append(itemToAppend);
    }
  }
};

const validateForm = async (modalId) => {
  // Validate inputs
  const med_id = $(modalId + ' #med_id').val();
  const medication_name = $(modalId + ' #med_name').val();
  const dosage = $(modalId + ' #dosage').val();
  const frequency = $(modalId + ' #frequency').val();
  const time1 = $(modalId + ' #time1').val();
  const time2 = $(modalId + ' #time2').val() ?? '';
  const time3 = $(modalId + ' #time3').val() ?? '';
  const time4 = $(modalId + ' #time4').val() ?? '';
  const start_date = $(modalId + ' #start_date').val();
  const end_date = $(modalId + ' #end_date').val();

  // Check if all required fields are filled
  if (
    !medication_name ||
    !dosage ||
    !frequency ||
    !time1 ||
    !start_date ||
    !end_date
  ) {
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
    end_date: end_date,
  };

  return formData;
};

const getMedications = async () => {
  try {
    const res = await get('/medManager/getMeds');
    addIntoTable(res.data);
  } catch (err) {
    console.error('Error getting medications:', err);
  }
};

const addNewMedication = async () => {
  const formData = await validateForm('#addModal');
  if (formData == null) {
    return;
  }

  try {
    const result = await post('/medManager/addMed', formData);
    alert(result.message);
    $('#addModal').modal('close');
    getMedications();
  } catch (err) {
    console.error('Error adding medication:', err);
  }
};

const editMedication = async () => {
  const formData = await validateForm('#editModal');
  if (formData == null) {
    return;
  }

  try {
    const result = await post('/medManager/editMed', formData);
    await alert(result.message);
    $('#editModal').modal('close');
    getMedications();
  } catch (err) {
    console.error('Error editing medication:', err);
  }
};

const downloadpdf = () => {
  var doc = new jsPDF();

  // Add title
  doc.setFontSize(16);
  doc.text('Medication Records', 14, 15);

  // Add patient
  doc.setFontSize(12);
  doc.text('Patient: John Doe', 14, 25);

  doc.autoTable({
    html: '#table',
    startY: 35,
  });

  return doc;
};

const deleteMed = async (medication_id) => {
  if (prompt("Type 'delete' to remove this medication data:") == 'delete') {
    try {
      const result = await post('/medManager/deleteMed', {
        _id: medication_id,
      });
      alert(result.message);
      $('#addModal').modal('close');
      getMedications();
    } catch (err) {
      console.error('Error adding medication:', err);
    }
  } else {
    alert('Unsuccessful deletion.');
  }
};

const openEditModal = (itemString) => {
  const item = JSON.parse(decodeURIComponent(itemString));

  $('#editModal #med_id').val(item._id);
  $('#editModal #med_name').val(item.medication_name);
  $('#editModal #dosage').val(item.dosage);
  $('#editModal #frequency').val(item.frequency).formSelect();
  $('#editModal #start_date').val(formatDate(item.start_date));
  $('#editModal #end_date').val(formatDate(item.end_date));

  var timeInputs = $('#editModal #timeInputs');
  timeInputs.empty();

  var numberOfTimes = 0;
  switch (item.frequency) {
    case 'Once a day':
      numberOfTimes = 1;
      break;
    case 'Twice a day':
      numberOfTimes = 2;
      break;
    case 'Three times a day':
      numberOfTimes = 3;
      break;
    case 'Four times a day':
      numberOfTimes = 4;
      break;
  }

  for (var i = 1; i <= numberOfTimes; i++) {
    var timeKey = 'time' + i;
    var time = item.time[timeKey] || '';
    timeInputs.append(`
            <div class="input-field col s12">
                <input type="time" id="time${i}" name="time${i}" class="validate" value="${time}" required/>
                <label for="time${i}"><b>Time ${i}</b></label>
            </div>
        `);
  }

  $('select').formSelect();

  // prevent value and label do not overlap
  $('#editModal #med_name').next('label').addClass('active');
  $('#editModal #dosage').next('label').addClass('active');
  $('#editModal #start_date').next('label').addClass('active');
  $('#editModal #end_date').next('label').addClass('active');

  $('#editModal').modal('open');
};

document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
  });
  calendar.render();
});

const sendEmail = async () => {
  // the medication record pdf is converted to base64 string to send it to the server
  const pdfBase64 = downloadpdf().output('datauristring');

  try {
    // send the base64 pdf data to the server
    const result = await post('/medManager/sendEmail', { pdf: pdfBase64 });
    alert(result.message);
    console.log('Email sent with attachment');
  } catch (err) {
    console.error('Error sending email:', err);
  }
};

$(document).ready(function () {
  $('#downloadbtn').click(() => {
    downloadpdf().save('medication_records.pdf');
  });
  getMedications();
  $('#addModal #formSubmit').click(() => {
    addNewMedication();
  });
  $('#editModal #formSubmit').click(() => {
    editMedication();
  });
  $('#sendEmail').click(() => {
    sendEmail();
  });
});
