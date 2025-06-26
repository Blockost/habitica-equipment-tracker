import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import {
  HabiticaAllContentData,
  HabiticaAllContentResponse,
  HabiticaEquipItemResponse,
  HabiticaUserInfo,
  HabiticaUserInfoResponse,
  HabiticaUserItemsInfo,
} from "../models/habitica.model";
import { Cacheable } from "../cache/cacheable.decorator";

const HABITICA_ROOT_URL = "https://habitica.com/api/v3";

const HABITICA_ALL_CONTENT_RESPONSE = "HABITICA_ALL_CONTENT_RESPONSE";
const HABITICA_USER_INFO_RESPONSE = "HABITICA_USER_INFO_RESPONSE";

const X_CLIENT_HEADER = "x-client";
const X_API_KEY_HEADER = "x-api-key";
const X_API_USER_HEADER = "x-api-user";

/**
 * Service responsible for contacting Habitica API, handling authorization, headers and potential
 * errors.
 */
@Injectable({
  providedIn: "root",
})
export class HabiticaService {
  constructor(private readonly httpClient: HttpClient) {}

  @Cacheable(HABITICA_ALL_CONTENT_RESPONSE)
  public async getAllContent(): Promise<HabiticaAllContentData> {
    const res = (await firstValueFrom(
      this.httpClient.get(`${HABITICA_ROOT_URL}/content`),
    )) as HabiticaAllContentResponse;

    if (!res.success) {
      throw new Error("Cannot fetch habitica content");
    }

    return res.data;
  }

  @Cacheable(HABITICA_USER_INFO_RESPONSE, true)
  public async getUserInfo(userId: string, apiToken: string): Promise<HabiticaUserInfo> {
    const habRes = (await firstValueFrom(
      this.httpClient.get(`${HABITICA_ROOT_URL}/user`, {
        params: { userFields: "items.gear" },
        headers: this.getDefaultAuthenticatedHeaders(userId, apiToken),
      }),
    )) as HabiticaUserInfoResponse;

    if (!habRes.success) {
      throw new Error("Cannot fetch Habitica user info");
    }

    return habRes.data;
  }

  /**
   * Equip/unequip the given item identified by its item key. Use either standard equipment via
   * `equipped` or cosmetic equipment via `costume`.
   * @param userId
   * @param apiToken
   * @param gearType
   * @param gearKey
   */
  public async equipItem(
    userId: string,
    apiToken: string,
    gearType: "equipped" | "costume",
    gearKey: string,
  ): Promise<HabiticaUserItemsInfo> {
    const habRes = (await firstValueFrom(
      this.httpClient.post(
        `${HABITICA_ROOT_URL}/user/equip/${gearType}/${gearKey}`,
        {},
        {
          headers: this.getDefaultAuthenticatedHeaders(userId, apiToken),
        },
      ),
    )) as HabiticaEquipItemResponse;

    // TODO: 2025-06-26 Blockost Use toast for success/error notification after each user action
    if (!habRes.success) {
      throw new Error("Failed to equip/unequip item", { cause: habRes.message });
    }

    return habRes.data;
  }

  private getDefaultAuthenticatedHeaders(userId: string, apiToken: string): HttpHeaders {
    return new HttpHeaders({
      [X_API_USER_HEADER]: userId,
      [X_API_KEY_HEADER]: apiToken,
      [X_CLIENT_HEADER]: "afd928ee-fcee-4e3b-ae2c-f7330d5caa4c-habitica-equipment-tracker",
    });
  }
}
