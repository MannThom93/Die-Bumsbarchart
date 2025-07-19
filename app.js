// =======================================================
// DOM-Element Referenzen (alle hier gesammelt)
// Stellen Sie sicher, dass alle IDs in Ihrer HTML vorhanden sind!
// =======================================================

// Login/Registrierungsseiten und Elemente
const registerPage = document.getElementById('registerPage');
const loginPage = document.getElementById('loginPage');
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const regUsernameInput = document.getElementById('regUsername');
const regPasswordInput = document.getElementById('regPassword');
const loginUsernameInput = document.getElementById('loginUsername');
const loginPasswordInput = document.getElementById('loginPassword');
const goToLoginLink = document.getElementById('goToLogin');
const goToRegisterLink = document.getElementById('goToRegister');

// Haupt-Navigationsseiten und Buttons
const mainStartPage = document.getElementById('mainStartPage');
const mainStartButton = document.getElementById('mainStartButton');
const rankingButton = document.getElementById('rankingButton'); // Ehemals historyButton
const historyButton = document.getElementById('historyButton'); // Ehemals bumsbarchartButton
const profileButton = document.getElementById('profileButton');
const logoutButton = document.getElementById('logoutButton');

// Namenseingabeseite
const nameInputPage = document.getElementById('nameInputPage');
const userNameInput = document.getElementById('userNameInput');
const continueToDataButton = document.getElementById('continueToDataButton');

// Dateneingabeseite
const dataInputPage = document.getElementById('dataInputPage');
const dataInputForm = document.getElementById('dataInputForm');
const groesseInput = document.getElementById('groesse');
const alterInput = document.getElementById('alter');
const gewichtInput = document.getElementById('gewicht');
const oberweiteInput = document.getElementById('oberweite');
const tailleInput = document.getElementById('taille');
const huefteInput = document.getElementById('huefte');

// Ergebnis-Seite
const resultPage = document.getElementById('resultPage');
const finalCalculationResultDisplay = document.getElementById('finalCalculationResultDisplay');
const saveFinalResultButton = document.getElementById('saveFinalResultButton');

// Ranking-Seite (ehemals Historie)
const rankingPage = document.getElementById('rankingPage');
const historyList = document.getElementById('historyList'); // ID des UL-Elements bleibt gleich

// Geschichte-Seite (ehemals Bumsbarchart)
const historyPage = document.getElementById('historyPage');

// Profil-Seite
const profilePage = document.getElementById('profilePage');
const profileForm = document.getElementById('profileForm');
const profileNameInput = document.getElementById('profileNameInput');
const profileGroesseInput = document.getElementById('profileGroesseInput');
const profileAlterInput = document.getElementById('profileAlterInput');
const profileGewichtInput = document.getElementById('profileGewichtInput');
const profileOberweiteInput = document.getElementById('profileOberweiteInput');
const profileTailleInput = document.getElementById('profileTailleInput');
const profileHuefteInput = document.getElementById('profileHuefteInput');
const profileImageUpload = document.getElementById('profileImageUpload');
const profileImageDisplay = document.getElementById('profileImageDisplay');
const profileResultDisplay = document.getElementById('profileResultDisplay');

// Alle "Zurück"-Buttons (querySelectorAll gibt eine NodeList zurück)
const backButtons = document.querySelectorAll('.back-button');

// =======================================================
// Globale Variablen für den Anwendungszustand
// =======================================================
let deferredPrompt; // Für die PWA-Installationsaufforderung
let currentUserName = ''; // Name für die aktuelle Berechnung
let lastCalculatedResultText = null; // Ergebnis für die Speicherung

// Globale Variable für den aktuell eingeloggten Benutzer
let currentLoggedInUser = null;

// =======================================================
// Hilfsfunktionen (z.B. Seitenwechsel, Daten speichern/laden)
// =======================================================

// Liste aller Seiten-Elemente für die showPage Funktion
const allPages = [
    registerPage, loginPage, mainStartPage, nameInputPage, dataInputPage,
    resultPage, rankingPage, historyPage, profilePage
];

/**
 * Zeigt die übergebene Seite an und versteckt alle anderen.
 * @param {HTMLElement} pageToShow Das DOM-Element der Seite, die angezeigt werden soll.
 */
function showPage(pageToShow) {
    allPages.forEach(page => {
        if (page) { // Stellt sicher, dass das Element existiert
            page.classList.remove('active');
            page.style.display = 'none'; // Versteckt die Seite
        }
    });
    if (pageToShow) {
        pageToShow.classList.add('active');
        pageToShow.style.display = 'block'; // Zeigt die Seite an
    }
}

/**
 * Speichert Benutzerdaten (Benutzername und Passwort).
 * ACHTUNG: Passwörter werden hier im Klartext gespeichert! Nur für Demozwecke!
 * @param {string} username - Der Benutzername.
 * @param {string} password - Das Passwort (unklartext, für reale Apps hashen!).
 */
function saveUser(username, password) {
    let users = JSON.parse(localStorage.getItem('users')) || {};
    users[username] = password;
    localStorage.setItem('users', JSON.stringify(users));
}

/**
 * Überprüft die Anmeldedaten eines Benutzers.
 * @param {string} username - Der Benutzername.
 * @param {string} password - Das eingegebene Passwort.
 * @returns {boolean} True, wenn die Anmeldedaten korrekt sind, sonst False.
 */
function checkCredentials(username, password) {
    let users = JSON.parse(localStorage.getItem('users')) || {};
    return users[username] === password;
}

/**
 * Setzt den aktuell eingeloggten Benutzer und speichert ihn im localStorage.
 * @param {string} username - Der Benutzername des eingeloggten Users.
 */
function setLoggedInUser(username) {
    currentLoggedInUser = username;
    localStorage.setItem('loggedInUser', username);
    console.log(`Benutzer '${username}' ist jetzt eingeloggt.`);
}

/**
 * Meldet den aktuellen Benutzer ab und löscht den Anmeldestatus.
 */
function logoutUser() {
    currentLoggedInUser = null;
    localStorage.removeItem('loggedInUser');
    alert('Sie wurden abgemeldet.');
    showPage(loginPage); // Zurück zur Login-Seite
    console.log('Benutzer abgemeldet.');
}

/**
 * Lädt den eingeloggten Benutzer beim App-Start aus dem localStorage
 * und leitet entsprechend weiter.
 */
function loadLoggedInUser() {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
        currentLoggedInUser = storedUser;
        console.log(`Willkommen zurück, ${storedUser}!`);
        showPage(mainStartPage); // Direkt zur Hauptseite, wenn schon eingeloggt
    } else {
        showPage(loginPage); // Zeigt die Login-Seite, wenn niemand eingeloggt ist
    }
}

/**
 * Speichert einen Ranking-Eintrag für den aktuell eingeloggten Benutzer.
 * @param {object} entry - Der Eintrag, der gespeichert werden soll.
 */
function saveToRanking(entry) {
    if (!currentLoggedInUser) {
        console.error('Kein Benutzer angemeldet. Ranking kann nicht gespeichert werden.');
        alert('Bitte melden Sie sich an, um Ergebnisse zu speichern.');
        return;
    }
    const rankingKey = `ranking_${currentLoggedInUser}`; // Schlüssel für Ranking-Daten
    let ranking = JSON.parse(localStorage.getItem(rankingKey)) || [];
    ranking.push(entry);
    localStorage.setItem(rankingKey, JSON.stringify(ranking));
    displayRanking(); // Ranking nach dem Speichern aktualisieren
}

/**
 * Lädt die Ranking-Einträge des aktuell eingeloggten Benutzers.
 * @returns {Array} Eine Liste der Ranking-Einträge.
 */
function loadRanking() {
    if (!currentLoggedInUser) {
        console.warn('Kein Benutzer angemeldet. Ranking kann nicht geladen werden.');
        return [];
    }
    const rankingKey = `ranking_${currentLoggedInUser}`;
    return JSON.parse(localStorage.getItem(rankingKey)) || [];
}

/**
 * Zeigt die geladene Ranking auf der Ranking-Seite an.
 */
function displayRanking() {
    historyList.innerHTML = ''; // Vorherige Einträge löschen (historyList ist das UL-Element für Ranking)
    const ranking = loadRanking();
    if (ranking.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'Noch keine Einträge vorhanden.';
        historyList.appendChild(li);
        return;
    }
    ranking.forEach((entry, index) => {
        const li = document.createElement('li');

        // Bestimme den Status für die CSS-Klasse
        let statusClass = '';
        const numericValue = parseFloat(entry.value); // "75.00%" -> 75.00
        if (numericValue >= 70) {
            statusClass = 'status-positive';
        } else if (numericValue >= 40) {
            statusClass = 'status-neutral';
        } else {
            statusClass = 'status-negative';
        }

        li.innerHTML = `
            <div class="history-content">
                <strong>${entry.name}</strong>
                <span>${entry.value}</span>
                <span class="history-status ${statusClass}">${entry.value.replace('%', '')}% ${statusClass.replace('status-', '')}</span>
                <small>${entry.date}</small>
            </div>
            <button class="delete-history-entry" data-index="${index}">Löschen</button>
        `;
        historyList.appendChild(li);
    });

    // Event Listener für die neuen Löschen-Buttons hinzufügen
    document.querySelectorAll('.delete-history-entry').forEach(button => {
        button.addEventListener('click', (event) => {
            const indexToDelete = parseInt(event.target.dataset.index);
            deleteRankingEntry(indexToDelete);
        });
    });
}

/**
 * Löscht einen Ranking-Eintrag basierend auf seinem Index.
 * @param {number} index - Der Index des zu löschenden Eintrags.
 */
function deleteRankingEntry(index) {
    if (!currentLoggedInUser) {
        console.error('Kein Benutzer angemeldet. Ranking kann nicht gelöscht werden.');
        return;
    }
    const rankingKey = `ranking_${currentLoggedInUser}`;
    let ranking = JSON.parse(localStorage.getItem(rankingKey)) || [];

    if (index > -1 && index < ranking.length) {
        ranking.splice(index, 1); // Entfernt das Element am gegebenen Index
        localStorage.setItem(rankingKey, JSON.stringify(ranking));
        displayRanking(); // Ranking nach dem Löschen aktualisieren
        alert('Eintrag erfolgreich gelöscht.');
    } else {
        console.error('Ungültiger Index zum Löschen des Ranking-Eintrags.');
    }
}


/**
 * Speichert Profildaten für den aktuell eingeloggten Benutzer.
 * @param {object} profileData - Das Profil-Objekt mit allen Daten und dem Bild (Base64).
 */
function saveProfileData(profileData) {
    if (!currentLoggedInUser) {
        console.error('Kein Benutzer angemeldet. Profil kann nicht gespeichert werden.');
        alert('Bitte melden Sie sich an, um Profile zu speichern.');
        return;
    }
    const profilesKey = `profiles_${currentLoggedInUser}`;
    let profiles = JSON.parse(localStorage.getItem(profilesKey)) || {};

    profiles[profileData.name] = profileData; // Speichert unter dem Namen als Schlüssel
    localStorage.setItem(profilesKey, JSON.stringify(profiles));
    console.log(`Profil für ${currentLoggedInUser} gespeichert:`, profileData);

    // Merkt sich den Namen des zuletzt gespeicherten Profils für diesen Benutzer
    localStorage.setItem(`lastSavedProfileName_${currentLoggedInUser}`, profileData.name);
}

/**
 * Lädt Profildaten eines spezifischen Profils für den aktuell eingeloggten Benutzer.
 * @param {string} profileName - Der Name des Profils, das geladen werden soll.
 * @returns {object|null} Das Profil-Objekt oder null, wenn nicht gefunden.
 */
function loadProfileData(profileName) {
    if (!currentLoggedInUser) {
        console.warn('Kein Benutzer angemeldet. Profil kann nicht geladen werden.');
        return null;
    }
    const profilesKey = `profiles_${currentLoggedInUser}`;
    let profiles = JSON.parse(localStorage.getItem(profilesKey)) || {};
    return profiles[profileName] || null;
}

/**
 * Berechnet den "Bumsbarkeit"-Prozentsatz basierend auf den Eingabewerten.
 * @param {number} groesse
 * @param {number} alter
 * @param {number} gewicht
 * @param {number} oberweite
 * @param {number} taille
 * @param {number} huefte
 * @returns {string} Der formatierte Prozentsatz (z.B. "75.00%").
 */
function calculateBumsbarkeit(groesse, alter, gewicht, oberweite, taille, huefte) {
    const teil1 = (oberweite + taille + huefte) / 3 * 0.0125;
    const teil2 = (groesse + alter + gewicht) / 3 * 0.0118;
    let x = teil1 * teil2;

    let calculatedPercentage;
    if (x < 1) {
        calculatedPercentage = (1 - x) * 100;
    } else {
        // Wenn x >= 1, berechne die absolute Differenz zu 2
        calculatedPercentage = Math.abs(x - 2) * 100;
    }
    // Stelle sicher, dass der Wert nicht negativ wird (Minimum 0)
    return Math.max(0, calculatedPercentage).toFixed(2) + '%';
}


// =======================================================
// PWA (Progressive Web App) Installation Logik
// =======================================================
if ('serviceWorker' in navigator) {
    // Der Service Worker wird im HTML registriert (wie von dir vorgesehen)
    // window.addEventListener('load', () => { ... });
    // Dies ist nur ein Hinweis, dass die Logik für 'beforeinstallprompt' hier hingehört.
}

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); // Verhindert, dass der Browser die Standard-Installationsaufforderung zeigt
    deferredPrompt = e; // Speichert das Event
    // Zeigt den benutzerdefinierten Installationsbutton an, falls vorhanden und gewünscht
    // if (installButton) installButton.style.display = 'block';
    console.log('Before install prompt fired.');
});

// Event Listener für einen optionalen "Installieren"-Button (muss in HTML existieren)
// const installButton = document.getElementById('installButton'); // Uncomment and define if you have one
// if (installButton) {
//     installButton.addEventListener('click', () => {
//         if (deferredPrompt) {
//             // installButton.style.display = 'none'; // Versteckt den Button nach Klick
//             deferredPrompt.prompt();
//             deferredPrompt.userChoice.then((choiceResult) => {
//                 if (choiceResult.outcome === 'accepted') {
//                     console.log('Benutzer hat die PWA installiert');
//                 } else {
//                     console.log('Benutzer hat die Installation abgebrochen');
//                 }
//                 deferredPrompt = null; // Löscht das deferredPrompt
//             });
//         }
//     });
// }


// =======================================================
// Event Listener (Anwendungslogik)
// =======================================================

// --- Account-Verwaltung ---
registerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = regUsernameInput.value.trim();
    const password = regPasswordInput.value.trim();

    if (username.length < 3 || password.length < 6) {
        alert('Benutzername muss mindestens 3 Zeichen, Passwort mindestens 6 Zeichen lang sein.');
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || {};
    if (users[username]) {
        alert('Dieser Benutzername existiert bereits.');
        return;
    }

    saveUser(username, password);
    alert('Registrierung erfolgreich! Bitte loggen Sie sich ein.');
    regUsernameInput.value = '';
    regPasswordInput.value = '';
    showPage(loginPage);
});

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = loginUsernameInput.value.trim();
    const password = loginPasswordInput.value.trim();

    if (checkCredentials(username, password)) {
        setLoggedInUser(username);
        alert('Login erfolgreich!');
        showPage(mainStartPage); // Zur Hauptseite nach Login
        // Hier könntest du spezifische User-Daten laden, wenn nötig
    } else {
        alert('Ungültiger Benutzername oder Passwort.');
    }
    loginPasswordInput.value = '';
});

goToLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    showPage(loginPage);
});

goToRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    showPage(registerPage);
});

if (logoutButton) {
    logoutButton.addEventListener('click', logoutUser);
}


// --- Hauptmenü Navigation ---
mainStartButton.addEventListener('click', () => {
    if (!currentLoggedInUser) {
        alert('Bitte melden Sie sich an, um die App zu nutzen.');
        showPage(loginPage);
        return;
    }
    showPage(nameInputPage);
    userNameInput.value = ''; // Namenseingabefeld leeren
    console.log('Navigated to Name Input Page via Start Button.');
});

// Ranking-Button (ehemals Historie)
rankingButton.addEventListener('click', () => {
    if (!currentLoggedInUser) {
        alert('Bitte melden Sie sich an, um Ihr Ranking zu sehen.');
        showPage(loginPage);
        return;
    }
    showPage(rankingPage);
    displayRanking(); // Ranking beim Anzeigen der Seite laden
    console.log('Navigated to Ranking Page.');
});

// Geschichte-Button (ehemals Bumsbarchart)
historyButton.addEventListener('click', () => {
    if (!currentLoggedInUser) {
        alert('Bitte melden Sie sich an, um Ihre Geschichte zu sehen.');
        showPage(loginPage);
        return;
    }
    showPage(historyPage);
    console.log('Navigated to History Page.');
});

profileButton.addEventListener('click', () => {
    if (!currentLoggedInUser) {
        alert('Bitte melden Sie sich an, um auf Ihr Profil zuzugreifen.');
        showPage(loginPage);
        return;
    }
    showPage(profilePage);
    console.log('Navigated to Profile Page.');

    // Lade das zuletzt gespeicherte Profil des aktuellen Benutzers
    const lastSavedProfileNameForUser = localStorage.getItem(`lastSavedProfileName_${currentLoggedInUser}`);
    if (lastSavedProfileNameForUser) {
        const loadedProfile = loadProfileData(lastSavedProfileNameForUser);
        if (loadedProfile) {
            profileNameInput.value = loadedProfile.name;
            profileGroesseInput.value = loadedProfile.groesse;
            profileAlterInput.value = loadedProfile.alter;
            profileGewichtInput.value = loadedProfile.gewicht;
            profileOberweiteInput.value = loadedProfile.oberweite;
            profileTailleInput.value = loadedProfile.taille;
            profileHuefteInput.value = loadedProfile.huefte;
            profileResultDisplay.textContent = loadedProfile.result;

            if (loadedProfile.image) {
                profileImageDisplay.src = loadedProfile.image;
                profileImageDisplay.style.display = 'block';
            } else {
                profileImageDisplay.src = '#';
                profileImageDisplay.style.display = 'none';
            }
        }
    } else {
        // Leere Profilfelder anzeigen, wenn noch kein Profil für diesen User existiert
        profileForm.reset();
        profileImageDisplay.src = '#';
        profileImageDisplay.style.display = 'none';
        profileResultDisplay.textContent = '';
    }
});


// --- Namenseingabe ---
continueToDataButton.addEventListener('click', () => {
    const name = userNameInput.value.trim();
    if (name === '') {
        alert('Bitte geben Sie einen Namen ein, um fortzufahren.');
        return;
    }
    currentUserName = name;
    showPage(dataInputPage);
    dataInputForm.reset(); // Dateneingabefelder leeren
    console.log(`Name "${currentUserName}" entered. Navigated to Data Input Page.`);
});


// --- "Zurück"-Buttons ---
backButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (document.getElementById('dataInputPage').classList.contains('active')) {
            showPage(nameInputPage);
            console.log('Navigated back from Data Input to Name Input Page.');
        } else if (document.getElementById('profilePage').classList.contains('active') ||
                   document.getElementById('rankingPage').classList.contains('active') || // Ehemals historyPage
                   document.getElementById('historyPage').classList.contains('active') || // Ehemals bumsbarchartPage
                   document.getElementById('resultPage').classList.contains('active')) {
            showPage(mainStartPage); // Ansonsten immer zur Hauptstartseite
            console.log('Navigated back to Main Start Page.');
        } else if (currentLoggedInUser) {
             // Fallback: Wenn man auf einer Seite ist, die man ohne Login nicht erreichen sollte,
             // und der Benutzer noch angemeldet ist, geht man zur Hauptseite.
            showPage(mainStartPage);
            console.log('Navigated back to Main Start Page from an unexpected page.');
        } else {
            // Wenn kein Benutzer angemeldet ist, geht man zum Login
            showPage(loginPage);
            console.log('Navigated back to Login Page (user not logged in).');
        }
    });
});


// --- Dateneingabe und Berechnung ---
dataInputForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const groesse = parseFloat(groesseInput.value);
    const alter = parseFloat(alterInput.value);
    const gewicht = parseFloat(gewichtInput.value);
    const oberweite = parseFloat(oberweiteInput.value);
    const taille = parseFloat(tailleInput.value);
    const huefte = parseFloat(huefteInput.value);

    if (isNaN(groesse) || isNaN(alter) || isNaN(gewicht) ||
        isNaN(oberweite) || isNaN(taille) || isNaN(huefte)) {
        alert('Bitte geben Sie für alle Felder gültige Zahlen ein.');
        return;
    }

    const formattedValue = calculateBumsbarkeit(groesse, alter, gewicht, oberweite, taille, huefte);

    lastCalculatedResultText = formattedValue;

    finalCalculationResultDisplay.textContent = `${currentUserName} ist zu ${lastCalculatedResultText} bumsbar.`;
    showPage(resultPage);

    console.log('Calculated value:', formattedValue);
    console.log('Displayed text:', finalCalculationResultDisplay.textContent);
});


// --- Profilformular (Berechnung und Speichern) ---
profileForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const profileName = profileNameInput.value.trim();
    const profileGroesse = parseFloat(profileGroesseInput.value);
    const profileAlter = parseFloat(profileAlterInput.value);
    const profileGewicht = parseFloat(profileGewichtInput.value);
    const profileOberweite = parseFloat(profileOberweiteInput.value);
    const profileTaille = parseFloat(profileTailleInput.value);
    const profileHuefte = parseFloat(profileHuefteInput.value);

    if (profileName === '' || isNaN(profileGroesse) || isNaN(profileAlter) || isNaN(profileGewicht) ||
        isNaN(profileOberweite) || isNaN(profileTaille) || isNaN(profileHuefte)) {
        alert('Bitte füllen Sie alle Profilfelder korrekt aus.');
        return;
    }

    const formattedProfileValue = calculateBumsbarkeit(profileGroesse, profileAlter, profileGewicht,
                                                    profileOberweite, profileTaille, profileHuefte);

    // Bilddaten aus dem img-Tag holen (falls vorhanden und Base64-Daten sind)
    const profileImageBase64 = profileImageDisplay.src.startsWith('data:') ? profileImageDisplay.src : null;

    const profileData = {
        name: profileName,
        groesse: profileGroesse,
        alter: profileAlter,
        gewicht: profileGewicht,
        oberweite: profileOberweite,
        taille: profileTaille,
        huefte: profileHuefte,
        result: `${profileName} hat eine Bumsbarschwelle von ${formattedProfileValue}.`,
        image: profileImageBase64
    };
    saveProfileData(profileData);

    profileResultDisplay.textContent = profileData.result;
    alert('Profil und Bumsbarschwelle gespeichert!');
    console.log('Profil-Bumsbarschwelle berechnet und gespeichert:', profileData.result);
});


// --- Bild-Upload Vorschau im Profil ---
profileImageUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            profileImageDisplay.src = e.target.result;
            profileImageDisplay.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        profileImageDisplay.src = '#';
        profileImageDisplay.style.display = 'none';
    }
});


// --- Ergebnis speichern ---
saveFinalResultButton.addEventListener('click', () => {
    if (lastCalculatedResultText === null) {
        alert('Kein Ergebnis zum Speichern vorhanden.');
        return;
    }

    if (!currentLoggedInUser) {
        alert('Bitte melden Sie sich an, um Ergebnisse zu speichern.');
        showPage(loginPage);
        return;
    }

    const date = new Date().toLocaleDateString('de-DE');

    const entry = {
        value: lastCalculatedResultText,
        name: currentUserName,
        date: date
    };

    saveToRanking(entry); // Speichert jetzt im Ranking
    alert('Ergebnis erfolgreich gespeichert!');
    lastCalculatedResultText = null; // Ergebnis leeren
    currentUserName = ''; // Benutzernamen leeren
    showPage(mainStartPage); // Zurück zur Hauptstartseite
    console.log('Final result saved to ranking.');
});


// =======================================================
// Initialisierung (wird beim Laden der Seite ausgeführt)
// =======================================================
window.addEventListener('load', () => {
    loadLoggedInUser(); // Versucht, einen gespeicherten User zu laden und die passende Seite anzuzeigen
});