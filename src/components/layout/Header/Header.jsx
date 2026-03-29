import DeviceStatus from '../../common/DeviceStatus/DeviceStatus';
import './Header.css';

const Header = ({ username, onLogout, deviceStatus }) => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <div className="logo-section">
            <div className="logo-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21c4.9706 0 9-4.0294 9-9s-4.0294-9-9-9-9 4.0294-9 9 4.0294 9 9 9Z" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M3 12h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M12 3c2.8 2.4 4.2 5.4 4.2 9s-1.4 6.6-4.2 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M12 3c-2.8 2.4-4.2 5.4-4.2 9s1.4 6.6 4.2 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="logo-text">
              <h1>Air Quality Monitor</h1>
              <span className="subtitle">Dashboard Monitoring Kualitas Udara</span>
            </div>
          </div>
          {deviceStatus && (
            <DeviceStatus 
              isOnline={deviceStatus.isOnline}
              lastUpdate={deviceStatus.lastUpdate}
              offlineMinutes={deviceStatus.offlineMinutes}
            />
          )}
        </div>
        
        <div className="header-right">
          <div className="user-profile">
            <div className="user-avatar">👤</div>
            <span className="username">{username || 'Admin'}</span>
          </div>
          <button onClick={onLogout} className="logout-button">
            <span className="logout-icon">🚪</span>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
