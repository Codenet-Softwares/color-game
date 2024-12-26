import * as Yup from 'yup';

// used for error messages in ResetPasswordSchema
const passwordErrorMessage = {
  length: 'Password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.',
  uppercase: 'Password must include at least 1 uppercase letter.',
  lowercase: 'Password must include at least 1 lowercase letter.',
  number: 'Password must include at least 1 number.',
  special: 'Password must include at least 1 special character (@, $, !, %, *, ?, &). An example of a valid password is: "Password123@',
};

// Forgot Password Schema
export const ForgotPasswordSchema = Yup.object().shape({
  oldPassword: Yup.string().required('Old Password is required'),
  newPassword: Yup.string().min(8, 'New Password must be at least 8 characters').required('New Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

// Login Schema
export const LoginSchema = Yup.object().shape({
  userName: Yup.string()
    .min(2, 'Username must be at least 2 characters')
    .max(25, 'Username must not exceed 25 characters')
    .required('Username is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

// Reset Password Schema
// export const ResetPasswordSchema = Yup.object().shape({
//   userName: Yup.string()
//     .min(2, 'Username must be at least 2 characters')
//     .max(25, 'Username must not exceed 25 characters')
//     .required('Username is required'),
// //   oldPassword: Yup.string()
// //     .required('New Password is required')
// //     .test('password-length', passwordErrorMessage.length, value => value && value.length >= 8)
// //     .test('password-uppercase', passwordErrorMessage.uppercase, value => value && /[A-Z]/.test(value))
// //     .test('password-lowercase', passwordErrorMessage.lowercase, value => value && /[a-z]/.test(value))
// //     .test('password-number', passwordErrorMessage.number, value => value && /\d/.test(value))
// //     .test('password-special', passwordErrorMessage.special, value => value && /[@$!%*?&]/.test(value)),
// oldPassword: Yup.string().required('Old Password is required'), 
// // newPassword: Yup.string().required('New Password is required'),
//  confirmPassword: Yup.string()
//     .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
//     .required('New Password is required'),
// });

// export const ResetPasswordSchema = Yup.object().shape({
//   userName: Yup.string()
//     .min(2, 'Username must be at least 2 characters')
//     .max(25, 'Username must not exceed 25 characters')
//     .required('Username is required'),
// //   oldPassword: Yup.string()
// //     .required('New Password is required')
// //     .test('password-length', passwordErrorMessage.length, value => value && value.length >= 8)
// //     .test('password-uppercase', passwordErrorMessage.uppercase, value => value && /[A-Z]/.test(value))
// //     .test('password-lowercase', passwordErrorMessage.lowercase, value => value && /[a-z]/.test(value))
// //     .test('password-number', passwordErrorMessage.number, value => value && /\d/.test(value))
// //     .test('password-special', passwordErrorMessage.special, value => value && /[@$!%*?&]/.test(value)),
// oldPassword: Yup.string().required('Old Password is required'), 
// // newPassword: Yup.string().required('New Password is required'),
//  confirmPassword: Yup.string()
//     .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
//     .required('New Password is required'),
// });

export const ResetPasswordSchema = Yup.object().shape({
  userName: Yup.string(),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .min(6, "Password should be at least 6 characters"),
  oldPassword: Yup.string(),
  newPassword: Yup.string()
    .min(6, "Password should be at least 6 characters")
    .required("New Password is required"),
});