import 'dotenv/config'
import sourceMapSupport from 'source-map-support'
sourceMapSupport.install()
import express from 'express';
import expressWs from 'express-ws'
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';

const { app } = expressWs(express())
const PORT = process.env.NODE_PORT || 4000;

// Middleware
app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  cors({
    origin: (origin, callback) => {
      // if (origin) console.log('OriginForCORSCall', origin)
      callback(null, true)
    },
    optionsSuccessStatus: 200,
  }),
)
// app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/health', (req, res) => {
  console.log('health check')
  res.json({ status: 'ok' });
});

// Database connection and server start
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server up and running on port ${PORT}`)
})

export default server
