import { IntegrationStep } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../../types';
import { WebSecurityScannerClient } from '../client';
import {
  WebSecurityScannerEntities,
  WebSecurityScannerSteps,
} from '../constants';
import { createScanConfigEntity } from '../converters';

async function fetchScanConfigs(
  context: IntegrationStepContext,
): Promise<void> {
  const {
    jobState,
    instance: { config },
  } = context;
  const client = new WebSecurityScannerClient({ config });

  await client.iterateScanConfigs(async (data) => {
    await jobState.addEntity(createScanConfigEntity(data));
  });
}

export const fetchScanConfigsStepMap: IntegrationStep<IntegrationConfig> = {
  id: WebSecurityScannerSteps.FETCH_SCAN_CONFIGS.id,
  name: WebSecurityScannerSteps.FETCH_SCAN_CONFIGS.name,
  entities: [WebSecurityScannerEntities.SCAN_CONFIG],
  relationships: [],
  dependsOn: [],
  executionHandler: fetchScanConfigs,
};
