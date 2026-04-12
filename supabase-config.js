const SUPABASE_URL = 'https://evhalrxeysymecfeznuf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2aGFscnhleXN5bWVjZmV6bnVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NDY5ODIsImV4cCI6MjA4NDQyMjk4Mn0.6DivfBsIUsiXlW9rhu0SfWvLc14k66PsCWaJBFkb6Vk';

let supabaseClient = null;

function initSupabase() {
    if (typeof supabase === 'undefined') return null;
    if (!supabaseClient) {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return supabaseClient;
}

async function saveToSupabase(payload) {
    const client = initSupabase();
    if (!client) throw new Error('Supabase no está cargado');

    // Llamamos a la nueva función v3
    const { data, error } = await client.rpc('guardar_cuestionario_v3', { p_data: payload });

    if (error) {
        console.error('Error detallado de Supabase:', error);
        throw new Error(error.message);
    }
    return { id: data };
}

// Función para marcar como sincronizado (ahora apunta a v3)
async function markAsSynced(recordId) {
    const client = initSupabase();
    if (!client) return;
    await client.from('respuestas_v3').update({ synced: true }).eq('id', recordId);
}
