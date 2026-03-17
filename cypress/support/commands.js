/* eslint-disable no-undef */
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
          db.close();
          resolve({
            exists: true,
            stores: stores,
            storeExists: true,
            data: getAllReq.result,
            count: getAllReq.result.length,
          });
        };

        getAllReq.onerror = () => {
          reject(getAllReq.error);
        };
      };
      onerror = () => {
        resolve({ exists: false, error: openReq.error });
      };
    });
  });
});
