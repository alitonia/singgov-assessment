describe('Advanced Search Functionality With Api Mock', () => {
    beforeEach(() => {
        cy.visit('/');
        // wait 2 seconds to allow the page to load and not dos the API calls
        cy.wait(1000);
    });
    // Task 1a
    it('should perform a search when clicking the search button', () => {
        const searchTerm = 'vacci';
        cy.get('input[type="text"]').type(searchTerm);
        cy.get('button').contains('Search').click();
        cy.get('.search-result-list .search-result-item').should('have.length.gt', 0);
    });

    it('should perform a search when pressing enter', () => {
        const searchTerm = 'vacci';
        cy.get('input[type="text"]').type(searchTerm);
        cy.get('input[type="text"]').type('{enter}');
        cy.get('.search-result-list .search-result-item').should('have.length.gt', 0);
    })

    it('should highlight Child text in search result', () => {
        const searchTerm = 'vacci';
        cy.get('input[type="text"]').type(searchTerm);
        cy.get('input[type="text"]').type('{enter}');
        cy.get('.search-result-list .search-result-item .highlighted-element').first().invoke('text').should('match', /vacci/i);
    });
    it('show no results when search term does not match', () => {
        const searchTerm = 'no match';
        cy.get('input[type="text"]').type(searchTerm);
        cy.get('input[type="text"]').type('{enter}');
        cy.get('.search-result-list .search-result-item').should('have.length', 0);
    })

    // task 2a

    it('should show suggestions when typing vacci', () => {
        cy.get('input[type="text"]').type('vacci');
        cy.get('.suggestions').should('be.visible');
        cy.get('.suggestions > div').should('have.length.gt', 0);
        cy.get('.suggestions > div').should('have.length.lt', 7);
    });

    //
    it('should show not show suggestions when typing koe', () => {
        cy.get('input[type="text"]').type('koe');
        cy.get('.suggestions').should('not.exist');
    })

})