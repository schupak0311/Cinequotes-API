import dotenv from 'dotenv';
import app from './app';
import logger from './logger';

const result = dotenv.config();
if (result.error) {
  dotenv.config({ path: '.env.default' });
}

app.listen(app.get('port'), (): void => {
  console.log(
    "\x1b[36m%s\x1b[0m", // eslint-disable-line
    `🌏 Server started at http://localhost:${app.get('port')}`
  );
});

process.on('SIGINT', () => {
  logger.info('Gracefully shutting down');
});
