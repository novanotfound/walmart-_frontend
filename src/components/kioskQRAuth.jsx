import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QrScanner from 'qr-scanner';
import styled from 'styled-components';
import apiService from '../services/apiService';

const KioskContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #ffc220 0%, #2e62d3 100%);
  padding: 2rem;
`;

const ScannerCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  text-align: center;
  max-width: 600px;
  width: 100%;
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 2rem auto;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
`;

const Video = styled.video`
  width: 100%;
  height: 300px;
  object-fit: cover;
  display: block;
`;

const StatusMessage = styled.div`
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 500;
  
  &.scanning {
    background: #e3f2fd;
    color: #1976d2;
    border: 2px solid #2196f3;
  }
  
  &.success {
    background: #e8f5e8;
    color: #2e7d32;
    border: 2px solid #4caf50;
  }
  
  &.error {
    background: #ffebee;
    color: #c62828;
    border: 2px solid #f44336;
  }
`;

const WalmartLogo = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #2e62d3;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const Instructions = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 10px;
  margin: 1rem 0;
  
  h3 {
    margin-top: 0;
    color: #2e62d3;
  }
  
  ol {
    text-align: left;
    margin: 0;
    padding-left: 1.5rem;
  }
  
  li {
    margin: 0.5rem 0;
    color: #555;
  }
`;

export default function KioskQRAuth() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);
  
  const [scanStatus, setScanStatus] = useState('initializing');
  const [statusMessage, setStatusMessage] = useState('Initializing camera...');
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  // Initialize QR Scanner
  useEffect(() => {
    const initializeScanner = async () => {
      try {
        if (!videoRef.current) return;

        // Create QR Scanner instance
        qrScannerRef.current = new QrScanner(
          videoRef.current,
          (result) => handleQRDetected(result.data),
          {
            highlightScanRegion: true,
            highlightCodeOutline: true,
            preferredCamera: 'environment'
          }
        );

        // Start scanning
        await qrScannerRef.current.start();
        setScanStatus('scanning');
        setStatusMessage('Ready to scan QR code');
        
      } catch (error) {
        console.error('Scanner initialization failed:', error);
        setScanStatus('error');
        setStatusMessage('Camera access denied. Please allow camera permissions and refresh.');
      }
    };

    initializeScanner();

    // Cleanup on unmount
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop();
        qrScannerRef.current.destroy();
      }
    };
  }, []);

  const handleQRDetected = async (qrData) => {
    try {
      setScanStatus('validating');
      setStatusMessage('Validating QR code...');

      // Stop scanning temporarily
      if (qrScannerRef.current) {
        qrScannerRef.current.stop();
      }

      // Extract token from QR data
      // QR data format: "recycling_kiosk:eyJhbGciOiJIUzI1NiIs..."
      let token = qrData;
      if (qrData.startsWith('recycling_kiosk:')) {
        token = qrData.replace('recycling_kiosk:', '');
      }

      // Validate QR token with backend
      const userData = await apiService.makeRequest('/auth/validate-qr', {
        method: 'POST',
        body: JSON.stringify({ token })
      });

      // Authentication successful
      setAuthenticatedUser(userData);
      setScanStatus('success');
      setStatusMessage(`Welcome, ${userData.full_name}!`);

      // Store user data for the scanning session
      localStorage.setItem('kioskUser', JSON.stringify(userData));

      // Navigate to scanning page after 2 seconds
      setTimeout(() => {
        navigate('/scan');
      }, 2000);

    } catch (error) {
      console.error('QR validation failed:', error);
      setScanStatus('error');
      setStatusMessage(`Authentication failed: ${error.message}`);
      
      // Restart scanning after 3 seconds
      setTimeout(() => {
        if (qrScannerRef.current) {
          qrScannerRef.current.start();
          setScanStatus('scanning');
          setStatusMessage('Ready to scan QR code');
        }
      }, 3000);
    }
  };

  const getStatusClass = () => {
    switch (scanStatus) {
      case 'scanning':
      case 'initializing':
        return 'scanning';
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      default:
        return 'scanning';
    }
  };

  return (
    <KioskContainer>
      <ScannerCard>
        <WalmartLogo>
          🛒 Walmart Recycling Kiosk
        </WalmartLogo>

        <VideoContainer>
          <Video ref={videoRef} />
        </VideoContainer>

        <StatusMessage className={getStatusClass()}>
          {statusMessage}
        </StatusMessage>

        {authenticatedUser && (
          <div style={{ 
            background: '#e8f5e8', 
            padding: '1rem', 
            borderRadius: '10px',
            margin: '1rem 0'
          }}>
            <h3>✅ Authentication Successful!</h3>
            <p><strong>Name:</strong> {authenticatedUser.full_name}</p>
            <p><strong>Email:</strong> {authenticatedUser.email}</p>
            <p><strong>Loyalty Tier:</strong> {authenticatedUser.loyalty_tier}</p>
            <p><strong>Walmart Plus:</strong> {authenticatedUser.walmart_plus_member ? 'Yes' : 'No'}</p>
            <p style={{ color: '#2e7d32', fontWeight: 'bold' }}>
              Redirecting to scanner...
            </p>
          </div>
        )}

        {scanStatus === 'scanning' && (
          <Instructions>
            <h3>📱 How to Use</h3>
            <ol>
              <li>Open the Walmart Recycling app on your phone</li>
              <li>Login to your account</li>
              <li>Generate a QR code</li>
              <li>Hold your phone steady in front of the camera</li>
              <li>Wait for authentication confirmation</li>
            </ol>
          </Instructions>
        )}
      </ScannerCard>
    </KioskContainer>
  );
}
