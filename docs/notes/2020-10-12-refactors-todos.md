# Refactor TODOS

Refactor from BBC version, removing BBC dependencies.

_last updated **29 Oct 2020**_

- [x] move things in this list into github project board

Moved todos to github project board https://github.com/pietrop/digital-paper-edit-firebase/projects/1?add_cards_query=is%3Aopen

- [x] replace `@bbc/*` with `@pietrop/*` in package.json
- [x] change author and contributors in package.json
- [x] Change sign in to be WSJ speecific vs BBC one
- [ ] ~Find a way to connect `@pietro/digital-paper-edit` client, with firebase version, eg if needed, via storybook repo/npm~
- [x] remove footer

## Projects

- [x] Create
  - [x] Created date, time stamp
- [x] Read - List
- [x] Read - One
- [x] Update
- [x] Delete
  - [x] delete associated transcript
  - [ ] delete associated transcript media
  - [x] delete associated paper-edit

## Paper Edit

- [x] Create <-- sub collection inside of projects
  - [x] Created date, time stamp
- [x] Read - List <-- sub collection inside of projects
- [x] Read - One ~ (missing project title)
- [x] Update
- [x] Delete

## Transcripts

- [x] Create <-- sub collection inside of projects
  - [x] Created date, time stamp
- [x] Read - List <-- sub collection inside of projects
- [x] Read - One ~ TODO: Add transcript data json
- [x] Update
- [x] Delete
- [x] edited text of transcript + save/update
- [x] add media to cloud storage
- [x] delete media from cloud storage
- [x] cloud function, convert to audio
- [ ] ~cloud function, read metadata`
- [ ] ~cloud function, convert to video mp4(?)~
- [ ] ~revisit size limit issue in firebase for transcript- eg, max cap, for storing transcript data in firebase. eg do we need to serialize, or save as subcollection?~
- [x] workaround STT cloud functions limitations, for longer media
- [x] support media file other then `mp3`
- [x] media storage CORS, GET, is the URL, security by obscurity? or is it just restricted to url of the hosting?
- [x] CORS VideoContext issue, does not play preview

## Labels

- [x] Create <-- sub collection inside of projects
  - [x] Created date, time stamp
- [x] Read - List <-- sub collection inside of projects
- [x] Read - One
- [x] Update
- [x] Delete
