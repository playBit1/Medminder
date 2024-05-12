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
}

function initializeModal(modalId, modalHeader) {
    $('body').append(`
        <div id="${modalId}" class="modal modal-fixed-footer">
            <div class="row modal-content">
                <form class="col s12">
                    <div class="col s12">
                        <h5 class="addmed-header">${modalHeader}</h5>
                    </div>
                    <div class="input-field col s12">
                        <input id="med_name" type="text" class="validate" required>
                        <label for="med_name"><b>Medication Name</b></label>
                    </div>
                    <div class="input-field col s12">
                        <input id="dosage" type="text" class="validate" required>
                        <label for="dosage"><b>Dosage</b></label>
                    </div>
                    <div class="input-field col s12">
                        <select required>
                            <option value="" disabled selected>Choose your option</option>
                            <option value="Once a day">Once a day</option>
                            <option value="Two times a day">Twice a day</option>
                            <option value="Three times a day ">Three times a day</option>
                            <option value="Four times a day ">Four times a day</option>
                        </select>
                        <label><b>Frequency</b></label>
                    </div>
                    <div class="input-field col s12">
                        <input type="time" id="time" name="time" class="validate" required/>
                        <label for="time"><b>Time</b></label>
                    </div>
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
                        <a href="#!" class="btn add-btn">Add</a>
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