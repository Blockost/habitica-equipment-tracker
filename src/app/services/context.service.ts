import { Injectable } from "@angular/core";

const LOCAL_STORAGE_KEY = "HABITICA_USER_CREDENTIALS";

/**
 * Service that holds user information to be used throughout the app.
 */
@Injectable({
  providedIn: "root",
})
export class ContextService {
  private _userId = "";
  private _apiToken = "";
  private _saved?: boolean;

  get userId(): string {
    return this._userId;
  }

  get apiToken(): string {
    return this._apiToken;
  }

  init(): void {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    console.debug("Fetching Habitica credentials from local storage");

    if (!data) {
      console.debug("Not data found.");
      return;
    }

    console.debug("Found! Initializing context.");
    const { userId, apiToken } = JSON.parse(data);
    this._userId = userId;
    this._apiToken = apiToken;
  }

  save(userId: string, apiToken: string, saveLocally: boolean) {
    this._userId = userId;
    this._apiToken = apiToken;
    this._saved = saveLocally;

    if (saveLocally) {
      const data = JSON.stringify({ userId, apiToken, saveLocally });
      localStorage.setItem(LOCAL_STORAGE_KEY, data);
    }
  }

  clear(): void {
    this._userId = "";
    this._apiToken = "";
    if (this._saved) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }
}
