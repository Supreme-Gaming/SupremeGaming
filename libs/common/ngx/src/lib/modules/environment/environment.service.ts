import { Inject, Injectable } from '@angular/core';

// Injection token
export const ENVIRONMENT = 'environment';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  constructor(@Inject(ENVIRONMENT) private env) {}

  /**
   * Returns an environment value lookup by token.
   */
  public value<T, R>(key?: keyof T, optional = false): R {
    if (key === undefined) {
      return this.env;
    }

    if (Object.prototype.hasOwnProperty.call(this.env, key)) {
      const parsed = JSON.parse(JSON.stringify(this.env[key]));
      return parsed;
    } else {
      if (optional) {
        console.log(
          `Environment does not contain "${key}}" in environment. Key is marked optional. Execution is not halted.`
        );
        return;
      } else {
        throw new Error(`Environment does not have "${key}" in environment. Halting execution.`);
      }
    }
  }
}
