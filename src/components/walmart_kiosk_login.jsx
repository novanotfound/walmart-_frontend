import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom'; // ✅ Added for navigation
import apiService from '../services/apiService';

// Keyframes for animations
const rotateInfinite = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const floatIn = keyframes`
  0% { transform: translateY(-30px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`;

const fadeInUp = keyframes`
  0% { transform: translateY(20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255, 194, 32, 0.6); }
  70% { box-shadow: 0 0 0 12px rgba(255, 194, 32, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 194, 32, 0); }
`;

const backgroundPulse = keyframes`
  0% { background: linear-gradient(to right, #ffc220, #2e62d3); }
  100% { background: linear-gradient(to right, #2e62d3, #ffc220); }
`;

const bounce = keyframes`
  0% { transform: translateY(0); }
  100% { transform: translateY(-6px); }
`;

// Styled Components
const AppContainer = styled.div`
  font-family: 'Inter', sans-serif;
  background: linear-gradient(to right, #ffc220, #2e62d3);
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  animation: ${backgroundPulse} 10s infinite alternate;
  padding: 2rem;
`;

const Title = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 1rem;
  text-shadow: 1px 1px 4px rgba(0,0,0,0.3);
  animation: ${fadeInUp} 1s ease;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const RecycleIcon = styled.img`
  width: 40px;
  height: 40px;
  animation: ${rotateInfinite} 4s linear infinite;
`;

const Container = styled.div`
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(0,0,0,0.15);
  padding: 2rem;
  width: 100%;
  max-width: 420px;
  animation: ${floatIn} 1.2s ease, ${bounce} 2s infinite alternate;
  margin-top: 1rem;
`;

const H2 = styled.h2`
  text-align: center;
  color: #2e62d3;
  margin-bottom: 0.5rem;
  animation: ${fadeInUp} 1s ease;
`;

const Subtext = styled.p`
  text-align: center;
  color: #555;
  margin-bottom: 1.5rem;
  animation: ${fadeInUp} 1.2s ease;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: block;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 1rem;
  margin-bottom: 1rem;
  animation: ${fadeInUp} 1.4s ease;
  box-sizing: border-box;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 1.2rem;
  animation: ${fadeInUp} 1.5s ease;

  input {
    margin-top: 0.2rem;
    margin-right: 0.75rem;
    flex-shrink: 0;
  }

  label {
    font-weight: normal;
  }
`;

const Button = styled.button`
  width: 100%;
  background: linear-gradient(to right, #2e62d3, #ffc220);
  color: #fff;
  padding: 0.9rem;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  animation: ${pulse} 2s infinite, ${fadeInUp} 1.6s ease;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const Footer = styled.div`
  text-align: center;
  font-size: 0.9rem;
  margin-top: 1.2rem;
  color: #555;
  animation: ${fadeInUp} 1.8s ease;

  a {
    color: #2e62d3;
    text-decoration: none;
    font-weight: 600;
  }
`;

// Main Component
export default function WalmartLogin() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [agreesToSms, setAgreesToSms] = useState(false);

  const navigate = useNavigate(); // ✅ React Router navigation

const handleSubmit = async (event) => {
  event.preventDefault();
  
  if (!phoneNumber) {
    alert('Please enter a phone number.');
    return;
  }

  try {
    // First, login with phone number (you'll need to implement phone auth)
    // For now, using test credentials to get initial token
    const loginData = await apiService.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test.user@walmart.com',
        password: 'password123'
      })
    });

    // Store the access token temporarily
    localStorage.setItem('accessToken', loginData.access_token);

    // Generate QR token for kiosk use
    const qrData = await apiService.makeRequest('/auth/qr-token', {
      method: 'POST'
    });

    // Store QR token and user data
    localStorage.setItem('qrToken', qrData.token);
    localStorage.setItem('userProfile', JSON.stringify(loginData.user));

    alert(`QR Code generated! Token expires at: ${qrData.expires_at}`);
    navigate('/landing');
    
  } catch (error) {
    alert(`Authentication failed: ${error.message}`);
  }
};
  //import apiService from '../services/apiService';



  return (
    <AppContainer>
      <Title>
        <RecycleIcon src="https://pics.clipartpng.com/Green_Recycle_Logo_PNG_Clip_Art-3212.png" alt="Recycle Icon" />
        Walmart Recycling
      </Title>

      <Container>
        <H2>Enter Phone Number</H2>
        <Subtext>We'll send you a verification code to get started</Subtext>

        <Form onSubmit={handleSubmit}>
          <Label htmlFor="phone">Phone Number</Label>
          <Input 
            type="tel"
            id="phone"
            placeholder="+1 (555) 123-4567"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          <CheckboxContainer>
            <input 
              type="checkbox" 
              id="sms"
              checked={agreesToSms}
              onChange={(e) => setAgreesToSms(e.target.checked)}
            />
            <Label htmlFor="sms">I agree to receive SMS notifications about my recycling rewards and account updates</Label>
          </CheckboxContainer>

          <Button type="submit">Send Verification Code</Button>
        </Form>

        <Footer>
          Already have an account? <a href="#">Sign in</a>
        </Footer>
      </Container>
    </AppContainer>
  );
}
