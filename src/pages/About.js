import React from 'react';
import { Card, Avatar } from 'antd';
import { TeamOutlined, ToolOutlined, CodeOutlined } from '@ant-design/icons';
import './About.css';

const { Meta } = Card;

function About() {
  return (
    <div className="about-container">
      <Card className="about-card" hoverable>
        <Meta
          avatar={<Avatar icon={<ToolOutlined />} />}
          title="关于我们"
          description="该网站用于海洋环境监测，提供实时数据监测、数据上传与更新、数据报告生成等功能。"
        />
      </Card>
      <Card className="about-card" hoverable>
        <Meta
          avatar={<Avatar icon={<CodeOutlined />} />}
          title="框架搭建和开发环境"
          description="本网站基于React框架，使用了React Router进行路由管理。"
        />
      </Card>
      <Card className="about-card" hoverable>
        <Meta
          avatar={<Avatar icon={<TeamOutlined />} />}
          title="开发团队"
          description="我们的团队包括前端开发人员、后端开发人员和数据分析师。"
        />
      </Card>
    </div>
  );
}

export default About;
