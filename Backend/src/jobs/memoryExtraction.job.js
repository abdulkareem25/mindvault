export default function defineMemoryExtractionJob(agenda) {
  agenda.define('extract-memories', async (job) => {
    // Empty stub for now, will be implemented in Ticket-005
    console.log('Stub extract-memories job executed with data:', job.attrs.data);
  });
}
