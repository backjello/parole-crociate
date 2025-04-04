import env from "#start/env"
import axios, { AxiosInstance } from "axios"

export class Game {
    public theme: string = ''
    public word: string = '' // parola generata da AI
    get n(): number {
        return this.word.length
    }
    public words: { // parole e definizioni
        word: string,
        definition: string
        index: number // where to start the word
    }[] = []
    propmt: string = ''
    axiosInstance: AxiosInstance

    constructor(theme: string) {
        this.theme = theme
        this.axiosInstance = axios.create({
            headers: {
                Authorization: 'Bearer ' + env.get('OPENROUTER_KEY'),
                "Content-Type": "application/json",
            },
        })
    }

    async init() {

        const res = await this.axiosInstance.post("https://openrouter.ai/api/v1/chat/completions", this.makePayload(`dammi una parola a tema ${this.theme}. dammi solo la parola in risposta, sii creativo`, 1.5))
        const temp: Response = res.data
        this.word = temp.choices[0].message?.content.toLowerCase()
        this.propmt = ''// `generami ${this.word.length} parole a tema ${this.theme} \n`

        for (let i = 0; i < this.word.length; i++) {
            this.propmt += `generami una parola a tema ${this.theme} che contenga la lettera "${this.word.charAt(i)}" e la sua definizione \n`;
        }

        this.propmt += '\n le lettere che richiedo non devono essere sempre nella stessa posizione\n';
        this.propmt += '\n la risposta deve essere in formato JSON secondo questo schema {word: string, definition: string}\n';

        await this.getWords()

    }
    async getWords() {
        const res = await this.axiosInstance.post("https://openrouter.ai/api/v1/chat/completions", this.makePayload(this.propmt))
        const temp: Response = res.data
        this.words = JSON.parse(temp.choices[0].message.content.replaceAll('\n', ''))
        if (this.words.length != this.word.length) {
            await this.getWords()
            return
        }
        for (let i = 0; i < this.n; i++) {
            const curWord = this.words[i]
            curWord.word = curWord.word.toLowerCase()
            const letter = this.word.charAt(i)
            console.log(curWord.word, letter);

            curWord.index = curWord.word.indexOf(letter)
            if (curWord.index == -1) {
                await this.getWords()
                return
            }
        }
    }

    private makePayload(text: string, teperature: number = 0) {
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
            ],
            "temperature": teperature
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
