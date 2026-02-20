declare module 'recordrtc' {
  class RecordRTC {
    constructor(stream: MediaStream, options?: Record<string, unknown>);
    startRecording(): void;
    stopRecording(callback?: () => void): void;
    getBlob(): Blob;
  }

  export default RecordRTC;
}
