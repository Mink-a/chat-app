import { Injectable } from '@nestjs/common';
import { HuggingFaceInference } from '@langchain/community/llms/hf';

@Injectable()
export class TextGenerationService {
  async quoteGenerator(input: string) {
    const model = new HuggingFaceInference({
      model:
        process.env.LLM_MODEL ??
        'noelmathewisaac/inspirational-quotes-distilgpt2',
      apiKey: process.env.HF_TOKEN ?? '',
      maxTokens: 70,
    });
    const res = await model.invoke(input);
    return res;
  }
}
