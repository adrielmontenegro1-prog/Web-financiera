module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return res.status(200).json({ data: null, cloud: false });
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/finance_data?id=eq.default&select=data,updated_at&limit=1`, {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
    });

    if (!response.ok) {
      const detail = await response.text();
      return res.status(response.status).json({ error: 'Supabase load failed', detail });
    }

    const rows = await response.json();
    return res.status(200).json({ data: rows[0]?.data || null, updated_at: rows[0]?.updated_at || null, cloud: true });
  } catch (error) {
    return res.status(500).json({ error: 'Cloud load failed', detail: error.message });
  }
};
