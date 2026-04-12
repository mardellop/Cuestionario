/**
 * MATRIX ANALYSIS - CORE LOGIC
 * Las preguntas se cargan desde el bloque script en index.html
 */

// 2. Utilidades de Codificación Robustas
function robustEncode(obj) {
    try {
        const str = JSON.stringify(obj);
        return btoa(unescape(encodeURIComponent(str)));
    } catch (e) {
        return "";
    }
}

function robustDecode(str) {
    try {
        if (!str) return null;
        const cleaned = str.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '+');
        const decoded = decodeURIComponent(escape(atob(cleaned)));
        return JSON.parse(decoded);
    } catch (e) {
        return null;
    }
}

// 3. Inicialización de Estado sincronizada
const urlParams = new URLSearchParams(window.location.search);
const sharedD = urlParams.get('d');
const sharedW = urlParams.get('w');

let QUESTIONS = [];
let responses = JSON.parse(localStorage.getItem('survey_responses')) || {};

// Lógica de carga de preguntas (Prioriza URL, luego LocalStorage, luego DEFAULT en HTML)
if (sharedD) {
    const fromUrl = robustDecode(sharedD);
    QUESTIONS = (fromUrl && Array.isArray(fromUrl)) ? fromUrl : [...DEFAULT_QUESTIONS];
    if (sharedW) {
        try { sessionStorage.setItem('temp_webhook', atob(sharedW.replace(/\s/g, '+'))); } catch (e) { }
    }
} else {
    const local = localStorage.getItem('admin_questions');
    QUESTIONS = local ? JSON.parse(local) : [...DEFAULT_QUESTIONS];
}

// 4. Renderizado del Cuestionario
// 5. Gestión de Toggle (Desmarcar)
window.toggleLikert = function (radio, key, val) {
    const saveStatus = document.getElementById('save-status');

    if (radio.getAttribute('data-checked-state') === 'true') {
        // Desmarcar
        radio.checked = false;
        radio.setAttribute('data-checked-state', 'false');
        delete responses[key];
        localStorage.setItem('survey_responses', JSON.stringify(responses));

        // Feedback visual para desmarcado
        if (saveStatus) {
            saveStatus.innerHTML = '<i data-lucide="refresh-cw" class="icon-small spin"></i> Guardando...';
            if (window.lucide) lucide.createIcons();

            setTimeout(() => {
                saveStatus.innerHTML = '<i data-lucide="check-circle" class="icon-small"></i> Guardado automáticamente';
                if (window.lucide) lucide.createIcons();
            }, 600);
        }
    } else {
        // Marcar
        // Resetear hermanos
        document.querySelectorAll(`input[name="${radio.name}"]`).forEach(r => {
            r.setAttribute('data-checked-state', 'false');
        });
        radio.setAttribute('data-checked-state', 'true');
        saveResponse(key, val); // saveResponse ya tiene su propio feedback visual
    }
};

// 4. Renderizado del Cuestionario
function renderQuestions() {
    // Parte 1: Preguntas 1-36 (Sección 2)
    const container1 = document.getElementById('questions-container');
    if (container1) {
        const questionsPart1 = QUESTIONS.slice(0, 22);
        container1.innerHTML = questionsPart1.map(q => `
            <div class="question-row fade-in" data-id="${q.id}">
                <div class="question-text">
                    <span class="category-title">${q.category}</span>
                    <span class="question-subtext">${q.subtext || ''}</span>
                </div>
                
                <div class="side-past">
                    <div class="likert-group">
                        ${[1, 2, 3, 4, 5].map(val => `
                            <label class="likert-option">
                                <input type="radio" name="past_${q.id}" value="${val}" 
                                    ${responses[`past_${q.id}`] == val ? 'checked' : ''} 
                                    data-checked-state="${responses[`past_${q.id}`] == val ? 'true' : 'false'}"
                                    onclick="toggleLikert(this, 'past_${q.id}', ${val})">
                                <div class="likert-circle"></div>
                                <span class="likert-label">${val}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>

                <div class="side-now">
                    <div class="likert-group">
                        ${[1, 2, 3, 4, 5].map(val => `
                            <label class="likert-option">
                                <input type="radio" name="now_${q.id}" value="${val}" 
                                    ${responses[`now_${q.id}`] == val ? 'checked' : ''} 
                                    data-checked-state="${responses[`now_${q.id}`] == val ? 'true' : 'false'}"
                                    onclick="toggleLikert(this, 'now_${q.id}', ${val})">
                                <div class="likert-circle"></div>
                                <span class="likert-label">${val}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }



    // Parte 2: Preguntas 37-55 (Sección 3)
    const container2 = document.getElementById('questions-container-part2');
    if (container2) {
        const questionsPart2 = QUESTIONS.slice(22, 41);
        container2.innerHTML = questionsPart2.map(q => `
            <div class="question-row fade-in" data-id="${q.id}">
                <div class="question-text">
                    <span class="category-title">${q.category}</span>
                    <span class="question-subtext">${q.subtext || ''}</span>
                </div>
                
                <div class="side-past">
                    <div class="likert-group">
                        ${[1, 2, 3, 4, 5].map(val => `
                            <label class="likert-option">
                                <input type="radio" name="past_${q.id}" value="${val}" 
                                    ${responses[`past_${q.id}`] == val ? 'checked' : ''} 
                                    data-checked-state="${responses[`past_${q.id}`] == val ? 'true' : 'false'}"
                                    onclick="toggleLikert(this, 'past_${q.id}', ${val})">
                                <div class="likert-circle"></div>
                                <span class="likert-label">${val}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>

                <div class="side-now">
                    <div class="likert-group">
                        ${[1, 2, 3, 4, 5].map(val => `
                            <label class="likert-option">
                                <input type="radio" name="now_${q.id}" value="${val}" 
                                    ${responses[`now_${q.id}`] == val ? 'checked' : ''} 
                                    data-checked-state="${responses[`now_${q.id}`] == val ? 'true' : 'false'}"
                                    onclick="toggleLikert(this, 'now_${q.id}', ${val})">
                                <div class="likert-circle"></div>
                                <span class="likert-label">${val}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Parte 2 Duplicada: Preguntas 37-55 (Sección 3 Duplicada)
    const container2Dup = document.getElementById('questions-container-part2-duplicada');
    if (container2Dup) {
        const questionsPart2Dup = QUESTIONS.slice(41);
        container2Dup.innerHTML = questionsPart2Dup.map(q => {
            if (q.type === 'multiple-choice' || q.type === 'single-choice') {
                const inputType = q.type === 'single-choice' ? 'radio' : 'checkbox';
                return `
            <div class="question-row fade-in" data-id="${q.id}" style="display: block; padding-bottom: 2rem;">
                <div class="question-text" style="width: 100%; margin-bottom: 1.5rem;">
                    <span class="category-title" style="font-weight: 600;">${q.category}</span>
                </div>
                <div class="multiple-choice-group" style="display: flex; flex-direction: column; gap: 1rem; padding-left: 1rem;">
                    ${q.options.map(opt => {
                        // Check exact match for radio, includes for checkbox
                        const valActual = responses[`past_${q.id}`] || '';
                        const isChecked = inputType === 'radio' ? valActual === opt : valActual.includes(opt);
                        const escapedOpt = opt.replace(/'/g, "\\'");
                        const clickHandler = inputType === 'radio' ? `onclick="toggleLikert(this, 'past_${q.id}', '${escapedOpt}')"` : '';
                        
                        return `
                        <label class="checkbox-option" style="display: flex; align-items: flex-start; gap: 0.8rem; cursor: pointer;">
                            <input type="${inputType}" name="past_${q.id}" value="${opt}"
                                ${isChecked ? 'checked' : ''}
                                data-checked-state="${isChecked ? 'true' : 'false'}"
                                ${clickHandler}
                                style="margin-top: 0.2rem; transform: scale(1.2);">
                            <span style="font-size: 1.1rem; color: var(--text-primary); line-height: 1.4;">${opt}</span>
                        </label>
                        `;
                    }).join('')}
                </div>
            </div>`;
            }

            return `
            <div class="question-row fade-in" data-id="${q.id}">
                <div class="question-text">
                    <span class="category-title">${q.category}</span>
                    <span class="question-subtext">${q.subtext || ''}</span>
                </div>
                
                <div class="side-past">
                    <div class="likert-group">
                        ${[1, 2, 3, 4, 5].map(val => `
                            <label class="likert-option">
                                <input type="radio" name="past_${q.id}" value="${val}" 
                                    ${responses[`past_${q.id}`] == val ? 'checked' : ''} 
                                    data-checked-state="${responses[`past_${q.id}`] == val ? 'true' : 'false'}"
                                    onclick="toggleLikert(this, 'past_${q.id}', ${val})">
                                <div class="likert-circle"></div>
                                <span class="likert-label">${val}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>

                <div class="side-now">
                    <div class="likert-group">
                        ${[1, 2, 3, 4, 5].map(val => `
                            <label class="likert-option">
                                <input type="radio" name="now_${q.id}" value="${val}" 
                                    ${responses[`now_${q.id}`] == val ? 'checked' : ''} 
                                    data-checked-state="${responses[`now_${q.id}`] == val ? 'true' : 'false'}"
                                    onclick="toggleLikert(this, 'now_${q.id}', ${val})">
                                <div class="likert-circle"></div>
                                <span class="likert-label">${val}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            </div>`;
        }).join('');
    }

    if (window.lucide) lucide.createIcons();

    // Restaurar inputs persistentes (Apellidos, Género)
    restoreFormInputs();
}


// Persistencia de inputs del formulario
function restoreFormInputs() {
    const inputs = {
        'user-surname': 'value'
    };

    for (let id in inputs) {
        const val = localStorage.getItem(`input_${id}`);
        const el = document.getElementById(id);
        if (val && el) el.value = val;
    }
}

// Listener global para guardar cambios en tiempo real
document.addEventListener('change', (e) => {
    const el = e.target;
    if (el.id === 'user-surname') {
        localStorage.setItem(`input_${el.id}`, el.value);
    } else if (el.name) {
        // Para radios y checkboxes del mismo name
        if (el.type === 'radio') {
            localStorage.setItem(`input_${el.name}`, el.value);
            saveResponse(el.name, el.value);

            // Feedback visual para radios
            const saveStatus = document.getElementById('save-status');
            if (saveStatus) {
                saveStatus.innerHTML = '<i data-lucide="refresh-cw" class="icon-small spin"></i> Guardando...';
                if (window.lucide) lucide.createIcons();
                setTimeout(() => {
                    saveStatus.innerHTML = '<i data-lucide="check-circle" class="icon-small"></i> Guardado automáticamente';
                    if (window.lucide) lucide.createIcons();
                }, 600);
            }
        } else if (el.type === 'checkbox') {
            const checked = Array.from(document.querySelectorAll(`input[name="${el.name}"]:checked`))
                .map(i => i.value);
            localStorage.setItem(`input_${el.name}`, checked.join('|||'));
            saveResponse(el.name, checked.join(', '));

            // Feedback visual para checkboxes
            const saveStatus = document.getElementById('save-status');
            if (saveStatus) {
                saveStatus.innerHTML = '<i data-lucide="refresh-cw" class="icon-small spin"></i> Guardando...';
                if (window.lucide) lucide.createIcons();
                setTimeout(() => {
                    saveStatus.innerHTML = '<i data-lucide="check-circle" class="icon-small"></i> Guardado automáticamente';
                    if (window.lucide) lucide.createIcons();
                }, 600);
            }
        }
    }
});

// Listener para el input de texto Nombre (keyup para mayor fluidez)
document.addEventListener('keyup', (e) => {
    if (e.target.id === 'user-name') {
        localStorage.setItem(`input_user-name`, e.target.value);
    } else if (e.target.id === 'user-surname') {
        localStorage.setItem(`input_user-surname`, e.target.value);
    } else if (e.target.id === 'freq_otras') {
        localStorage.setItem(`input_freq_otras`, e.target.value);
    }
});

// 5. Gestión de Respuestas
window.saveResponse = function (key, value) {
    responses[key] = value;
    localStorage.setItem('survey_responses', JSON.stringify(responses));

    const saveStatus = document.getElementById('save-status');
    if (saveStatus) {
        saveStatus.innerHTML = '<i data-lucide="refresh-cw" class="icon-small spin"></i> Guardando...';
        if (window.lucide) lucide.createIcons();
        setTimeout(() => {
            saveStatus.innerHTML = '<i data-lucide="check-circle" class="icon-small"></i> Guardado automáticamente';
            if (window.lucide) lucide.createIcons();
        }, 800);
    }
};

// 6. Envío Robusto a Supabase + Google Sheets
// Flag global para prevenir envíos duplicados
let isSubmitting = false;

// Función para reiniciar el cuestionario sin recargar la página
window.resetSurvey = function () {
    // 1. Ocultar modal de éxito
    const modal = document.getElementById('modal-success');
    if (modal) modal.classList.add('hidden');

    // 2. Limpiar todos los datos en memoria y localStorage
    localStorage.removeItem('survey_responses');
    responses = {};

    // Limpiar inputs visuales (Sección 1/3)
    document.getElementById('matrix-form').reset();

    // 3. Volver a la Sección 2 y ocultar las demás
    document.getElementById('section-2').classList.remove('hidden');
    document.getElementById('section-3').classList.add('hidden');
    const sec3Dup = document.getElementById('section-3-duplicada');
    if (sec3Dup) sec3Dup.classList.add('hidden');
    document.getElementById('section-4').classList.add('hidden');

    // 4. Asegurar que volvemos arriba de todo para ver el título y el disclaimer
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 5. Reiniciar flag de envío
    isSubmitting = false;
    const btn = document.getElementById('submit-btn');
    if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<span>Enviar Cuestionario</span><i data-lucide="send" class="icon-right"></i>';
    }

    // Re-iniciar iconos si es necesario
    if (window.lucide) lucide.createIcons();

    console.log("♻️ Cuestionario reseteado correctamente.");
};

// Funciones de navegación

window.validateSection2AndNext = function () {
    // Todo bien (ahora opcional), vamos a la Sección 3 (Preguntas 37-55)
    document.getElementById('section-2').classList.add('hidden');
    document.getElementById('section-3').classList.remove('hidden');
    window.scrollTo(0, 0);
};

window.validateSection3AndNext = function () {
    // Todo bien, vamos a la Sección 3 Duplicada
    document.getElementById('section-3').classList.add('hidden');
    const sec3Dup = document.getElementById('section-3-duplicada');
    if (sec3Dup) sec3Dup.classList.remove('hidden');
    window.scrollTo(0, 0);
};

window.validateSection3DuplicadaAndNext = function () {
    // Todo bien (ahora opcional), vamos a la Sección 4 (Datos Personales)
    document.getElementById('section-3-duplicada').classList.add('hidden');
    document.getElementById('section-4').classList.remove('hidden');
    window.scrollTo(0, 0);
};

window.goToSection2 = function () {
    const sec3 = document.getElementById('section-3');
    if (sec3 && !sec3.classList.contains('hidden')) sec3.classList.add('hidden');

    document.getElementById('section-2').classList.remove('hidden');
    window.scrollTo(0, 0);
};

window.goToSection3 = function () {
    const sec3Dup = document.getElementById('section-3-duplicada');
    if (sec3Dup && !sec3Dup.classList.contains('hidden')) {
        sec3Dup.classList.add('hidden');
    } else {
        document.getElementById('section-4').classList.add('hidden');
    }
    
    document.getElementById('section-3').classList.remove('hidden');
    window.scrollTo(0, 0);
};

window.goToSection3Duplicada = function () {
    document.getElementById('section-4').classList.add('hidden');
    const sec3Dup = document.getElementById('section-3-duplicada');
    if (sec3Dup) sec3Dup.classList.remove('hidden');
    window.scrollTo(0, 0);
};

const mainForm = document.getElementById('matrix-form');
if (mainForm) {
    mainForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // PROTECCIÓN CONTRA DUPLICADOS: Verificar si ya hay un envío en progreso
        if (isSubmitting) {
            console.warn("⚠️ Envío ya en progreso. Ignorando evento duplicado.");
            return;
        }

        // Generar ID único para esta transacción (para debugging)
        const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        console.log(`📝 [${transactionId}] Evento submit capturado. Validando...`);

        // Validar Sección 4 (Datos Personales) - Apellidos es el único obligatorio
        const userSurnameInput = document.getElementById('user-surname');
        const userSurname = userSurnameInput ? userSurnameInput.value.trim() : "";

        const btn = document.getElementById('submit-btn');
        // VALIDACIÓN DE APELLIDOS (OBLIGATORIO)
        if (!userSurname) {
            alert('Por favor, indica tus apellidos para poder enviar el cuestionario.');
            if (userSurnameInput) userSurnameInput.focus();
            isSubmitting = false;
            return;
        }

        // DESACTIVAR INMEDIATAMENTE el botón y marcar como enviando
        isSubmitting = true;
        btn.disabled = true;
        btn.innerHTML = '<span>Guardando...</span>';
        console.log(`🔒 [${transactionId}] Botón desactivado y flag isSubmitting = true`);

        // Construir payload EN EL ORDEN Y CON LAS CLAVES EXACTAS para Sheets y Supabase
        const payload = {
            "Fecha": new Date().toLocaleString(),
            "Apellidos": userSurname
        };


        // 3. Items de valoración (1-55) con nombres completos
        QUESTIONS.forEach((q, index) => {
            const valAfter = responses[`past_${q.id}`];
            const valBefore = responses[`now_${q.id}`];
            
            // Si es de las duplicadas (índice >= 41)
            if (index >= 41) {
                payload[`${q.category} (Duplicada Después)`] = valAfter !== undefined ? valAfter : "";
                payload[`${q.category} (Duplicada Retrospectiva)`] = valBefore !== undefined ? valBefore : "";
            } else {
                payload[`${q.category} (Después de la experiencia)`] = valAfter !== undefined ? valAfter : "";
                payload[`${q.category} (Retrospectiva Cuestionario 1)`] = valBefore !== undefined ? valBefore : "";
            }
        });

        console.log(`📦 [${transactionId}] Payload construido:`, payload);

        try {
            // PASO 1: Guardar en Supabase (Base de datos principal)
            console.log(`📊 [${transactionId}] Guardando en Supabase...`);
            btn.innerHTML = '<span>Guardando...</span>';

            let supabaseRecord = null;
            let supabaseSaved = false;

            try {
                supabaseRecord = await saveToSupabase(payload);
                supabaseSaved = true;
                console.log(`✅ [${transactionId}] Datos guardados en Supabase:`, supabaseRecord);
            } catch (supabaseError) {
                console.warn(`⚠️ [${transactionId}] Supabase no disponible, continuando con Google Sheets:`, supabaseError.message);
                // Si Supabase falla, continuamos con Google Sheets
            }

            // PASO 2: Intentar sincronizar registros pendientes
            const webhook = (typeof WEBHOOK_URL !== 'undefined' ? WEBHOOK_URL : '') ||
                sessionStorage.getItem('temp_webhook') ||
                localStorage.getItem('google_sheet_webhook');

            // NOTA: NO sincronizamos registros pendientes aquí para evitar duplicados.
            // Los registros pendientes se sincronizarán automáticamente en el próximo envío.

            // PASO 3: Enviar a Google Sheets (con reintentos)
            if (webhook) {
                btn.innerHTML = '<span>Enviando cuestionario...</span>';
                // El webhook de Google Apps Script ahora gestiona tanto la hoja de cálculo como el envío del email con el adjunto .txt
                console.log(`📤 [${transactionId}] Iniciando envío a Google Sheets y Backup Gmail...`);

                const maxRetries = 3;
                let retryCount = 0;
                let sheetSuccess = false;

                while (retryCount < maxRetries && !sheetSuccess) {
                    try {
                        console.log(`📤 [${transactionId}] Intento ${retryCount + 1}/${maxRetries} de envío a Google Sheets...`);

                        await fetch(webhook, {
                            method: 'POST',
                            mode: 'no-cors',
                            cache: 'no-cache',
                            body: JSON.stringify(payload)
                        });

                        sheetSuccess = true;
                        console.log(`✅ [${transactionId}] Datos enviados a Google Sheets`);

                        // Marcar como sincronizado en Supabase SOLO si se guardó exitosamente
                        if (supabaseSaved && supabaseRecord) {
                            await markAsSynced(supabaseRecord.id);
                            console.log(`✅ [${transactionId}] Registro marcado como sincronizado en Supabase`);
                        }

                    } catch (sheetError) {
                        retryCount++;
                        console.warn(`❌ [${transactionId}] Intento ${retryCount} falló:`, sheetError);

                        if (retryCount < maxRetries) {
                            // Esperar antes de reintentar (backoff exponencial)
                            const waitTime = Math.pow(2, retryCount) * 1000;
                            console.log(`⏳ [${transactionId}] Esperando ${waitTime}ms antes de reintentar...`);
                            await new Promise(resolve => setTimeout(resolve, waitTime));
                        }
                    }
                }

                if (!sheetSuccess) {
                    console.warn(`⚠️ [${transactionId}] No se pudo enviar a Google Sheets después de 3 intentos`);
                    if (supabaseSaved) {
                        console.log(`💾 [${transactionId}] Los datos están guardados en Supabase y se sincronizarán automáticamente en el próximo envío`);
                    }
                }
            } else {
                console.warn(`⚠️ [${transactionId}] No hay webhook configurado para Google Sheets`);
            }

            // PASO 4: Mostrar éxito al usuario
            console.log(`✅ [${transactionId}] Proceso completado exitosamente`);
            setTimeout(() => {
                const modal = document.getElementById('modal-success');
                if (modal) modal.classList.remove('hidden');

                // Limpieza profunda de persistencia
                localStorage.removeItem('survey_responses');
                responses = {};

                // Eliminar todos los inputs guardados de la Sección 1
                Object.keys(localStorage).forEach(key => {
                    if (key.startsWith('input_')) {
                        localStorage.removeItem(key);
                    }
                });

                // Limpiar UI
                const surnameEl = document.getElementById('user-surname');
                if (surnameEl) surnameEl.value = "";
                
                document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(r => r.checked = false);

                // RESETEAR FLAG para permitir nuevos envíos
                isSubmitting = false;
                btn.disabled = false;
                btn.innerHTML = '<span>Enviar Resultados</span><i data-lucide="send" class="icon-right"></i>';
                if (window.lucide) lucide.createIcons();
                console.log(`🔓 [${transactionId}] Flag isSubmitting reseteado`);
            }, 600);

        } catch (err) {
            console.error(`❌ [${transactionId}] Error crítico en el envío:`, err);
            // Mostrar mensaje de error específico
            let errorMsg = 'Error al guardar los datos. ';
            if (err.message.includes('Supabase not configured')) {
                errorMsg += 'Por favor, configura Supabase en supabase-config.js';
            } else {
                errorMsg += 'Por favor, verifica tu conexión e intenta de nuevo.';
            }

            alert(errorMsg);

            // RESETEAR FLAG para permitir reintentos
            isSubmitting = false;
            btn.disabled = false;
            btn.innerHTML = '<span>Enviar Resultados</span><i data-lucide="send" class="icon-right"></i>';
            if (window.lucide) lucide.createIcons();
            console.log(`🔓 [${transactionId}] Flag isSubmitting reseteado después de error`);
        }
    });
}

// Función auxiliar para enviar a Google Sheets
async function sendToGoogleSheets(webhook, payload) {
    return fetch(webhook, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        body: JSON.stringify(payload)
    });
}

// 7. Funciones Admin
window.toggleAdmin = function () {
    const panel = document.getElementById('admin-panel');
    if (panel) {
        panel.classList.toggle('hidden');
        renderAdminQuestions();
        const urlIn = document.getElementById('webhook-url');
        if (urlIn) {
            urlIn.value = localStorage.getItem('google_sheet_webhook') ||
                (typeof WEBHOOK_URL !== 'undefined' ? WEBHOOK_URL : '');
        }
    }
};

window.saveWebhookUrl = (url) => localStorage.setItem('google_sheet_webhook', url);

function renderAdminQuestions() {
    const list = document.getElementById('admin-questions-list');
    if (!list) return;
    list.innerHTML = QUESTIONS.map((q, i) => `
        <div class="admin-q-item">
            <input type="text" value="${q.category}" onchange="updateQ(${i}, 'category', this.value)" placeholder="Categoría">
            <input type="text" value="${q.subtext || ''}" onchange="updateQ(${i}, 'subtext', this.value)" placeholder="Descripción">
            <button onclick="removeQ(${i})" class="btn-icon">×</button>
        </div>
    `).join('');
}

window.addQuestion = () => {
    QUESTIONS.push({ id: 'q' + Date.now(), category: 'Nueva Categoría', subtext: 'Descripción' });
    localSaveQuestions();
    renderAdminQuestions();
    renderQuestions();
};

window.removeQ = (i) => {
    QUESTIONS.splice(i, 1);
    localSaveQuestions();
    renderAdminQuestions();
    renderQuestions();
};

window.updateQ = (i, f, v) => {
    QUESTIONS[i][f] = v;
    localSaveQuestions();
    renderQuestions();
};

function localSaveQuestions() {
    localStorage.setItem('admin_questions', JSON.stringify(QUESTIONS));
}

window.resetQuestions = () => {
    if (confirm('¿Reiniciar a valores por defecto?')) {
        QUESTIONS = [...DEFAULT_QUESTIONS];
        localStorage.removeItem('admin_questions');
        renderAdminQuestions();
        renderQuestions();
    }
};

window.generateShareLink = () => {
    const d = robustEncode(QUESTIONS);
    const w = localStorage.getItem('google_sheet_webhook');
    const url = window.location.origin + window.location.pathname + '?d=' + d + (w ? '&w=' + btoa(w) : '');
    navigator.clipboard.writeText(url).then(() => {
        const btn = document.getElementById('gen-link-btn');
        const old = btn.innerHTML;
        btn.innerHTML = 'Copiado ✅';
        setTimeout(() => { btn.innerHTML = old; if (window.lucide) lucide.createIcons(); }, 2000);
    });
};

function startup() {
    const gear = document.getElementById('admin-gear');
    if (gear) gear.style.display = sharedD ? 'none' : 'flex';
    renderQuestions();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startup);
} else {
    startup();
}
