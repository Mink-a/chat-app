import { Injectable } from '@nestjs/common';
import { HuggingFaceInference } from '@langchain/community/llms/hf';

@Injectable()
export class TextGenerationService {
  /**
   * This function generates inspirational quotes using a Hugging Face model.
   *
   * @param input - The input string to the model. This could be a prompt or a seed phrase.
   * @returns A Promise that resolves to a string containing the generated quote.
   *
   * @throws Will throw an error if the Hugging Face API key is not provided or if the model fails to generate a quote.
   */
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
