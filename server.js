const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// 内存数据存储（可替换为数据库）
let menuItems = [];
let voteData = { lunch: {}, dinner: {} };
let voteVoters = { lunch: [], dinner: [] };

// 获取菜单
app.get('/api/menu', (req, res) => {
  res.json({ menu: menuItems });
});

// 添加菜单项
app.post('/api/menu', (req, res) => {
  const { food } = req.body;
  if (!food || menuItems.includes(food)) {
    return res.status(400).json({ error: '无效或重复的菜品' });
  }
  menuItems.push(food);
  res.json({ success: true });
});

// 删除菜单项
app.delete('/api/menu', (req, res) => {
  const { food } = req.body;
  menuItems = menuItems.filter(item => item !== food);
  res.json({ success: true });
});

// 获取投票数据
app.get('/api/vote', (req, res) => {
  res.json({ voteData, voteVoters });
});

// 提交投票
app.post('/api/vote', (req, res) => {
  const { session, food, voterId } = req.body;
  if (!session || !food || !voterId) {
    return res.status(400).json({ error: '参数不全' });
  }
  if (voteVoters[session].includes(voterId)) {
    return res.status(400).json({ error: '已投票' });
  }
  if (!voteData[session][food]) voteData[session][food] = 0;
  voteData[session][food]++;
  voteVoters[session].push(voterId);
  res.json({ success: true });
});

// 清空菜单
app.post('/api/clear', (req, res) => {
  menuItems = [];
  voteData = { lunch: {}, dinner: {} };
  voteVoters = { lunch: [], dinner: [] };
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`API服务已启动: http://localhost:${port}`);
});