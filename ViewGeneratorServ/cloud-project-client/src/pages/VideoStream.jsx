import React, { useState, useEffect } from 'react';

const VideoStream = () => {
  const [videoSrc, setVideoSrc] = useState(null); // URL for video stream
  const [metaData, setMetaData] = useState({
    title: '',
    description: '',
    duration: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        // Fetch metadata
        // const metadataResponse = await fetch('http://localhost:8800/api/video-metadata');
        // if (!metadataResponse.ok) throw new Error('Failed to fetch metadata');
        // const metadata = await metadataResponse.json();
        // setMetaData(metadata);

        // Set video source

        const folderName = '676870c97ae28e86ce21b241/video';
        const videoName = 'SarmadVideo';

        console.log("Going to fetch");

        

        const response = await fetch(
            `http://localhost:8800/stream-video/?folderName=${folderName}&videoName=${videoName}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
  
        setVideoSrc(response.url);
      } catch (err) {
        console.error('Error fetching video data:', err);
        setError('Failed to load video data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Video Streamer</h2>
      {videoSrc ? (
        <div>
          <video
            src={videoSrc}
            controls
            autoPlay
            style={{ width: '100%', maxWidth: '600px', marginBottom: '20px' }}
          ></video>
          <div>
            <h3>Metadata</h3>
            <div style={{ marginBottom: '10px' }}>
              <strong>Title:</strong> {metaData.title || 'N/A'}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Description:</strong> {metaData.description || 'N/A'}
            </div>
            <div>
              <strong>Duration:</strong> {metaData.duration || 'N/A'}
            </div>
          </div>
        </div>
      ) : (
        <p>Video is not available.</p>
      )}
    </div>
  );
};

export default VideoStream;
