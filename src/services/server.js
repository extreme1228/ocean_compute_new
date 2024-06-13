const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3010;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '2021*Lbw5731606',
  database: 'ocean_compute'
});

db.connect(err => {
  if (err) {
    console.error('无法连接到数据库:', err);
    return;
  }
  console.log('已成功连接到数据库');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';

  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('查询出错:', err);
      res.status(500).send('服务器错误');
      return;
    }

    if (results.length > 0) {
      const user = results[0];
      res.json({ success: true, message: '登录成功', userId: user.User_ID });
    } else {
      res.status(401).json({ success: false, message: '用户名或密码错误' });
    }
  });
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const query = 'INSERT INTO users (username, password) VALUES (?, ?)';

  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('插入出错:', err);
      res.status(500).send('服务器错误');
      return;
    }
    res.status(201).send({ success: true, message: '注册成功' });
  });
});


app.get('/stations/:userId', (req, res) => {
  const { userId } = req.params;
  db.query('SELECT * FROM stations WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

app.post('/stations', (req, res) => {
  const { userId, name, lat, lon, info, data } = req.body;
  db.query('INSERT INTO stations (user_id, name, lat, lon, info, data) VALUES (?, ?, ?, ?, ?, ?)', [userId, name, lat, lon, info, data], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send({ id: results.insertId });
    }
  });
});


app.put('/stations/:userId/:id', (req, res) => {
  const { userId, id } = req.params;
  const { name, lat, lon, info, data } = req.body;
  const query = 'UPDATE stations SET name = ?, lat = ?, lon = ?, info = ?, data = ? WHERE id = ? AND user_id = ?';

  db.query(query, [name, lat, lon, info, data, id, userId], (err, result) => {
    if (err) {
      console.error('更新出错:', err);
      res.status(500).send('服务器错误');
      return;
    }
    res.sendStatus(200);
  });
});

app.delete('/stations/:userId/:stationId', (req, res) => {
  const { userId, stationId } = req.params;
  db.query('DELETE FROM stations WHERE id = ? AND user_id = ?', [stationId, userId], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(204).send();
    }
  });
});


// 获取某站点指定时间范围内的数据
app.get('/data/:stationId', (req, res) => {
  const { stationId } = req.params;
  const { startDate, endDate } = req.query;
  const query = 'SELECT * FROM data WHERE Station_ID = ? AND Timestamp BETWEEN ? AND ?';
  db.query(query, [stationId, startDate, endDate], (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Server error');
    } else {
      res.json(results);
    }
  });
});



app.post('/data', (req, res) => {
  const { Station_ID, Timestamp, Temperature, Salinity, pH, notes } = req.body;
  const query = 'INSERT INTO data (Station_ID, Timestamp, Temperature, Salinity, pH, notes) VALUES (?, ?, ?, ?, ?, ?)';

  db.query(query, [Station_ID, Timestamp, Temperature, Salinity, pH, notes], (err, result) => {
    if (err) {
      console.error('插入出错:', err);
      res.status(500).send('服务器错误');
    } else {
      res.json({ id: result.insertId });
    }
  });
});

app.delete('/data/:dataId', (req, res) => {
  const dataId = req.params.dataId;
  const query = 'DELETE FROM data WHERE Data_ID = ?';

  db.query(query, [dataId], (err, result) => {
    if (err) {
      console.error('删除出错:', err);
      res.status(500).send('服务器错误');
    } else {
      res.sendStatus(204);
    }
  });
});



// 获取某站点指定时间范围内的污染物数据
app.get('/pollutants/:stationId', (req, res) => {
  const { stationId } = req.params;
  const { startDate, endDate } = req.query;
  const query = 'SELECT * FROM pollutant_data WHERE Station_ID = ? AND Timestamp BETWEEN ? AND ?';
  db.query(query, [stationId, startDate, endDate], (err, results) => {
    if (err) {
      console.error('Error fetching pollutant data:', err);
      res.status(500).send('Server error');
    } else {
      res.json(results);
    }
  });
});

app.post('/pollutants', (req, res) => {
  const { Station_ID, Pollutant_Type, Concentration, Safety_Threshold, Timestamp } = req.body;
  const query = 'INSERT INTO pollutant_data (Station_ID, Pollutant_Type, Concentration, Safety_Threshold, Timestamp) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [Station_ID, Pollutant_Type, Concentration, Safety_Threshold, Timestamp], (err, results) => {
    if (err) {
      console.error('插入污染物数据出错:', err);
      res.status(500).send('服务器错误');
    } else {
      res.json({ id: results.insertId });
    }
  });
});

app.delete('/pollutants/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM pollutant_data WHERE Pollutant_Data_ID = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('删除污染物数据出错:', err);
      res.status(500).send('服务器错误');
    } else {
      res.sendStatus(200);
    }
  });
});



// 获取所有用户
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});

// 添加新用户
app.post('/users', (req, res) => {
  const { username, password, user_type, contact_info } = req.body;
  const query = 'INSERT INTO users (Username, Password, User_Type, Contact_Info) VALUES (?, ?, ?, ?)';
  db.query(query, [username, password, user_type, contact_info], (err, results) => {
    if (err) {
      console.error('Error adding user:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json({ id: results.insertId });
  });
});

// 删除用户
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM users WHERE User_ID = ?';
  db.query(query, [id], (err) => {
    if (err) {
      console.error('Error deleting user:', err);
      res.status(500).send('Server error');
      return;
    }
    res.sendStatus(204);
  });
});






// 保存报告
app.post('/reports', (req, res) => {
  const { Station_ID, Template_Name, Report_Content, Start_Date, End_Date } = req.body;
  const query = 'INSERT INTO Reports (Station_ID, Template_Name, Report_Content, Start_Date, End_Date) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [Station_ID, Template_Name, Report_Content, Start_Date, End_Date], (err, result) => {
    if (err) {
      console.error('Error saving report:', err);
      res.status(500).send('Server error');
    } else {
      res.json({ id: result.insertId });
    }
  });
});
app.listen(port, () => {
  console.log(`服务器已启动，监听端口 ${port}`);
});
