import { AgentCommandProgress } from '@supremegaming/agent/core';

import { AgentCommandDispatcher } from './dispatcher';
import { AgentCommandError } from './errors';

describe('AgentCommandDispatcher', () => {
  it('rejects unknown command types', async () => {
    const dispatcher = new AgentCommandDispatcher();
    const events: AgentCommandProgress[] = [];

    await dispatcher.execute(
      { requestId: 'req-1', type: 'nope', payload: {}, issuedAt: new Date().toISOString() },
      (progress) => events.push(progress)
    );

    expect(events.map((e) => e.status)).toEqual(['accepted', 'rejected']);
    expect(events[1].error?.code).toBe('unknown_command');
  });

  it('runs a handler and reports progress through to succeeded', async () => {
    const dispatcher = new AgentCommandDispatcher();
    dispatcher.register('echo', async (command, report) => {
      report({ status: 'running', progress: 50, message: 'halfway' });
      report({ status: 'succeeded', data: command.payload });
    });

    const events: AgentCommandProgress[] = [];
    await dispatcher.execute(
      { requestId: 'req-2', type: 'echo', payload: { hello: 'world' }, issuedAt: new Date().toISOString() },
      (progress) => events.push(progress)
    );

    expect(events.map((e) => e.status)).toEqual(['accepted', 'running', 'running', 'succeeded']);
    expect(events[2].progress).toBe(50);
    expect(events[3].data).toEqual({ hello: 'world' });
    expect(events.every((e) => e.requestId === 'req-2')).toBe(true);
  });

  it('maps handler errors onto a failed progress event', async () => {
    const dispatcher = new AgentCommandDispatcher();
    dispatcher.register('boom', async () => {
      throw new AgentCommandError('nope', 'something went wrong');
    });

    const events: AgentCommandProgress[] = [];
    await dispatcher.execute(
      { requestId: 'req-3', type: 'boom', payload: {}, issuedAt: new Date().toISOString() },
      (progress) => events.push(progress)
    );

    expect(events.map((e) => e.status)).toEqual(['accepted', 'running', 'failed']);
    expect(events[2].error).toEqual({ code: 'nope', message: 'something went wrong' });
  });

  it('ignores commands without a requestId', async () => {
    const dispatcher = new AgentCommandDispatcher();
    const emit = jest.fn();

    await dispatcher.execute({ requestId: '', type: 'echo', payload: {}, issuedAt: new Date().toISOString() }, emit);

    expect(emit).not.toHaveBeenCalled();
  });
});
