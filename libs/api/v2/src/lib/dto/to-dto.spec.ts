import { InternalServerErrorException } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

import { GameServerResponseDto } from '../modules/servers/dto/game-server-response.dto';
import { toDto } from './to-dto';

class SampleResponseDto {
  @Expose()
  @IsString()
  public id: string;

  @Expose()
  @IsString()
  public name: string;
}

describe('toDto', () => {
  it('maps a mongoose-like document and strips unexposed fields', async () => {
    const doc = {
      id: '507f1f77bcf86cd799439011',
      name: 'Alpha',
      rconpass: 'secret',
      toJSON() {
        return { id: this.id, name: this.name, rconpass: this.rconpass };
      },
    };

    const result = await toDto(SampleResponseDto, doc);

    expect(result).toBeInstanceOf(SampleResponseDto);
    expect(result).toEqual({ id: '507f1f77bcf86cd799439011', name: 'Alpha' });
    expect(result).not.toHaveProperty('rconpass');
  });

  it('maps arrays of records', async () => {
    const result = await toDto(SampleResponseDto, [
      { id: '1', name: 'One', extra: true },
      { id: '2', name: 'Two' },
    ]);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ id: '1', name: 'One' });
    expect(result[1]).toEqual({ id: '2', name: 'Two' });
  });

  it('throws a 500 when the outgoing payload fails validation', async () => {
    await expect(toDto(SampleResponseDto, { id: 10, name: 'Bad' })).rejects.toBeInstanceOf(InternalServerErrorException);
  });

  it('omits validation details when hideErrorDetails is set', async () => {
    try {
      await toDto(SampleResponseDto, { name: 'Missing id' }, { hideErrorDetails: true });
      fail('expected toDto to throw');
    } catch (err) {
      expect(err).toBeInstanceOf(InternalServerErrorException);
      expect((err as InternalServerErrorException).getResponse()).toEqual({
        message: 'Response validation failed',
      });
    }
  });

  it('returns nullish values unchanged', async () => {
    expect(await toDto(SampleResponseDto, null)).toBeNull();
    expect(await toDto(SampleResponseDto, undefined)).toBeUndefined();
  });

  it('maps a game server document and drops sensitive fields', async () => {
    const result = await toDto(GameServerResponseDto, {
      _id: '507f1f77bcf86cd799439011',
      host: { _id: '507f191e810c19729de860ea' },
      port: 7777,
      rconport: 27020,
      game: 'ark',
      map_name: 'TheIsland',
      rconpass: 'hunter2',
      shouldProcess: true,
      server_directory: '/opt/ark',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    });

    expect(result).toEqual({
      id: '507f1f77bcf86cd799439011',
      host: '507f191e810c19729de860ea',
      port: 7777,
      rconport: 27020,
      game: 'ark',
      map_name: 'TheIsland',
      createdAt: '2026-01-01T00:00:00.000Z',
    });
    expect(result).not.toHaveProperty('rconpass');
    expect(result).not.toHaveProperty('shouldProcess');
    expect(result).not.toHaveProperty('server_directory');
  });

  it('can skip validation', async () => {
    class NumericDto {
      @Expose()
      @IsInt()
      public count: number;
    }

    const result = await toDto(NumericDto, { count: 'nope' }, { validate: false });

    expect(result.count).toBe('nope');
  });
});
