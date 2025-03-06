describe('Search Functionality', () => {
    beforeEach(() => {
        cy.visit('/');
    });
    // basic functions
    it('should display the search bar', () => {
        cy.get('input[type="text"]').should('be.visible');
        cy.get('button').contains('Search').should('be.visible');
    });
    //
    it('should allow typing in the search bar', () => {
        const searchTerm = 'test search';
        cy.get('input[type="text"]').type(searchTerm)
        cy.get('input[type="text"]').should('have.value', searchTerm);
    });
    //
    // // Task 1a
    it('should perform a search when clicking the search button', () => {
        const searchTerm = 'child';
        cy.get('input[type="text"]').type(searchTerm);
        cy.get('button').contains('Search').click();
        cy.get('.search-result-list .search-result-item').should('have.length.gt', 0);
    });
    it('should perform a search when pressing enter', () => {
        const searchTerm = 'child';
        cy.get('input[type="text"]').type(searchTerm);
        cy.get('input[type="text"]').type('{enter}');
        cy.get('.search-result-list .search-result-item').should('have.length.gt', 0);
    })
    it('should highlight Child text in search result', () => {
        const searchTerm = 'child';
        cy.get('input[type="text"]').type(searchTerm);
        cy.get('input[type="text"]').type('{enter}');
        cy.get('.search-result-list .search-result-item .highlighted-element').first().should('contain', 'child');
    });

    // Task 2a

    it('should show not show suggestions when typing ch', () => {
        cy.get('input[type="text"]').type('ch');
        cy.get('.suggestions').should('not.exist');
    })

    it('should show suggestions when typing chi', () => {
        cy.get('input[type="text"]').type('chi');
        cy.get('.suggestions').should('be.visible');
        cy.get('.suggestions > div').should('have.length.gt', 0);
        cy.get('.suggestions > div').should('have.length.lt', 7);
    });

    it('should not show suggestion after clear text', () => {
        cy.get('input[type="text"]').type('chi');
        cy.get('.suggestions > div').should('have.length.gt', 0);

        cy.get('input[type="text"]').type('{backspace}'.repeat(1))
        cy.get('.suggestions').should('not.exist');
    })

    // Task 2b
    it('can use click suggestions', () => {
        cy.get('input[type="text"]').type('chi');
        cy.get('.suggestions').should('be.visible');
        cy.get('.suggestions > div').should('have.length.gt', 0);

        cy.get('.suggestions > div .suggestion-text-value').first().should('have.text', 'child care');
        cy.get('.suggestions > div').eq(0).click();
        cy.get('input[type="text"]').should('have.value', 'child care');
    });

    it('can use arrows to navigate suggestions', () => {
        cy.get('input[type="text"]').type('chi');
        cy.get('.suggestions').should('be.visible');
        cy.get('.suggestions > div').should('have.length.gt', 0);
        // type arrow down
        cy.get('input[type="text"]').type('{downarrow}');
        cy.get('.suggestions > div').eq(1).get('div').should('have.class', 'highlight');
        // type arrow up
        cy.get('input[type="text"]').type('{uparrow}');
        cy.get('.suggestions >  div').first().get('div').should('have.class', 'highlight');
        // type arrow enter
        cy.get('input[type="text"]').type('{enter}');
        cy.get('.suggestions').should('not.exist');
        cy.get('input[type="text"]').should('have.value', 'child care');
    });

    // Task 2c
    it('not show clear button when input is empty', () => {
        cy.get('.clear-button').should('not.exist');
    })
    it('show clear button when there is a search term', () => {
        cy.get('input[type="text"]').type('c');
        cy.get('.clear-button').should('exist');
    })

    // Task 2d
    it('should clear the search, suggestion and clear button, when clicking the reset button', () => {
        const searchTerm = 'chi';
        cy.get('input[type="text"]').type(searchTerm);
        cy.get('.suggestions > div').should('have.length.gt', 0);

        cy.get('.clear-button').click();
        cy.get('input[type="text"]').should('have.value', '');
        cy.get('.clear-button').should('not.exist');
        cy.get('.suggestions').should('not.exist');
        // input should be focused after reset
        cy.get('input[type="text"]').should('be.focused');
    });

});