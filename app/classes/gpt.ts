
import { ClientOptions, default as Configuration, default as OpenAIApi } from 'openai';


export default class GPTclass {
  private configuration: ClientOptions
  private openai: OpenAIApi

  constructor() {
    this.configuration = {
      apiKey: process.env.OPENAI_API_KEY,
    }
    this.openai = new OpenAIApi(this.configuration)
  }

  private async main(text: string, role: 'system' | 'user' = 'system') {
    console.log(text);
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',//'gpt-3.5-turbo',
        messages: [{ role: 'system', content: text }]
      })
      var res: any = response.choices[0].message?.content
      return res
    } catch (error) {
      console.log(error);
    }
    // gpt-4o
    // $2.50 / 1M input tokens
    // $10.00 / 1M output tokens

    // gpt-4o-mini
    // $0.150 / 1M input tokens
    // $0.600 / 1M output tokens

    // gpt-3.5-turbo
    // $3.000 / 1M input tokens
    // $8.000 / 1M training tokens


    // console.log(response.data)
    // console.log(response.data.choices[0].message)
    //console.log("tokens", response.data.usage?.total_tokens)
  }

}
