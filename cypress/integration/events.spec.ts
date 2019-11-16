import { randomArrayItemUtil } from "../../src/app/utils"
import {
  eventsFixture,
  eventsCategoriesFixture
} from "../../src/app/fixtures"

describe("events", () => {
  it("Open app", () => {
    cy.visit("http://localhost:1234")
  })

  it("Navigate to events", () => {
    cy.getById("eventsAllMenuItem").click({ force: true })
  })

  it("Create categories", () => {
    // "category": { "name": "Verdensmesterskap" },
    // "category": { "name": "Lokalt stevne" },

    cy.getById("eventsCategoriesMenuItem").click({ force: true })
    const create = (category) => {
      cy.getById("eventsCategoriesOpenCreateDialogButton").click()
      cy.getById("eventsCategoriesCreateDialogFormInputName").type("Verdensmesterskap")
      cy.getById("eventsCategoriesCreateDialogFormButtonSubmit").click()
      cy.getById("eventsCategoriesListTable").contains("Verdensmesterskap")
    }
    eventsCategoriesFixture.forEach(create)
  })

  it("Navigate to events", () => {
    cy.getById("eventsAllMenuItem").click({ force: true })
  })

  it("Create many events", () => {
    const create = (event) => {
      cy.getById("eventsOpenCreateDialogButton").click()
      cy.getById("eventsCreateDialogFormInputTitle").type(event.title)
      cy.getById("eventsCreateDialogFormDatePickerDates").click()
      cy.get(".available").first().click()
      cy.get(".available").last().click()
      cy.getById("eventsCreateDialogFormSelectCategory").click()
      cy.getById(`eventsCreateDialogFormSelectCategoryValueVerdensmesterskap`).first().click()
      cy.getById("eventsCreateDialogFormButtonSubmit").click()
      cy.getById("eventsListTable").contains(event.title)
    }

    for(let i = 0; i <= 2; i++) {
      const f = randomArrayItemUtil(eventsFixture)
      create({ ...f, title: `${i} - ${f.title}` })
    }
  })

  it("Delete one event", () => {
    cy.getById("eventsListTableRowDropdown").first().click({ force: true })
    cy.getById("eventsListTableRowDropdownRemoveOne").first().click({ force: true })
    cy.get(".el-message-box .el-button--primary").click()
  })

  it("Edit one event", () => {
    cy.wait(200)
    cy.getById("eventsListTableRowDropdown").first().click({ force: true })
    cy.getById("eventsListTableRowDropdownOpenEditDialog").first().click({ force: true })
    cy.getById("eventsEditDialogFormLabelApprobated").click({ force: true })
    cy.getById("eventsEditDialogFormButtonSubmit").click()
    cy.getById("eventsListTable").contains("Er approbert")
  })

  it("Delete many events", () => {
    cy.get(".el-checkbox").first().click()
    cy.getById("eventsListTableRowDropdownRemoveMany").click({ force: true })
    cy.get(".el-message-box .el-button--primary").click({ force: true })
  })
})
