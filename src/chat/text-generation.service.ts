import { Injectable } from '@nestjs/common';
import { HuggingFaceInference } from '@langchain/community/llms/hf';

@Injectable()
export class TextGenerationService {
  async quoteGenerator(input: string) {
    const model = new HuggingFaceInference({
      model: 'noelmathewisaac/inspirational-quotes-distilgpt2',
      apiKey: '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',
      maxTokens: 70,
    });
    const res = await model.invoke(input);
    return res;
  }
}
