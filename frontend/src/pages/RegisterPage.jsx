import PropTypes from 'prop-types';
import RegisterForm from '../components/RegisterForm';

function RegisterPage() {
  return (
    <div className="register-page">
      <div className="page-container">
        <RegisterForm />
      </div>
    </div>
  );
}

RegisterPage.PropTypes = {};

export default RegisterPage;
