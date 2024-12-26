import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
  userName: Yup.string()
    .min(2, 'Username must be at least 2 characters')
    .max(25, 'Username must not exceed 25 characters')
    .required('Username is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default LoginSchema;
