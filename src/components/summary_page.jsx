import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import apiService from '../services/apiService';
import { useAuth } from '../hooks/useAuth';

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
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  
  const results = location.state?.results;

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return;
      
      try {
        const analyticsData = await apiService.makeRequest(`/analytics/customer/${user.id}`);
        setAnalytics(analyticsData);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      }
    };

    fetchAnalytics();
  }, [user]);

  return (
    <SummaryContainer>
      <h1 style={{ color: 'white', textAlign: 'center' }}>Recycling Summary</h1>
      
      {results && (
        <Card>
          <h2>🎉 Session Complete!</h2>
          <StatGrid>
            <StatCard>
              <h3>{results.summary.total_items}</h3>
              <p>Items Processed</p>
            </StatCard>
            <StatCard>
              <h3>{results.summary.successful_items}</h3>
              <p>Successfully Identified</p>
            </StatCard>
            <StatCard>
              <h3>${results.summary.total_reward}</h3>
              <p>Rewards Earned</p>
            </StatCard>
            <StatCard>
              <h3>{results.summary.success_rate}%</h3>
              <p>Success Rate</p>
            </StatCard>
          </StatGrid>
        </Card>
      )}

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
              <h3>{analytics.environmental_impact.co2_saved} kg</h3>
              <p>CO₂ Saved</p>
            </StatCard>
          </StatGrid>
          
          <h3>Favorite Categories:</h3>
          <p>{analytics.favorite_categories.join(', ')}</p>
        </Card>
      )}

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
      </Card>
    </SummaryContainer>
  );
}
