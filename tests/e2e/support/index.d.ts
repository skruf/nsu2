namespace Cypress {
  interface Chainable {
    getById: (testid: string) => Chainable
    startup: () => void
  }
}

// declare global {
interface Window {
  ipc: any
  db: any
  ready: boolean
}
// }
