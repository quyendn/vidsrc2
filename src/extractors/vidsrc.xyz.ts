import axios from 'axios';
const user_agent = "Mozilla/5.0 (X11; Linux x86_64; rv:125.0) Gecko/20100101 Firefox/125.0";
const proxy_url      = 'http://123.30.171.163:8081';
const referer_url    = 'https://ate60vs7zcjhsjo5qgv8.com';
const file_extension = '.m3u8';
interface Dict {
    [key: string]: string,
}

interface Methods {
    [key: string]: any
}
interface StreamInfo {
    quality: string;
    url?: string;
  }
  function parseM3U8(content: string,main: string): StreamInfo[] {
    const lines = content.split('\n');
    const streams: StreamInfo[] = [];
    streams.push({
        quality : "auto",
        url: main,
    });
    let quality = '';
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      console.log("line:" + main);
      if (line.startsWith('#EXT-X-STREAM-INF')) {
        const resolutionMatch = line.match(/RESOLUTION=(\d+x\d+)/);
        if (resolutionMatch) {
          quality = resolutionMatch[1];
        }
      } else if (line.startsWith('http')) {
        const domainRegex = /https:\/\/([^/]+)/;
        const idRegex = /stream_new\/(.*\.m3u8)/;
        let domain = line.match(domainRegex)?.[1];
        let identifier = line.match(idRegex)?.[1];
        let url = "";
        if(identifier && identifier.trim() !== "")
        {
          url = identifier;
        }
        else
        {
          const parts = url.split('/');
          identifier = parts.slice(4).join('/');
        }
        let streamURL = "https://vidsrc.pro/api/proxy/sage/stream/"+identifier + "?base="+domain+"&v=1722446103194";
        streams.push({
          quality,
          url: line,
        });
      }
    }
    const domainRegex = /https:\/\/([^/]+)/;
    const idRegex = /stream_new\/(.*\.m3u8)/;
    let domain = main.match(domainRegex)?.[1];
    let identifier = main.match(idRegex)?.[1];
    let url = "";
    if(identifier && identifier.trim() !== "")
    {
      url = identifier;
    }
    else
    {
      const parts = url.split('/');
      identifier = parts.slice(4).join('/');
    }
    let streamURL = "https://vidsrc.pro/api/proxy/sage/stream/"+identifier + "?base="+domain+"&v=1722446103194";
    
    return streams;
  }
function regMatch(s: string, r: RegExp) {
    let check = s.match(r)
    if (check && check.length) {
        return check;
    } else {
        throw new Error(`regex error: ${s} `);
    }
}

function decrypt(method: string, encoded: string) {
    let methods: Methods = {
        'IGLImMhWrI': function(_0x2ab3bb: string) {
            const _0x2173f6 = _0x2ab3bb.split('').reverse().join('');
            const _0x9b9638 = _0x2173f6.replace(/[a-zA-Z]/g, function(_0x3e4ab8) {
                return String.fromCharCode(_0x3e4ab8.charCodeAt(0) + (_0x3e4ab8.toLowerCase() < 'n' ? 13 : -13));
            });
            const _0x16f7f1 = _0x9b9638.split('').reverse().join('');
            return atob(_0x16f7f1);
        },
        'GTAxQyTyBx': function(_0x33dfa4: string) {
            const _0x1457ba = _0x33dfa4.split('').reverse().join('');
            let _0x49a8fe = '';
            for (let _0x8bc703 = 0; _0x8bc703 < _0x1457ba.length; _0x8bc703 += 2) {
                _0x49a8fe += _0x1457ba[_0x8bc703];
            }
            return atob(_0x49a8fe);
        },
        'C66jPHx8qu': function(_0x48e6c2: string) {
            const _0x382290 = _0x48e6c2.split('').reverse().join('');
            const _0x50d89b = regMatch(_0x382290, /.{1,2}/g).map(_0x58f648 => String.fromCharCode(parseInt(_0x58f648, 16))).join('');
            let _0x574d54 = '';
            for (let _0x151d1c = 0; _0x151d1c < _0x50d89b.length; _0x151d1c++) {
                _0x574d54 += String.fromCharCode(_0x50d89b.charCodeAt(_0x151d1c) ^ "X9a(O;FMV2-7VO5x;Ao:dN1NoFs?j,".charCodeAt(_0x151d1c % "X9a(O;FMV2-7VO5x;Ao:dN1NoFs?j,".length));
            }
            return _0x574d54;
        },
        'MyL1IRSfHe': function(_0xa54f5f: string) {
            const _0x2b197e = _0xa54f5f.split('').reverse().join('');
            let _0x14fe01 = '';
            for (let _0x1e1913 = 0; _0x1e1913 < _0x2b197e.length; _0x1e1913++) {
                _0x14fe01 += String.fromCharCode(_0x2b197e.charCodeAt(_0x1e1913) - 1);
            }
            let _0x5e7210 = '';
            for (let _0x3f77d8 = 0; _0x3f77d8 < _0x14fe01.length; _0x3f77d8 += 2) {
                _0x5e7210 += String.fromCharCode(parseInt(_0x14fe01.substr(_0x3f77d8, 2), 16));
            }
            return _0x5e7210;
        },
        'detdj7JHiK': function(_0x46ddbf: string) {
            const _0x4fd99c = _0x46ddbf.slice(10, -16);
            const _0x411fd5 = atob(_0x4fd99c);
            const _0x1b9ca3 = "3SAY~#%Y(V%>5d/Yg\"$G[Lh1rK4a;7ok".repeat(Math.ceil(_0x411fd5.length / "3SAY~#%Y(V%>5d/Yg\"$G[Lh1rK4a;7ok".length)).substring(0, _0x411fd5.length);
            let _0x5062ac = '';
            for (let _0x47adac = 0; _0x47adac < _0x411fd5.length; _0x47adac++) {
                _0x5062ac += String.fromCharCode(_0x411fd5.charCodeAt(_0x47adac) ^ _0x1b9ca3.charCodeAt(_0x47adac));
            }
            return _0x5062ac;
        },
        'nZlUnj2VSo': function(_0x132a77: string) {
            const _0xa8f579: Dict = {
                'x': 'a',
                'y': 'b',
                'z': 'c',
                'a': 'd',
                'b': 'e',
                'c': 'f',
                'd': 'g',
                'e': 'h',
                'f': 'i',
                'g': 'j',
                'h': 'k',
                'i': 'l',
                'j': 'm',
                'k': 'n',
                'l': 'o',
                'm': 'p',
                'n': 'q',
                'o': 'r',
                'p': 's',
                'q': 't',
                'r': 'u',
                's': 'v',
                't': 'w',
                'u': 'x',
                'v': 'y',
                'w': 'z',
                'X': 'A',
                'Y': 'B',
                'Z': 'C',
                'A': 'D',
                'B': 'E',
                'C': 'F',
                'D': 'G',
                'E': 'H',
                'F': 'I',
                'G': 'J',
                'H': 'K',
                'I': 'L',
                'J': 'M',
                'K': 'N',
                'L': 'O',
                'M': 'P',
                'N': 'Q',
                'O': 'R',
                'P': 'S',
                'Q': 'T',
                'R': 'U',
                'S': 'V',
                'T': 'W',
                'U': 'X',
                'V': 'Y',
                'W': 'Z',
            }
            return _0x132a77.replace(/[xyzabcdefghijklmnopqrstuvwXYZABCDEFGHIJKLMNOPQRSTUVW]/g, function(c: string) {
                return _0xa8f579[c];
            });
        },
        'laM1dAi3vO': function(_0x247af1: string) {
            const _0x3abc86 = _0x247af1.split('').reverse().join('');
            const _0x4334b0 = _0x3abc86.replace(/-/g, '+').replace(/_/g, '/');
            const _0xaf1d09 = atob(_0x4334b0);
            let _0x13c192 = '';
            for (let _0x19e58b = 0; _0x19e58b < _0xaf1d09.length; _0x19e58b++) {
                _0x13c192 += String.fromCharCode(_0xaf1d09.charCodeAt(_0x19e58b) - 5);
            }
            return _0x13c192;
        },
        'uxKGDsA2T': function(_0x23be91: string) {
            const _0x3b7914 = _0x23be91.split('').reverse().join('');
            const _0x434653 = _0x3b7914.replace(/-/g, '+').replace(/_/g, '/');
            const _0x55c940 = atob(_0x434653);
            let _0x4a190a = '';
            for (let _0x450745 = 0; _0x450745 < _0x55c940.length; _0x450745++) {
                _0x4a190a += String.fromCharCode(_0x55c940.charCodeAt(_0x450745) - 7);
            }
            return _0x4a190a;
        },
        'bMGyx71TzQLfdonN': function(_0x182b26: string) {
            var _0x22b578: Array<string> = [];
            for (var _0x3cf1e = 0; _0x3cf1e < _0x182b26.length; _0x3cf1e += 3) {
                _0x22b578.push(_0x182b26.slice(_0x3cf1e, _0x3cf1e + 3));
            }
            var _0x1098cb = _0x22b578.reverse().join('');
            return _0x1098cb;
        },
        'Iry9MQXnLs': function(_0x4abb1c: string) {
            let _0x31e7e2 = '';
            const _0x2680b0 = regMatch(_0x4abb1c, (/.{1,2}/g)).map(_0x356804 => String.fromCharCode(parseInt(_0x356804, 16))).join('');
            for (let _0xffe351 = 0; _0xffe351 < _0x2680b0.length; _0xffe351++) {
                _0x31e7e2 += String.fromCharCode(_0x2680b0.charCodeAt(_0xffe351) ^ "pWB9V)[*4I`nJpp?ozyB~dbr9yt!_n4u".charCodeAt(_0xffe351 % "pWB9V)[*4I`nJpp?ozyB~dbr9yt!_n4u".length));
            }
            let _0x5e9147 = '';
            for (let _0x57e5e6 = 0; _0x57e5e6 < _0x31e7e2.length; _0x57e5e6++) {
                _0x5e9147 += String.fromCharCode(_0x31e7e2.charCodeAt(_0x57e5e6) - 3);
            }
            return atob(_0x5e9147);
        },
        'GuxKGDsA2T': function(_0x23be91: string) {
            const _0x3b7914 = _0x23be91.split('').reverse().join('');
            const _0x434653 = _0x3b7914.replace(/-/g, '+').replace(/_/g, '/');
            const _0x55c940 = atob(_0x434653);
            let _0x4a190a = '';
            for (let _0x450745 = 0; _0x450745 < _0x55c940.length; _0x450745++) {
                _0x4a190a += String.fromCharCode(_0x55c940.charCodeAt(_0x450745) - 7);
            }
            return _0x4a190a;
        },
        'LXVUMCoAHJ': function(_0xe2f470: string) {
            const _0x4c0c8b = _0xe2f470.split('').reverse().join('');
            const _0x4964d2 = _0x4c0c8b.replace(/-/g, '+').replace(/_/g, '/');
            const _0x419a20 = atob(_0x4964d2);
            let _0x3239f9 = '';
            for (let _0x2b1dfe = 0; _0x2b1dfe < _0x419a20.length; _0x2b1dfe++) {
                _0x3239f9 += String.fromCharCode(_0x419a20.charCodeAt(_0x2b1dfe) - 3);
            }
            return _0x3239f9;
        }
    }
    return methods[method](encoded);
}

async function fwh(url: string, ref: string) {
    let resp = await fetch(url, {
        headers: {
            "User-Agent": user_agent,
            "Referer": ref,
            "Origin": ref,
        }
    });
    let txt = await resp.text();

    return txt;
}

function get_method(method: string) {
    let first = method.slice(7);
    let second = method.slice(4, 7);
    let third = method.slice(1, 4);

    return first + second + third + method[0];

}

const mainVidSrc = async (xrax: string,s: string,e: string) => {
    
    let movie_embed_link = "https://vidsrc.me/embed/" + xrax;
    if(s !=null)
    {
        movie_embed_link = "https://vidsrc.me/embed/" + xrax + "/"+s + "-" + e;
    }
    console.log("movie_embed_link:" + movie_embed_link);

    const proxies = {
        http: 'http://134.209.67.109:19752',
        https: 'http://70.186.128.126:8080'
      };
      const controller = new AbortController();
      setTimeout(() => {
        controller.abort();
      }, 4000);
      const resSearch = await axios.get(movie_embed_link, { 
        headers : {
            "User-Agent": user_agent,
            "Referer": movie_embed_link
        },
        proxy: get_random_proxy(proxies),
        signal: controller.signal,
        method: 'GET'
      });
    console.log("data:" + resSearch.data)

    // let main_resp = await fetch(movie_embed_link, {
    //     headers: {
    //         "User-Agent": user_agent,
    //         "Referer": movie_embed_link
    //     }
    // });
    // let txt = await main_resp.text();
    let txt = await resSearch.data;

    let reg = /player_iframe" src="[^"]*/g
    let rcp_link = regMatch(txt, reg)[0];
    rcp_link = "https://" + rcp_link.slice(22);
    console.log("rcp_link:" + rcp_link);

    //console.log(rcp_link);
    // let rcp_resp = await fetch(rcp_link, {
    //     headers: {
    //         "User-Agent": user_agent,
    //         "Referer": movie_embed_link
    //     }
    // });
    // let rcp_txt = await rcp_resp.text();

    let rcp_resp = await axios.get(rcp_link, {
        headers: {
            "User-Agent": user_agent,
            "Referer": movie_embed_link
        },
        proxy: get_random_proxy(proxies),
        signal: controller.signal,
        method: 'GET'
    });
    let rcp_txt = await rcp_resp.data;


    reg = /prorcp[^']*/g
    let srcrcp_link = "https://ate60vs7zcjhsjo5qgv8.com/" + regMatch(rcp_txt, reg)[0];
    console.log("srcrcp_link:" + srcrcp_link);
    let srcrcp_text = await fwh(srcrcp_link, rcp_link);
    const streams: StreamInfo[] = [];
    try {
        reg = /div id="[a-zA-z0-9]{10}"/g
        let decryption_method = regMatch(srcrcp_text, reg)[0].slice(8, -1);
        decryption_method = get_method(decryption_method);

        console.log(decryption_method);


        reg = /none;">[^<]{5,}/g
        let encoded = regMatch(srcrcp_text, reg)[1].slice(7);

        let master = decrypt(decryption_method, encoded);
        console.log("Master: " + master + '\n');
        let indices = await fwh(master, rcp_link);
        console.log("Indices: " + indices);
        //console.log(rcp_link);
        const streams = parseM3U8(indices,master);
        //console.log(streams);
        return streams;
    } catch (e) {
        reg = /file:"[^"]*/g
        let encoded = regMatch(srcrcp_text, reg)[0].slice(6);
        let decoded = decode(encoded);
        console.log("decoded:" + decoded);
        streams.push({
            quality : "auto",
            url: decoded,
          });
        return streams;
    }
}

function decode(x: string) {
    let v: Dict = {
        'bk0': '%?6497.[:4',
        'bk1': '=(=:19705/',
        'bk2': ':]&*1@@1=&',
        'bk3': '33-*.4/9[6',
        'bk4': '*,4).(_)()',
    }

    let a = x.slice(2);
    for (let str in v) {
        a = a.replace('/@#@/' + b1(v[str]), "");
    }
    console.log(a);
    try {
        a = b2(a);
        return a;
    } catch (e) {
        a = "";
    }
    function b1(str: string) {
        return btoa(
            encodeURIComponent(str).replace(
                /%([0-9A-F]{2})/g,
                function toSolidBytes(match, p1) {
                    return String.fromCharCode(parseInt("0x" + p1, 16));
                },
            ),
        );
    }
    function b2(str: string) {
        return decodeURIComponent(
            atob(str)
                .split("")
                .map(function(c) {
                    return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join(""),
        );
    }

}


export { mainVidSrc };
function get_random_proxy(proxies: any) {
    return proxies[Math.floor((Math.random() * proxies.length))];
  }