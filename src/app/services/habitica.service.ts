import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { HabiticaAllContentData, HabiticaAllContentResponse } from "../models/habitica.model";

const HABITICA_ROOT_URL = "https://habitica.com/api/v3";

const HABITICA_ALL_CONTENT_RESPONSE = "HABITICA_ALL_CONTENT_RESPONSE";

interface CachedItem<T> {
  /**
   * Timestamp when the data has been cached.
   */
  timestamp: number;
  /**
   * Number of seconds before data expires.
   */
  expiry: number;
  /**
   * Data to cache.
   */
  data: T;
}

@Injectable({
  providedIn: "root",
})
export class HabiticaService {
  constructor(private readonly httpClient: HttpClient) {}

  public async getAllContent(): Promise<HabiticaAllContentData> {
    console.debug("Looking into local storage for cached data");
    const cached = localStorage.getItem(HABITICA_ALL_CONTENT_RESPONSE);

    if (cached != null) {
      console.debug("Cached data found");
      const cachedRes = JSON.parse(cached) as CachedItem<HabiticaAllContentData>;
      console.debug("Checking for expiry (is data still valid ?)");
      const expiryDate = cachedRes.timestamp + cachedRes.expiry * 1000;
      // TODO: Handle different timezone ?
      if (expiryDate >= Date.now()) {
        console.debug("Cached data is valid. Returning");
        return cachedRes.data;
      } else {
        console.debug("Cached data has expired");
      }
    } else {
      console.debug("Cached data not found in local storage.");
    }

    console.debug("Fetching fresh data from Habitica");
    const res = (await firstValueFrom(
      this.httpClient.get(`${HABITICA_ROOT_URL}/content`),
    )) as HabiticaAllContentResponse;

    if (!res.success) {
      throw new Error("Cannot fetch habitica content");
    }

    const toCache: CachedItem<HabiticaAllContentData> = {
      timestamp: Date.now(),
      expiry: 3600,
      data: res.data,
    };

    console.debug("Caching fresh data in local storage");
    localStorage.setItem(HABITICA_ALL_CONTENT_RESPONSE, JSON.stringify(toCache));
    return res.data;
  }
}
