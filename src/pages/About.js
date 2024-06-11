import React from 'react';
import { Card } from 'antd';
import './About.css';

const { Meta } = Card;

function About() {
  return (
    <div className="about-container">
      <Card className="about-card">
        <Meta title="关于我们" />
        <p className="about-content">该网站用于海洋环境监测，提供实时数据监测、数据上传与更新、数据报告生成等功能。</p>
      </Card>
      <Card className="about-card">
        <Meta title="框架搭建和开发环境" />
        <p className="about-content">本网站基于React框架，使用了React Router进行路由管理。</p>
      </Card>
      <Card className="about-card">
        <Meta title="开发团队" />
        <p className="about-content">我们的团队包括前端开发人员、后端开发人员和数据分析师。</p>
      </Card>
    </div>
  );
}

export default About;
