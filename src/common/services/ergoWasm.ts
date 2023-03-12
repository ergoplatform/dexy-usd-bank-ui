import { RustModule } from '@ergolabs/ergo-sdk';
import { from, publishReplay, refCount } from 'rxjs';

export const ergoWasm$ = from(RustModule.load()).pipe(
  publishReplay(1),
  refCount(),
);
