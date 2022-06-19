describe('Data Collector', () => {

    beforeEach(() => {
        cy.visit('http://localhost:8080/Webform')
    })

    it('Checks if first name has been added', () => {
        cy.contains("Data Collector")
  
    })




})