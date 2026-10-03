import Express, { type Request } from 'express';

const tunnel = Express.Router();

const SENTRY_HOST = 'o4512156987228160.ingest.de.sentry.io';
const SENTRY_PROJECT_IDS = ['4512157012197456'];

interface SentryEnvelopeHeader {
  dsn?: string;
}

// Reference [6]
tunnel.post(
  '/',
  Express.raw({ type: '*/*', limit: '1mb' }),
  async (req: Request<unknown, unknown, Buffer>, res) => {
    try {
      const envelopeBuffer = req.body;
      const envelope = envelopeBuffer.toString('utf-8');
      const piece = envelope.split('\n')[0];
      if (!piece) {
        throw Error('no piece');
      }
      const header = JSON.parse(piece) as SentryEnvelopeHeader;
      if (!header.dsn) {
        throw Error('no dsn');
      }
      const dsn = new URL(header.dsn);
      const project_id = dsn.pathname.replace('/', '');

      if (dsn.hostname !== SENTRY_HOST) {
        throw Error(`Invalid sentry hostname: ${dsn.hostname}`);
      }

      if (!project_id || !SENTRY_PROJECT_IDS.includes(project_id)) {
        throw Error(`Invalid sentry project id: ${project_id}`);
      }

      const upstream_sentry_url
        = `https://${SENTRY_HOST}/api/${project_id}/envelope/`;
      await fetch(upstream_sentry_url, {
        method: 'POST',
        body: new Uint8Array(envelopeBuffer)
      });

      res.status(200).end();
    } catch (e) {
      console.error('error tunneling to sentry', e);
      res.status(500).json({ error: 'error tunneling to sentry' });
    }
  }
);

export default tunnel;
