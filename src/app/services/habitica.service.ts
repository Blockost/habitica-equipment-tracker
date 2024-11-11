import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import {
  HabiticaAllContentData,
  HabiticaAllContentResponse,
  HabiticaUserInfoResponse,
} from "../models/habitica.model";

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

  public async getUserInfo(): Promise<HabiticaUserInfoResponse> {
    // todo: Replace with real call once we registered the app + have a strategy to store/read api key
    const habRes: HabiticaUserInfoResponse = {
      success: true,
      data: {
        items: {
          gear: {
            owned: {
              headAccessory_special_blackHeadband: true,
              headAccessory_special_blueHeadband: true,
              headAccessory_special_greenHeadband: true,
              headAccessory_special_pinkHeadband: true,
              headAccessory_special_redHeadband: true,
              headAccessory_special_whiteHeadband: true,
              headAccessory_special_yellowHeadband: true,
              eyewear_special_blackTopFrame: true,
              eyewear_special_blueTopFrame: true,
              eyewear_special_greenTopFrame: true,
              eyewear_special_pinkTopFrame: true,
              eyewear_special_redTopFrame: true,
              eyewear_special_whiteTopFrame: true,
              eyewear_special_yellowTopFrame: true,
              eyewear_special_blackHalfMoon: true,
              eyewear_special_blueHalfMoon: true,
              eyewear_special_greenHalfMoon: true,
              eyewear_special_pinkHalfMoon: true,
              eyewear_special_redHalfMoon: true,
              eyewear_special_whiteHalfMoon: true,
              eyewear_special_yellowHalfMoon: true,
              armor_special_bardRobes: true,
              head_special_nye: true,
              armor_special_birthday: true,
              head_special_piDay: true,
              shield_special_piDay: true,
              head_special_nye2014: true,
              armor_special_birthday2015: true,
              head_special_nye2015: true,
              weapon_warrior_0: true,
              head_special_bardHat: true,
              weapon_special_bardInstrument: true,
              armor_special_birthday2016: true,
              weapon_wizard_0: true,
              weapon_wizard_1: true,
              weapon_wizard_2: true,
              head_wizard_1: true,
              armor_wizard_1: true,
              head_special_lunarWarriorHelm: true,
              weapon_wizard_3: true,
              head_wizard_2: true,
              armor_wizard_2: true,
              weapon_wizard_4: true,
              shield_special_takeThis: true,
              armor_wizard_3: true,
              armor_special_pageArmor: true,
              head_special_pyromancersTurban: true,
              weapon_wizard_5: true,
              armor_wizard_4: true,
              armor_special_lunarWarriorArmor: true,
              head_special_pageHelm: true,
              weapon_special_pageBanner: true,
              weapon_special_lunarScythe: true,
              head_wizard_3: true,
              head_wizard_4: true,
              armor_special_spring2024Mage: true,
              shield_special_diamondStave: true,
              head_special_spring2024Mage: true,
              weapon_special_spring2024Mage: true,
              weapon_special_2: true,
              shield_armoire_mightyPizza: true,
              weapon_special_takeThis: true,
              head_armoire_crownOfHearts: true,
              armor_armoire_medievalLaundryDress: true,
              head_armoire_gardenersSunHat: true,
              weapon_special_skeletonKey: true,
              shield_special_lootBag: true,
              shield_armoire_swanFeatherFan: true,
              armor_armoire_teaGown: true,
              head_armoire_crownOfDiamonds: true,
              head_special_clandestineCowl: true,
              armor_special_sneakthiefRobes: true,
              armor_special_takeThis: true,
              armor_armoire_nephriteArmor: true,
              eyewear_armoire_roseColoredGlasses: true,
              armor_armoire_bathtub: true,
              head_armoire_blackFloppyHat: true,
              shield_armoire_strawberryFood: true,
              armor_wizard_5: true,
              head_wizard_5: true,
              head_special_snowSovereignCrown: true,
              armor_special_snowSovereignRobes: true,
              shield_special_goldenknight: true,
              eyewear_armoire_clownsNose: true,
              weapon_armoire_finelyCutGem: true,
              shield_special_wintryMirror: true,
              back_special_snowdriftVeil: true,
              armor_armoire_coachDriverLivery: true,
              head_special_summer2024Mage: true,
              head_armoire_corsairsBandana: true,
              armor_special_summer2024Mage: true,
              weapon_special_summer2024Mage: true,
              weapon_armoire_slingshot: true,
              head_special_namingDay2017: true,
              head_special_takeThis: true,
              body_armoire_karateBlackBelt: true,
              weapon_armoire_happyBanner: true,
              weapon_armoire_flutteryArmy: true,
              shield_armoire_thrownVessel: true,
              head_armoire_paintersBeret: true,
              head_armoire_regalCrown: true,
              head_armoire_fancyPirateHat: true,
              armor_armoire_gardenersOveralls: true,
              weapon_special_nomadsScimitar: true,
              armor_special_nomadsCuirass: true,
              head_special_spikedHelm: true,
              armor_armoire_greenFluffTrimmedCoat: true,
              body_special_takeThis: true,
              armor_armoire_guardiansGown: true,
              weapon_special_fall2024Mage: true,
              shield_armoire_bucket: true,
              shield_armoire_weaversShuttle: true,
              weapon_armoire_cleaningCloth: true,
            },
          },
        },
      },
    };

    if (!habRes.success) {
      throw new Error("Cannot fetch Habitica user info");
    }

    return habRes;
  }
}
