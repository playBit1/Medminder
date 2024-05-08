let sampleSchema = {
    user_email: 'em',
    user_password: 'em',
    user_first_name: 'ee',
    user_last_name: 'ee',
    user_gender: 'Male || Female || Other || Prefer not to say',
    user_medication: {
        ex_med1: {
            dosage: "mg",
            frequency: "once a day || twice a day",
            time: {
                time1: '10:00 am'
            },
            start_date: '10/3/2023',
            end_date: '20/3/2023'
        }
    }
}
