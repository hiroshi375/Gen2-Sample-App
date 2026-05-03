declare module 'fast-text-encoding' {
  export class TextEncoder {
    constructor();
    encode(input?: string): Uint8Array;
  }

  export class TextDecoder {
    constructor(label?: string, options?: { fatal?: boolean; ignoreBOM?: boolean });
    decode(input?: BufferSource, options?: { stream?: boolean }): string;
  }
}
