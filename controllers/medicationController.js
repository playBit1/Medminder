const Medication = require('../models/Medication');

exports.getAllMedications = async (req, res) => {
    try {
        const medications = await Medication.find({});
        console.log('Medications fetched:', medications);
        res.render('dashboard/index', { medications });
    } catch (error) {
        console.error('Error fetching medications:', error.message);
        res.status(500).send({ message: error.message || "Error retrieving medications." });
    }
};

/*
exports.addMedication = async (req, res) => {
  const { name, dosage, startDate, endDate, intervalHours, pillCount} = req.body;
  const newMed = new Medication({ name, dosage, startDate, endDate, intervalHours, pillCount});
  try {
      await newMed.save();
      res.redirect('/medications/getPills');  // Redirecting to the route that displays all medications
  } catch (error) {
      res.status(500).send({ message: error.message || "An error occurred while adding the medication." });
  }
};

exports.updatePills = async (req, res) => {
  const { action, id } = req.body;
  const medication = await Medication.findById(id);
  if (!medication) {
      return res.status(404).send({ message: 'Medication not found' });
  }

  switch(action) {
      case 'taken':
          if (medication.pillCount > 0) {
              medication.pillCount -= 1;
              medication.status = medication.pillCount === 0 ? 'Completed' : 'In Progress';
          }
          break;
      case 'skip':
          // Optionally log this action or handle it accordingly
          break;
      case 'cancel':
          medication.status = 'Cancelled';
          break;
      default:
          return res.status(400).send({ message: 'Invalid action' });
  }

  await medication.save();
  res.json({ success: true, medication });
};
*/
