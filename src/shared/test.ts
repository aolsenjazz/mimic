import * as Revivable from '@shared/revivable';

console.log('hello from test');

@Revivable.register
export class Test {
  toJSON() {
    return {
      name: this.constructor.name,
      args: [],
    };
  }
}
