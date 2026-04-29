module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return res.status(200).json({ saved: false, cloud: false });
  }

  try {
    const body = req.body || {};
    const payload = body.data;

    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ error: 'Missing data payload' });
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/finance_data`, {
      method: 'POST',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify({
        id: 'default',
        data: payload,
        updated_at: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      return res.status(response.status).json({ error: 'Supabase save failed', detail });
    }

    return res.status(200).json({ saved: true, cloud: true });
  } catch (error) {
    return res.status(500).json({ error: 'Cloud save failed', detail: error.message });
  }
};
