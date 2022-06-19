import {parse} from "papaparse"

describe('Data Generator', () => {

    beforeEach(() => {
        cy.visit('http://localhost:3000/')
    })

    it('Checks if first name has been added', () => {
        cy.get('#select-key-drop-basic').select('firstName')
        cy.get('#btn-add-prop').click()
        cy.get('#object-props > ul').should('contain.text', 'firstName')
    })

    it('Check if it generates and arranges a CSV available for download', () => {
        cy.get('#entries-input').type("5")
        cy.get('#select-key-drop-basic').select('First Name')
        cy.get('#btn-add-prop').click()
        cy.get('#select-key-drop-basic').select('Last Name')
        cy.get('#btn-add-prop').click()
        cy.get('#select-key-drop-basic').select('Email')
        cy.get('#btn-add-prop').click()
        cy.get('#custom-input').type('car')
        cy.get('#value-select-custom').select('Vehicle')
        cy.get('#select-key-drop-car-custom').select('Car')
        cy.get('#btn-add-custom').click()

        cy.contains('Generate CSV').click()
        cy.contains('Arrange CSV').click()
        cy.contains('Download CSV').click()
    })

    it('Add&Clear', () => {
        cy.get('#custom-input').type('Forename')
        cy.get('#value-select-custom').select('First Name')
        cy.get('#btn-add-custom').click()
        cy.get('#custom-input').should('be.empty')
        cy.get('#object-props').contains('Forename')
        cy.get('#btn-clear-object').click()
        cy.get('#object-props > ul').should('be.empty')
    })

    it("Should have key features on page", () => {
        cy.get("#select-key-drop-basic").should('exist')
        cy.get("#btn-add-prop").should('exist')
        cy.get("#btn-add-custom").should('exist')
        cy.get("#btn-clear-object").should('exist')
        cy.get("#custom-input").should('exist')
        cy.get("#value-select-custom").should('exist')
    })

    it("Should add keys and custom keys, then clear the keys", () => {
        cy.get("#select-key-drop-basic").select("firstName");
        cy.get("#btn-add-prop").click();
        cy.get("#select-key-drop-basic").select("lastName");
        cy.get("#btn-add-prop").click();
        cy.get("#custom-input").clear();
        cy.get("#custom-input").type("nickName");
        cy.get("#value-select-custom").select("firstName");
        cy.get("#btn-add-custom").click();
        cy.get("#btn-clear-object").click();
    });

    it('Should show an error message if you try to generate a CSV with no data', () => {

        cy.get('#btn-get-data').click()
        cy.contains('Error: No entries value specified')

    })

    it('Can close CSV error message', () => {

        cy.get('#btn-get-data').click()
        cy.contains('Error: No entries value specified')
        cy.get('#btn-error-confirm').click()
        cy.get('body').not(':contains("Error: No entries value specified")')

    })

    it('Check entries field cannnot be empty', () => {
        cy.visit('http://localhost:3000/')

        cy.get('#select-key-drop-basic').select('First Name')
        cy.get('#btn-add-prop').click()
        cy.get('#select-key-drop-basic').select('Last Name')
        cy.get('#btn-add-prop').click()
        cy.get('#select-key-drop-basic').select('Email')
        cy.get('#btn-add-prop').click()

        cy.get('#btn-get-data').click()
        cy.contains('Error: No entries value specified')
    })

    it('Check entries field cannnot be negative', () => {
   

        cy.get('#entries-input').type("-2")
        cy.get('#select-key-drop-basic').select('First Name')
        cy.get('#btn-add-prop').click()

        cy.get('#btn-get-data').click()
        cy.contains('Error: No entries value specified')
    })

    it('Check entries field cannnot be decimals', () => {
    

        cy.get('#entries-input').type("1.5")
        cy.get('#select-key-drop-basic').select('First Name')
        cy.get('#btn-add-prop').click()

        cy.get('#btn-get-data').click()
        cy.get('body').not(':contains("Error: No properties selected")')
    })
})

//Parsing data
describe('Convert CSV file in JSON file', function(){
    let allData        
    before(()=>{
        cy.readFile('C:/Users/venqu/OneDrive/Dokumenty/Advances Scripting/PHP/cypress/downloads/generatedBy_react-csv.csv', 'ascii')
            .then(str =>{
                cy.writeFile('C:/data/cypress/fixtures/testDataFromCSV.json', parse(str, {header:true}), 'ascii')
            })
        cy.fixture('parsedData.json', 'ascii')
            .as('dataJson')
            .then(dataJson => {
                allData = dataJson
            })
    })

    it('Log the data from the CSV to the JSON file', function(){       
        allData.data.forEach(data =>{
            cy.log(data.phoneNo)
            cy.log(data.firstName)
            cy.log(data.lastName)
            cy.log(data.email)
            cy.log(data.address)
            cy.log(data.vehicle)
        })
    })

    it('Use JSON Data in hte HTML form', function(){ 
        allData.data.forEach(data =>{
            cy.visit('http://localhost:8080/Webform')
            cy.fixture("parsedData.json", 'ascii')
                .as('dataJson')
                .then((dataJson)=>{
                    allData = JSON.stringify(dataJson)                
                    cy.get('[cy-data="firstname"]')
                        .type(data.firstName)
                    cy.get('[cy-data="lastname"]')
                        .type(data.lastName)
                    cy.get('[cy-data="email"]')
                        .type(data.email);
                    cy.get('[cy-data="address"]')
                        .type(data.address);
                    cy.get('[cy-data="vehicle"]')
                        .type(data.vehicle);
                    cy.get('[cy-data="submit"]')
                        .click()
                })
        })
    })
})