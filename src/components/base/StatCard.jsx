import React from 'react';
import { Card as AntCard, Statistic, Typography, Badge, Tooltip } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

const StatCard = ({ 
  icon, 
  title, 
  value, 
  suffix = '', 
  prefix = '', 
  change = 0, 
  changeText = '', 
  color = '#1890ff',
  loading = false,
  tooltip = '',
  onClick = null
}) => {
  // Determine if change is positive, negative or neutral
  const isPositive = change > 0;
  const isNegative = change < 0;
  const changeValue = Math.abs(change);
  
  return (
    <AntCard 
      hoverable 
      className="stat-card transition-all duration-300 hover:shadow-md" 
      loading={loading}
      onClick={onClick}
      style={{ 
        borderTop: `3px solid ${color}`,
        borderRadius: '8px',
        height: '100%'
      }}
    >
      <div className="flex items-center justify-between ">
        <div className="flex items-center">
          <Text strong className="text-lg mr-2">{title}</Text>
          {tooltip && (
            <Tooltip title={tooltip}>
              <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
            </Tooltip>
          )}
        </div>
        {icon && (
          <div className="flex items-center justify-center w-5 h-12 rounded-full" 
               style={{ backgroundColor: `${color}20` }}>
            <span className="text-2xl" style={{ color }}>{icon}</span>
          </div>
        )}
      </div>
      
      <Statistic 
        value={value} 
        suffix={suffix}
        prefix={prefix}
        valueStyle={{ 
          color, 
          fontWeight: 'bold',
          fontSize: '28px'
        }}
      />
      
      {(change !== 0 || changeText) && (
        <div className="mt-3 flex items-center">
          <Badge 
            className="mr-2"
            count={
              <div className="px-2 py-1 rounded-full text-xs flex items-center" style={{ 
                backgroundColor: isPositive ? '#f6ffed' : isNegative ? '#fff2f0' : '#e6f7ff',
                color: isPositive ? '#52c41a' : isNegative ? '#ff4d4f' : '#1890ff',
                border: `1px solid ${isPositive ? '#b7eb8f' : isNegative ? '#ffccc7' : '#91d5ff'}`
              }}>
                {isPositive && <ArrowUpOutlined style={{ marginRight: '2px' }} />}
                {isNegative && <ArrowDownOutlined style={{ marginRight: '2px' }} />}
                {changeValue}
              </div>
            }
          />
          <Text type="secondary" className="text-sm">
            {changeText || (isPositive ? 'more' : 'less') + ' than last month'}
          </Text>
        </div>
      )}
    </AntCard>
  );
};

export default StatCard;