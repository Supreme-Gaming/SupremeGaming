import { readdir, stat } from 'fs/promises';
import * as path from 'path';

import { AgentCommand, DirectoryEntry, ListDirectoryPayload, ListDirectoryResult } from '@supremegaming/agent/core';

import { AgentCommandError } from '../errors';
import { AgentCommandReporter } from '../dispatcher';

const MAX_ENTRIES = 500;

export async function listDirectoryHandler(
  command: AgentCommand<ListDirectoryPayload>,
  report: AgentCommandReporter
): Promise<void> {
  const rawPath = command.payload?.path;
  if (!rawPath || typeof rawPath !== 'string') {
    throw new AgentCommandError('invalid_payload', 'payload.path is required');
  }
  if (rawPath.includes('\0')) {
    throw new AgentCommandError('invalid_path', 'path contains invalid characters');
  }

  const resolved = path.resolve(rawPath);
  const allowedRoot = process.env.AGENT_FS_ROOT;
  if (allowedRoot) {
    const resolvedRoot = path.resolve(allowedRoot);
    const insideRoot = resolved === resolvedRoot || resolved.startsWith(resolvedRoot + path.sep);
    if (!insideRoot) {
      throw new AgentCommandError('path_forbidden', 'path is outside the allowed root');
    }
  }

  report({ status: 'running', message: `Listing ${resolved}` });

  let dirents;
  try {
    dirents = await readdir(resolved, { withFileTypes: true });
  } catch (err) {
    throw mapFsError(err, resolved);
  }

  const truncated = dirents.length > MAX_ENTRIES;
  const slice = truncated ? dirents.slice(0, MAX_ENTRIES) : dirents;
  const entries: DirectoryEntry[] = [];

  for (const dirent of slice) {
    const fullPath = path.join(resolved, dirent.name);
    const entry: DirectoryEntry = {
      name: dirent.name,
      path: fullPath,
      type: dirent.isDirectory() ? 'directory' : dirent.isFile() ? 'file' : 'other',
    };

    try {
      const info = await stat(fullPath);
      entry.sizeBytes = info.size;
      entry.modifiedAt = info.mtime.toISOString();
    } catch {
      // Broken symlink or raced delete — still include the name.
    }

    entries.push(entry);
  }

  const data: ListDirectoryResult = {
    path: resolved,
    truncated,
    entries,
  };

  report({
    status: 'succeeded',
    data,
  });
}

function mapFsError(err: unknown, resolved: string): AgentCommandError {
  const code = (err as NodeJS.ErrnoException)?.code;
  if (code === 'ENOENT') {
    return new AgentCommandError('not_found', `Directory not found: ${resolved}`);
  }
  if (code === 'ENOTDIR') {
    return new AgentCommandError('not_a_directory', `Not a directory: ${resolved}`);
  }
  if (code === 'EACCES' || code === 'EPERM') {
    return new AgentCommandError('permission_denied', `Permission denied: ${resolved}`);
  }
  const message = err instanceof Error ? err.message : String(err);
  return new AgentCommandError('list_failed', message);
}
