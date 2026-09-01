import { validate } from 'class-validator';

import { ObjectIdParamsDto } from './object-id-params.dto';

describe('ObjectIdParamsDto', () => {
  it('accepts a 24-character hex ObjectId', async () => {
    const params = Object.assign(new ObjectIdParamsDto(), { id: '507f1f77bcf86cd799439011' });

    expect(await validate(params)).toHaveLength(0);
  });

  it('rejects a non-ObjectId path param', async () => {
    const params = Object.assign(new ObjectIdParamsDto(), { id: 'not-an-id' });

    expect(await validate(params)).not.toHaveLength(0);
  });
});
