import PropTypes from 'prop-types';
import LoginForm from '../components/LoginForm';

function LoginPage() {
  return (
    <div className="login-page">
      <div className="page-container">
        <LoginForm />
      </div>
    </div>
  );
}

LoginPage.PropTypes = {};

export default LoginPage;
