import env from "#start/env"
import axios, { AxiosInstance } from "axios"

export class Game {
    public theme: string = ''
    public word: string = ''
    public n: number = 0
    public words: any
    // {
    //     word: string,
    //     definition: string
    //     index: number // where to start the word
    // }[] = []
    propmt: string = ''
    axiosInstance: AxiosInstance

    constructor(theme: string) {
        this.theme = theme
        console.log('pikachu');
        this.axiosInstance = axios.create({
            headers: {
                Authorization: 'Bearer ' + env.get('OPENROUTER_KEY'),
                "Content-Type": "application/json",
            },
        })
    }

    async init() {

        const res = await this.axiosInstance.post("https://openrouter.ai/api/v1/chat/completions", this.makePayload(`dammi una parola a tema ${this.theme}. dammi solo la parola in risposta`))
        const temp: Response = res.data
        this.word = temp.choices[0].message?.content
        this.n = this.word.length
        this.propmt = `generami ${this.word.length} parole a tema ${this.theme} \n`

        for (let i = 0; i < this.word.length; i++) {
            this.propmt += 'generami una parola che contenga la lettera "' + this.word.charAt(i) + '" e la sua definizione \n';
        }

        this.propmt += '\n le lettere che richiedo non devono essere sempre nella stessa posizione\n';
        this.propmt += '\n la risposta deve essere in formato JSON secondo questo schema {word: string, definition: string}\n';

        await this.getWords()

    }
    async getWords() {
        const res = await this.axiosInstance.post("https://openrouter.ai/api/v1/chat/completions", this.makePayload(this.propmt))
        const temp: Response = res.data
        this.words = JSON.parse(temp.choices[0].message.content.replaceAll('\n', ''))
    }

    private makePayload(text: string) {
        return {
            "model": "openrouter/quasar-alpha",
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": text
                        }
                    ]
                }
            ]
        }
    }

}


export interface Response {
    id: string
    provider: string
    model: string
    object: string
    created: number
    choices: Choice[]
}

export interface Choice {
    logprobs: any
    finish_reason: string
    native_finish_reason: string
    index: number
    message: Message
}

export interface Message {
    role: string
    content: string
    refusal: any
}
