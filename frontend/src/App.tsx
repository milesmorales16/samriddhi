import { useState } from 'react';

function App() {
    const [healthData, setHealthData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const checkHealth = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/health');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setHealthData(data);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
            <h1>Samriddhi - Hello World</h1>
            <p>Testing full stack: Frontend → Backend → Database</p>

            <button
                onClick={checkHealth}
                disabled={loading}
                style={{
                    padding: '0.5rem 1rem',
                    fontSize: '1rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    backgroundColor: '#0066cc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px'
                }}
            >
                {loading ? 'Checking...' : 'Check Health'}
            </button>

            {error && (
                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#ffebee', borderRadius: '4px' }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            {healthData && (
                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>
                    <h3>Health Check Result:</h3>
                    <pre style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
                        {JSON.stringify(healthData, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}

export default App;
