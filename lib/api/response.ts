export function success(data: any, status = 200): Response {
    return new Response(JSON.stringify({ success: true, data }), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}

export function error(message: string, status = 500): Response {
    return new Response(JSON.stringify({ success: false, error: message }), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}