const express  = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth/auth');
const userRoutes = require('./routes/user/index');
const apiRoutes = require('./routes/api/index');
const authenticateToken = require('./middleware/middleware');

const app = express();
const PORT = 9000;
app.use(express.json());
app.use(cors());


// Authorization
app.use('/auth', authRoutes);
app.use('/u', authenticateToken, userRoutes);
app.use('/p', authenticateToken, apiRoutes);

app.listen(PORT, () => {
    console.log(`API Server running on ${PORT}`);
});
