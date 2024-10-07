# Streaming Providers

This project integrates various streaming providers to fetch video sources for movies and TV shows. Below is a list of the providers currently used, along with their statuses.

## Providers

| Provider       | Status    | Notes                                                      |
|----------------|-----------|------------------------------------------------------------|
| **Vidlink.pro** | Online    | API working as expected, used for fetching movie and TV links. |
| **Vidsrc.net**  | Online    | Stable, primarily for TV shows and other media sources.    |
| **Upcloud (vidsrc.cc)** | Maintenance | Currently under maintenance, some links may not be available. |

## Features

- **Vidlink.pro**: AES-256-CBC encrypted video ID encoding and decryption.
- **Vidsrc.net**: Reliable provider with a large catalog.
- **Upcloud/vidsrc.cc**: Temporary downtime for maintenance, expected to resume soon.

## Deploy to Vercel

You can easily deploy this project to Vercel by clicking the button below:

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/Toasty360/vidsrc/)

## Usage

To use the provider services, you can call the `getSource` method, passing the required parameters like the media ID, whether it's a movie, and other optional parameters like season and episode numbers.

## Usage

### Vidlink.pro Example
To fetch a video source from Vidlink.pro, you can use the following fetch example:
```typescript
const baseURL = "YOUR_API_BASE_URL";
const vidlinkResponse = await fetch(
  baseURL + "/vidlink/watch?isMovie=false&id=124364&episode=1&season=2"
);
const vidlinkData = await vidlinkResponse.text(); 
console.log(vidlinkData);
```
### Response
```json
{
    "sourceId": "embedsu",
    "stream": {
        "id": "primary",
        "type": "hls",
        "playlist": "https://bronlexsky.live/file1/g~uINZ90iF3o73uaCQGVNOPw1auLmjOK4H~FBw0HvtkBBnPoIjkhuw+51arcviAfXG1pTpyqv52In3VtB5Jiosc+mFuMqrRnRzq6Py1rT+mfkyFh~XLhMWoGO8V1bfApopjhFpOdPV~yqupCpkwTFeCn4q5+IvH7x3gh8v4SZ+0=/cGxheWxpc3QubTN1OA==-m3u8",
        "flags": [
            "cors-allowed"
        ],
        "captions": [
            {
                "id": "https://cc.2cdns.com/0a/d5/0ad5a65ecd771665334d6626746e7b0a/eng-2.vtt",
                "url": "https://cc.2cdns.com/0a/d5/0ad5a65ecd771665334d6626746e7b0a/eng-2.vtt",
                "language": "English - English [SDH]",
                "type": "srt",
                "hasCorsRestrictions": false
            }
        ]
    }
}
```
## Credits
If you use this ugly code or any part of it in your projects, please give credit to @Toasty360. You can mention my contribution in your README.md or project documentation. Thank you for your support!

Feel free to update the status as the providers' availability changes.
