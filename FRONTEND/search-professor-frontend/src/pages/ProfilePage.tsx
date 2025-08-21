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
    <div className="profile-container">
  <h1>My Profile</h1>

  {message && (
    <div className={`profile-message ${message.includes('Error') ? 'error' : 'success'}`}>
      {message}
    </div>
  )}

  <div className="profile-info">
    {!isEditing ? (
      <>
        <div><strong>Name:</strong> {profile.name}</div>
        <div><strong>Email:</strong> {profile.email}</div>
        <div><strong>Role:</strong> {profile.role}</div>
        <div className="profile-buttons">
          <button className="btn-edit" onClick={() => setIsEditing(true)}>Edit Profile</button>
        </div>
      </>
    ) : (
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:
            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} />
          </label>
        </div>
        <div>
          <label>Current Password:
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </label>
        </div>
        <div>
          <label>New Password:
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </label>
        </div>
        <div className="profile-buttons">
          <button type="submit" className="btn-save">Save Changes</button>
          <button type="button" className="btn-cancel" onClick={() => {
            setIsEditing(false);
            setNewName(profile.name);
            setCurrentPassword('');
            setNewPassword('');
            setMessage('');
          }}>Cancel</button>
        </div>
      </form>
    )}
  </div>
</div>

  );
}

export default ProfilePage;
