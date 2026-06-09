import * as digestService from '../services/digest.service.js';

export default function defineDigestJob(agenda) {
  agenda.define('generate-digest', async (job) => {
    const { userId } = job.attrs.data;
    await digestService.generateAndSaveDigest({ userId });
  });
}
