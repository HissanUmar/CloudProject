import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import SideBar from '../components/SideBar';
import { Menu, Home, Compass, PlaySquare, Clock, ThumbsUp, Video } from 'lucide-react';



const VideoUploadPage = () => {
  const [videoName, setVideoName] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoName || !videoFile || !thumbnailFile) {
      alert('Please fill all fields before submitting.');
      return;
    }

    const auth_token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('name', videoName);
    formData.append('files', videoFile);
    formData.append('files', thumbnailFile);
    console.log(auth_token);

    const size = (videoFile.size / (1024 * 1024)) + (thumbnailFile.size / (1024 * 1024));

    let usageLabel = document.querySelector('.usage').textContent = `The size is ${size} MB.`

    let response = await fetch('http://localhost:8080/get-username', {
      method: 'GET',
      headers: {
        'auth_token': auth_token ? `${auth_token}` : '', // Attach the token in Authorization header
        'Content-Type': 'application/json', // Optional, depending on the server's expected content type
      }
    });

    let data = await response.json();
    const userId = data.userId;

    response = await fetch('http://localhost:8000/usage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',  // or 'multipart/form-data' if you're sending files
      },
      body: JSON.stringify({ userId: userId, fileSizeMB: size }),
    });

    data = await response.json();


    console.log(data.response);

    if (data.response === 2) {
      document.querySelector('.usage').textContent = "Storage Limit exceeds after uploading. Delete some content to upload again.";
    }
    else if (data.response === 1) {
      document.querySelector('.usage').textContent = "This file upload exceeds your today's upload limit.";
    }
    else if (data.response === 0) {
      document.querySelector('.usage').textContent = "Uploading File to Cloud";
      localStorage.setItem('uploadStatus', JSON.stringify({ status: 'uploading', message: 'Uploading file...' }));
      navigate('/home');


      fetch('http://localhost:8800/upload', {
        method: 'POST',
        headers: {
          // Add Authorization header if the token exists
          'auth_token': auth_token ? `${auth_token}` : ''
        },
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            alert('Upload successful!');
            localStorage.setItem('uploadStatus', JSON.stringify({ status: 'success', message: 'File uploaded successfully!' }));
          } else {
            alert('Upload failed.');
            localStorage.setItem('uploadStatus', JSON.stringify({ status: 'error', message: 'Error uploading file.' }));
          }
        })
        .catch((error) => {
          console.error('Error uploading files:', error);
          alert('Error uploading files.');
          localStorage.setItem('uploadStatus', JSON.stringify({ status: 'error', message: 'Error uploading file.' }));
        });
    }

    // Perform the API call to upload the data

  };

  return (
    <div className='flex'>
      <nav className="bg-gradient-to-r from-green-400 to-teal-500 h-16  top-0 left-0 right-0 shadow-lg z-10 flex items-center px-6 ">
        <div className="">
          <Video className="text-black" style={{ paddingLeft: '12px' }} size={70} />
          <label className="ml-2 font-semibold fs-2 " style={{ gap: '80px' }}>ViewTube</label>
        </div>
      </nav>


      <SideBar />
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
          <br></br>
          <label className="usage">
            Usage Monitoring data shows here.
          </label>
        </form>
      </div>
    </div>
  );
};

export default VideoUploadPage;
