declare global {
  interface Window {
    ipc: any
    ready: boolean
    // seedDb: () => Promise<void>,
    // resetDb: () => Promise<void>
  }
}
