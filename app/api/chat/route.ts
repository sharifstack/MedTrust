import { getDoctors, getUser, getAppointments } from '@/lib/actions';

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Fetch live context from the DB
    const [user, doctors, appointments] = await Promise.all([
      getUser(),
      getDoctors(),
      getAppointments(),
    ]);

    const doctorList = doctors
      .map(
        (d: any) =>
          `- Dr. ${d.name} (${d.specialty}) | Rating: ${d.rating}/5 | Experience: ${d.experienceYears} yrs | Next available: ${d.nextAvailable} | ID: ${d.id}`
      )
      .join('\n');

    const appointmentList = appointments
      .map((a: any) => {
        const doc = doctors.find((d: any) => d.id === a.doctorId);
        return `- ${a.date} at ${a.time} with Dr. ${doc?.name ?? 'Unknown'} (${a.type}) — Status: ${a.status}`;
      })
      .join('\n');

    const systemPrompt = `You are MedTrust AI, an intelligent and compassionate medical assistant for the MedTrust healthcare platform. You are talking with ${user.name} (${user.fullName}).

PATIENT PROFILE:
- Name: ${user.fullName}
- Heart Rate: ${user.vitals.heartRate} BPM
- Blood Pressure: ${user.vitals.bloodPressure} mmHg
- Insurance: ${user.insurance}

AVAILABLE DOCTORS AT MEDTRUST:
${doctorList}

${user.name}'s APPOINTMENTS:
${appointmentList}

YOUR CAPABILITIES & GUIDELINES:
1. Answer health, symptom, medication, and treatment questions professionally but in a friendly, empathetic tone.
2. Suggest relevant MedTrust doctors by name and specialty when users describe symptoms or ask for recommendations.
3. Help users book appointments by directing them to the /search page or the "Book New Appointment" button.
4. Provide general health advice, wellness tips, and medication guidance.
5. If a user asks about their appointments, reference the list above.
6. Always remind users that your advice is informational and they should consult a doctor for serious conditions.
7. Keep responses concise and scannable — use bullet points and short paragraphs.
8. Be warm, professional, and reassuring — like a knowledgeable friend who happens to be a doctor.
9. Never diagnose serious conditions definitively — always recommend professional evaluation.
10. Format key information with **bold** for emphasis.

Respond naturally and helpfully. If the user greets you, greet them back warmly and offer to help with their health needs.`;

    const geminiMessages = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: geminiMessages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('Gemini API error:', err);
      return Response.json({ error: 'AI service error' }, { status: 502 });
    }

    const data = await response.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "I'm sorry, I couldn't generate a response. Please try again.";

    return Response.json({ message: text });
  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
