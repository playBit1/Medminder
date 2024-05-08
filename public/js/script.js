
$(document).ready(function() { 
    $('.modal').modal();    
    $('select').formSelect();
    initializeModal('addModal', "Add Medication");
    initializeModal('editModal', "Edit Medication");
    $('#downloadbtn').click(()=>{ 
        downloadpdf();
    })
});

function downloadpdf() {
    var doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text("Medication Records", 14, 15);
    
    // Add text
    doc.setFontSize(12);
    doc.text("Patient: John Doe", 14, 25); // Text position

    doc.autoTable({
        html: '#table',
        startY: 35
    })

    doc.save('table.pdf')
}
