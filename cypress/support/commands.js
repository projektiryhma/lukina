/* eslint-disable no-undef */
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Custom command to clear IndexedDB
Cypress.Commands.add("clearIndexedDB", () => {
  cy.window().then((win) => {
    return new Promise((resolve, reject) => {
      if (!win.indexedDB) {
        resolve();
        return;
      }
      const deleteReq = win.indexedDB.deleteDatabase("lukina");

      deleteReq.onsuccess = () => resolve();
      deleteReq.onerror = () => reject(deleteReq.error);
    });
  });
});

// Custom command to check and retrieve IndexedDB data
Cypress.Commands.add("checkIndexedDB", (storeName = null) => {
  return cy.window().then((win) => {
    return new Promise((resolve, reject) => {
      if (!win.indexedDB) {
        resolve({ exists: false, stores: [], data: {} });
        return;
      }

      win.indexedDB.open("lukina").onsuccess = (event) => {
        const db = event.target.result;
        const stores = Array.from(db.objectStoreNames);

        if (!storeName) {
          resolve({
            exists: true,
            stores: stores,
            storeCount: stores.length,
          });
          return;
        }

        if (!stores.includes(storeName)) {
          resolve({
            exists: true,
            stores: stores,
            storeExists: false,
            data: [],
          });
          return;
        }

        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);
        const getAllReq = store.getAll();

        getAllReq.onsuccess = () => {
          resolve({
            exists: true,
            stores: stores,
            storeExists: true,
            data: getAllReq.result,
            count: getAllReq.result.length,
          });
        };

        getAllReq.onerror = () => reject(getAllReq.error);
      };
      onerror = () => {
        resolve({ exists: false, error: openReq.error });
      };
    });
  });
});
