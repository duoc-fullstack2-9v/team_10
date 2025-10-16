import { useAuth } from '../contexts/AuthContext';

function TestAdmin() {
  const { user, isAdmin, isAuthenticated } = useAuth();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Test Admin Page</h1>
      <div style={{ backgroundColor: '#f5f5f5', padding: '15px', marginBottom: '20px' }}>
        <h2>Debug Info:</h2>
        <p><strong>Is Authenticated:</strong> {isAuthenticated() ? 'Yes' : 'No'}</p>
        <p><strong>Is Admin:</strong> {isAdmin() ? 'Yes' : 'No'}</p>
        <p><strong>User Data:</strong></p>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>
      
      {isAdmin() ? (
        <div style={{ backgroundColor: '#d4edda', padding: '15px', border: '1px solid #c3e6cb' }}>
          <h3>✅ Admin Access Granted</h3>
          <p>You have admin privileges!</p>
        </div>
      ) : (
        <div style={{ backgroundColor: '#f8d7da', padding: '15px', border: '1px solid #f5c6cb' }}>
          <h3>❌ Admin Access Denied</h3>
          <p>You don't have admin privileges.</p>
        </div>
      )}
    </div>
  );
}

export default TestAdmin;