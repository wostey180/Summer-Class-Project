import { useEffect, useState } from 'react';
import axios from 'axios';

interface UserProfile {
  name: string;
  email: string;
  role: string;
}

function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const fetchProfile = () => {
    const accessToken = localStorage.getItem("accessToken");
    
    axios.get("http://localhost:3000/users/profile", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => {
      setProfile(response.data);
      setNewName(response.data.name);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching profile:", error);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");
    
    try {
      const updateData: any = { name: newName };
      if (currentPassword && newPassword) {
        updateData.currentPassword = currentPassword;
        updateData.newPassword = newPassword;
      }

      await axios.put(
        "http://localhost:3000/users/profile",
        updateData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setMessage('Profile updated successfully!');
      setIsEditing(false);
      setCurrentPassword('');
      setNewPassword('');
      fetchProfile();
    } catch (error: any) {
      setMessage(error?.response?.data?.message || 'Error updating profile');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>Unable to load profile</div>;
  }

  return (
    <div className="profile-container" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px' }}>My Profile</h1>
      
      {message && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '20px', 
          backgroundColor: message.includes('Error') ? '#ffe6e6' : '#e6ffe6',
          borderRadius: '4px' 
        }}>
          {message}
        </div>
      )}

      <div className="profile-info" style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
        {!isEditing ? (
          <>
            <div style={{ marginBottom: '15px' }}>
              <strong>Name:</strong> {profile.name}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Email:</strong> {profile.email}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Role:</strong> {profile.role}
            </div>
            <button 
              onClick={() => setIsEditing(true)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Edit Profile
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                Name:
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    marginTop: '5px',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                />
              </label>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                Current Password:
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    marginTop: '5px',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                />
              </label>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                New Password:
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    marginTop: '5px',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                />
              </label>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setNewName(profile.name);
                  setCurrentPassword('');
                  setNewPassword('');
                  setMessage('');
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
