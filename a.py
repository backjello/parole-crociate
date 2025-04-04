import requests
import json

response = requests.post(
  url="https://openrouter.ai/api/v1/chat/completions",
  headers={
    "Authorization": "Bearer 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",
    "Content-Type": "application/json",
    "HTTP-Referer": "<YOUR_SITE_URL>",  # Optional. Site URL for rankings on openrouter.ai.
    "X-Title": "<YOUR_SITE_NAME>",  # Optional. Site title for rankings on openrouter.ai.
  },
  data=json.dumps({
    "model": "openrouter/quasar-alpha",
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": (
                "genera una parola che contenga la lettera 'p' e la sua definizione. "
                "genera una parola che contenga la lettera 'i' e la sua definizione. "
                "genera una parola che contenga la lettera 'k' e la sua definizione. "
                "genera una parola che contenga la lettera 'a' e la sua definizione. "
                "genera una parola che contenga la lettera 'c' e la sua definizione. "
                "genera una parola che contenga la lettera 'h' e la sua definizione. "
                "genera una parola che contenga la lettera 'u' e la sua definizione. "
                "le lettere che richiedo non devono essere sempre nella stessa posizione. la rispota in formato json"
            )
          }
        ]
      }
    ],
    
  })
)

# Print the response to the console
response_json = response.json()
if 'choices' in response_json and len(response_json['choices']) > 0:
    print(response_json['choices'][0]['message']['content'])
else:
    print("Response:", response_json)