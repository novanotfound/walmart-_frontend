import React, { 
  useState,
  useEffect,
  useRef,
  useCallback
} from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import apiService from '../services/apiService';

const ScanContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  margin-bottom: 2rem;
`;

const Video = styled.video`
  width: 100%;
  height: 400px;
  border-radius: 15px;
  object-fit: cover;
`;

const CaptureButton = styled.button`
  background: #4CAF50;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  margin: 1rem;
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ProcessingStatus = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 10px;
  margin: 1rem 0;
  max-width: 600px;
  width: 100%;
`;

const StatusItem = styled.div`
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

export default function KioskScan() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  // State management
  const [user, setUser] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [processingStatus, setProcessingStatus] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);

  // Get authenticated user from localStorage on component mount
  useEffect(() => {
    const kioskUser = localStorage.getItem('kioskUser');
    console.log('Checking for kiosk user:', kioskUser);
    
    if (kioskUser) {
      try {
        const userData = JSON.parse(kioskUser);
        console.log('Setting user data:', userData);
        setUser(userData);
      } catch (error) {
        console.error('Failed to parse kiosk user data:', error);
        navigate('/kiosk-auth');
      }
    } else {
      console.log('No kiosk user found, redirecting to auth');
      navigate('/kiosk-auth');
    }
  }, [navigate]);

  const startCamera = useCallback(async () => {
    try {
      if (!videoRef.current) {
        console.warn('Video element not ready');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch (error) {
      console.error('Camera access failed:', error);
      if (error.name === 'NotAllowedError') {
        alert('Camera access denied. Please allow camera permissions and refresh.');
      } else if (error.name === 'NotFoundError') {
        alert('No camera found on this device.');
      } else {
        alert(`Camera error: ${error.message}`);
      }
    }
  }, []);

  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
      setCapturedImages(prev => [...prev, file]);
    }, 'image/jpeg', 0.8);
  }, []);

const processImages = useCallback(async () => {
  if (capturedImages.length === 0 || !user) return;

  console.log('🚀 Starting image processing...');
  setIsProcessing(true);
  setProcessingStatus(['Uploading images for processing...']);

  const formData = new FormData();
  formData.append('customer_id', user.id);
  formData.append('kiosk_id', 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
  
  capturedImages.forEach((image, index) => {
    formData.append('files', image, `image_${index}.jpg`);
  });

  try {
    console.log('📡 Making request to backend...');
    const response = await fetch(`${apiService.baseURL}/recycling/process-batch-advanced`, {
      method: 'POST',
      body: formData
    });

    console.log('📥 Response received:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('🔄 Starting SSE processing...');
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let eventType = '';
    let buffer = '';
    let processedEvents = 0;

    // Add timeout for SSE processing
    const startTime = Date.now();
    const SSE_TIMEOUT = 60000; // 60 seconds

    while (true) {
      // Check for timeout
      if (Date.now() - startTime > SSE_TIMEOUT) {
        throw new Error('SSE processing timeout');
      }

      const { done, value } = await reader.read();
      console.log('📊 SSE chunk received, done:', done);
      
      if (done) {
        console.log('✅ SSE stream completed');
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmedLine = line.trim();
        console.log('📝 Processing line:', trimmedLine);
        
        if (trimmedLine.startsWith('event:')) {
          eventType = trimmedLine.substring(6).trim();
          console.log('🎯 Event type:', eventType);
        } else if (trimmedLine.startsWith('data:')) {
          try {
            const dataString = trimmedLine.substring(5).trim();
            
            if (dataString && dataString.length > 0 && dataString.startsWith('{')) {
              const data = JSON.parse(dataString);
              processedEvents++;
              console.log('📦 Parsed data:', data);
              
              switch (eventType) {
                case 'batch_complete':
                  console.log('🎉 Batch complete, navigating to summary...');
                  setResults(data);
                  setIsProcessing(false);
                  navigate('/summary', { state: { results: data } });
                  return; // Exit the function
                  
                default:
                  setProcessingStatus(prev => [...prev, `Event: ${eventType}`]);
              }
            }
          } catch (parseError) {
            console.warn('⚠️ Parse error:', parseError);
          }
        }
      }
    }

  } catch (error) {
    console.error('💥 Processing failed:', error);
    setProcessingStatus(['❌ Processing failed: ' + error.message]);
    setIsProcessing(false);
    alert(`Processing failed: ${error.message}`);
  }
}, [capturedImages, user, navigate]);



  // Camera initialization with proper timing
  useEffect(() => {
    const initCamera = setTimeout(() => {
      startCamera();
    }, 100);

    return () => {
      clearTimeout(initCamera);
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  return (
    <ScanContainer>
      {user && (
        <div style={{ 
          background: 'rgba(255,255,255,0.9)', 
          padding: '1rem', 
          borderRadius: '10px',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          <h3>Welcome, {user.full_name}!</h3>
          <p>Loyalty Tier: {user.loyalty_tier} | Total Points: {user.total_points}</p>
          <p>Walmart Plus: {user.walmart_plus_member ? 'Yes' : 'No'}</p>
        </div>
      )}
      
      <h1 style={{ color: 'white', marginBottom: '2rem' }}>Scan Your Items</h1>
      
      <VideoContainer>
        <Video ref={videoRef} autoPlay playsInline />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </VideoContainer>

      <div>
        <CaptureButton 
          onClick={captureImage} 
          disabled={!isScanning || isProcessing || !user}
        >
          📸 Capture Item ({capturedImages.length})
        </CaptureButton>
        
        <CaptureButton 
          onClick={processImages}
          disabled={capturedImages.length === 0 || isProcessing || !user}
        >
          {isProcessing ? '⏳ Processing...' : '🔄 Process Items'}
        </CaptureButton>
        
        <CaptureButton 
          onClick={() => {
            localStorage.removeItem('kioskUser');
            navigate('/kiosk-auth');
          }}
          style={{
            background: '#f44336',
            marginLeft: '1rem'
          }}
        >
          🚪 Logout
        </CaptureButton>
      </div>

      {processingStatus.length > 0 && (
        <ProcessingStatus>
          <h3>Processing Status:</h3>
          {processingStatus.map((status, index) => (
            <StatusItem key={index}>{status}</StatusItem>
          ))}
        </ProcessingStatus>
      )}

      {results && (
        <ProcessingStatus>
          <h3>🎉 Processing Complete!</h3>
          <p><strong>Total Items:</strong> {results.summary.total_items}</p>
          <p><strong>Successful:</strong> {results.summary.successful_items}</p>
          <p><strong>Total Reward:</strong> ${results.summary.total_reward}</p>
          <p><strong>Success Rate:</strong> {results.summary.success_rate}%</p>
        </ProcessingStatus>
      )}
    </ScanContainer>
  );
}
