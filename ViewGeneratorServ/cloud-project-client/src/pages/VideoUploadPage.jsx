import React, { useState } from 'react';

const VideoUploadPage = () => {
  const [videoName, setVideoName] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!videoName || !videoFile || !thumbnailFile) {
      alert('Please fill all fields before submitting.');
      return;
    }

    const authToken = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('name', videoName);
    formData.append('files', videoFile);
    formData.append('files', thumbnailFile);
    console.log(authToken);

    // Perform the API call to upload the data
    fetch('http://localhost:8800/upload', {
      method: 'POST',
      headers: {
        // Add Authorization header if the token exists
        'auth_token': authToken ? `${authToken}` : ''
      },
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          alert('Upload successful!');
        } else {
          alert('Upload failed.');
        }
      })
      .catch((error) => {
        console.error('Error uploading files:', error);
        alert('Error uploading files.');
      });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
      <h2>Upload Video</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Video Name:
            <input
              type="text"
              value={videoName}
              onChange={(e) => setVideoName(e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              placeholder="Enter video name"
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Video File:
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Thumbnail File:
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnailFile(e.target.files[0])}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              required
            />
          </label>
        </div>
        <button
          type="submit"
          style={{
            padding: '10px 15px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default VideoUploadPage;
