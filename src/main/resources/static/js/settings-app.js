// Settings Application
(function() {
    'use strict';

    // State
    const settingsState = {
        // Personalizacja
        darkMode: false,
        highContrast: false,
        fontSize: 18,
        iconSize: 96,
        voiceControl: false,
        eyeTracking: false,
        reducedMotion: false,

        // Dla słabowidzących
        screenReaderMode: false,
        zoomLevel: 100,
        ttsVolume: 100,
        ttsRate: 1.0,
        ttsPitch: 1.0,

        // Profil
        userName: '',
        userAge: '',
        userType: '',
        bloodType: '',
        allergies: '',
        medications: '',
        emergencyNotes: '',

        // SOS
        sosType: 'emergency',
        sosPhone1: '',
        sosPhone2: '',
        sosEmail: ''
    };

    // Elements - Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Elements - Personalizacja
    const darkModeCb = document.getElementById('darkMode');
    const highContrastCb = document.getElementById('highContrast');
    const fontSizeInput = document.getElementById('fontSize');
    const fontSizeValue = document.getElementById('fontSizeValue');
    const iconSizeInput = document.getElementById('iconSize');
    const iconSizeValue = document.getElementById('iconSizeValue');
    const voiceControlCb = document.getElementById('voiceControl');
    const eyeTrackingCb = document.getElementById('eyeTracking');
    const reducedMotionCb = document.getElementById('reducedMotion');

    // Elements - Dla słabowidzących
    const screenReaderModeCb = document.getElementById('screenReaderMode');
    const zoomLevelInput = document.getElementById('zoomLevel');
    const zoomValue = document.getElementById('zoomValue');
    const ttsVolumeInput = document.getElementById('ttsVolume');
    const ttsVolumeValue = document.getElementById('ttsVolumeValue');
    const ttsRateInput = document.getElementById('ttsRate');
    const ttsRateValue = document.getElementById('ttsRateValue');
    const ttsPitchInput = document.getElementById('ttsPitch');
    const ttsPitchValue = document.getElementById('ttsPitchValue');
    const testTTSBtn = document.getElementById('testTTS');

    // Elements - Profil
    const userNameInput = document.getElementById('userName');
    const userAgeInput = document.getElementById('userAge');
    const userTypeSelect = document.getElementById('userType');
    const bloodTypeSelect = document.getElementById('bloodType');
    const allergiesInput = document.getElementById('allergies');
    const medicationsInput = document.getElementById('medications');
    const emergencyNotesInput = document.getElementById('emergencyNotes');

    // Elements - SOS
    const sosRadios = document.querySelectorAll('input[name="sosType"]');
    const sosPhone1Input = document.getElementById('sosPhone1');
    const sosPhone2Input = document.getElementById('sosPhone2');
    const sosEmailInput = document.getElementById('sosEmail');
    const testSOSBtn = document.getElementById('testSOS');

    // Elements - Actions
    const saveBtn = document.getElementById('saveBtn');
    const resetBtn = document.getElementById('resetBtn');
    const statusMsg = document.getElementById('statusMsg');

    // Initialize
    function init() {
        loadSettings();
        attachEventListeners();
        applySettings();

        // Check URL for tab parameter
        const urlParams = new URLSearchParams(window.location.search);
        const tab = urlParams.get('tab');
        if (tab) {
            switchTab(tab);
        }

        // Listen for storage changes from accessibility panel (different tabs)
        window.addEventListener('storage', function(e) {
            if (e.key === 'aac_accessibility') {
                loadSettings();
            }
        });

        // Listen for custom event (same tab)
        window.addEventListener('accessibility-settings-changed', function(e) {
            loadSettings();
        });
    }

    // Tab switching
    function switchTab(tabId) {
        tabBtns.forEach(btn => {
            if (btn.dataset.tab === tabId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        tabContents.forEach(content => {
            if (content.id === 'tab-' + tabId) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
    }

    // Load settings
    function loadSettings() {
        // Load from localStorage
        const savedPersonalization = localStorage.getItem('aac_accessibility');
        const savedProfile = localStorage.getItem('aac_profile');
        const savedSOS = localStorage.getItem('aac_sos');

        if (savedPersonalization) {
            try {
                const settings = JSON.parse(savedPersonalization);
                Object.assign(settingsState, settings);
            } catch (e) {
                console.error('Błąd wczytywania ustawień personalizacji');
            }
        }

        if (savedProfile) {
            try {
                const profile = JSON.parse(savedProfile);
                Object.assign(settingsState, profile);
            } catch (e) {
                console.error('Błąd wczytywania profilu');
            }
        }

        if (savedSOS) {
            try {
                const sos = JSON.parse(savedSOS);
                Object.assign(settingsState, sos);
            } catch (e) {
                console.error('Błąd wczytywania ustawień SOS');
            }
        }

        updateUI();
    }

    // Update UI
    function updateUI() {
        // Personalizacja
        if (darkModeCb) darkModeCb.checked = settingsState.darkMode;
        if (highContrastCb) highContrastCb.checked = settingsState.highContrast;
        if (fontSizeInput) {
            fontSizeInput.value = settingsState.fontSize;
            fontSizeValue.textContent = settingsState.fontSize + 'px';
        }
        if (iconSizeInput) {
            iconSizeInput.value = settingsState.iconSize;
            iconSizeValue.textContent = settingsState.iconSize + 'px';
        }
        if (voiceControlCb) voiceControlCb.checked = settingsState.voiceControl;
        if (eyeTrackingCb) eyeTrackingCb.checked = settingsState.eyeTracking;
        if (reducedMotionCb) reducedMotionCb.checked = settingsState.reducedMotion;

        // Dla słabowidzących
        if (screenReaderModeCb) screenReaderModeCb.checked = settingsState.screenReaderMode;
        if (zoomLevelInput) {
            zoomLevelInput.value = settingsState.zoomLevel;
            zoomValue.textContent = settingsState.zoomLevel + '%';
        }
        if (ttsVolumeInput) {
            ttsVolumeInput.value = settingsState.ttsVolume;
            ttsVolumeValue.textContent = settingsState.ttsVolume + '%';
        }
        if (ttsRateInput) {
            ttsRateInput.value = settingsState.ttsRate;
            ttsRateValue.textContent = settingsState.ttsRate + 'x';
        }
        if (ttsPitchInput) {
            ttsPitchInput.value = settingsState.ttsPitch;
            ttsPitchValue.textContent = settingsState.ttsPitch;
        }

        // Profil
        if (userNameInput) userNameInput.value = settingsState.userName;
        if (userAgeInput) userAgeInput.value = settingsState.userAge;
        if (userTypeSelect) userTypeSelect.value = settingsState.userType;
        if (bloodTypeSelect) bloodTypeSelect.value = settingsState.bloodType;
        if (allergiesInput) allergiesInput.value = settingsState.allergies;
        if (medicationsInput) medicationsInput.value = settingsState.medications;
        if (emergencyNotesInput) emergencyNotesInput.value = settingsState.emergencyNotes;

        // SOS
        sosRadios.forEach(radio => {
            radio.checked = radio.value === settingsState.sosType;
        });
        if (sosPhone1Input) sosPhone1Input.value = settingsState.sosPhone1;
        if (sosPhone2Input) sosPhone2Input.value = settingsState.sosPhone2;
        if (sosEmailInput) sosEmailInput.value = settingsState.sosEmail;
    }

    // Apply settings
    function applySettings() {
        // Personalizacja
        document.body.classList.toggle('dark', settingsState.darkMode);
        document.body.classList.toggle('high-contrast', settingsState.highContrast);
        document.body.classList.toggle('reduce-motion', settingsState.reducedMotion);
        document.body.classList.toggle('screen-reader-mode', settingsState.screenReaderMode);

        document.documentElement.style.setProperty('--font-size', settingsState.fontSize + 'px');
        document.documentElement.style.fontSize = settingsState.fontSize + 'px';
        document.documentElement.style.setProperty('--btn-size', settingsState.iconSize + 'px');

        // Zoom
        document.body.style.zoom = settingsState.zoomLevel / 100;
    }

    // Attach event listeners
    function attachEventListeners() {
        // Tabs
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                switchTab(btn.dataset.tab);
            });
        });

        // Personalizacja
        if (darkModeCb) {
            darkModeCb.addEventListener('change', () => {
                settingsState.darkMode = darkModeCb.checked;
                applySettings();
            });
        }

        if (highContrastCb) {
            highContrastCb.addEventListener('change', () => {
                settingsState.highContrast = highContrastCb.checked;
                applySettings();
            });
        }

        if (fontSizeInput) {
            fontSizeInput.addEventListener('input', () => {
                settingsState.fontSize = parseInt(fontSizeInput.value);
                fontSizeValue.textContent = settingsState.fontSize + 'px';
                applySettings();
            });
        }

        if (iconSizeInput) {
            iconSizeInput.addEventListener('input', () => {
                settingsState.iconSize = parseInt(iconSizeInput.value);
                iconSizeValue.textContent = settingsState.iconSize + 'px';
                applySettings();
            });
        }

        if (voiceControlCb) {
            voiceControlCb.addEventListener('change', () => {
                settingsState.voiceControl = voiceControlCb.checked;
            });
        }

        if (eyeTrackingCb) {
            eyeTrackingCb.addEventListener('change', () => {
                settingsState.eyeTracking = eyeTrackingCb.checked;
            });
        }

        if (reducedMotionCb) {
            reducedMotionCb.addEventListener('change', () => {
                settingsState.reducedMotion = reducedMotionCb.checked;
                applySettings();
            });
        }

        // Dla słabowidzących
        if (screenReaderModeCb) {
            screenReaderModeCb.addEventListener('change', () => {
                settingsState.screenReaderMode = screenReaderModeCb.checked;
                applySettings();
            });
        }

        if (zoomLevelInput) {
            zoomLevelInput.addEventListener('input', () => {
                settingsState.zoomLevel = parseInt(zoomLevelInput.value);
                zoomValue.textContent = settingsState.zoomLevel + '%';
                applySettings();
            });
        }

        if (ttsVolumeInput) {
            ttsVolumeInput.addEventListener('input', () => {
                settingsState.ttsVolume = parseInt(ttsVolumeInput.value);
                ttsVolumeValue.textContent = settingsState.ttsVolume + '%';
            });
        }

        if (ttsRateInput) {
            ttsRateInput.addEventListener('input', () => {
                settingsState.ttsRate = parseFloat(ttsRateInput.value);
                ttsRateValue.textContent = settingsState.ttsRate + 'x';
            });
        }

        if (ttsPitchInput) {
            ttsPitchInput.addEventListener('input', () => {
                settingsState.ttsPitch = parseFloat(ttsPitchInput.value);
                ttsPitchValue.textContent = settingsState.ttsPitch;
            });
        }

        // Test TTS
        if (testTTSBtn) {
            testTTSBtn.addEventListener('click', () => {
                testTTS();
            });
        }

        // Profil
        if (userNameInput) {
            userNameInput.addEventListener('input', () => {
                settingsState.userName = userNameInput.value;
            });
        }

        if (userAgeInput) {
            userAgeInput.addEventListener('input', () => {
                settingsState.userAge = userAgeInput.value;
            });
        }

        if (userTypeSelect) {
            userTypeSelect.addEventListener('change', () => {
                settingsState.userType = userTypeSelect.value;
            });
        }

        if (bloodTypeSelect) {
            bloodTypeSelect.addEventListener('change', () => {
                settingsState.bloodType = bloodTypeSelect.value;
            });
        }

        if (allergiesInput) {
            allergiesInput.addEventListener('input', () => {
                settingsState.allergies = allergiesInput.value;
            });
        }

        if (medicationsInput) {
            medicationsInput.addEventListener('input', () => {
                settingsState.medications = medicationsInput.value;
            });
        }

        if (emergencyNotesInput) {
            emergencyNotesInput.addEventListener('input', () => {
                settingsState.emergencyNotes = emergencyNotesInput.value;
            });
        }

        // SOS
        sosRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                settingsState.sosType = radio.value;
            });
        });

        if (sosPhone1Input) {
            sosPhone1Input.addEventListener('input', () => {
                settingsState.sosPhone1 = sosPhone1Input.value;
            });
        }

        if (sosPhone2Input) {
            sosPhone2Input.addEventListener('input', () => {
                settingsState.sosPhone2 = sosPhone2Input.value;
            });
        }

        if (sosEmailInput) {
            sosEmailInput.addEventListener('input', () => {
                settingsState.sosEmail = sosEmailInput.value;
            });
        }

        // Test SOS
        if (testSOSBtn) {
            testSOSBtn.addEventListener('click', () => {
                testSOS();
            });
        }

        // Save
        if (saveBtn) {
            saveBtn.addEventListener('click', saveSettings);
        }

        // Reset
        if (resetBtn) {
            resetBtn.addEventListener('click', resetSettings);
        }
    }

    // Test TTS
    function testTTS() {
        if (!('speechSynthesis' in window)) {
            showStatus('Text-to-Speech nie jest dostępny w tej przeglądarce', 'error');
            return;
        }

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance('To jest test ustawień głosu. Czy słyszysz mnie wyraźnie?');
        utterance.lang = 'pl-PL';
        utterance.volume = settingsState.ttsVolume / 100;
        utterance.rate = settingsState.ttsRate;
        utterance.pitch = settingsState.ttsPitch;

        utterance.onend = function() {
            showStatus('Test głosu zakończony', 'success');
        };

        utterance.onerror = function(event) {
            showStatus('Błąd testu głosu: ' + event.error, 'error');
        };

        window.speechSynthesis.speak(utterance);
        showStatus('Odtwarzanie testu głosu...', 'success');
    }

    // Test SOS
    function testSOS() {
        const sosType = settingsState.sosType;
        let message = 'TEST SOS:\n\n';

        switch(sosType) {
            case 'emergency':
                message += '🚨 Typ: Numer alarmowy 112\n';
                message += 'W prawdziwej sytuacji zostanie wykonane połączenie z numerem alarmowym 112.';
                break;
            case 'phone':
                message += '📱 Typ: Telefon opiekuna\n';
                message += 'Telefon 1: ' + (settingsState.sosPhone1 || 'Nie podano') + '\n';
                message += 'Telefon 2: ' + (settingsState.sosPhone2 || 'Nie podano') + '\n';
                message += 'W prawdziwej sytuacji zostanie wykonane połączenie.';
                break;
            case 'email':
                message += '📧 Typ: Email\n';
                message += 'Email: ' + (settingsState.sosEmail || 'Nie podano') + '\n';
                message += 'W prawdziwej sytuacji zostanie wysłany email z Twoją lokalizacją.';
                break;
            case 'sms':
                message += '💬 Typ: SMS\n';
                message += 'Telefon: ' + (settingsState.sosPhone1 || 'Nie podano') + '\n';
                message += 'W prawdziwej sytuacji zostanie wysłany SMS z Twoją lokalizacją.';
                break;
        }

        alert(message);
        showStatus('Test SOS wykonany (bez wysyłania)', 'success');
    }

    // Save settings
    function saveSettings() {
        // Save personalization
        const personalizationSettings = {
            darkMode: settingsState.darkMode,
            highContrast: settingsState.highContrast,
            fontSize: settingsState.fontSize,
            iconSize: settingsState.iconSize,
            voiceControl: settingsState.voiceControl,
            eyeTracking: settingsState.eyeTracking,
            reducedMotion: settingsState.reducedMotion,
            screenReaderMode: settingsState.screenReaderMode,
            zoomLevel: settingsState.zoomLevel,
            ttsVolume: settingsState.ttsVolume,
            ttsRate: settingsState.ttsRate,
            ttsPitch: settingsState.ttsPitch
        };
        localStorage.setItem('aac_accessibility', JSON.stringify(personalizationSettings));

        // Save profile
        const profileSettings = {
            userName: settingsState.userName,
            userAge: settingsState.userAge,
            userType: settingsState.userType,
            bloodType: settingsState.bloodType,
            allergies: settingsState.allergies,
            medications: settingsState.medications,
            emergencyNotes: settingsState.emergencyNotes
        };
        localStorage.setItem('aac_profile', JSON.stringify(profileSettings));

        // Save SOS
        const sosSettings = {
            sosType: settingsState.sosType,
            sosPhone1: settingsState.sosPhone1,
            sosPhone2: settingsState.sosPhone2,
            sosEmail: settingsState.sosEmail
        };
        localStorage.setItem('aac_sos', JSON.stringify(sosSettings));

        // Trigger global settings reload if available
        if (typeof window.loadGlobalAccessibilitySettings === 'function') {
            window.loadGlobalAccessibilitySettings();
        }

        // Dispatch custom event for same-tab synchronization
        window.dispatchEvent(new CustomEvent('accessibility-settings-changed', { detail: personalizationSettings }));

        showStatus('✓ Wszystkie ustawienia zostały zapisane', 'success');
    }

    // Reset settings
    function resetSettings() {
        if (!confirm('Czy na pewno chcesz przywrócić ustawienia domyślne?')) {
            return;
        }

        Object.assign(settingsState, {
            darkMode: false,
            highContrast: false,
            fontSize: 18,
            iconSize: 96,
            voiceControl: false,
            eyeTracking: false,
            reducedMotion: false,
            screenReaderMode: false,
            zoomLevel: 100,
            ttsVolume: 100,
            ttsRate: 1.0,
            ttsPitch: 1.0
        });

        updateUI();
        applySettings();
        showStatus('Ustawienia przywrócone do domyślnych', 'success');
    }

    // Show status message
    function showStatus(message, type = '') {
        if (statusMsg) {
            statusMsg.textContent = message;
            statusMsg.className = 'status-message ' + type;

            setTimeout(() => {
                statusMsg.textContent = '';
                statusMsg.className = 'status-message';
            }, 4000);
        }
    }

    // Initialize on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
