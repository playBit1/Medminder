function clearForm(modalId) {
  $('#' + modalId + ' input, #' + modalId + ' select').val('');
  $('#' + modalId + ' select').formSelect();
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();

  today = yyyy + '-' + mm + '-' + dd;

  document.getElementById('start_date').setAttribute('min', today);
  document.getElementById('end_date').setAttribute('min', today);

  $('#timeInputs').empty();
}

function initializeModal(modalId, modalHeader) {
  $('body').append(`
        <div id="${modalId}" class="modal modal-fixed-footer">
            <div class="row modal-content">
                <form class="col s12">
                    <div class="col s12">
                        <h5 class="addmed-header">${modalHeader}</h5>
                    </div>
                    <input id="med_id" type="text" hidden>
                    <div class="input-field col s12">
                        <input id="med_name" type="text" class="validate" required>
                        <label for="med_name"><b>Medication Name</b></label>
                    </div>
                    <div class="input-field col s12">
                        <input id="dosage" type="text" class="validate" required>
                        <label for="dosage"><b>Dosage</b></label>
                    </div>
                    <div class="input-field col s12">
                        <select id="frequency" required>
                            <option value="" disabled selected>Choose your option</option>
                            <option value="Once a day">Once a day</option>
                            <option value="Twice a day">Twice a day</option>
                            <option value="Three times a day">Three times a day</option>
                            <option value="Four times a day">Four times a day</option>
                        </select>
                        <label><b>Frequency</b></label>
                    </div>
                    <div id="timeInputs" class="input-field col s12"></div>
                    <div class="input-field col s12">
                        <input type="date" id="start_date" class="validate" name="start_date" required/>
                        <label for="start_date"><b>Start Date</b></label>
                    </div>
                    <div class="input-field col s12">
                        <input type="date" id="end_date" class="validate" name="end_date" required/>
                        <label for="end_date"><b>End Date</b></label>
                    </div>
                    <div class="row center-align">
                        <a href="#!" class="modal-close btn cancel-btn">Cancel</a>
                        <a href="#!" class="btn add-btn" id="formSubmit">Submit</a>
                    </div>
                </form>
            </div>
        </div> 
    `);
  $('select').formSelect();

  // Initialize the modal
  $('#' + modalId).modal();
}

function openModal(modalId) {
  clearForm(modalId);
  $('#' + modalId).modal('open');
}

function updateTimesInput(modalId) {
  var frequency = $('#' + modalId + ' #frequency').val();
  var timeInputs = $('#' + modalId + ' #timeInputs');
  timeInputs.empty();

  var numberOfTimes = 0;
  switch (frequency) {
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
    timeInputs.append(`
            <div class="input-field col s12">
                <input type="time" id="time${i}" name="time${i}" class="validate" required/>
                <label for="time${i}"><b>Time ${i}</b></label>
            </div>
        `);
  }

  $('select').formSelect();
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

$(document).ready(function () {
  initializeModal('addModal', 'Add Medication');
  initializeModal('editModal', 'Edit Medication');
  $('.modal').modal();
  $('select').formSelect();
  $('#addModal #frequency').on('change', function () {
    updateTimesInput('addModal');
  });
  $('#editModal #frequency').on('change', function () {
    updateTimesInput('editModal');
  });
});
