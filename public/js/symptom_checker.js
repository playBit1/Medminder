let symptomList = [];
let previousSubmittedSymptoms = [];

$(document).ready(function () {
  $('input.autocomplete').autocomplete({
    data: autocompleteData,
    onAutocomplete: function (symptom) {
      createChip(symptom);
      $('#autocomplete-input').val('');
    },
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const inputField = document.getElementById('autocomplete-input');
  inputField.addEventListener('keydown', handleInputKeyDown);
});

document.addEventListener('DOMContentLoaded', function () {
  const nextButton = document.getElementById('submit-symptoms');
  nextButton.addEventListener('click', submitSymptoms);
});

function addSymptomToList(symptom) {
  const lowercaseSymptom = symptom.toLowerCase().replace(/ /g, '_');
  if (!symptomList.includes(lowercaseSymptom)) {
    symptomList.push(lowercaseSymptom);
    console.log(symptomList);
  }
}

function handleInputKeyDown(event) {
  if (event.key === 'Enter') {
    const symptomText = event.target.value.trim();
    if (
      Object.keys(diseaseEmojis).find(
        (element) => element == symptomText.toLowerCase()
      )
    ) {
      createChip(symptomText);
      event.target.value = '';
    } else {
      alert('Please select a symptom from the drop-down list!');
    }
  }
}

function createChip(symptomText) {
  const chipContainer = document.getElementById('symptoms');
  const lowercaseSymptom = symptomText.toLowerCase().replace(/ /g, '_');

  if (!symptomList.includes(lowercaseSymptom)) {
    const sympChip = document.createElement('div');
    sympChip.classList.add('chip');
    sympChip.textContent = `${
      diseaseEmojis[symptomText.toLowerCase()] || ''
    } ${symptomText}`;

    const closeIcon = document.createElement('i');
    closeIcon.classList.add('close', 'material-icons');
    closeIcon.textContent = 'close';
    closeIcon.addEventListener('click', () => {
      chipContainer.removeChild(sympChip);
      symptomList = symptomList.filter(
        (symptom) => symptom !== lowercaseSymptom
      );
    });

    sympChip.appendChild(closeIcon);
    chipContainer.appendChild(sympChip);
    addSymptomToList(lowercaseSymptom);
  }
}

function createDiagnosis(result) {
  const diagnosisContainer = document.getElementById('diagnosis-results');
  const diagnosisItemsContainer = document.createElement('div');
  diagnosisItemsContainer.classList.add('diagnosis-items-container');

  const diagnosisItem = document.createElement('div');
  diagnosisItem.classList.add('diagnosis-item');

  const diagnosisItemHead = document.createElement('div');
  diagnosisItemHead.classList.add('diagnosis-item-head');

  const diagnosisItemHeading = document.createElement('p');
  diagnosisItemHeading.classList.add('diagnosis-item-heading');
  diagnosisItemHeading.textContent = 'Diagnosis';

  const closeIcon = document.createElement('i');
  closeIcon.classList.add('material-icons', 'diagnosis-item-button');
  closeIcon.textContent = 'close';

  closeIcon.addEventListener('click', () => {
    diagnosisItem.remove();
  });

  diagnosisItemHead.appendChild(diagnosisItemHeading);
  diagnosisItemHead.appendChild(closeIcon);

  const diagnosisItemBodyDisease = document.createElement('p');
  diagnosisItemBodyDisease.classList.add('diagnosis-item-body-disease');
  const boldDisease = document.createElement('strong');
  boldDisease.textContent = result['disease'];
  diagnosisItemBodyDisease.textContent = 'You might have: ';
  diagnosisItemBodyDisease.appendChild(boldDisease);

  const diagnosisItemBodySymptoms = document.createElement('p');
  diagnosisItemBodySymptoms.classList.add('diagnosis-item-body-symptoms');

  const symptomsWithSpaces = symptomList.map((symptom) =>
    symptom.replace(/_/g, ' ')
  );
  diagnosisItemBodySymptoms.textContent = `Entered Symptoms: ${symptomsWithSpaces.join(
    ', '
  )}`;

  diagnosisItem.appendChild(diagnosisItemHead);
  diagnosisItem.appendChild(diagnosisItemBodyDisease);
  diagnosisItem.appendChild(diagnosisItemBodySymptoms);

  diagnosisItemsContainer.prepend(diagnosisItem);

  if (diagnosisItemsContainer.children.length > 3) {
    diagnosisContainer.replaceChild(
      diagnosisItemsContainer,
      diagnosisContainer.firstChild
    );
  } else {
    diagnosisContainer.prepend(diagnosisItemsContainer);
  }
}

function submitSymptoms() {
  if (symptomList.length === 0) {
    alert('Please enter at least one symptom.');
    return;
  }

  if (
    previousSubmittedSymptoms.length === symptomList.length &&
    previousSubmittedSymptoms.every(
      (value, index) => value === symptomList[index]
    )
  ) {
    alert(
      'You have already submitted these symptoms. Please enter new symptoms or modify the existing ones.'
    );
    return;
  }

  const data = { symptoms: symptomList };

  $.ajax({
    url: 'http://20.92.138.252:3004/predict',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(data),
    success: function (result) {
      console.log('Success:', result);
      createDiagnosis(result);
      previousSubmittedSymptoms = [...symptomList]; // Update the previousSubmittedSymptoms array
    },
    error: function (error) {
      console.error('Error:', error);
    },
  });
}

const diseaseEmojis = {
  itching: '💉',
  'skin rash': '🌺',
  'nodal skin eruptions': '🔴',
  'continuous sneezing': '💨',
  shivering: '🥶',
  chills: '☃️',
  'joint pain': '🦴',
  'stomach pain': '😖',
  acidity: '🍋',
  'ulcers on tongue': '👅',
  'muscle wasting': '💪',
  vomiting: '🤮',
  'burning micturition': '🔥',
  'spotting urination': '💦',
  fatigue: '😫',
  'weight gain': '⬆️',
  anxiety: '😰',
  'cold hands and feets': '🥶',
  'mood swings': '🎭',
  'weight loss': '⬇️',
  restlessness: '🏃',
  lethargy: '😴',
  'patches in throat': '👄',
  'irregular sugar level': '🍭',
  cough: '💨',
  'high fever': '🔥',
  'sunken eyes': '😔',
  breathlessness: '😮‍💨',
  sweating: '💦',
  dehydration: '🥤',
  indigestion: '🍽️',
  headache: '🤕',
  'yellowish skin': '👻',
  'dark urine': '🟤',
  nausea: '🤢',
  'loss of appetite': '🍽️',
  'pain behind the eyes': '👀',
  'back pain': '🦴',
  constipation: '💩',
  'abdominal pain': '😖',
  diarrhoea: '💩',
  'mild fever': '🌡️',
  'yellow urine': '🟡',
  'yellowing of eyes': '👀',
  'acute liver failure': '🫀',
  'fluid overload': '💧',
  'swelling of stomach': '🤰',
  'swelled lymph nodes': '🩸',
  malaise: '😷',
  'blurred and distorted vision': '👓',
  phlegm: '🤧',
  'throat irritation': '👄',
  'redness of eyes': '👀',
  'sinus pressure': '🫁',
  'runny nose': '🤧',
  congestion: '🫁',
  'chest pain': '🫁',
  'weakness in limbs': '💪',
  'fast heart rate': '💓',
  'pain during bowel movements': '💩',
  'pain in anal region': '🍑',
  'bloody stool': '🩸',
  'irritation in anus': '🍑',
  'neck pain': '🦴',
  dizziness: '🌀',
  cramps: '😣',
  bruising: '🩹',
  obesity: '🚽',
  'swollen legs': '🦵',
  'swollen blood vessels': '💉',
  'puffy face and eyes': '😩',
  'enlarged thyroid': '🐘',
  'brittle nails': '💅',
  'swollen extremeties': '🦶',
  'excessive hunger': '🍽️',
  'extra marital contacts': '👫',
  'drying and tingling lips': '👄',
  'slurred speech': '🗣️',
  'knee pain': '🦵',
  'hip joint pain': '🦴',
  'muscle weakness': '💪',
  'stiff neck': '🦴',
  'swelling joints': '🤖',
  'movement stiffness': '🤖',
  'spinning movements': '🌀',
  'loss of balance': '🤸',
  unsteadiness: '🚶‍♂️',
  'weakness of one body side': '🙍',
  'loss of smell': '👃',
  'bladder discomfort': '🚽',
  'foul smell of urine': '👃',
  'continuous feel of urine': '💦',
  'passage of gases': '💨',
  'internal itching': '🕷️',
  'toxic look (typhos)': '☠️',
  depression: '😔',
  irritability: '😠',
  'muscle pain': '💪',
  'altered sensorium': '🧠',
  'red spots over body': '🔴',
  'belly pain': '😖',
  'abnormal menstruation': '🩸',
  'dischromic patches': '🌑',
  'watering from eyes': '😢',
  'increased appetite': '🍽️',
  polyuria: '💦',
  'family history': '👪',
  'mucoid sputum': '🤮',
  'rusty sputum': '🤮',
  'lack of concentration': '🧠',
  'visual disturbances': '👓',
  'receiving blood transfusion': '💉',
  'receiving unsterile injections': '💉',
  coma: '😵',
  'stomach bleeding': '🩸',
  'distention of abdomen': '🤰',
  'history of alcohol consumption': '🍺',
  'fluid overload.1': '💧',
  'blood in sputum': '🤮',
  'prominent veins on calf': '💉',
  palpitations: '💓',
  'painful walking': '🚶‍♂️',
  'pus filled pimples': '🤢',
  blackheads: '⚫',
  scurring: '🌺',
  'skin peeling': '🧖',
  'silver like dusting': '✨',
  'small dents in nails': '💅',
  'inflammatory nails': '💅',
  blister: '🔴',
  'red sore around nose': '👃',
  'yellow crust ooze': '🤮',
};

//Materialze Autocomplte requires null values so data object is replicated without emojis
const autocompleteData = {
  Itching: null,
  'Skin rash': null,
  'Nodal skin eruptions': null,
  'Continuous sneezing': null,
  Shivering: null,
  Chills: null,
  'Joint pain': null,
  'Stomach pain': null,
  Acidity: null,
  'Ulcers on tongue': null,
  'Muscle wasting': null,
  Vomiting: null,
  'Burning micturition': null,
  'Spotting urination': null,
  Fatigue: null,
  'Weight gain': null,
  Anxiety: null,
  'Cold hands and feets': null,
  'Mood swings': null,
  'Weight loss': null,
  Restlessness: null,
  Lethargy: null,
  'Patches in throat': null,
  'Irregular sugar level': null,
  Cough: null,
  'High fever': null,
  'Sunken eyes': null,
  Breathlessness: null,
  Sweating: null,
  Dehydration: null,
  Indigestion: null,
  Headache: null,
  'Yellowish skin': null,
  'Dark urine': null,
  Nausea: null,
  'Loss of appetite': null,
  'Pain behind the eyes': null,
  'Back pain': null,
  Constipation: null,
  'Abdominal pain': null,
  Diarrhoea: null,
  'Mild fever': null,
  'Yellow urine': null,
  'Yellowing of eyes': null,
  'Acute liver failure': null,
  'Fluid overload': null,
  'Swelling of stomach': null,
  'Swelled lymph nodes': null,
  Malaise: null,
  'Blurred and distorted vision': null,
  Phlegm: null,
  'Throat irritation': null,
  'Redness of eyes': null,
  'Sinus pressure': null,
  'Runny nose': null,
  Congestion: null,
  'Chest pain': null,
  'Weakness in limbs': null,
  'Fast heart rate': null,
  'Pain during bowel movements': null,
  'Pain in anal region': null,
  'Bloody stool': null,
  'Irritation in anus': null,
  'Neck pain': null,
  Dizziness: null,
  Cramps: null,
  Bruising: null,
  Obesity: null,
  'Swollen legs': null,
  'Swollen blood vessels': null,
  'Puffy face and eyes': null,
  'Enlarged thyroid': null,
  'Brittle nails': null,
  'Swollen extremeties': null,
  'Excessive hunger': null,
  'Extra marital contacts': null,
  'Drying and tingling lips': null,
  'Slurred speech': null,
  'Knee pain': null,
  'Hip joint pain': null,
  'Muscle weakness': null,
  'Stiff neck': null,
  'Swelling joints': null,
  'Movement stiffness': null,
  'Spinning movements': null,
  'Loss of balance': null,
  Unsteadiness: null,
  'Weakness of one body side': null,
  'Loss of smell': null,
  'Bladder discomfort': null,
  'Foul smell of urine': null,
  'Continuous feel of urine': null,
  'Passage of gases': null,
  'Internal itching': null,
  'Toxic look (typhos)': null,
  Depression: null,
  Irritability: null,
  'Muscle pain': null,
  'Altered sensorium': null,
  'Red spots over body': null,
  'Belly pain': null,
  'Abnormal menstruation': null,
  'Dischromic patches': null,
  'Watering from eyes': null,
  'Increased appetite': null,
  Polyuria: null,
  'Family history': null,
  'Mucoid sputum': null,
  'Rusty sputum': null,
  'Lack of concentration': null,
  'Visual disturbances': null,
  'Receiving blood transfusion': null,
  'Receiving unsterile injections': null,
  Coma: null,
  'Stomach bleeding': null,
  'Distention of abdomen': null,
  'History of alcohol consumption': null,
  'Fluid overload.1': null,
  'Blood in sputum': null,
  'Prominent veins on calf': null,
  Palpitations: null,
  'Painful walking': null,
  'Pus filled pimples': null,
  Blackheads: null,
  Scurring: null,
  'Skin peeling': null,
  'Silver like dusting': null,
  'Small dents in nails': null,
  'Inflammatory nails': null,
  Blister: null,
  'Red sore around nose': null,
  'Yellow crust ooze': null,
};
