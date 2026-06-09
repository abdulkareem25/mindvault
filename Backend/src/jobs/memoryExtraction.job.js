import * as extractionService from '../services/extraction.service.js';

export default function defineMemoryExtractionJob(agenda) {
  agenda.define('extract-memories', async (job) => {
    const { chatId, userId } = job.attrs.data;
    await extractionService.extractFromChat({ chatId, userId });
  });
}
