import Agenda from 'agenda';
import defineMemoryExtractionJob from '../jobs/memoryExtraction.job.js';
import defineDigestJob from '../jobs/digest.job.js';

const agenda = new Agenda({
  db: { 
    address: process.env.MONGODB_URI || process.env.DB_URI, 
    collection: process.env.AGENDA_COLLECTION || 'agendaJobs' 
  },
  processEvery: process.env.AGENDA_PROCESS_EVERY || '30 seconds',
  maxConcurrency: parseInt(process.env.AGENDA_MAX_CONCURRENCY) || 5,
});

// Register job definitions
defineMemoryExtractionJob(agenda);
defineDigestJob(agenda);

export default agenda;

