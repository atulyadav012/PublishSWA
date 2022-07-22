export const CommonConstant = {
    FILE_LENGTH: 5,

    ALLOWED_FILE_TYPES: ['docx', 'xlsx', 'pdf', 'jpeg', 'zip', 'jpg', 'png', 'doc'],

    RESPONSE_MESSAGES: {
        FILE_TYPE_ERROR: 'This file type is not allowed.',
        FIEL_LENGTH_ERROR: 'Can not upload more than 5 Files.',
        FILE_SIZE_ERROR: 'File size should be less than 10 MB.',
        MB_SIZE : 10485760 // for 10 MB
    },
    PROFILE_MESSAGES:{
        SELECT_PAYMENT_ERROR: 'Please select Payment Method Type.',
        SELECT_BUSINESS_ERROR:'Please select Business Type.',
        ALL_REQUIRED_ERROR: 'Please fill all the required fields.',
        SELECT_BARNO_ERROR: 'Please Enter at least one bar number.'
    }
}