import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import apiService from '../services/apiService';

const SummaryContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
`;

const Card = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  margin: 1rem 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
`;

const StatCard = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 10px;
  text-align: center;
`;

export default function SummaryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [user, setUser] = useState(null);
  
  const results = location.state?.results;

  // Debug logging
  useEffect(() => {
    console.log('📄 Summary page mounted');
    console.log('📍 Location state:', location.state);
    console.log('📊 Results received:', results);
  }, [location.state, results]);

  // Get user from localStorage (kiosk authentication)
  useEffect(() => {
    const kioskUser = localStorage.getItem('kioskUser');
    if (kioskUser) {
      try {
        const userData = JSON.parse(kioskUser);
        setUser(userData);
        console.log('👤 User data loaded:', userData);
      } catch (error) {
        console.error('Failed to parse kiosk user data:', error);
      }
    }
  }, []);

  // Fetch analytics (optional - can be disabled for testing)
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return;
      
      try {
        console.log('📈 Fetching analytics for user:', user.id);
        const analyticsData = await apiService.makeRequest(`/analytics/customer/${user.id}`);
        setAnalytics(analyticsData);
        console.log('📊 Analytics loaded:', analyticsData);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
        // Don't show error to user, just log it
      }
    };

    fetchAnalytics();
  }, [user]);

  // Redirect if no results data
  useEffect(() => {
    if (!results) {
      console.warn('⚠️ No results data, redirecting to scan page');
      setTimeout(() => {
        navigate('/scan');
      }, 3000);
    }
  }, [results, navigate]);

  return (
    <SummaryContainer>
      <h1 style={{ color: 'white', textAlign: 'center' }}>Recycling Summary</h1>
      
      {/* User Welcome Card */}
      {user && (
        <Card>
          <h2>👋 Welcome back, {user.full_name}!</h2>
          <p>Loyalty Tier: <strong>{user.loyalty_tier}</strong></p>
          <p>Total Points: <strong>{user.total_points}</strong></p>
        </Card>
      )}
      
      {/* Results Card */}
      {results ? (
        <Card>
          <h2>🎉 Session Complete!</h2>
          <StatGrid>
            <StatCard>
              <h3>{results.summary?.total_items || 'N/A'}</h3>
              <p>Items Processed</p>
            </StatCard>
            <StatCard>
              <h3>{results.summary?.successful_items || 'N/A'}</h3>
              <p>Successfully Identified</p>
            </StatCard>
            <StatCard>
              <h3>${results.summary?.total_reward || '0.00'}</h3>
              <p>Rewards Earned</p>
            </StatCard>
            <StatCard>
              <h3>{results.summary?.success_rate || 0}%</h3>
              <p>Success Rate</p>
            </StatCard>
          </StatGrid>
          
          {/* Individual Items */}
          {results.items && results.items.length > 0 && (
            <div>
              <h3>📦 Items Processed:</h3>
              {results.items.map((item, index) => (
                <div key={index} style={{
                  background: '#f0f0f0',
                  padding: '0.5rem',
                  margin: '0.5rem 0',
                  borderRadius: '5px'
                }}>
                  <strong>{item.product_name || `Item ${index + 1}`}</strong> - 
                  ${item.reward || '0.00'} ({item.category || 'unknown'})
                </div>
              ))}
            </div>
          )}
        </Card>
      ) : (
        <Card>
          <h2>⚠️ No Results Available</h2>
          <p>No processing results were found. You will be redirected to the scan page in a few seconds.</p>
          <button 
            onClick={() => navigate('/scan')}
            style={{
              background: '#ff9800',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '25px',
              fontSize: '1.1rem',
              cursor: 'pointer'
            }}
          >
            🔄 Go to Scanner
          </button>
        </Card>
      )}

      {/* Analytics Card (Optional) */}
      {analytics && (
        <Card>
          <h2>📊 Your Recycling Journey</h2>
          <StatGrid>
            <StatCard>
              <h3>{analytics.total_recycled_items}</h3>
              <p>Total Items Recycled</p>
            </StatCard>
            <StatCard>
              <h3>${analytics.total_rewards_earned}</h3>
              <p>Total Rewards Earned</p>
            </StatCard>
            <StatCard>
              <h3>{analytics.recycling_streak}</h3>
              <p>Day Streak</p>
            </StatCard>
            <StatCard>
              <h3>{analytics.environmental_impact?.co2_saved || 0} kg</h3>
              <p>CO₂ Saved</p>
            </StatCard>
          </StatGrid>
          
          {analytics.favorite_categories && (
            <div>
              <h3>Favorite Categories:</h3>
              <p>{analytics.favorite_categories.join(', ')}</p>
            </div>
          )}
        </Card>
      )}

      {/* Navigation Card */}
      <Card>
        <button 
          onClick={() => navigate('/scan')}
          style={{
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '25px',
            fontSize: '1.1rem',
            cursor: 'pointer',
            marginRight: '1rem'
          }}
        >
          🔄 Scan More Items
        </button>
        
        <button 
          onClick={() => navigate('/')}
          style={{
            background: '#2196F3',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '25px',
            fontSize: '1.1rem',
            cursor: 'pointer'
          }}
        >
          🏠 Return Home
        </button>
        
        <button 
          onClick={() => {
            localStorage.removeItem('kioskUser');
            navigate('/kiosk-auth');
          }}
          style={{
            background: '#f44336',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '25px',
            fontSize: '1.1rem',
            cursor: 'pointer',
            marginLeft: '1rem'
          }}
        >
          🚪 Logout
        </button>
      </Card>
    </SummaryContainer>
  );
}
