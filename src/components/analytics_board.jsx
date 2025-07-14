
import React, { useState, useEffect } from 'react';
import { Activity, Users, Heart, TrendingUp, BarChart3, Shield, ChevronRight, Zap } from 'lucide-react';

const AnalyticsDashboard = () => {
  const [activeEndpoint, setActiveEndpoint] = useState(null);
  const [healthStatus, setHealthStatus] = useState('healthy');
  const [animationTrigger, setAnimationTrigger] = useState(0);

  // Mock data for different endpoints
  const mockData = {
    customer: {
      id: 'CUST_001',
      name: 'John Doe',
      totalOrders: 45,
      revenue: 12450,
      avgOrderValue: 276.67,
      lastActivity: '2 hours ago',
      growth: '+15%'
    },
    dashboard: {
      totalCustomers: 1247,
      revenue: 89450,
      orders: 356,
      conversionRate: 3.2,
      trends: [
        { month: 'Jan', value: 65 },
        { month: 'Feb', value: 75 },
        { month: 'Mar', value: 82 },
        { month: 'Apr', value: 91 },
        { month: 'May', value: 89 }
      ]
    },
    health: {
      status: 'healthy',
      uptime: '99.9%',
      responseTime: '45ms',
      lastCheck: new Date().toLocaleTimeString()
    }
  };

  const endpoints = [
    {
      method: 'GET',
      endpoint: '/analytics/customer/{id}',
      description: 'Customer analytics',
      icon: Users,
      color: 'from-blue-600 to-blue-500',
      data: mockData.customer,
      key: 'customer'
    },
    {
      method: 'GET',
      endpoint: '/analytics/dashboard',
      description: 'Dashboard data',
      icon: BarChart3,
      color: 'from-yellow-500 to-yellow-400',
      data: mockData.dashboard,
      key: 'dashboard'
    },
    {
      method: 'GET',
      endpoint: '/health',
      description: 'System health check',
      icon: Heart,
      color: 'from-blue-500 to-yellow-500',
      data: mockData.health,
      key: 'health'
    }
  ];

  const additionalEndpoints = [
    {
      method: 'GET',
      endpoint: '/docs',
      description: 'API Documentation',
      url: 'http://127.0.0.1:8000/docs',
      icon: '📚',
      color: 'from-blue-400 to-blue-300'
    },
    {
      method: 'GET',
      endpoint: '/dashboard',
      description: 'Analytics Dashboard',
      url: 'http://127.0.0.1:8000/dashboard',
      icon: '📊',
      color: 'from-yellow-400 to-yellow-300'
    },
    {
      method: 'GET',
      endpoint: '/health',
      description: 'Health Monitoring',
      url: 'http://127.0.0.1:8000/health',
      icon: '🔍',
      color: 'from-blue-400 to-yellow-400'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTrigger(prev => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleEndpointClick = (endpoint) => {
    setActiveEndpoint(endpoint);
    // Simulate API call
    setTimeout(() => {
      setHealthStatus('healthy');
    }, 500);
  };

  const renderEndpointData = (endpoint) => {
    const data = endpoint.data;
    
    switch (endpoint.key) {
      case 'customer':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">{data.name}</h3>
              <span className="text-green-400 font-semibold">{data.growth}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-white/70 text-sm">Total Orders</div>
                <div className="text-2xl font-bold text-white">{data.totalOrders}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-white/70 text-sm">Revenue</div>
                <div className="text-2xl font-bold text-white">${data.revenue.toLocaleString()}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-white/70 text-sm">Avg Order Value</div>
                <div className="text-2xl font-bold text-white">${data.avgOrderValue}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-white/70 text-sm">Last Activity</div>
                <div className="text-2xl font-bold text-white">{data.lastActivity}</div>
              </div>
            </div>
          </div>
        );
      
      case 'dashboard':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-white/70 text-sm">Total Customers</div>
                <div className="text-2xl font-bold text-white">{data.totalCustomers.toLocaleString()}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-white/70 text-sm">Revenue</div>
                <div className="text-2xl font-bold text-white">${data.revenue.toLocaleString()}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-white/70 text-sm">Orders</div>
                <div className="text-2xl font-bold text-white">{data.orders}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-white/70 text-sm">Conversion Rate</div>
                <div className="text-2xl font-bold text-white">{data.conversionRate}%</div>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-white/70 text-sm mb-2">Monthly Trends</div>
              <div className="flex items-end space-x-2 h-20">
                {data.trends.map((trend, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-t from-white/30 to-white/60 rounded-t transition-all duration-1000"
                      style={{
                        height: `${(trend.value / 100) * 100}%`,
                        animationDelay: `${index * 200}ms`
                      }}
                    />
                    <div className="text-xs text-white/70 mt-1">{trend.month}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'health':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">System Status</h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-yellow-400 font-semibold capitalize">{data.status}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-white/70 text-sm">Uptime</div>
                <div className="text-2xl font-bold text-white">{data.uptime}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-white/70 text-sm">Response Time</div>
                <div className="text-2xl font-bold text-white">{data.responseTime}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-white/70 text-sm">Last Check</div>
                <div className="text-2xl font-bold text-white">{data.lastCheck}</div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-yellow-600 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-white/70">API Endpoints & System Monitoring</p>
        </div>

        {/* Additional Resources Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <span className="mr-2">📚</span>
            Additional Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {additionalEndpoints.map((resource, index) => (
              <div
                key={index}
                onClick={() => window.open(resource.url, '_blank')}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <div className={`bg-gradient-to-r ${resource.color} rounded-lg p-3 mb-3 w-fit`}>
                  <span className="text-2xl">{resource.icon}</span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{resource.description}</h3>
                <p className="text-white/70 text-sm font-mono mb-2">{resource.endpoint}</p>
                <p className="text-blue-300 text-xs hover:text-blue-200 transition-colors">
                  {resource.url}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full font-semibold">
                    {resource.method}
                  </span>
                  <span className="text-white/60 text-xs">Click to open</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Endpoints Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {endpoints.map((endpoint, index) => {
            const Icon = endpoint.icon;
            return (
              <div
                key={index}
                onClick={() => handleEndpointClick(endpoint)}
                className={`
                  relative overflow-hidden rounded-2xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl
                  ${activeEndpoint?.key === endpoint.key ? 'ring-2 ring-white/50' : ''}
                `}
              >
                <div className={`bg-gradient-to-r ${endpoint.color} p-6 h-full`}>
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="w-8 h-8 text-white" />
                    <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full font-semibold">
                      {endpoint.method}
                    </span>
                  </div>
                  
                  <h3 className="text-white font-bold text-lg mb-2">
                    {endpoint.description}
                  </h3>
                  
                  <p className="text-white/80 text-sm mb-4 font-mono">
                    {endpoint.endpoint}
                  </p>
                  
                  <div className="flex items-center text-white/90 text-sm">
                    <span>View Details</span>
                    <ChevronRight className="w-4 h-4 ml-1 transform transition-transform group-hover:translate-x-1" />
                  </div>
                  
                  {/* Animated background elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full animate-pulse"></div>
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Endpoint Details */}
        {activeEndpoint && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${activeEndpoint.color}`}>
                  <activeEndpoint.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{activeEndpoint.description}</h2>
                  <p className="text-white/70 font-mono text-sm">{activeEndpoint.endpoint}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
                <span className="text-white/80 text-sm">Live Data</span>
              </div>
            </div>
            
            <div className="animate-fadeIn">
              {renderEndpointData(activeEndpoint)}
            </div>
          </div>
        )}

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white/70 text-sm">API Calls</div>
                <div className="text-2xl font-bold text-white">12,450</div>
              </div>
              <Activity className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white/70 text-sm">Success Rate</div>
                <div className="text-2xl font-bold text-white">99.2%</div>
              </div>
              <TrendingUp className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white/70 text-sm">Avg Response</div>
                <div className="text-2xl font-bold text-white">45ms</div>
              </div>
              <Zap className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white/70 text-sm">Security</div>
                <div className="text-2xl font-bold text-white">Active</div>
              </div>
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AnalyticsDashboard;