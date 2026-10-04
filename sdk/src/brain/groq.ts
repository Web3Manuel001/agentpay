import dns from 'node:dns';

try {
  dns.setDefaultResultOrder('ipv4first');
} catch {}

export interface GroqMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content?: string | null;
  tool_calls?: any[];
  tool_call_id?: string;
  name?: string;
}

export class GroqClient {
  private apiKey: string;
  public model: string;

  constructor(apiKey: string, model?: string) {
    this.apiKey = apiKey.trim();
    this.model = model || process.env.GROQ_MODEL || 'qwen/qwen3.8-27b';
  }

  async discoverActiveModel(): Promise<string> {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { 'Authorization': `Bearer ${this.apiKey}` },
        signal: AbortSignal.timeout(6000),
      });
      const data = await res.json();
      if (data.data && Array.isArray(data.data)) {
        const chatModels = data.data
          .map((m: any) => m.id)
          .filter((id: string) => !id.includes('whisper') && !id.includes('guard'));

        const qwenModel = chatModels.find((id: string) => id.includes('qwen'));
        if (qwenModel) return qwenModel;
        if (chatModels.length > 0) return chatModels[0];
      }
    } catch {}
    return 'qwen/qwen3.8-27b';
  }

  async chatCompletion(messages: GroqMessage[], tools?: any[]): Promise<any> {
    const payload: any = {
      model: this.model,
      messages,
      temperature: 0.1,
      max_tokens: 750, // Stays strictly within Groq's 1000 OTPM free-tier limit
    };

    if (tools && tools.length > 0) {
      payload.tools = tools;
      payload.tool_choice = 'auto';
    }

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });

    const data = await res.json();

    if (res.status === 404) {
      console.warn(`⚠️ Model "${this.model}" not found. Auto-discovering models...`);
      const newModel = await this.discoverActiveModel();
      console.log(`✅ Switched to active model: "${newModel}"`);
      this.model = newModel;
      return await this.chatCompletion(messages, tools);
    }

    if (!res.ok) {
      const errMsg = data.error?.message || JSON.stringify(data);
      throw new Error(`[Groq LPU Error ${res.status}] ${errMsg}`);
    }

    if (!data.choices || data.choices.length === 0) {
      throw new Error(`[Groq LPU Error] Server returned no choices: ${JSON.stringify(data)}`);
    }

    return data.choices[0].message;
  }
}
