Background: 
I am going to use a cursor to create a FE for my BE app. An AI Tutor Chat bot that is built for the students level. In every response, the api will respond with the ai response, ai response translation to native language, and ai response audio message (all streamed, can user server side events, SSE!), additionally, in parallel, the bot will correct the users response, and generate an audio of the users response or the corrected response.

Design: 
This application will be a single page chatbot. I just want a page with an area for a chatbot. I do not want any other designs or anything else flashy. I want it to look good on both web and mobile. I just want to make sure the chatbot is set up and responding properly and then I will move to designs. In the chat bot window, I want it to be similar to imessage where each person in the conversation has a “message bubble" and the bubbles or messages stack below. The chat box will be a fixed size and then scroll when messages begin to get longer than the fixed size.The chat area should auto-scroll to the bottom whenever a new message is completed. 

User Input:
The user will input the following items: native language, foreign language, and level (A1 through C2). I will provide the languages below. The user will also choose the gender for their messages and ai messages, these can be auto filled to female for ai and messages, but the user can change them. After input these items the user will hit start and then the FE will send the first turn route below.

AI message (message on the left side):
Every AI message will have the following meta data: translation and audio. These options should be available right below the message in a small icon (translation icon for translation, and audio icon for audio) when the user presses the translation button, the translation should display above the message as a top level bubble (it can cover previous responses). This is similar to a hint when you hover your cursor over an icon, but here they will need to press it and it will toggle it above, not blocking the ai message, so the user can see both. When press, the audio icon will play the audio.

Human Message (message on the right side):
Human messages can be either audio or text. When a text message is sent, the users original text message can be used as the users message in the bubble. When an audio message is sent, a loading icon can be shown in the bubble, and eventually replaced with the transcription of the audio when the response is received.

Additionally, when the response is received, every response will include an audio url in the correction event that will include the ai playback of their message. This will be displayed in the same way as the ai message, as an audio icon below the message. When the icon is pressed the audio url that is provided will play

If a message is corrected, then there will also be a corrected message in the correction. This will have the same effect as the translation icon for the ai message (except flipped as the human message is on the right side)

If a user sends an audio message, there will also be an audio icon above their bubble message where the user can listen back to their original audio recording. Max audio size is 10MB. When the audio icon is pressed (different audio icon) the saved user audio will play

Sending Human messages:
The user will be able to send text messages or audio messages, including the mic icon in the input message area so the user can press that to record a message if they choose. For recording, use the MediaRecorder API to capture microphone audio as a .webm and send it as audio_file in the /api/chat/voice form-data request. When recording a recording icon should show. The can play back to listen to themselves and then either send or remove the audio

On the front end, it will need to store thread_id, messages (in order to display them), any human audio messages (for playback), and foreign language (for each request). There will be no persistence between sessions, if a user refreshes the page, everything will be back to the new user page, no FE persistence.

Recording & sending audio: Use the MediaRecorder API to capture microphone audio as .webm and send it as audio_file in /api/chat/voice (multipart form-data).While recording: Show a clear “recording” state (e.g. red mic icon and a small timer). Disable sending text messages.When the user stops recording:Show a preview state in the input area with: a playback button to listen to their recording a “Send” button to send the audio to /api/chat/voice a “Delete”/“Cancel” option to discard the recording Do not allow audio files larger than 10MB; if the file would exceed this size, stop recording and show an error message.


Audio playback rules: Implement a simple AudioPlayer component with a play/pause icon (play icon turns into a pause icon when pressed). Only allow one audio (AI or user) to play at a time; starting a new audio should pause the previously playing audio.

NOTE: 

Translation/correction toggles: AI messages: a translation icon toggles a translation bubble above the AI bubble (shows AI translation text). User messages: a correction icon (only when corrected = true) toggles a correction bubble above the user bubble (shows corrected foreign text + translation + correction audio player). Only one bubble of this type (translation or correction) can be open in the entire chat at any time. Opening a new one automatically closes any previously open bubble.


Tech Stack
Use React for the frontend. Use TypeScript everywhere (no JavaScript files). Use Vite + React + TypeScript to create a single-page app (no routing needed yet). Use Tailwind CSS for styling. Keep the initial design minimal and clean (iMessage-style bubbles, responsive layout). No fancy design system yet. Use React hooks only for state (no Redux/Zustand). Create a small custom hook to manage SSE streaming and chat state. Use the browser MediaRecorder API for recording, and a simple custom AudioPlayer component (play/pause button) for playback. Do not use any external audio libraries.

Route Information:
First Turn, User Submission
Request Body (/api/chat/text):
For the users first turn / submission, use the /api/chat/text route with the following request body:
{
  "foreign_language": "string", # language string, proper()
  "native_language": "string",  # language string, proper()
  "student_level": "string",       # “A1”, “A2”, “B1”, “B2”, “C1”, “C2” 
  "tutor_gender": "string",        # “male” or “female”
  "student_gender": "string"    # “male” or “female”
}
Response (/api/chat/text):
{
  "thread_id": "string",  # thread id for the chat, to be saved and used in subsequent requests
  "ai_message": {
    "content": "string",   # AI message in the users foreign language
    "translation": "string",  # AI message in the users native language
    "audio_url": "string"    # URL to play the audio of the AI message in foreign language
  }
}

(2nd turn+) Text Route (/api/chat/text) - with correction: 
Request Body  (/api/chat/text):
{
  "thread_id": "string", # thread id for the user
  "message": "string", # user message
  "stream": true,  # bool, set to true for streaming
  "foreign_language": "string" # Foreign language name
}
Response (Streaming):
: thread_id d5d16cf8-1136-440c-b962-57992e810fe3

event: thread
data: {"thread_id": "d5d16cf8-1136-440c-b962-57992e810fe3"}

event: assistant_start
data: {"id": "4b02a2a4-3dc0-4fd8-a9c2-1e5255307693", "node": "call_model"}

event: assistant_delta
data: {"id": "4b02a2a4-3dc0-4fd8-a9c2-1e5255307693", "channel": "foreign", "text": "П"}

event: assistant_delta
data: {"id": "4b02a2a4-3dc0-4fd8-a9c2-1e5255307693", "channel": "foreign", "text": "онят"}

event: assistant_delta
data: {"id": "4b02a2a4-3dc0-4fd8-a9c2-1e5255307693", "channel": "foreign", "text": "но"}

event: assistant_delta
data: {"id": "4b02a2a4-3dc0-4fd8-a9c2-1e5255307693", "channel": "foreign", "text": "."}

event: assistant_delta
data: {"id": "4b02a2a4-3dc0-4fd8-a9c2-1e5255307693", "channel": "foreign", "text": " Ты"}

event: assistant_delta
data: {"id": "4b02a2a4-3dc0-4fd8-a9c2-1e5255307693", "channel": "foreign", "text": " люб"}

event: assistant_delta
data: {"id": "4b02a2a4-3dc0-4fd8-a9c2-1e5255307693", "channel": "foreign", "text": "ишь"}

event: assistant_delta
data: {"id": "4b02a2a4-3dc0-4fd8-a9c2-1e5255307693", "channel": "foreign", "text": " уч"}

event: assistant_delta
data: {"id": "4b02a2a4-3dc0-4fd8-a9c2-1e5255307693", "channel": "foreign", "text": "ить"}

event: assistant_delta
data: {"id": "4b02a2a4-3dc0-4fd8-a9c2-1e5255307693", "channel": "foreign", "text": " русский"}

event: assistant_delta
data: {"id": "4b02a2a4-3dc0-4fd8-a9c2-1e5255307693", "channel": "foreign", "text": " язык"}

event: assistant_delta
data: {"id": "4b02a2a4-3dc0-4fd8-a9c2-1e5255307693", "channel": "foreign", "text": "?"}

event: correction
data: {"target_id": "8603e057-b23f-4491-90a6-88cddeba40bb", "corrected_message": "Да, я обычно учу русский в школе", "translation": "Yes, I usually learn Russian at school", "audio_url": "https://minkrhmuqpubcgxvmnao.supabase.co/storage/v1/object/public/audio-bucket/d5d16cf8-1136-440c-b962-57992e810fe3/chat_20251111_004452_36289356.mp3", "corrected": true}

event: assistant_end
data: {"id": "4b02a2a4-3dc0-4fd8-a9c2-1e5255307693", "ai_message": "Понятно. Ты любишь учить русский язык?", "translation": "I see. Do you like learning Russian?", "audio_url": "https://minkrhmuqpubcgxvmnao.supabase.co/storage/v1/object/public/audio-bucket/d5d16cf8-1136-440c-b962-57992e810fe3/chat_20251111_004454_393cb8d8.mp3"}

event: done
data: {"ok": true}

Response Info:
First it will stream the users response, then will return all of the additional data includes:

event: correction this is when we decide if the user's response needs correction or not (“corrected”: true). If true, we need to allow the user to toggle the correct response, possibly at a popup that shows their corrected message, the translation of their corrected message, and a play button that allows the user to hear how to say their message properly.

event: assistant_end When assistant_end happens, then we receive the translation of the AI response and the audio url. With this the FE will allow the users to play the AI audio and see translation

(2nd turn+) Text Route (/api/chat/text) - without correction:
Request Body (/api/chat/text):
{
  "thread_id": "string", # thread id for the user
  "message": "string", # user message
  "stream": true,  # bool, set to true for streaming
  "foreign_language": "string" # Foreign language name
}

Response (Streaming):
: thread_id 544ae617-17c1-4bbe-adcf-ff96a73183cc

event: thread
data: {"thread_id": "544ae617-17c1-4bbe-adcf-ff96a73183cc"}

event: assistant_start
data: {"id": "7bb94444-167b-47f4-a472-ebcd92877683", "node": "call_model"}

event: assistant_delta
data: {"id": "7bb94444-167b-47f4-a472-ebcd92877683", "channel": "foreign", "text": "Это"}

event: assistant_delta
data: {"id": "7bb94444-167b-47f4-a472-ebcd92877683", "channel": "foreign", "text": " хорошо"}

event: assistant_delta
data: {"id": "7bb94444-167b-47f4-a472-ebcd92877683", "channel": "foreign", "text": "!"}

event: assistant_delta
data: {"id": "7bb94444-167b-47f4-a472-ebcd92877683", "channel": "foreign", "text": " Ты"}

event: assistant_delta
data: {"id": "7bb94444-167b-47f4-a472-ebcd92877683", "channel": "foreign", "text": " зна"}

event: assistant_delta
data: {"id": "7bb94444-167b-47f4-a472-ebcd92877683", "channel": "foreign", "text": "ешь"}

event: assistant_delta
data: {"id": "7bb94444-167b-47f4-a472-ebcd92877683", "channel": "foreign", "text": " уже"}

event: assistant_delta
data: {"id": "7bb94444-167b-47f4-a472-ebcd92877683", "channel": "foreign", "text": " много"}

event: assistant_delta
data: {"id": "7bb94444-167b-47f4-a472-ebcd92877683", "channel": "foreign", "text": " слов"}

event: assistant_delta
data: {"id": "7bb94444-167b-47f4-a472-ebcd92877683", "channel": "foreign", "text": "?"}

event: correction
data: {"target_id": "6c5e3807-b3b1-435e-9c74-1dd5224110f0", "corrected_message": "", "translation": "I am learning Russian today", "audio_url": "https://minkrhmuqpubcgxvmnao.supabase.co/storage/v1/object/public/audio-bucket/544ae617-17c1-4bbe-adcf-ff96a73183cc/chat_20251115_170157_edd5c4b4.mp3", "corrected": false}

event: assistant_end
data: {"id": "7bb94444-167b-47f4-a472-ebcd92877683", "ai_message": "Это хорошо! Ты знаешь уже много слов?", "translation": "That's good! Do you already know many words?", "audio_url": "https://minkrhmuqpubcgxvmnao.supabase.co/storage/v1/object/public/audio-bucket/544ae617-17c1-4bbe-adcf-ff96a73183cc/chat_20251115_170158_64f239e5.mp3"}

event: done
data: {"ok": true}

Response Info:
Even without correction, the audio file for the user's message is still sent.

(2nd turn+) Audio Route (/api/chat/text) - without correction:
Request Body (multipart/form-data) (/api/chat/voice):

thread_id (string, required):
 The ongoing chat’s thread ID, obtained from the first /api/chat/text response.
audio_file (file, required):
 The user’s audio message file (.webm, .mp3, or .wav), typically 5–30 seconds long.
foreign_language (string, required):
 The target (learning) language. Example: "Russian".
stream (boolean, optional, default false):
 Set to true to enable Server-Sent Events (SSE) streaming.
Everything else is set in the first turn

Response (Streaming):
: thread_id 544ae617-17c1-4bbe-adcf-ff96a73183cc

event: transcript
data: {"text": "Это очень хорошо. Ты читаешь или слушаешь сегодня?"}

event: thread
data: {"thread_id": "544ae617-17c1-4bbe-adcf-ff96a73183cc"}

event: assistant_start
data: {"id": "f2886841-2763-4dce-9a29-58e40a3df49f", "node": "call_model"}

event: assistant_delta
data: {"id": "f2886841-2763-4dce-9a29-58e40a3df49f", "channel": "foreign", "text": "Сегодня"}

event: assistant_delta
data: {"id": "f2886841-2763-4dce-9a29-58e40a3df49f", "channel": "foreign", "text": " я"}

event: assistant_delta
data: {"id": "f2886841-2763-4dce-9a29-58e40a3df49f", "channel": "foreign", "text": " слуш"}

event: assistant_delta
data: {"id": "f2886841-2763-4dce-9a29-58e40a3df49f", "channel": "foreign", "text": "аю"}

event: assistant_delta
data: {"id": "f2886841-2763-4dce-9a29-58e40a3df49f", "channel": "foreign", "text": " песни"}

event: assistant_delta
data: {"id": "f2886841-2763-4dce-9a29-58e40a3df49f", "channel": "foreign", "text": "."}

event: assistant_delta
data: {"id": "f2886841-2763-4dce-9a29-58e40a3df49f", "channel": "foreign", "text": " Какие"}

event: assistant_delta
data: {"id": "f2886841-2763-4dce-9a29-58e40a3df49f", "channel": "foreign", "text": " песни"}

event: assistant_delta
data: {"id": "f2886841-2763-4dce-9a29-58e40a3df49f", "channel": "foreign", "text": " ты"}

event: assistant_delta
data: {"id": "f2886841-2763-4dce-9a29-58e40a3df49f", "channel": "foreign", "text": " зна"}

event: assistant_delta
data: {"id": "f2886841-2763-4dce-9a29-58e40a3df49f", "channel": "foreign", "text": "ешь"}

event: assistant_delta
data: {"id": "f2886841-2763-4dce-9a29-58e40a3df49f", "channel": "foreign", "text": " на"}

event: assistant_delta
data: {"id": "f2886841-2763-4dce-9a29-58e40a3df49f", "channel": "foreign", "text": " русском"}

event: assistant_delta
data: {"id": "f2886841-2763-4dce-9a29-58e40a3df49f", "channel": "foreign", "text": "?"}

event: correction
data: {"target_id": "93b481bd-a51c-4413-8131-52fd259df6bd", "corrected_message": "", "translation": "This is very good. Are you reading or listening today?", "audio_url": "https://minkrhmuqpubcgxvmnao.supabase.co/storage/v1/object/public/audio-bucket/544ae617-17c1-4bbe-adcf-ff96a73183cc/chat_20251115_170418_686f6c29.mp3", "corrected": false}

event: assistant_end
data: {"id": "f2886841-2763-4dce-9a29-58e40a3df49f", "ai_message": "Сегодня я слушаю песни. Какие песни ты знаешь на русском?", "translation": "Today I am listening to songs. Which songs do you know in Russian?", "audio_url": "https://minkrhmuqpubcgxvmnao.supabase.co/storage/v1/object/public/audio-bucket/544ae617-17c1-4bbe-adcf-ff96a73183cc/chat_20251115_170421_2309b12e.mp3"}

event: done
data: {"ok": true}


Response Info:
event: transcript: gives the transcription of the users audio file. The user audio file should always be saved so the user can play it back. It does not need to be saved on refresh, just persist for one session

event: correction: gives the correction of the user data. The correction will always return the translated user message, and audio message of the user message. Both audios, the correction audio and the users initial audio should be saved. The user will be able to replay both

event: assistant_end: gives the rest of the ai meta data includes the ai response translation, 


(2nd turn+) Audio Route (/api/chat/text) - with correction:
Request Body (multipart/form-data) (/api/chat/voice):

thread_id (string, required):
 The ongoing chat’s thread ID, obtained from the first /api/chat/text response.
audio_file (file, required):
 The user’s audio message file (.webm, .mp3, or .wav), typically 5–30 seconds long.
foreign_language (string, required):
 The target (learning) language. Example: "Russian".
stream (boolean, optional, default false):
 Set to true to enable Server-Sent Events (SSE) streaming.
Everything else is set in the first turn

Response (Streaming):
: thread_id 544ae617-17c1-4bbe-adcf-ff96a73183cc

event: transcript
data: {"text": "Я люблю собака."}

event: thread
data: {"thread_id": "544ae617-17c1-4bbe-adcf-ff96a73183cc"}

event: assistant_start
data: {"id": "81c543af-7982-4f52-8571-b3c7567e9a25", "node": "call_model"}

event: assistant_delta
data: {"id": "81c543af-7982-4f52-8571-b3c7567e9a25", "channel": "foreign", "text": "Ты"}

event: assistant_delta
data: {"id": "81c543af-7982-4f52-8571-b3c7567e9a25", "channel": "foreign", "text": " часто"}

event: assistant_delta
data: {"id": "81c543af-7982-4f52-8571-b3c7567e9a25", "channel": "foreign", "text": " игра"}

event: assistant_delta
data: {"id": "81c543af-7982-4f52-8571-b3c7567e9a25", "channel": "foreign", "text": "ешь"}

event: assistant_delta
data: {"id": "81c543af-7982-4f52-8571-b3c7567e9a25", "channel": "foreign", "text": " с"}

event: assistant_delta
data: {"id": "81c543af-7982-4f52-8571-b3c7567e9a25", "channel": "foreign", "text": " собак"}

event: assistant_delta
data: {"id": "81c543af-7982-4f52-8571-b3c7567e9a25", "channel": "foreign", "text": "ой"}

event: assistant_delta
data: {"id": "81c543af-7982-4f52-8571-b3c7567e9a25", "channel": "foreign", "text": "?"}

event: correction
data: {"target_id": "44567dc0-36c7-408d-adb8-9713daf2c9bb", "corrected_message": "Я люблю собаку.", "translation": "I love the dog.", "audio_url": "https://minkrhmuqpubcgxvmnao.supabase.co/storage/v1/object/public/audio-bucket/544ae617-17c1-4bbe-adcf-ff96a73183cc/chat_20251115_171045_6fb15676.mp3", "corrected": true}

event: assistant_end
data: {"id": "81c543af-7982-4f52-8571-b3c7567e9a25", "ai_message": "Ты часто играешь с собакой?", "translation": "Do you often play with the dog?", "audio_url": "https://minkrhmuqpubcgxvmnao.supabase.co/storage/v1/object/public/audio-bucket/544ae617-17c1-4bbe-adcf-ff96a73183cc/chat_20251115_171048_db65d3bf.mp3"}

event: done
data: {"ok": true}

Streaming Note:
Treat each assistant_start as the beginning of a new AI message with a unique id.


Collect all assistant_delta events with the same id and channel = "foreign" into a single content string in order.


When assistant_end is received:
If we have collected any assistant_delta chunks for this id, use that accumulated string as the AI bubble text.


If we did not receive any assistant_delta chunks, use assistant_end.ai_message as the AI bubble text.


In either case, also store translation and audio_url from assistant_end as metadata for that AI message.

The user will not be able to send a new message until the response has been fully received. The correction in the response will always apply to the last user message / the one that was sent in the request.

On SSE error, show a small error banner and re-enable the input.

When a correction event is received:
Attach it to the last user message that was sent (the one corresponding to this request). 

Always store, corrected_message (may be empty), translation of the (corrected or original) message, audio_url for the user message playback,corrected boolean


UI behavior:
If corrected = true: Show a correction icon under the user bubble. Clicking it toggles a bubble above the user message showing: the corrected_message in the foreign language, the translation in the native language, a play button that plays the correction audio_url.
If corrected = false: Do not show a corrected text bubble, but still show an audio icon under the user message that plays the audio_url so they can hear their pronunciation.

Example streaming failing: 
: thread_id 544ae617-17c1-4bbe-adcf-ff96a73183cc
event: transcript
data: {"text": "Я люблю собака."}
event: thread
data: {"thread_id": "544ae617-17c1-4bbe-adcf-ff96a73183cc"}
event: assistant_start
data: {"id": "5e4365b5-ab09-47d8-a2fa-b44c3f5e6c52", "node": "call_model"}
event: correction
data: {"target_id": "ecc4a9b5-eb2d-43d9-b595-039716666780", "corrected_message": "Я люблю собаку.", "translation": "I love the dog.", "audio_url": "https://minkrhmuqpubcgxvmnao.supabase.co/storage/v1/object/public/audio-bucket/544ae617-17c1-4bbe-adcf-ff96a73183cc/chat_20251115_170603_9c3ccef5.mp3", "corrected": true}
event: assistant_end
data: {"id": "5e4365b5-ab09-47d8-a2fa-b44c3f5e6c52", "ai_message": "Здорово! У тебя есть собака?", "translation": "Great! Do you have a dog?", "audio_url": "https://minkrhmuqpubcgxvmnao.supabase.co/storage/v1/object/public/audio-bucket/544ae617-17c1-4bbe-adcf-ff96a73183cc/chat_20251115_170605_a369c57d.mp3"}
event: done
data: {"ok": true}


Available Languages: 
Afrikaans, Arabic, Armenian, Azerbaijani, Belarusian, Bosnian, Bulgarian, Catalan, Chinese, Croatian, Czech, Danish, Dutch, English, Estonian, Finnish, French, Galician, German, Greek, Hebrew, Hindi, Hungarian, Icelandic, Indonesian, Italian, Japanese, Kannada, Kazakh, Korean, Latvian, Lithuanian, Macedonian, Malay, Marathi, Maori, Nepali, Norwegian, Persian, Polish, Portuguese, Romanian, Russian, Serbian, Slovak, Slovenian, Spanish, Swahili, Swedish, Tagalog, Tamil, Thai, Turkish, Ukrainian, Urdu, Vietnamese, and Welsh.


API configuration:
Use an environment variable like VITE_API_BASE_URL for the backend base URL, defaulting to http://localhost:8000 in development.


Implement a small API helper module (e.g. src/lib/api.ts) with functions:


startTextChat(...) – first turn /api/chat/text


continueTextChatSSE(...) – SSE for subsequent text turns


voiceChatSSE(...) – SSE for /api/chat/voice


Project structure:
src/App.tsx – wraps config form + chat window


src/components/ChatWindow.tsx – main chat area


src/components/MessageBubble.tsx – AI/user bubble


src/components/InputBar.tsx – text input + mic


src/components/AudioPlayer.tsx – shared audio player


src/hooks/useChat.ts – handles SSE, message list, thread_id, loading flags


src/types/chat.ts – TypeScript types for messages and events


OpenAPI Schema: 
{"openapi":"3.1.0","info":{"title":"Korli Language Learning API","description":"AI-powered language learning assistant","version":"1.0.0"},"paths":{"/api/chat/text":{"post":{"tags":["chat"],"summary":"Chat Text","operationId":"chat_text_api_chat_text_post","requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/ChatInput"}}},"required":true},"responses":{"200":{"description":"Successful Response","content":{"application/json":{"schema":{}}}},"422":{"description":"Validation Error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/HTTPValidationError"}}}}}}},"/api/chat/voice":{"post":{"tags":["chat"],"summary":"Chat Voice","description":"Voice chat endpoint (Swagger-friendly):\n\n- **Initialization turn:** Omit `thread_id` and optionally omit `audio_file`.\n  Provide `student_level`, `foreign_language`, and `native_language`.\n- **Follow-up turn:** Provide `thread_id` and an `audio_file`.\n  The audio is transcribed and used as the message.","operationId":"chat_voice_api_chat_voice_post","requestBody":{"content":{"multipart/form-data":{"schema":{"$ref":"#/components/schemas/Body_chat_voice_api_chat_voice_post"}}},"required":true},"responses":{"200":{"description":"Successful Response","content":{"application/json":{"schema":{}}}},"422":{"description":"Validation Error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/HTTPValidationError"}}}}}}},"/":{"get":{"summary":"Root","operationId":"root__get","responses":{"200":{"description":"Successful Response","content":{"application/json":{"schema":{}}}}}}},"/health":{"get":{"summary":"Health","operationId":"health_health_get","responses":{"200":{"description":"Successful Response","content":{"application/json":{"schema":{}}}}}}}},"components":{"schemas":{"Body_chat_voice_api_chat_voice_post":{"properties":{"audio_file":{"anyOf":[{"type":"string","format":"binary"},{"type":"null"}],"title":"Audio File","description":"Audio file (webm/mp3/wav); typically 5–30s; omit on first turn to initialize"},"thread_id":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Thread Id","description":"Stable conversation thread ID"},"stream":{"type":"boolean","title":"Stream","description":"Whether to stream the response via SSE","default":false},"foreign_language":{"type":"string","title":"Foreign Language","description":"Foreign language full name, e.g. 'Russian'"},"native_language":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Native Language","description":"Native language full name, e.g. 'English'"},"student_level":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Student Level","description":"CEFR level, e.g. A1, B2, etc."},"tutor_gender":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Tutor Gender","description":"Tutor gender (male/female)"},"student_gender":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Student Gender","description":"Student gender (male/female)"}},"type":"object","required":["foreign_language"],"title":"Body_chat_voice_api_chat_voice_post"},"ChatInput":{"properties":{"thread_id":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Thread Id","description":"Stable thread/session identifier"},"message":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Message","description":"User message; omit on first turn to initialize"},"stream":{"type":"boolean","title":"Stream","description":"Whether to stream the response","default":false},"foreign_language":{"type":"string","title":"Foreign Language","description":"Foreign language full name, e.g. 'Russian'"},"native_language":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Native Language"},"student_level":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Student Level"},"tutor_gender":{"anyOf":[{"type":"string","pattern":"^(male|female)$"},{"type":"null"}],"title":"Tutor Gender"},"student_gender":{"anyOf":[{"type":"string","pattern":"^(male|female)$"},{"type":"null"}],"title":"Student Gender"}},"type":"object","required":["foreign_language"],"title":"ChatInput"},"HTTPValidationError":{"properties":{"detail":{"items":{"$ref":"#/components/schemas/ValidationError"},"type":"array","title":"Detail"}},"type":"object","title":"HTTPValidationError"},"ValidationError":{"properties":{"loc":{"items":{"anyOf":[{"type":"string"},{"type":"integer"}]},"type":"array","title":"Location"},"msg":{"type":"string","title":"Message"},"type":{"type":"string","title":"Error Type"}},"type":"object","required":["loc","msg","type"],"title":"ValidationError"}}}}

