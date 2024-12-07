import axios from 'axios';
import {getBaseUrl} from '../../utils/getBaseUrl';
import * as cheerio from 'cheerio';

export class NetMirrorCookieFetcher {
  private static readonly COOKIE_CACHE_KEY = 'nfCookie';
  private static readonly COOKIE_TIME_KEY = 'nfCookieTime';
  private static readonly COOKIE_EXPIRY_MS = 79200000; // 22 hours
  private static readonly VERIFY_TIMEOUT_MS = 25000;
  private static readonly MAX_RETRY_ATTEMPTS = 50;

  /**
   * Fetches a cookie with intelligent caching and error handling
   * @returns Promise resolving to the cookie string
   */
  static async fetchCookie(): Promise<string> {
    try {
      // Fetch new cookie with retry mechanism
      return await this.fetchFreshCookie();
    } catch (err) {
      console.error('NetMirror cookie fetch failed:', err);
      return '';
    }
  }

  /**
   * Fetches a fresh cookie with multiple verification steps
   * @returns Promise resolving to the new cookie
   */
  private static async fetchFreshCookie(): Promise<string> {
    const baseUrl = await getBaseUrl('nfMirror');

    // Fetch initial page to get addhash
    const res = await axios.get(`${baseUrl}/home`, {withCredentials: false});
    const $ = cheerio.load(res.data);
    const addhash = $('body').attr('data-addhash');

    if (!addhash) {
      throw new Error('Unable to extract addhash');
    }

    // Preliminary verification
    await this.performPreliminaryVerification(addhash);

    // Cookie verification with retry logic
    const cookie = await this.verifyCookie(baseUrl, addhash);

    // Cache the new cookie
    this.cacheCookie(cookie);
    return cookie;
  }

  /**
   * Performs preliminary verification request
   * @param addhash Verification hash
   */
  private static async performPreliminaryVerification(
    addhash: string,
  ): Promise<void> {
    try {
      await fetch(
        `https://userverify.netmirror.app/verify?dp1=${addhash}&a=y&t=${Math.random()}`,
        {credentials: 'omit'},
      );
    } catch (err) {
      console.warn('Preliminary verification failed:', err);
    }
  }

  /**
   * Verifies and retrieves the cookie with retry mechanism
   * @param baseUrl Base URL for verification
   * @param addhash Verification hash
   * @returns Promise resolving to the cookie string
   */
  private static async verifyCookie(
    baseUrl: string,
    addhash: string,
  ): Promise<string> {
    for (let attempt = 1; attempt <= this.MAX_RETRY_ATTEMPTS; attempt++) {
      const form = new FormData();
      form.append('verify', addhash);

      const verificationPromise = new Promise<string>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('Cookie verification timed out'));
        }, this.VERIFY_TIMEOUT_MS);

        this.performCookieVerification(baseUrl, form)
          .then(cookie => {
            clearTimeout(timeoutId);
            resolve(cookie);
          })
          .catch(err => {
            clearTimeout(timeoutId);
            reject(err);
          });
      });

      try {
        return await verificationPromise;
      } catch (err) {
        console.warn(`Cookie verification attempt ${attempt} failed:`, err);
        if (attempt === this.MAX_RETRY_ATTEMPTS) {
          throw err;
        }
        // Optional: add a small delay between retries
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    throw new Error('Failed to retrieve cookie after multiple attempts');
  }

  /**
   * Performs the actual cookie verification request
   * @param baseUrl Base URL for verification
   * @param form FormData for verification
   * @returns Promise resolving to the cookie string
   */
  private static async performCookieVerification(
    baseUrl: string,
    form: FormData,
  ): Promise<string> {
    const res2 = await fetch(`${baseUrl}/verify2.php`, {
      method: 'POST',
      body: form,
      credentials: 'omit',
    });

    const res2Json = await res2.json();
    console.log('NetMirror verification response:', res2Json);

    if (res2Json.statusup !== 'All Done') {
      throw new Error('Verification not complete');
    }

    const cookie2 = res2.headers.get('set-cookie');
    if (!cookie2) {
      throw new Error('No cookie found in response');
    }

    return `${cookie2.split(';')[0]};`;
  }

  /**
   * Caches the retrieved cookie
   * @param cookie Cookie string to cache
   */
  private static cacheCookie(cookie: string): void {
   
  }
}

// Usage
export async function nfGetCookie(): Promise<string> {
  return NetMirrorCookieFetcher.fetchCookie();
}
