import { google, memcache_v1 } from 'googleapis';
import { Client } from '../../google-cloud/client';

export class MemcacheClient extends Client {
  private client = google.memcache('v1');

  async iterateMemcachedInstances(
    callback: (data: memcache_v1.Schema$Instance) => Promise<void>,
  ) {
    const auth = await this.getAuthenticatedServiceClient();

    await this.iterateApi(
      async (nextPageToken) => {
        return this.client.projects.locations.instances.list({
          auth,
          parent: `projects/${this.projectId}/locations/-`,
          pageToken: nextPageToken,
        });
      },
      async (data: memcache_v1.Schema$ListInstancesResponse) => {
        for (const instance of data.instances || []) {
          await callback(instance);
        }
      },
    );
  }
}
