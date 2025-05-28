import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  oldPassword: Yup.string().required('Old Password Is Required'),
  newPassword: Yup.string().min(6, 'New Password must be at least 6 characters').required('New Password Is Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm Password Is Required'),
});

export default validationSchema;
