
function registerForm() {
  let formData = {};
  formData.user_first_name = $('#first_name').val();
  formData.user_last_name = $('#last_name').val();
  formData.user_gender = $('#gender').val();
  formData.user_email = $('#email').val();
  formData.user_password = $('#password').val();
      
  console.log("Form Data Submitted: ", formData);
  postRegister(formData);
}

function postRegister(user) {
  $.ajax({
      url: '/registerUser',
      data: user,
      type: 'POST',
      success: (result) => {
          console.log(result.data);
          console.log('Data submitted successfully:', user); // Log the submitted data
          console.log('Server response:', result.data);
          location.reload();
      },
      error: (xhr, status, error) => {
          console.error('Error submitting data:', error); // Log any errors
          // Handle the error (e.g., show an error message to the user)
      }
  });
}

// function enablePath() {
//   document.getElementById('gender').disabled= "";
// }
// enablePath();

$(document).ready(function(){
  console.log('Click Event Test1');
  //$('.modal').modal();
  //$('#clickMeButton').click(()=>{});
  
  $('#registerSubmit').click(()=>{
    console.log('Click Event Test2');
      registerForm();
      
  });
  
});



/*


$(document).ready(function () {
  $('.modal').modal();
});

//Initialize the materialize autocomplete with diesease data
$(document).ready(function () {
  $('input.autocomplete').autocomplete({
    data: autocompleteData,
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const inputField = document.getElementById('autocomplete-input');
  inputField.addEventListener('keydown', handleInputKeyDown);
});

function handleInputKeyDown(event) {
  if (event.key === 'Enter') {
    const symptomText = event.target.value.trim();
    if (symptomText) {
      createChip(symptomText);
      event.target.value = '';
    }
  }
}

function createChip(symptomText) {
  const chipContainer = document.getElementById('symptoms');

  const sympChip = ` <div class="chip"> ${
    diseaseEmojis[symptomText.toLowerCase()]
      ? diseaseEmojis[symptomText.toLowerCase()]
      : ''
  } ${symptomText} <i class="close material-icons">close</i> </div>`;

  chipContainer.innerHTML += sympChip;
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

const autocompleteData = {
  itching: null,
  'skin rash': null,
  'nodal skin eruptions': null,
  'continuous sneezing': null,
  shivering: null,
  chills: null,
  'joint pain': null,
  'stomach pain': null,
  acidity: null,
  'ulcers on tongue': null,
  'muscle wasting': null,
  vomiting: null,
  'burning micturition': null,
  'spotting urination': null,
  fatigue: null,
  'weight gain': null,
  anxiety: null,
  'cold hands and feets': null,
  'mood swings': null,
  'weight loss': null,
  restlessness: null,
  lethargy: null,
  'patches in throat': null,
  'irregular sugar level': null,
  cough: null,
  'high fever': null,
  'sunken eyes': null,
  breathlessness: null,
  sweating: null,
  dehydration: null,
  indigestion: null,
  headache: null,
  'yellowish skin': null,
  'dark urine': null,
  nausea: null,
  'loss of appetite': null,
  'pain behind the eyes': null,
  'back pain': null,
  constipation: null,
  'abdominal pain': null,
  diarrhoea: null,
  'mild fever': null,
  'yellow urine': null,
  'yellowing of eyes': null,
  'acute liver failure': null,
  'fluid overload': null,
  'swelling of stomach': null,
  'swelled lymph nodes': null,
  malaise: null,
  'blurred and distorted vision': null,
  phlegm: null,
  'throat irritation': null,
  'redness of eyes': null,
  'sinus pressure': null,
  'runny nose': null,
  congestion: null,
  'chest pain': null,
  'weakness in limbs': null,
  'fast heart rate': null,
  'pain during bowel movements': null,
  'pain in anal region': null,
  'bloody stool': null,
  'irritation in anus': null,
  'neck pain': null,
  dizziness: null,
  cramps: null,
  bruising: null,
  obesity: null,
  'swollen legs': null,
  'swollen blood vessels': null,
  'puffy face and eyes': null,
  'enlarged thyroid': null,
  'brittle nails': null,
  'swollen extremeties': null,
  'excessive hunger': null,
  'extra marital contacts': null,
  'drying and tingling lips': null,
  'slurred speech': null,
  'knee pain': null,
  'hip joint pain': null,
  'muscle weakness': null,
  'stiff neck': null,
  'swelling joints': null,
  'movement stiffness': null,
  'spinning movements': null,
  'loss of balance': null,
  unsteadiness: null,
  'weakness of one body side': null,
  'loss of smell': null,
  'bladder discomfort': null,
  'foul smell of urine': null,
  'continuous feel of urine': null,
  'passage of gases': null,
  'internal itching': null,
  'toxic look (typhos)': null,
  depression: null,
  irritability: null,
  'muscle pain': null,
  'altered sensorium': null,
  'red spots over body': null,
  'belly pain': null,
  'abnormal menstruation': null,
  'dischromic patches': null,
  'watering from eyes': null,
  'increased appetite': null,
  polyuria: null,
  'family history': null,
  'mucoid sputum': null,
  'rusty sputum': null,
  'lack of concentration': null,
  'visual disturbances': null,
  'receiving blood transfusion': null,
  'receiving unsterile injections': null,
  coma: null,
  'stomach bleeding': null,
  'distention of abdomen': null,
  'history of alcohol consumption': null,
  'fluid overload.1': null,
  'blood in sputum': null,
  'prominent veins on calf': null,
  palpitations: null,
  'painful walking': null,
  'pus filled pimples': null,
  blackheads: null,
  scurring: null,
  'skin peeling': null,
  'silver like dusting': null,
  'small dents in nails': null,
  'inflammatory nails': null,
  blister: null,
  'red sore around nose': null,
  'yellow crust ooze': null,
};
*/