import { Transform } from 'class-transformer';

export function ToStringId(): PropertyDecorator {
  return Transform(({ obj, key }) => {
    const raw = key === 'id' ? obj._id ?? obj.id : obj[key];

    if (raw == null) {
      return undefined;
    }

    if (typeof raw === 'object' && ('_id' in raw || 'id' in raw)) {
      return String(raw._id ?? raw.id);
    }

    return String(raw);
  });
}

export function ToIsoDate(): PropertyDecorator {
  return Transform(({ value }) => (value instanceof Date ? value.toISOString() : value));
}
