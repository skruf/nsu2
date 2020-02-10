declare namespace Cypress {
  interface Chainable<Subject> {
    getById(testid: string): Chainable
    startup(): Chainable
    acceptConfirmation(): Chainable
    inputEventsForm(event: object): Chainable
    random(): Chainable
    searchTable(value: string, inputId: string, tableId: string): Chainable,
    pickFromSelect(testid: string, value: string): Chainable,
    datePickerPickFirst(testid: string): Chainable,
    datePickerPickLast(testid: string): Chainable,

    pickFromDatePicker(testid: string, value: string): Chainable
  }
}

interface Window {
  ipc: any
  ready: boolean
}
