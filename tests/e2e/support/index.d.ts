declare namespace Cypress {
  interface Chainable<Subject> {
    getById(testid: string): Chainable
    startup(): Chainable
    acceptConfirmation(): Chainable
    inputEventsForm(data: object): Chainable
    random(): Chainable
    selectMember(): Chainable
    addWeapon(): Chainable
  }
}

interface Window {
  ipc: any
  ready: boolean
}
