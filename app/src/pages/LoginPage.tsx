import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import LoginModal from '../components/LoginModal';
import './AuthPage.css';

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <Header />
      <LoginModal isOpen={true} onClose={() => navigate('/')} />
    </div>
  );
};

export default LoginPage;
