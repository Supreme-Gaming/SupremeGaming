import { mkdtemp, mkdir, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import * as path from 'path';

import { AgentCommandProgress, ListDirectoryResult } from '@supremegaming/agent/core';

import { listDirectoryHandler } from './list-directory';

describe('listDirectoryHandler', () => {
  const reports: AgentCommandProgress[] = [];
  const report = (update: Partial<AgentCommandProgress>) => {
    reports.push({
      requestId: 'req',
      status: update.status ?? 'running',
      timestamp: new Date().toISOString(),
      ...update,
    });
  };

  beforeEach(() => {
    reports.length = 0;
    delete process.env.AGENT_FS_ROOT;
  });

  afterEach(() => {
    delete process.env.AGENT_FS_ROOT;
  });

  it('lists files and directories', async () => {
    const dir = await mkdtemp(path.join(tmpdir(), 'sg-agent-ls-'));
    await writeFile(path.join(dir, 'readme.txt'), 'hello');
    await mkdir(path.join(dir, 'nested'));

    await listDirectoryHandler(
      { requestId: 'req', type: 'list-directory', payload: { path: dir }, issuedAt: new Date().toISOString() },
      report
    );

    const result = reports.find((r) => r.status === 'succeeded')?.data as ListDirectoryResult;
    expect(result.path).toBe(path.resolve(dir));
    expect(result.entries.map((e) => e.name).sort()).toEqual(['nested', 'readme.txt']);
    expect(result.entries.find((e) => e.name === 'nested')?.type).toBe('directory');
    expect(result.entries.find((e) => e.name === 'readme.txt')?.type).toBe('file');
  });

  it('rejects paths outside AGENT_FS_ROOT', async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'sg-agent-root-'));
    process.env.AGENT_FS_ROOT = root;

    await expect(
      listDirectoryHandler(
        {
          requestId: 'req',
          type: 'list-directory',
          payload: { path: path.join(root, '..') },
          issuedAt: new Date().toISOString(),
        },
        report
      )
    ).rejects.toMatchObject({ code: 'path_forbidden' });
  });

  it('requires payload.path', async () => {
    await expect(
      listDirectoryHandler(
        { requestId: 'req', type: 'list-directory', payload: { path: '' }, issuedAt: new Date().toISOString() },
        report
      )
    ).rejects.toMatchObject({ code: 'invalid_payload' });
  });
});
