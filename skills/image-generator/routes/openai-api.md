# Route: OpenAI API

Every call costs money (see `setup.md`). Generate only what the user asked for.

```bash
curl -s https://api.openai.com/v1/images/generations \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "gpt-image-2", "prompt": "<prompt>", "size": "1536x1024"}' \
| python3 -c 'import sys, json, base64; d = json.load(sys.stdin); open("<file-name>.png", "wb").write(base64.b64decode(d["data"][0]["b64_json"]))'
```

- `gpt-image-2` is the newest GPT Image model at the time of writing; check the OpenAI docs if it is rejected.
- `size` sets the aspect: landscape, portrait or square; pick what fits the use.
- On an error, the response holds `error.message`; show it to the user in plain words.
