import { google, storage_v1 } from 'googleapis';
import { Client } from '../../google-cloud/client';

export function createStorageBucketClientMapper(
  callback: (data: storage_v1.Schema$Bucket) => Promise<void>,
) {
  return async (data: storage_v1.Schema$Buckets) => {
    for (const bucket of data.items || []) {
      await callback(bucket);
    }
  };
}

export class CloudStorageClient extends Client {
  private client = google.storage({ version: 'v1', retry: false });

  async iterateCloudStorageBuckets(
    callback: (data: storage_v1.Schema$Bucket) => Promise<void>,
  ): Promise<void> {
    const auth = await this.getAuthenticatedServiceClient();

    await this.iterateApi(async (nextPageToken) => {
      return this.client.buckets.list({
        project: this.projectId,
        auth,
        pageToken: nextPageToken,
      });
    }, createStorageBucketClientMapper(callback));
  }

  async getPolicy(bucket: string): Promise<storage_v1.Schema$Policy> {
    const auth = await this.getAuthenticatedServiceClient();

    const result = await this.client.buckets.getIamPolicy({
      auth,
      bucket,
    });

    return result.data;
  }
}
