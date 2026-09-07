// storage.js - Universal Storage Wrapper para sa Web at APK
// I-import ang file na ito sa LAHAT ng HTML pages bago ang ibang script

const storage = (() => {
    // In-memory storage bilang fallback
    const memoryStorage = {};
    
    // Suriin kung available ang localStorage
    function isLocalStorageAvailable() {
        try {
            if (typeof localStorage === 'undefined' || localStorage === null) {
                return false;
            }
            const testKey = '__storage_test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    const useLocalStorage = isLocalStorageAvailable();
    
    // Kung available ang localStorage, i-load lahat ng data sa memory
    if (useLocalStorage) {
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                memoryStorage[key] = localStorage.getItem(key);
            }
        } catch (e) {
            console.warn('Error sa pag-load ng localStorage sa memory:', e);
        }
    }
    
    return {
        setItem(key, value) {
            // I-save sa memory
            memoryStorage[key] = value;
            
            // Subukan i-save sa localStorage kung available
            if (useLocalStorage) {
                try {
                    localStorage.setItem(key, value);
                } catch (e) {
                    console.warn('Nabigo ang localStorage.setItem:', e);
                }
            }
        },
        
        getItem(key) {
            // Priority: tingnan muna sa memory, pagkatapos sa localStorage
            if (memoryStorage[key] !== undefined) {
                return memoryStorage[key];
            }
            
            if (useLocalStorage) {
                try {
                    const item = localStorage.getItem(key);
                    if (item !== null) {
                        memoryStorage[key] = item; // I-cache sa memory
                        return item;
                    }
                } catch (e) {
                    console.warn('Nabigo ang localStorage.getItem:', e);
                }
            }
            
            return null;
        },
        
        removeItem(key) {
            // Tanggalin sa memory
            delete memoryStorage[key];
            
            // Tanggalin sa localStorage kung available
            if (useLocalStorage) {
                try {
                    localStorage.removeItem(key);
                } catch (e) {
                    console.warn('Nabigo ang localStorage.removeItem:', e);
                }
            }
        },
        
        clear() {
            // I-clear ang memory
            for (const key in memoryStorage) {
                delete memoryStorage[key];
            }
            
            // I-clear ang localStorage kung available
            if (useLocalStorage) {
                try {
                    localStorage.clear();
                } catch (e) {
                    console.warn('Nabigo ang localStorage.clear:', e);
                }
            }
        },
        
        // Debug info
        isUsingLocalStorage() {
            return useLocalStorage;
        },
        
        getAllKeys() {
            return Object.keys(memoryStorage);
        }
    };
})();

// I-log ang status para sa debugging
console.log('Storage ay na-initialize. Gumagamit ng localStorage:', storage.isUsingLocalStorage());
console.log('Kasalukuyang mga key:', storage.getAllKeys());
